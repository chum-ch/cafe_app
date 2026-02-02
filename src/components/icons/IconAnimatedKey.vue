<template>
    <div class="key-container">
        <div class="glow-sphere"></div>

        <div class="key-card">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="key-svg">
                <path class="key-path"
                    d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                <circle class="key-dot" cx="16.5" cy="7.5" r=".8" fill="currentColor" />
            </svg>

            <div class="shimmer-sweep"></div>
        </div>
    </div>
</template>

<style scoped>
.key-container {
    position: relative;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

/* 1. Ambient Background Glow */
.glow-sphere {
    position: absolute;
    width: 60px;
    height: 60px;
    background: var(--p-primary-500);
    filter: blur(25px);
    border-radius: 50%;
    opacity: 0.15;
    animation: pulse-glow 4s ease-in-out infinite;
}

/* 2. The Glass Container */
.key-card {
    position: relative;
    width: 72px;
    height: 72px;
    /* background: rgba(255, 255, 255, 0.8); */
    /* background: #eff6ff; */
    backdrop-filter: blur(8px);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.08); */
    overflow: hidden;
    animation: float-key 3s ease-in-out infinite;
}

.key-svg {
    width: 38px;
    height: 38px;
    color: var(--p-primary-600);
    z-index: 2;
    transition: transform 0.3s ease;
}

/* 3. SVG Path Animation */
.key-path {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: draw-key 2s ease-out forwards;
}

.key-dot {
    animation: blink-dot 2s infinite 2s;
}

/* 4. Shimmer Sweep Effect */
.shimmer-sweep {
    position: absolute;
    top: 0;
    left: -150%;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent);
    transform: skewX(-25deg);
    animation: shine-sweep 4s infinite 1s;
}

/* Keyframes */
@keyframes draw-key {
    to {
        stroke-dashoffset: 0;
    }
}

@keyframes float-key {

    0%,
    100% {
        transform: translateY(0) rotate(0);
    }

    50% {
        transform: translateY(-8px) rotate(-3deg);
    }
}

@keyframes pulse-glow {

    0%,
    100% {
        opacity: 0.15;
        transform: scale(1);
    }

    50% {
        opacity: 0.3;
        transform: scale(1.4);
    }
}

@keyframes shine-sweep {
    0% {
        left: -150%;
    }

    25% {
        left: 150%;
    }

    100% {
        left: 150%;
    }
}

@keyframes blink-dot {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.3;
    }
}

/* Hover effect for a playful feel */
/* .key-container:hover .key-svg {
    transform: scale(1.15) rotate(15deg);
    color: var(--p-primary-500);
} */
</style>