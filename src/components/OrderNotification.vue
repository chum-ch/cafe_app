<template>
    <div class="notification-wrapper">
        <transition name="fade-overlay">
            <div v-if="!isAudioUnlocked" class="audio-unlock-overlay">
                <div class="unlock-box">
                    <span class="unlock-icon">🔊</span>
                    <div class="unlock-content">
                        <strong>Enable Notifications</strong>
                        <p>Click to enable sound alerts for new orders.</p>
                    </div>
                    <button @click="unlockAudio" class="unlock-btn">Enable</button>
                </div>
            </div>
        </transition>

        <div class="notification-container">
            <transition-group name="toast">
                <div v-for="notification in notifications" :key="notification.id" class="toast-notification"
                    @click="handleToastClick(notification)" role="alert">
                    <div class="toast-content">
                        <div class="icon-wrapper">☕</div>
                        <div class="toast-details">
                            <strong class="toast-title">New Order!</strong>
                            <p class="toast-subtitle">
                                #{{ notification.OrderCode }} - {{ notification.Name }} ({{ notification.Size }})
                            </p>
                        </div>
                    </div>
                    <button class="close-btn" @click.stop="removeNotification(notification.id)"
                        aria-label="Close notification">
                        ×
                    </button>
                    <div class="toast-progress"></div>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from "socket.io-client";
import { useAuthStore } from '@/stores/auth';

// --- FIXED: Define both events here ---
const emit = defineEmits(['order-action', 'new-order-received']);

const notifications = ref([]);
const isAudioUnlocked = ref(false);
let socket = null;
let alertSound = null;

const authStore = useAuthStore();
const userInfo = authStore.getUserSessionStorage();
const tenantId = userInfo?.TenantId;
const userId = userInfo?.EntityItemId;

// Method to Unlock Audio
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

    notifications.value.push(notification);

    // --- NEW: Emit to BaristaFlow.vue to refresh the list ---
    emit('new-order-received', notification);

    if (alertSound && isAudioUnlocked.value) {
        alertSound.currentTime = 0;
        alertSound.play().catch(e => console.error("Sound play failed:", e));
    }

    setTimeout(() => {
        removeNotification(notification.id);
    }, 8000);
};

const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id);
};

const handleToastClick = (notification) => {
    emit('order-action', notification);
    removeNotification(notification.id);
};

// onMounted(() => {
//     alertSound = new Audio('/sounds/notification.wav');
//     const socketServerUrl = `http://localhost:3008`;
//     // const socketServerUrl = `https://eaownyg1ak.execute-api.ap-southeast-1.amazonaws.com/dev`;
//     socket = io(socketServerUrl, {
//         query: { tenantId, userId }
//     });

//     socket.on("newOrder", (orderData) => {
//         handleNewOrder(orderData);
//     });
// });

onUnmounted(() => {
    if (socket) socket.disconnect();
});
</script>

<style scoped>
/* Overlay Styles */
.audio-unlock-overlay {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    width: calc(100% - 40px);
    max-width: 480px;
}

.unlock-box {
    background: white;
    color: #1f2937;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 15px;
    border: 1px solid #e5e7eb;
}

.unlock-icon {
    font-size: 1.5rem;
    background: #fef3c7;
    padding: 10px;
    border-radius: 12px;
}

.unlock-content {
    flex-grow: 1;
}

.unlock-content strong {
    display: block;
    font-size: 1rem;
    color: #b45309;
}

.unlock-content p {
    margin: 0;
    font-size: 0.85rem;
    color: #6b7280;
}

.unlock-btn {
    background: #f59e0b;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
}

.unlock-btn:hover {
    background: #d97706;
}

/* Notification Container */
.notification-container {
    position: fixed;
    top: 90px;
    right: 20px;
    z-index: 9999;
    width: calc(100% - 40px);
    max-width: 360px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Toast Card */
.toast-notification {
    background: white;
    color: #1f2937;
    padding: 16px;
    border-radius: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    border: 1px solid #f3f4f6;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.toast-notification:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.icon-wrapper {
    font-size: 20px;
    background: #f3f4f6;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
}

.toast-title {
    font-size: 1rem;
    font-weight: 700;
    color: #111827;
}

.toast-subtitle {
    font-size: 0.85rem;
    color: #6b7280;
    margin: 2px 0 0 0;
}

.close-btn {
    background: transparent;
    border: none;
    color: #d1d5db;
    cursor: pointer;
    font-size: 20px;
    padding: 0 5px;
    transition: color 0.2s;
}

.close-btn:hover {
    color: #ef4444;
}

/* Progress Bar */
.toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: #10b981;
    width: 100%;
    animation: progress 8s linear forwards;
}

@keyframes progress {
    from {
        width: 100%;
    }

    to {
        width: 0%;
    }
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100px);
}

.toast-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

/* Responsive Breakpoints */
@media (max-width: 640px) {
    .notification-container {
        top: auto;
        bottom: 20px;
        right: 50%;
        transform: translateX(50%);
    }
}
</style>