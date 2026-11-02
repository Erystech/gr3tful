-- Some mobile browsers decode WebP but cannot encode canvas output as WebP.
-- Allow correctly labeled JPEG fallback files while keeping the private bucket
-- and the 512 KiB per-image storage ceiling.
update storage.buckets
set allowed_mime_types = array['image/webp', 'image/jpeg'],
    file_size_limit = 524288
where id = 'gratitude-images';
