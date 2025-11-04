import dotenv from 'dotenv';
import admin from 'firebase-admin'; //Hace la conección con la base de datos de Firebase
dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    }),

    storageBucket: process.env.FIREBASE_STORAGE_BUCKET // Configura el bucket de almacenamiento
});

const db = admin.firestore()
const bucket = admin.storage().bucket() // Obtiene la instancia del bucket de almacenamiento

export { db, bucket }

