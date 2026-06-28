import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FSCartItem } from '@/types/firebase'

const COL = 'carts'

export async function loadCartFromFirestore(uid: string): Promise<FSCartItem[]> {
  const snap = await getDoc(doc(db, COL, uid))
  if (!snap.exists()) return []
  return (snap.data().items ?? []) as FSCartItem[]
}

export async function saveCartToFirestore(uid: string, items: FSCartItem[]): Promise<void> {
  await setDoc(doc(db, COL, uid), {
    userId:    uid,
    items,
    updatedAt: serverTimestamp(),
  })
}
