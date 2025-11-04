<template>
    <v-container>
        <h1 class = "text-h4 mb-4">
            Gestión de usuarios
        </h1>

        <v-btn color = "primary" @click = "openDialog('create')">
            <v-icon left>
                mdi-account-plus
            </v-icon>
            Crear usuario
        </v-btn>

        <!-- Tabla para los usuarios -->
        <v-data-table
            :headers="headers"
            :items="usuarios"
            :items-per-page="15"
            dense
            class="mt-4"
        >
            <template #[`item.actions`]="{ item }">
                <!-- Editar-->
                <v-icon small color = "primary" title = "Editar" @click = "openDialog('edit', item)">
                    mdi-pencil
                </v-icon>

                <!-- Borrar-->
                <v-icon small color = "red" title = "Borrar" @click = "openDialog('delete', item)">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>

        <!-- Dialogo para editar y crear usuarios -->
        <v-dialog v-model = "dialog" persistent max-width = "700px">
            <v-card color = "indigo lighten-5">
                <v-card-title>
                    <span class="text-h6 text-center">
                        {{ dialogMode ==='create' ? 'Crear usuario' : 'Editar usuario' }}
                    </span>
                </v-card-title>

                <v-card-text>
                    <v-form v-model = "valid" ref = "form">
                        <v-row>
                            <v-col cols = "4">
                                <v-text-field
                                    v-model = "userData.nombre"
                                    label = "Nombre"
                                    required
                                />
                            </v-col>
                            <v-col cols = "4">
                                <v-text-field
                                    v-model = "userData.apaterno"
                                    label = "A. Paterno"
                                    required
                                />
                            </v-col>
                            <v-col cols = "4">
                                <v-text-field
                                    v-model = "userData.amaterno"
                                    label = "A. Materno"
                                    required
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model = "userData.direccion"
                                    label = "Dirección"
                                    required
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols = "4">
                                <v-text-field
                                    v-model = "userData.telefono"
                                    label = "Teléfono"
                                    required
                                />
                            </v-col>
                            <v-col cols = "4">
                                <v-text-field
                                    v-model = "userData.estado"
                                    label = "Estado"
                                    required
                                />
                            </v-col>
                            <v-col cols = "4">
                                <v-text-field
                                    v-model = "userData.ciudad"
                                    label = "Ciudad"
                                    required
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols = "4">
                                <v-text-field
                                    v-model = "userData.usuario"
                                    label = "Usuario"
                                    required
                                />
                            </v-col>
                            <v-col cols = "4">
                                <v-text-field
                                    v-model = "userData.password"
                                    label = "Password"
                                    required
                                />
                            </v-col>
                            <v-col cols = "4">
                                <v-select
                                    v-model = "userData.rol"
                                    :items = "roles"
                                    required
                                    label = "Rol"
                                />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click = "dialog = false">
                        Cancelar
                    </v-btn>
                    <v-btn :disabled = "!valid" color = "primary" @click = "saveUser">
                        {{ dialogMode === 'create' ? 'Crear' : 'Actualizar' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!--Termina dialog para editar y crear-->

        <!-- Dialogo para confirmar eliminación -->
        <v-dialog v-model = "confirmDialog" persistent max-width = "400px">
            <v-card color = "red lighten-5">
                <v-card-title>
                    <span class = "text-h6 text-center">
                        Confirmar borrado
                    </span>
                </v-card-title>
                <v-card-text>
                    ¿Está seguro de que desea borrar el usuario <strong> {{ selectedUser ? selectedUser.nombre : '' }} </strong>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click = "closeConfirmDialog">
                        Cancelar
                    </v-btn>
                    <v-btn color = "red" :disabled = "!selectedUser" @click = "deleteUser(selectedUser)">
                        Borrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Termina diálogo para confirmar eliminación -->
    </v-container>
</template>

<script>
export default {
    data () {
        return {
            usuarios: [],
            headers: [
                { text: 'Nombre', value: 'nombre' },
                { text: 'A. Paterno', value: 'apaterno' },
                { text: 'A. Materno', value: 'amaterno' },
                { text: 'Usuario', value: 'usuario' },
                { text: 'Rol', value: 'rol' },
                { text: 'Acciones', value: 'actions', sortable: false }
            ],
            roles: ['admin', 'usuario'],
            valid: false,
            dialog: false,
            confirmDialog: false,
            dialogMode: 'create', //create, edit, delete
            userData: {
                nombre: '',
                apaterno: '',
                amaterno: '',
                direccion: '',
                telefono: '',
                ciudad: '',
                estado: '',
                usuario: '',
                password: '',
                rol: 'usuario'
            },
            selectedUser: null
        }
    },

    mounted () {
        this.loadUsers()
    },

    methods: {
        closeConfirmDialog () {
            this.confirmDialog = false
            this.selectedUser = null
        },
        async deleteUser () {
            try {
                await this.$axios.delete(`/users/delete/${this.selectedUser.id}`)
                this.$store.dispatch('alert/triggerAlert', {
                    message: 'Usuario borrado satisfactoriamente',
                    type: 'success'
                })
                this.loadUsers()
                this.closeConfirmDialog()
            } catch (error) {
                this.$store.dispatch('alert/triggerAlert', {
                    message: error.message,
                    type: 'error'
                })
            }
        },
        async loadUsers () {
            try {
                const response = await this.$axios.get('/users')
                this.usuarios = response.data
            } catch (error) {
                this.$store.dispatch('alert/triggerAlert', {
                    message: error.message,
                    type: 'error'
                })
            }
        },
        openDialog (mode, user = null) {
            this.dialogMode = mode

            if (mode === 'edit' && user) {
                this.dialog = true
                user.password = ''
                this.userData = { ...user }
            } else if (mode === 'create') {
                this.dialog = true
                this.userData = { 
                    nombre: '',
                    apaterno: '',
                    amaterno: '',
                    direccion: '',
                    telefono: '',
                    ciudad: '',
                    estado: '',
                    usuario: '',
                    password: '',
                    rol: 'usuario'
                }
            } else if (mode === 'delete' && user) {
                this.confirmDialog = true
                this.selectedUser = user
            }   
        },
        saveUser () {
            if (this.dialogMode === 'create') {
                this.createUser()
            } else if (this.dialogMode === 'edit') {
                this.updateUser()
            }
        },
        async createUser () {
            try {
                await this.$axios.post('/users/create', this.userData)
                this.$store.dispatch('alert/triggerAlert', {
                    message: 'Usuario creado satisfactoriamente',
                    type: 'success'
                })
                this.loadUsers()
                this.dialog = false
            } catch (error) {
                this.$store.dispatch('alert/triggerAlert', {
                    message: error.message,
                    type: 'error'
                })
            }
        },
        async updateUser () {
            try {
                await this.$axios.put(`/users/update/${this.userData.id}`, this.userData)
                this.$store.dispatch('alert/triggerAlert', {
                    message: 'Usuario actualizado satisfactoriamente',
                    type: 'success'
                })
                this.loadUsers()
                this.dialog = false
            } catch (error) {
                this.$store.dispatch('alert/triggerAlert', {
                    message: error.message,
                    type: 'error'
                })
            }
        }
    }
}
</script>

<style scoped>

</style>