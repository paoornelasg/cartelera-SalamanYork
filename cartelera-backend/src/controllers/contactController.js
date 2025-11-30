import { db } from '../config/firebase.js'

export default class ContactController {
  constructor () {}

  async sendMessage (req, res, next) {
    try {
      const userId = req.user?.id || null
      const { name, email, subject, message } = req.body || {}

      if (!message || String(message).trim() === '') {
        return res.status(400).json({ message: 'El mensaje es requerido' })
      }

      const now = Date.now()
      const data = {
        name: name || null,
        email: email || null,
        subject: subject || null,
        message: String(message),
        userId,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await db.collection('contacts').add(data)

      return res.status(201).json({ id: docRef.id, ...data })
    } catch (e) {
      return res.status(e.statusCode || 500).json({ message: e.message || 'Error guardando el mensaje' })
    }
  }
}
