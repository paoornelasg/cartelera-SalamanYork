export class User {
    constructor({
        usuario,
        password,
        rol = 'usuario',
        bloqueado = false,
        intentos = 0
    }) {
        this.usuario = usuario;
        this.password = password;
        this.rol = rol;
        this.bloqueado = bloqueado;
        this.intentos = intentos;
    }
}



