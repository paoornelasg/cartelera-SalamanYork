<template>
    <div class="cinema-hero" :style="backgroundStyle">
        <div class="cinema-hero-overlay" />

        <div class="cinema-hero-content">
        <p class="cinema-hero-kicker">
            Bienvenido a
        </p>

        <h1 class="cinema-hero-title">
            {{ title }}
        </h1>

        <p class="cinema-hero-slogan">
            {{ slogan }}
        </p>

        <p v-if="subtitle" class="cinema-hero-subtitle">
            {{ subtitle }}
        </p>

        <div class="cinema-hero-actions">
            <NuxtLink to="/shop" class="cinema-hero-button-primary">
            Ver cartelera
            </NuxtLink>
            <NuxtLink to="/about" class="cinema-hero-button-ghost">
            Conoce el cine
            </NuxtLink>
        </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CinemaHero',
    props: {
        title: {
        type: String,
        default: 'Cartelera de SalamanYork'
        },
        slogan: {
        type: String,
        default: 'Las mejores películas y estrenos disponibles ahora.'
        },
        subtitle: {
        type: String,
        default: 'Estrenos, preventas y funciones especiales en un solo lugar.'
        },
        background: {
        type: String,
        default: () => '/portada.png'
        }
    },
    computed: {
        backgroundStyle () {
        return {
            backgroundImage: `
            linear-gradient(120deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.9) 100%),
            url(${this.background})
            `
        }
        }
    }
}
</script>

<style scoped>
.cinema-hero {
    position: relative;
    width: 100%;
    height: 420px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
}

.cinema-hero-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 10% 0%, rgba(255,255,255,0.15) 0%, transparent 50%);
    mix-blend-mode: soft-light;
    pointer-events: none;
}

.cinema-hero-content {
    position: relative;
    max-width: 900px;
    padding: 0 24px;
    text-align: center;
}

.cinema-hero-kicker {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.85rem;
    margin-bottom: 12px;
    opacity: 0.9;
}

.cinema-hero-title {
    font-size: clamp(2.6rem, 5vw, 3.6rem);
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 12px;
}

.cinema-hero-slogan {
    font-size: 1.1rem;
    margin-bottom: 8px;
    opacity: 0.95;
}

.cinema-hero-subtitle {
    font-size: 0.98rem;
    opacity: 0.85;
    max-width: 640px;
    margin: 0 auto 24px;
}

.cinema-hero-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
}

.cinema-hero-button-primary,
.cinema-hero-button-ghost {
    padding: 10px 22px;
    border-radius: 999px;
    font-size: 0.95rem;
    font-weight: 500;
    text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, color 0.15s ease;
}

.cinema-hero-button-primary {
    background-color: #db133b;
    color: #111111;
    box-shadow: 0 10px 35px rgba(0,0,0,0.35);
}

.cinema-hero-button-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 40px rgba(0,0,0,0.45);
}

.cinema-hero-button-ghost {
    border: 1px solid rgba(255,255,255,0.6);
    color: #ffffff;
    background-color: rgba(0,0,0,0.15);
}

.cinema-hero-button-ghost:hover {
    background-color: rgba(0,0,0,0.4);
}

/* Responsive */
@media (max-width: 768px) {
    .cinema-hero {
        height: 360px;
    }

    .cinema-hero-title {
        font-size: clamp(2.2rem, 4.8vw, 3rem);
    }

    .cinema-hero-slogan {
        font-size: 1rem;
    }

    .cinema-hero-subtitle {
        font-size: 0.9rem;
        margin-bottom: 20px;
    }

    .cinema-hero-actions {
        gap: 10px;
    }

    .cinema-hero-button-primary,
    .cinema-hero-button-ghost {
        width: 100%;
        justify-content: center;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .cinema-hero {
        height: 320px;
    }

    .cinema-hero-title {
        font-size: 2rem;
    }

    .cinema-hero-kicker {
        font-size: 0.8rem;
    }
}
</style>
