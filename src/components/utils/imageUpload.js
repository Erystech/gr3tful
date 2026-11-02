const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 512 * 1024;
const TARGET_BYTES = 400 * 1024;
const DIMENSION_STEPS = [1400, 1120, 896, 720, 576];
const QUALITY_STEPS = [0.82, 0.7, 0.58, 0.46];
const OUTPUT_EXTENSIONS = { 'image/webp': 'webp', 'image/jpeg': 'jpg' };

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("We couldn't read that image."));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

function drawPhoto(context, canvas, image, type) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (type === 'image/jpeg') {
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
}

function preparedFile(blob, originalName) {
  const baseName = originalName.replace(/\.[^.]+$/, '') || 'gratitude';
  return new File([blob], `${baseName}.${OUTPUT_EXTENSIONS[blob.type]}`, { type: blob.type });
}

export function getGratitudeImagePath(userId, entryId, slot, image) {
  const extension = OUTPUT_EXTENSIONS[image.type];
  if (!extension || image.size > MAX_UPLOAD_BYTES) {
    throw new Error('This photo could not be prepared. Please add it again.');
  }
  return `${userId}/${entryId}/${slot}.${extension}`;
}

export async function prepareGratitudeImage(file) {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Choose a JPG, PNG, or WebP image.");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("Choose a photo smaller than 20 MB.");
  }

  const image = await loadImage(file);
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  if (!width || !height) throw new Error("We couldn't read that photo. Please choose another one.");
  const canvas = document.createElement("canvas");
  try {
    const context = canvas.getContext('2d');
    if (!context) throw new Error("Image processing isn't available in this browser.");
    const renderedSizes = new Set();
    let type = 'image/webp';
    for (const maxDimension of DIMENSION_STEPS) {
      const scale = Math.min(1, maxDimension / Math.max(width, height));
      const nextWidth = Math.max(1, Math.round(width * scale));
      const nextHeight = Math.max(1, Math.round(height * scale));
      const dimensions = `${nextWidth}x${nextHeight}`;
      if (renderedSizes.has(dimensions)) continue;
      renderedSizes.add(dimensions);
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      drawPhoto(context, canvas, image, type);
      let smallest = null;
      for (const quality of QUALITY_STEPS) {
        let blob = await canvasToBlob(canvas, type, quality);
        // Unsupported canvas formats can silently become lossless PNGs. Inspect
        // the real MIME type and use JPEG rather than relabeling those bytes.
        if (type === 'image/webp' && blob?.type !== 'image/webp') {
          type = 'image/jpeg';
          drawPhoto(context, canvas, image, type);
          blob = await canvasToBlob(canvas, type, quality);
        }
        if (!blob || !blob.size || blob.type !== type) continue;
        if (!smallest || blob.size < smallest.size) smallest = blob;
        if (blob.size <= TARGET_BYTES) return preparedFile(blob, file.name);
      }
      if (smallest && smallest.size <= MAX_UPLOAD_BYTES) return preparedFile(smallest, file.name);
    }
    throw new Error("We couldn't prepare this photo. Please choose a different one.");
  } finally {
    // Release the drawing buffer promptly when preparing several phone photos.
    canvas.width = 1;
    canvas.height = 1;
  }
}
