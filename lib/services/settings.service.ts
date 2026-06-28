import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FSStoreSettings } from '@/types/firebase'

const REF = () => doc(db, 'settings', 'store')

export async function getStoreSettings(): Promise<FSStoreSettings | null> {
  const snap = await getDoc(REF())
  return snap.exists() ? (snap.data() as FSStoreSettings) : null
}

export async function updateStoreSettings(data: Partial<Omit<FSStoreSettings, 'updatedAt'>>): Promise<void> {
  await setDoc(REF(), { ...data, updatedAt: serverTimestamp() }, { merge: true })
}
