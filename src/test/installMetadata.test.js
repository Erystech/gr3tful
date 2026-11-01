import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import process from 'node:process';
import { describe, expect, it, vi } from 'vitest';

const publicDirectory = path.join(process.cwd(), 'public');
const workerSource = fs.readFileSync(path.join(publicDirectory, 'sw.js'), 'utf8');

function worker(fetchResult, cached) {
  const listeners = {};
  const cache = { put: vi.fn().mockResolvedValue(undefined) };
  const fetch = typeof fetchResult === 'function' ? vi.fn(fetchResult) : vi.fn().mockResolvedValue(fetchResult);
  const caches = { open: vi.fn().mockResolvedValue(cache), match: vi.fn().mockResolvedValue(cached) };
  vm.runInNewContext(workerSource, {
    self: { location: { origin: 'https://gr3tful.example' }, addEventListener: (name, callback) => { listeners[name] = callback; } },
    fetch, caches, Response, URL,
  });
  async function request(path) {
    let response;
    listeners.fetch({
      request: { method: 'GET', mode: 'no-cors', url: `https://gr3tful.example${path}` },
      respondWith: (result) => { response = result; },
    });
    return response;
  }
  return { request, fetch, caches, cache };
}

describe('Home Screen install metadata', () => {
  it('fetches a fresh manifest rather than reusing cached installation metadata', async () => {
    const response = new Response('{"icons":[]}', { headers: { 'content-type': 'application/manifest+json' } });
    const instance = worker(response, new Response('old manifest'));
    const result = await instance.request('/manifest.webmanifest?v=current');
    expect(await result.json()).toEqual({ icons: [] });
    expect(instance.fetch).toHaveBeenCalledWith(expect.anything(), { cache: 'no-cache' });
    expect(instance.caches.match).not.toHaveBeenCalled();
    expect(instance.cache.put).toHaveBeenCalled();
  });

  it('rejects an HTML fallback served from an Apple icon URL', async () => {
    const html = () => new Response('<html>Sign in</html>', { headers: { 'content-type': 'text/html' } });
    const instance = worker(html(), html());
    const result = await instance.request('/apple-touch-icon-precomposed.png');
    expect(result.type).toBe('error');
    expect(instance.cache.put).not.toHaveBeenCalled();
  });

  it('retains valid cached icons when the device is offline', async () => {
    const cached = new Response(new Uint8Array([137, 80, 78, 71]), { headers: { 'content-type': 'image/png' } });
    const instance = worker(() => Promise.reject(new Error('Offline')), cached);
    const result = await instance.request('/brand/icon-192-current.png');
    expect(result).toBe(cached);
  });

  it('provides real PNGs for the declared and standard iPhone icon lookups', () => {
    const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
    const declared = html.match(/rel="apple-touch-icon"[^>]+href="([^"]+)"/)[1];
    for (const name of [declared.slice(1), 'apple-touch-icon.png', 'apple-touch-icon-precomposed.png', 'apple-touch-icon-180x180.png']) {
      const image = fs.readFileSync(path.join(publicDirectory, name));
      expect(image.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect([image.readUInt32BE(16), image.readUInt32BE(20)]).toEqual([180, 180]);
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(publicDirectory, 'manifest.webmanifest'), 'utf8'));
    expect(manifest.id).toBe('/');
    for (const icon of manifest.icons) {
      const image = fs.readFileSync(path.join(publicDirectory, icon.src.slice(1)));
      expect(`${image.readUInt32BE(16)}x${image.readUInt32BE(20)}`).toBe(icon.sizes);
    }
  });
});
