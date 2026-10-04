const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SOURCE_BYTES = 8 * 1024 * 1024;
const TARGET_BYTES = 400 * 1024;
const MAX_DIMENSION = 1400;

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

function canvasToBlob(canvas, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/webp", quality);
  });
}

export async function prepareGratitudeImage(file) {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Choose a JPG, PNG, or WebP image.");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("Choose an image smaller than 8 MB.");
  }

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image processing isn't available in this browser.");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  let blob = null;
  for (const quality of [0.78, 0.68, 0.58, 0.48]) {
    blob = await canvasToBlob(canvas, quality);
    if (blob && blob.size <= TARGET_BYTES) break;
  }

  if (!blob || blob.size > 512 * 1024) {
    throw new Error("This image is still too large after compression. Try a smaller photo.");
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "gratitude";
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}
