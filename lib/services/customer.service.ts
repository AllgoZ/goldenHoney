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
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FSCustomer, FSCartItem, FSAddress } from '@/types/firebase'

const COL = 'customers'

/* ── Customer document ────────────────────────────────────────────────
   Document ID = 10-digit phone number (e.g. "9876543210")
──────────────────────────────────────────────────────────────────────── */
export async function getCustomer(phoneId: string): Promise<FSCustomer | null> {
  const snap = await getDoc(doc(db, COL, phoneId))
  return snap.exists() ? (snap.data() as FSCustomer) : null
}

export async function createCustomer(
  phoneId: string,
  data: Pick<FSCustomer, 'phone' | 'name' | 'email'>
): Promise<void> {
  await setDoc(doc(db, COL, phoneId), {
    ...data,
    cart:      [],
    wishlist:  [],
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  })
}

export async function updateCustomer(
  phoneId: string,
  data: Partial<Pick<FSCustomer, 'name' | 'email' | 'phone'>>
): Promise<void> {
  await updateDoc(doc(db, COL, phoneId), { ...data, lastLogin: serverTimestamp() })
}

/* ── Cart (embedded array) ───────────────────────────────────────────── */
export async function saveCustomerCart(phoneId: string, items: FSCartItem[]): Promise<void> {
  await updateDoc(doc(db, COL, phoneId), { cart: items })
}

/* ── Wishlist (embedded product ID array) ────────────────────────────── */
export async function addToCustomerWishlist(phoneId: string, productId: string): Promise<void> {
  await updateDoc(doc(db, COL, phoneId), { wishlist: arrayUnion(productId) })
}

export async function removeFromCustomerWishlist(phoneId: string, productId: string): Promise<void> {
  await updateDoc(doc(db, COL, phoneId), { wishlist: arrayRemove(productId) })
}

/* ── Addresses sub-collection ────────────────────────────────────────── */
export async function getCustomerAddresses(phoneId: string): Promise<FSAddress[]> {
  const snap = await getDocs(
    query(collection(db, COL, phoneId, 'addresses'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FSAddress))
}

export async function addCustomerAddress(
  phoneId: string,
  address: Omit<FSAddress, 'id' | 'createdAt'>
): Promise<string> {
  const ref = doc(collection(db, COL, phoneId, 'addresses'))
  if (address.isDefault) await _clearDefaultAddress(phoneId)
  await setDoc(ref, { ...address, id: ref.id, createdAt: serverTimestamp() })
  return ref.id
}

export async function updateCustomerAddress(
  phoneId: string,
  addressId: string,
  data: Partial<FSAddress>
): Promise<void> {
  if (data.isDefault) await _clearDefaultAddress(phoneId)
  await updateDoc(doc(db, COL, phoneId, 'addresses', addressId), data)
}

export async function deleteCustomerAddress(phoneId: string, addressId: string): Promise<void> {
  await deleteDoc(doc(db, COL, phoneId, 'addresses', addressId))
}

export async function setDefaultCustomerAddress(phoneId: string, addressId: string): Promise<void> {
  await _clearDefaultAddress(phoneId)
  await updateDoc(doc(db, COL, phoneId, 'addresses', addressId), { isDefault: true })
}

async function _clearDefaultAddress(phoneId: string): Promise<void> {
  const snap = await getDocs(collection(db, COL, phoneId, 'addresses'))
  const batch = writeBatch(db)
  snap.docs.forEach((d) => {
    if (d.data().isDefault) batch.update(d.ref, { isDefault: false })
  })
  await batch.commit()
}
