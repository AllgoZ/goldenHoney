import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FSUser, FSAddress, FSWishlist } from '@/types/firebase'

/* ── User ────────────────────────────────────────────────── */
export async function getUser(uid: string): Promise<FSUser | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as FSUser) : null
}

export async function updateUser(uid: string, data: Partial<FSUser>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { ...data })
}

/* ── Addresses ───────────────────────────────────────────── */
export async function getAddresses(uid: string): Promise<FSAddress[]> {
  const snap = await getDocs(
    query(collection(db, 'users', uid, 'addresses'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FSAddress))
}

export async function addAddress(uid: string, address: Omit<FSAddress, 'id' | 'createdAt'>): Promise<string> {
  const ref = doc(collection(db, 'users', uid, 'addresses'))

  // If this is the first address or marked default, unset existing default
  if (address.isDefault) {
    await _clearDefaultAddress(uid)
  }

  await setDoc(ref, { ...address, id: ref.id, createdAt: serverTimestamp() })
  return ref.id
}

export async function updateAddress(uid: string, addressId: string, data: Partial<FSAddress>): Promise<void> {
  if (data.isDefault) {
    await _clearDefaultAddress(uid)
  }
  await updateDoc(doc(db, 'users', uid, 'addresses', addressId), data)
}

export async function deleteAddress(uid: string, addressId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'addresses', addressId))
}

export async function setDefaultAddress(uid: string, addressId: string): Promise<void> {
  await _clearDefaultAddress(uid)
  await updateDoc(doc(db, 'users', uid, 'addresses', addressId), { isDefault: true })
}

async function _clearDefaultAddress(uid: string): Promise<void> {
  const snap = await getDocs(collection(db, 'users', uid, 'addresses'))
  const batch = writeBatch(db)
  snap.docs.forEach((d) => {
    if (d.data().isDefault) batch.update(d.ref, { isDefault: false })
  })
  await batch.commit()
}

/* ── Wishlist ────────────────────────────────────────────── */
export async function getWishlist(uid: string): Promise<string[]> {
  const snap = await getDoc(doc(db, 'wishlist', uid))
  if (!snap.exists()) return []
  return (snap.data() as FSWishlist).productIds
}

export async function addToWishlist(uid: string, productId: string): Promise<void> {
  const ref = doc(db, 'wishlist', uid)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const current = (snap.data() as FSWishlist).productIds
    if (!current.includes(productId)) {
      await updateDoc(ref, {
        productIds: [...current, productId],
        updatedAt:  serverTimestamp(),
      })
    }
  } else {
    await setDoc(ref, {
      userId:     uid,
      productIds: [productId],
      updatedAt:  serverTimestamp(),
    })
  }
}

export async function removeFromWishlist(uid: string, productId: string): Promise<void> {
  const ref = doc(db, 'wishlist', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const current = (snap.data() as FSWishlist).productIds
  await updateDoc(ref, {
    productIds: current.filter((id) => id !== productId),
    updatedAt:  serverTimestamp(),
  })
}
