import UserRepository from '../repositories/userRepository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import TokenService from './tokenService.js'
import { User } from './../models/User.js'

export default class UserService {
    constructor () {
        this.userRepository = new UserRepository()
    }

    async getAll () {
        return await this.userRepository.getAll()
    }

    async findByUser(username) {
        return await this.userRepository.findByUser(username)
    }

    async findByRol (rol) {
        return await this.userRepository.findByRol(rol)
    }

    async create (user) {
        const usuario = user.usernameOrEmail || user.usuario// alias recibido en el body

        if (!usuario || !user.password || !user.rol) {
            throw { statusCode: 400, message: 'Faltan campos requeridos' }
        }

        const userExists = await this.userRepository.findByUser(usuario)
        if (userExists) {
            throw { statusCode: 400, message: 'Usuario ya existe' }
        }

        const hashedPassword = await bcrypt.hash(user.password, 10)

        const newUser = new User({
            usuario,
            password: hashedPassword,
            rol: user.rol,
            bloqueado: false,
            intentos: 0
        })

        return await this.userRepository.create({ ...newUser })
    }

    async update (id, user) {
        const userExists = await this.userRepository.getById(id)

        if (!userExists) {
            throw { message: 'Usuario no encontrado', statusCode: 404 }
        }

        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10)
        }

        const newUser = new User({ ...user })
        return await this.userRepository.update(id, { ...newUser })
    }

    async delete (id) {
        const existUser = await this.userRepository.getById(id)
        if (!existUser) {
            throw {statusCode: 404, message: 'Usuario no encontrado'}
        }
        return await this.userRepository.delete(id)
    }

    // Login compatible con el registro de usuario con email
    async login (usernameOrEmail, password, rememberMe = false) {
        const user = await this.findByUser(usernameOrEmail)
        if (!user) {
            throw { message: 'Usuario no encontrado', statusCode: 404 }
        }

        if (!user.password) {
            throw { message: 'Este usuario aún no tiene contraseña asignada. Completa el registro.', statusCode: 400 }
        }

        if (user.bloqueado) {
            throw { message: 'Usuario bloqueado, contacta al administrador', statusCode: 403 }
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            await this.handleFailedLogin(user.id)
            throw { message: 'Contraseña incorrecta', statusCode: 401 }
        }

        const existingToken = await this.userRepository.getSessionToken(user.id)
        if (existingToken) {
            throw { message: 'Ya está loggeado en otro lugar', statusCode: 403 }
        }

        const expiresIn = rememberMe ? '24h' : '1h'
        const token = jwt.sign(
            { id: user.id, usuario: user.usuario, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn }
        )
            
        await this.userRepository.updateSessionToken(user.id, token)
        await this.userRepository.update(user.id, {
            loginTime: Date.now()
        })

        return {
            token,
            user
        }
    }

    async logout (userId, token) {
        const sessionToken = await this.userRepository.getSessionToken(userId)
        if (sessionToken !== token) {
            throw {message: 'Token inválido', statusCode: 400}
        }
        await this.userRepository.updateSessionToken(userId, null)
        await this.userRepository.update(userId, { loginTime: null })

        await TokenService.revokeToken(token)
    }

    async unlockUser (id) {
        const user = await this.userRepository.getById(id)
        if (!user) {
            throw {message: 'Usuario no existe', statusCode: 404}
        }
        await this.userRepository.update(id, {bloqueado: false, intentos: 0})
    }

    async handleFailedLogin (id) {
        const user = await this.userRepository.getById(id)
        const intentos = user.intentos + 1
        if (intentos >= 5) {
            await this.userRepository.update(id, {bloqueado: true})
            throw {message: 'Usuario bloqueado despúes de 5 intentos', statusCode: 404}
        }
        await this.userRepository.update(id, {intentos})
    }

    async getByUser (usuario) {
        const user = this.userRepository.findByUser(usuario)
        if (!user) {
            throw {message: 'Usuario no encontrado', statusCode: 404}
        }
        return user
    }

    // Registro de usuario con email
    async registerEmailOnly(email) {
        if (!email) {
            throw { statusCode: 400, message: 'Email es obligatorio' }
        }

        const existing = await this.userRepository.findByUser(email)
        if (existing) {
            throw { statusCode: 409, message: 'Este correo ya está registrado' }
        }

        const newUser = new User({
            usuario: email,
            password: '',
            rol: 'usuario',
            bloqueado: false,
            intentos: 0
        })

        return await this.userRepository.create({ ...newUser })
    }

    async completeRegister (email, password) {
        const user = await this.userRepository.findByUser(email)

        if (!user) {
            throw { statusCode: 404, message: 'Usuario no encontrado' }
        }

        if (user.password && user.password !== '') {
            throw { statusCode: 400, message: 'El usuario ya tiene una contraseña asignada' }
        }

        const hashed = await bcrypt.hash(password, 10)
        await this.userRepository.update(user.id, { password: hashed })

        const updatedUser = await this.userRepository.getById(user.id)

        return updatedUser
    }
}