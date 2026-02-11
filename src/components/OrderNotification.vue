<template>
    <div class="notification-wrapper">
        <div v-if="!isAudioUnlocked" class="audio-unlock-overlay">
            <div class="unlock-box">
                <span class="unlock-icon">🔊</span>
                <p class="unlock-text">Notification sounds are muted by your browser.</p>
                <button @click="unlockAudio" class="unlock-btn">
                    Enable
                </button>
            </div>
        </div>

        <div class="notification-container">
            <transition-group name="fade">
                <div v-for="notification in notifications" :key="notification.id" class="toast-notification"
                    @click="handleToastClick(notification)">
                    <div class="toast-content">
                        <div class="icon-wrapper">☕</div>
                        <div class="toast-details">
                            <strong class="toast-title">New Order!</strong>
                            <p class="toast-subtitle">{{ notification.Name }} - {{ notification.Size }}</p>
                        </div>
                    </div>
                    <button class="close-btn" @click.stop="removeNotification(notification.id)">×</button>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from "socket.io-client";
import { useAuthStore } from '@/stores/auth';

// --- NEW: Define Emit for Parent Component ---
const emit = defineEmits(['order-action']);

const notifications = ref([]);
const isAudioUnlocked = ref(false);
let socket = null;
let alertSound = null;

const authStore = useAuthStore();
const userInfo = authStore.getUserSessionStorage();
const tenantId = userInfo?.TenantId;
const userId = userInfo?.EntityItemId;

// --- Method to Unlock Audio (Must be user-initiated) ---
const unlockAudio = () => {
    if (alertSound) {
        alertSound.play()
            .then(() => {
                alertSound.pause();
                alertSound.currentTime = 0;
                isAudioUnlocked.value = true;
            })
            .catch(e => console.error("Could not unlock audio", e));
    }
};

const handleNewOrder = (orderData) => {
    const notification = {
        ...orderData,
        id: Date.now() + Math.random()
    };

    console.log('notification', notification);
    notifications.value.push(notification);

    // Play sound ONLY if user has interacted/enabled it
    if (alertSound && isAudioUnlocked.value) {
        alertSound.currentTime = 0;
        alertSound.play().catch(e => console.error("Sound play failed:", e));
    }

    // Auto-remove notification after 8 seconds
    setTimeout(() => {
        removeNotification(notification.id);
    }, 8000);
};

const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id);
};

// --- NEW: Handle Toast Click ---
const handleToastClick = (notification) => {
    emit('order-action', notification);
    removeNotification(notification.id);
};

onMounted(() => {
    alertSound = new Audio('/sounds/notification.wav');
    const socketServerUrl = `http://localhost:3008`;
    socket = io(socketServerUrl, {
        query: { tenantId, userId }
    });

    socket.on("newOrder", (orderData) => {
        handleNewOrder(orderData);
    });
});

onUnmounted(() => {
    if (socket) socket.disconnect();
});
</script>

<style scoped>
/* OVERLAY STYLES - Modernized */
.audio-unlock-overlay {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    width: 90%;
    max-width: 450px;
}

.unlock-box {
    background: rgba(245, 158, 11, 0.95);
    /* Semi-transparent Amber */
    color: white;
    padding: 12px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    backdrop-filter: blur(5px);
    font-family: sans-serif;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.unlock-icon {
    font-size: 1.2rem;
}

.unlock-text {
    flex-grow: 1;
    margin: 0;
    font-size: 0.9rem;
    font-weight: 500;
}

.unlock-btn {
    background: white;
    color: #d97706;
    border: none;
    padding: 6px 14px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
    white-space: nowrap;
}

.unlock-btn:hover {
    background: #fff8e1;
    transform: translateY(-1px);
}

/* NOTIFICATION STYLES - Beautified & Responsive */
.notification-container {
    position: fixed;
    top: 80px;
    /* Below overlay */
    right: 20px;
    z-index: 9999;
    width: calc(100% - 40px);
    max-width: 350px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
    .notification-container {
        top: auto;
        bottom: 20px;
        right: 50%;
        transform: translateX(50%);
    }
}

.toast-notification {
    background: white;
    color: #1f2937;
    padding: 16px;
    border-radius: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: hidden;
    position: relative;
}

.toast-notification:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.icon-wrapper {
    font-size: 24px;
    background: #f3f4f6;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
}

.toast-title {
    font-size: 1rem;
    color: #111827;
}

.toast-subtitle {
    font-size: 0.85rem;
    color: #6b7280;
    margin: 2px 0 0 0;
}

.close-btn {
    background: #f3f4f6;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    font-size: 18px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.close-btn:hover {
    background: #fee2e2;
    color: #ef4444;
}

/* TRANSITION ANIMATIONS - Modern Sliding */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.fade-enter-from {
    opacity: 0;
    transform: translateX(50px);
}

.fade-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>