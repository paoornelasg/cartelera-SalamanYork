import { v4 as uuidv4 } from 'uuid';
import { bucket } from '../config/firebase.js';

//Subir una imagen a Firebase Storage
export async function uploadImageToStorage(file) {
  if (!file) throw { statusCode: 400, message: 'No se proporcionó ninguna imagen' };

  const fileName = `products/${Date.now()}-${file.originalname}`;
  const blob = bucket.file(fileName);

    const token = uuidv4()

  const stream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: token
      }
    }
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (err) => {
      reject({ statusCode: 500, message: 'Error al subir la imagen', error: err });
    });

    stream.on('finish', () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${token}`;
      resolve(publicUrl);
    });

    stream.end(file.buffer);
  });
}




