import userService from '../services/userService.js';

export default class authController {
    constructor () {
        this.userService = new userService();
    }

    async login (req, res, next) {
        try {
            const { usernameOrEmail, password, rememberMe } = req.body || {}

            if (!usernameOrEmail || !password) {
            return res.status(400).json({ message: 'Username/email and password are required' })
            }

            const { token, user } = await this.userService.login(usernameOrEmail, password, rememberMe)
            res.status(200).json({ token, user })

        } catch (error) {
            console.error('Error de inicio de sesión:', error)
            next(error)
        }
    }

    async logout (req, res, next) {
        try {
            const authHeadear = req.headers['authorization']
            const token = authHeadear.split(' ')[1]
            const userId = req.user.id

            await this.userService.logout(userId, token)
            res.status(200).json({ message: 'Sesión cerrada' })
        } catch (error) {
                next(error)
         }
    }
    
    // Función para registrar un usuario solo con email
    async registerEmailOnly (req, res, next) {
        const { email } = req.body
        try {
            const result = await this.userService.registerEmailOnly(email)
            res.status(201).json(result)
        } catch (error) {
            next(error)
        }
    }

    async completeRegister (req, res, next) {
        const { email, password } = req.body
        try {
            const result = await this.userService.completeRegister(email, password)
            res.status(200).json({ message: 'Registro completado exitosamente', user: result })
        } catch (error) {
            next(error)
        }
    }
}