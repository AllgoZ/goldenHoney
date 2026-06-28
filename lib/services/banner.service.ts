import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FSBanner } from '@/types/firebase'

const COL = 'banners'

export async function getBanners(): Promise<FSBanner[]> {
  const snap = await getDocs(query(collection(db, COL), orderBy('sortOrder', 'asc')))
  return snap.docs.map((d) => d.data() as FSBanner)
}

export async function createBanner(data: Omit<FSBanner, 'id'>): Promise<string> {
  const ref = doc(collection(db, COL))
  await setDoc(ref, { ...data, id: ref.id })
  return ref.id
}

export async function updateBanner(id: string, data: Partial<FSBanner>): Promise<void> {
  await updateDoc(doc(db, COL, id), data)
}

export async function deleteBanner(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id))
}
