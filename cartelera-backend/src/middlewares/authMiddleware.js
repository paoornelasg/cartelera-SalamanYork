import jwt from 'jsonwebtoken'
import TokenService from '../services/tokenService.js'
import UserRepository from '../repositories/userRepository.js'
import dotenv from 'dotenv'

dotenv.config()

const authMiddleware = async (req, res, next) => {

    const authHeadear = req.headers['authorization'] || req.headers['Authorization']
    if (!authHeadear) {
        return res.status(401).json({message: 'No autorizado'})
    }
    const token = authHeadear.split(' ')[1]
    const userRepository = new UserRepository()
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const sessionToken = await userRepository.getSessionToken(decoded.id)
        if (sessionToken != token || await TokenService.isTokenRevoked(token)) {
            return res.status(403).json({message: 'Token inválido o expirado'})
        }
        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({message: 'Token inválido'})
    }
}

export default authMiddleware