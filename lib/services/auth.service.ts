import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { FSUser } from '@/types/firebase'

const googleProvider = new GoogleAuthProvider()

/* ── Sign Up ─────────────────────────────────────────────── */
export async function signUp(name: string, email: string, password: string): Promise<FirebaseUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName: name })

  const userDoc: Omit<FSUser, 'uid'> = {
    name,
    email,
    role:      'customer',
    status:    'active',
    createdAt: serverTimestamp() as never,
    lastLogin: serverTimestamp() as never,
  }
  await setDoc(doc(db, 'users', credential.user.uid), { uid: credential.user.uid, ...userDoc })

  return credential.user
}

/* ── Sign In ─────────────────────────────────────────────── */
export async function signIn(email: string, password: string): Promise<FirebaseUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  await setDoc(doc(db, 'users', credential.user.uid), { lastLogin: serverTimestamp() }, { merge: true })
  return credential.user
}

/* ── Google Sign In ──────────────────────────────────────── */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  const credential = await signInWithPopup(auth, googleProvider)
  const { user } = credential

  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid:       user.uid,
      name:      user.displayName ?? '',
      email:     user.email ?? '',
      photoURL:  user.photoURL ?? '',
      role:      'customer',
      status:    'active',
      lastLogin: serverTimestamp(),
    },
    { merge: true }  // won't overwrite role on existing accounts
  )

  return user
}

/* ── Sign Out ────────────────────────────────────────────── */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

/* ── Password Reset ──────────────────────────────────────── */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

/* ── Auth State Observer ─────────────────────────────────── */
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback)
}

/* ── Current User ────────────────────────────────────────── */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser
}

/* ── Update Admin Credentials ────────────────────────────── */
export async function updateAdminCredentials(
  currentPassword: string,
  newEmail?: string,
  newPassword?: string,
): Promise<void> {
  const user = auth.currentUser
  if (!user || !user.email) throw new Error('Not signed in')

  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)

  if (newEmail && newEmail !== user.email) await updateEmail(user, newEmail)
  if (newPassword) await updatePassword(user, newPassword)
}
