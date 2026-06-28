import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FSCategory } from '@/types/firebase'

const COL = 'categories'

export async function getCategories(): Promise<FSCategory[]> {
  const snap = await getDocs(query(collection(db, COL), orderBy('sortOrder', 'asc')))
  return snap.docs.map((d) => d.data() as FSCategory)
}

export async function getCategoryById(id: string): Promise<FSCategory | null> {
  const snap = await getDoc(doc(db, COL, id))
  return snap.exists() ? (snap.data() as FSCategory) : null
}

export async function createCategory(data: Omit<FSCategory, 'id'>): Promise<string> {
  const ref = doc(collection(db, COL))
  await setDoc(ref, { ...data, id: ref.id })
  return ref.id
}

export async function updateCategory(id: string, data: Partial<FSCategory>): Promise<void> {
  await updateDoc(doc(db, COL, id), data)
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id))
}
