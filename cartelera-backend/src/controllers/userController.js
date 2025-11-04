import UserService from '../services/userService.js'

export default class UserController {
    constructor () {
        this.userService = new UserService()
    }

    async getAll (req, res, next) {
        try {
            const users = await this.userService.getAll()
            res.json(users)
        } catch (error) {
            next(error)
        }
    }

    async getByUser (req, res, next) {
        try {
            const {usuario} = req.params
            const user = await this.userService.getByUser(usuario)
            res.json(user)
        } catch (error) {
            next(error)
        }
    }

    async getByRol (req, res, next) {
        try {
            const {rol} = req.params
            const users = await this.userService.getByRol(rol)
            res.json(users)
        } catch (error) {
            next(error)
        }
    }

    async create (req, res, next) {
        try {
            const newUser = await this.userService.create(req.body)
            res.json(newUser)
        } catch (error) {
            next(error)
        }
    }

    async update (req, res, next) {
        try {
            const {id} = req.params
            const updatedUser = await this.userService.update(id, req.body)
            res.json(updatedUser)
        } catch (error) {
            next(error)
        }
    }

    async delete (req, res, next) {
        try {
            const {id} = req.params
            await this.userService.delete(id)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }

    async unlockUser (req, res, next) {
        try {
            const {id} = req.params
            await this.userService.unlockUser(id)
            res.json({ message: 'Usuario desbloqueado' })
        } catch (error) {
            next(error)
        }
    }

    async getUserByUsername (req, res, next) {
        const {usuario} = req.user
        try {
            const user = await this.userService.getByUser(usuario)
            if (!user) {
                return res.status(400).json({ message: 'Usuario no encontrado' })
            }
            return res.status(200).json({ user })
        } catch (error) {
            next(error)
        }
    }
}