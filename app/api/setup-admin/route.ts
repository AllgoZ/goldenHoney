import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FSAdmin } from '@/types/firebase'

const ADMIN_UID = '9OjtKZJROOM9BpdlrkBe5sdwFrG3'
const ADMIN_EMAIL = 'kodaigoldenhoney@gmail.com'

export async function GET() {
  try {
    const adminDoc: FSAdmin = {
      uid: ADMIN_UID,
      name: 'Admin',
      email: ADMIN_EMAIL,
      role: 'super_admin',
      createdAt: Timestamp.now(),
      createdBy: 'system',
      permissions: {
        manageProducts: true,
        manageOrders: true,
        manageReviews: true,
        manageCoupons: true,
        manageUsers: true,
        manageSettings: true,
        viewAnalytics: true,
      },
    }

    await setDoc(doc(db, 'admins', ADMIN_UID), adminDoc)

    return Response.json({
      success: true,
      message: 'Admin account created successfully',
      admin: { uid: ADMIN_UID, email: ADMIN_EMAIL },
    })
  } catch (error) {
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
