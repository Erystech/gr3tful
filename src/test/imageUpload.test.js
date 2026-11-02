import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getGratitudeImagePath, prepareGratitudeImage } from '../components/utils/imageUpload';

const KiB = 1024;
const MiB = 1024 * KiB;
const blob = (type, bytes) => new Blob([new Uint8Array(bytes)], { type });
let encode;
let dimensions;
let cannotLoad;
let context;
let createObjectURL;
let revokeObjectURL;
let drawingCanvas;

function photo(size = 2 * MiB) {
  const file = new File(['photo'], 'phone-photo.jpg', { type: 'image/jpeg' });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('phone photo preparation', () => {
  beforeEach(() => {
    dimensions = [4032, 3024];
    cannotLoad = false;
    context = { clearRect: vi.fn(), fillRect: vi.fn(), drawImage: vi.fn() };
    createObjectURL = vi.fn(() => 'blob:phone-photo');
    revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    vi.stubGlobal('Image', class {
      constructor() { this.naturalWidth = dimensions[0]; this.naturalHeight = dimensions[1]; }
      set src(value) { this.url = value; queueMicrotask(() => cannotLoad ? this.onerror() : this.onload()); }
    });
    encode = vi.fn(({ type }) => blob(type, 200 * KiB));
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function () { drawingCanvas = this; return context; });
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function (callback, type, quality) {
      callback(encode({ width: this.width, height: this.height, type, quality }));
    });
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('accepts a larger camera original while keeping the saved image small', async () => {
    const result = await prepareGratitudeImage(photo(14 * MiB));
    expect(result.type).toBe('image/webp');
    expect(result.name).toBe('phone-photo.webp');
    expect(result.size).toBeLessThanOrEqual(512 * KiB);
    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 1400, 1050);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:phone-photo');
  });

  it.each(['png', 'null'])('uses a real JPEG when the WebP encoder returns %s', async (fallback) => {
    encode.mockImplementation(({ type }) => type === 'image/webp'
      ? fallback === 'png' ? blob('image/png', 100 * KiB) : null
      : blob('image/jpeg', 180 * KiB));
    const result = await prepareGratitudeImage(photo());
    expect(result.type).toBe('image/jpeg');
    expect(result.name).toBe('phone-photo.jpg');
    expect(result.size).toBe(180 * KiB);
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 1400, 1050);
    expect(encode).toHaveBeenCalledWith(expect.objectContaining({ type: 'image/jpeg' }));
  });

  it('reduces dimensions when lowering quality alone cannot meet the storage cap', async () => {
    encode.mockImplementation(({ width, type }) => blob(type, width > 1120 ? 650 * KiB : 200 * KiB));
    const result = await prepareGratitudeImage(photo());
    expect(result.size).toBeLessThanOrEqual(512 * KiB);
    expect(context.drawImage.mock.calls.map((call) => call[3])).toEqual([1400, 1120]);
  });

  it('retains a full-sized image if it fits the hard cap despite missing the smaller target', async () => {
    encode.mockImplementation(({ type }) => blob(type, 480 * KiB));
    const result = await prepareGratitudeImage(photo());
    expect(result.size).toBe(480 * KiB);
    expect(context.drawImage).toHaveBeenCalledTimes(1);
  });

  it('does not enlarge a smaller original', async () => {
    dimensions = [640, 480];
    await prepareGratitudeImage(photo());
    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 640, 480);
  });

  it('never returns an oversized result and releases the canvas buffer after failure', async () => {
    encode.mockImplementation(({ type }) => blob(type, 650 * KiB));
    await expect(prepareGratitudeImage(photo())).rejects.toThrow('choose a different one');
    expect(context.drawImage.mock.calls.at(-1)[3]).toBe(576);
    expect(context.clearRect.mock.calls.at(-1)).toEqual([0, 0, 576, 432]);
    expect([drawingCanvas.width, drawingCanvas.height]).toEqual([1, 1]);
  });

  it('rejects originals over 20 MB before decoding them', async () => {
    await expect(prepareGratitudeImage(photo(20 * MiB + 1))).rejects.toThrow('20 MB');
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it('releases the object URL when a damaged image cannot be read', async () => {
    cannotLoad = true;
    await expect(prepareGratitudeImage(photo())).rejects.toThrow("couldn't read");
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:phone-photo');
  });

  it('keeps the stored file extension consistent with the actual encoded format', () => {
    expect(getGratitudeImagePath('user', 'entry', 1, blob('image/jpeg', 200))).toBe('user/entry/1.jpg');
    expect(getGratitudeImagePath('user', 'entry', 3, blob('image/webp', 200))).toBe('user/entry/3.webp');
    expect(() => getGratitudeImagePath('user', 'entry', 1, blob('image/png', 200))).toThrow();
    expect(() => getGratitudeImagePath('user', 'entry', 1, blob('image/jpeg', 513 * KiB))).toThrow();
  });
});
