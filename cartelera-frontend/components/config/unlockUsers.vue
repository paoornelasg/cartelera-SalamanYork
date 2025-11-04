<template>
    <v-container>
        <h1 class = "text-h4 mb-4">
            Desbloquear usuarios
        </h1>

        <!-- Tabla de usuarios bloqueados -->
         <v-data-table
            :headers = "headers"
            :items = "usuariosBloqueados"
            :items-per-page = "15"
            dense
            class = "mt-4"
         >
            <template #[`item.acciones`]="{ item }">
                <v-icon color = "green" title = "Desbloquear" @click = "desbloquearUsuario(item.id)">
                    mdi-account-check
                </v-icon>
            </template>
         </v-data-table>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            usuariosBloqueados: [],
            headers: [
                { text: 'Nombre', value: 'nombre' },
                { text: 'A. Paterno', value: 'apaterno'},
                { text: 'A. Materno', value: 'amaterno' },
                { text: 'Usuario', value: 'usuario' },
                { text: 'Acciones', value: 'acciones', sortable: false }
            ]
        }
    },
    mounted() {
        this.obtenerUsuariosBloqueados();

    },
    methods: {
        async obtenerUsuariosBloqueados() {
            try {
                const response = await this.$axios.get('/users')
                this.usuariosBloqueados = response.data.filter(user => user.bloqueado)
            } catch (error) {
                this.$store.dispatch('alert/triggerAlert', {
                    message: error.message,
                    type: 'error'
                })
            }
        },
        async desbloquearUsuario (id) {
            try {
                await this.$axios.post(`/users/unlock/${id}`)
                this.$store.dispatch('alert/triggerAlert', {
                    message: 'Usuario desbloqueado satisfactoriamente',
                    type: 'success'
                })
                this.obtenerUsuariosBloqueados()
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