import admin from 'firebase-admin'
import serviceAccount from '../../scarrow-firebase-key.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
})

export const db = admin.firestore()

