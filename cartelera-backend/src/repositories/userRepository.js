import IUserRepository from '../interfaces/IUserRepository.js';
import { db } from '../config/firebase.js';

export default class UserRepository extends IUserRepository {
    constructor() {
        super();
        this.collection = db.collection('ecommerce-users');
    }

    async create(user) {
        const { id, ...userWithoutId } = user; // 💥 Aquí se elimina el campo id
        await this.collection.doc(user.usuario).set(userWithoutId);
        return { 
            id: user.usuario, 
            ...userWithoutId 
        };
    }

    async update(id, user) {
        await this.collection.doc(id).update(user);
        return {
            id,
            ...user,
        }
    }

    async delete(id) {
        await this.collection.doc(id).delete();
        return {id, message: 'Usuario eliminado'};
    }

    async getAll() {
        const users = await this.collection.get();
        return users.docs.map((doc) => ({
            id: doc.id, 
            ...doc.data(),
        }));
    }

    async findByUser(username) {
        const users = await this.collection.where('usuario', '==', username).get();
        return users.empty ? null : {
            id: users.docs[0].id,
            ...users.docs[0].data(),
        }
    }

    async findByRol(rol) {
        const users = await this.collection.where('rol', '==', rol).get();
        return users.docs.map((doc) => ({
            id: doc.id, 
            ...doc.data(),
        }));
    }

    async updateSessionToken(id, sessionToken) {
        const user = this.collection.doc(id)
        await user.update({currentSessionToken: sessionToken});
    }

    async getSessionToken(id) {
        const user = await this.collection.doc(id).get();
        return user.exists ? user.data().currentSessionToken : null;
    }

    async getById(id) {
        const user = await this.collection.doc(id).get();
        return user.exists ? {
            id, ...user.data()
        } : null;
    }
}