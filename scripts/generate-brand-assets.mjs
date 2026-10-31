import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'public/brand');
fs.mkdirSync(output, { recursive: true });
const palette = { burgundy: '#4A2329', cream: '#FFF4E7', peach: '#EFA879' };
const source = fs.readFileSync(path.join(root, 'design/gr3tful-brand-mark-v2.svg'), 'utf8');
const artwork = source.replace(/<svg[^>]*>/, '').replace('</svg>', '').replace(/<rect[^>]*\/>/, '');
const fontFile = path.join(root, 'design/fonts/Nunito-Black.ttf');
const svg = (width, height, content) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${content}</svg>`;
const write = (name, content) => fs.writeFileSync(path.join(output, name), typeof content === 'string' ? content.replace(/[\t ]+$/gm, '') : content);
const png = (content, size) => new Resvg(content, { fitTo: { mode: 'width', value: size } }).render().asPng();

// Outline the lettering: the wordmark needs no installed or downloaded font.
function lettering(text, size, ink, accentThree = false, tracking = -0.06) {
  const escaped = text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const coloured = accentThree ? escaped.replaceAll('3', `<tspan fill="${palette.peach}">3</tspan>`) : escaped;
  const renderer = new Resvg(svg(3000, size * 4,
    `<text x="${size}" y="${size * 2}" fill="${ink}" font-family="Nunito" font-weight="900" font-size="${size}" letter-spacing="${size * tracking}">${coloured}</text>`),
  { font: { fontFiles: [fontFile], loadSystemFonts: false } });
  const box = renderer.getBBox();
  const content = renderer.toString().replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return { content, x1: box.x, y1: box.y, width: box.width, height: box.height };
}

write('mark.svg', source);
write('favicon.svg', source);
const fullSquare = svg(512, 512, `<rect width="512" height="512" fill="${palette.burgundy}"/>${artwork}`);
const maskable = svg(512, 512, `<rect width="512" height="512" fill="${palette.burgundy}"/><g transform="translate(25.6 25.6) scale(.9)">${artwork}</g>`);
write('icon-192.png', png(source, 192));
write('icon-512.png', png(source, 512));
write('icon-maskable-512.png', png(maskable, 512));
write('apple-touch-icon.png', png(fullSquare, 180));
write('favicon-32.png', png(source, 32));
write('notification-badge.png', png(svg(512, 512, artwork.replaceAll(palette.cream, '#FFFFFF').replaceAll(palette.peach, '#FFFFFF')), 96));

// Multi-size ICO for browsers that do not choose the SVG favicon.
const frames = [16, 32, 48].map((size) => ({ size, data: png(source, size) }));
const icoHeader = Buffer.alloc(6 + 16 * frames.length);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(frames.length, 4);
let offset = icoHeader.length;
frames.forEach(({ size, data }, index) => {
  const entry = 6 + index * 16;
  icoHeader[entry] = size;
  icoHeader[entry + 1] = size;
  icoHeader.writeUInt16LE(1, entry + 4);
  icoHeader.writeUInt16LE(32, entry + 6);
  icoHeader.writeUInt32LE(data.length, entry + 8);
  icoHeader.writeUInt32LE(offset, entry + 12);
  offset += data.length;
});
write('favicon.ico', Buffer.concat([icoHeader, ...frames.map(({ data }) => data)]));

for (const [mode, color] of [['light', palette.burgundy], ['dark', palette.cream]]) {
  const word = lettering('gr3tful', 100, color, true);
  const width = Math.ceil(word.width + 4);
  const height = Math.ceil(word.height + 4);
  const outlined = `<g transform="translate(${2 - word.x1} ${2 - word.y1})">${word.content}</g>`;
  write(`wordmark-on-${mode}.svg`, svg(width, height, outlined));
  const markSize = height + 8;
  const mark = `<g transform="scale(${markSize / 512})">${artwork.replace(/^/, `<rect width="512" height="512" rx="118" fill="${palette.burgundy}"/>`)}</g>`;
  write(`logo-on-${mode}.svg`, svg(markSize + 16 + width, markSize, `${mark}<g transform="translate(${markSize + 16} 4)">${outlined}</g>`));
}

const socialWord = lettering('gr3tful', 150, palette.burgundy, true);
const tagline = lettering('small moments. big gratitude.', 25, '#78515A', false, 0.015);
const social = svg(1200, 630,
  `<rect width="1200" height="630" fill="${palette.cream}"/>`
  + `<circle cx="1010" cy="90" r="260" fill="none" stroke="${palette.peach}" stroke-opacity=".2"/>`
  + `<circle cx="1150" cy="560" r="200" fill="none" stroke="${palette.peach}" stroke-opacity=".2"/>`
  + `<g transform="translate(110 145) scale(.66)"><rect width="512" height="512" rx="118" fill="${palette.burgundy}"/>${artwork}</g>`
  + `<g transform="translate(${510 - socialWord.x1} ${270 - socialWord.y1})">${socialWord.content}</g>`
  + `<g transform="translate(${515 - tagline.x1} ${420 - tagline.y1})">${tagline.content}</g>`);
write('social-card.svg', social);
write('social-card.png', png(social, 1200));

// Keep old install URLs working while manifests refresh on existing devices.
for (const [oldName, newName] of [
  ['pwa-192.png', 'icon-192.png'], ['pwa-512.png', 'icon-512.png'],
  ['pwa-maskable-512.png', 'icon-maskable-512.png'], ['apple-touch-icon.png', 'apple-touch-icon.png'],
  ['gr3tful-social-card.png', 'social-card.png'],
]) fs.copyFileSync(path.join(output, newName), path.join(root, 'public', oldName));

console.info('Generated Gr3tful logo, favicon, Home Screen, notification and social assets in public/brand.');
