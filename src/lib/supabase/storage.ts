import type { SupabaseClient } from '@supabase/supabase-js';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedTypes = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]);

export const CAMPUS_STORAGE_BUCKETS = [
  'avatars', 'resumes', 'assignments', 'submissions', 'resources',
  'lost-found', 'events', 'company-logos', 'support-attachments',
] as const;

export async function uploadCampusFile(
  supabase: SupabaseClient,
  bucket: string,
  userId: string,
  file: File,
) {
  if (!CAMPUS_STORAGE_BUCKETS.includes(bucket as (typeof CAMPUS_STORAGE_BUCKETS)[number])) {
    return { error: new Error('Invalid storage bucket') };
  }
  if (!allowedTypes.has(file.type)) {
    return { error: new Error('Unsupported file type') };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: new Error('File must be 10 MB or smaller') };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${userId}/${crypto.randomUUID()}-${safeName}`;
  return supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type });
}
