import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/lib/firebase'

export type StorageFolder = 'products' | 'banners' | 'users' | 'reviews' | 'certificates' | 'invoices'

export async function uploadImage(
  file: File,
  folder: StorageFolder,
  onProgress?: (pct: number) => void
): Promise<string> {
  const safeName = `${Date.now()}_${file.name.replace(/[^a-z0-9.]/gi, '_')}`
  const storageRef = ref(storage, `${folder}/${safeName}`)

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file)

    task.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
        onProgress?.(pct)
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      }
    )
  })
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
  } catch {
    // File may not exist; ignore
  }
}
