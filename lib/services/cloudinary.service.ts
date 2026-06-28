export type StorageFolder = 'products' | 'banners' | 'users' | 'reviews'

interface UploadOptions {
  folder: StorageFolder
  onProgress?: (percent: number) => void
}

export async function uploadImage(file: File, options: UploadOptions): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', options.folder)

  try {
    const xhr = new XMLHttpRequest()

    if (options.onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100
          options.onProgress?.(Math.round(percent))
        }
      })
    }

    return await new Promise((resolve, reject) => {
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          resolve(response.secure_url)
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })
      xhr.addEventListener('error', () => reject(new Error('Upload failed')))

      xhr.open('POST', '/api/upload')
      xhr.send(formData)
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Image upload failed')
  }
}

export async function deleteFile(publicId: string): Promise<void> {
  // Cloudinary deletion would be handled server-side via a separate endpoint
  // For now, we'll just log that deletion is requested
  console.log('Cloudinary file deletion requested:', publicId)
  // In production, call: POST /api/delete-image with { publicId }
}
