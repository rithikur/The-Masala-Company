/**
 * Storage API service — admin-only file upload/delete
 */
import api from './api'

/**
 * Upload an image to Supabase Storage via the Flask backend.
 *
 * @param {File}   file    - The File object from an <input type="file">
 * @param {string} folder  - Sub-folder name in the bucket, e.g. product slug
 * @returns {{ public_url, path, bucket, size_bytes, mime_type }}
 */
export const uploadImage = async (file, folder = 'general') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const response = await api.post('/api/storage/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data.data
}

/**
 * Delete an image from Supabase Storage via the Flask backend.
 *
 * @param {string} path - The storage path returned by uploadImage, e.g. "slug/abc123.jpg"
 */
export const deleteImage = async (path) => {
  const response = await api.delete('/api/storage/delete', { data: { path } })
  return response.data
}
