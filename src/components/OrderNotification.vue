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
                                <span v-if="Array.isArray(notification.data) && notification.data.length > 1">
                                    <span class="text-orange-500">{{ notification.data.length }} </span> items
                                </span>
                                <span v-else>
                                    #{{ notification.OrderCode }} - {{ notification.Name }}
                                </span>
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
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(['order-action', 'new-order-received']);

const notifications = ref([]);
const isAudioUnlocked = ref(false);
const ws = ref(null); // WebSocket reference
let alertSound = null;

const authStore = useAuthStore();
const userInfo = authStore.getUserSessionStorage();
const tenantId = userInfo?.TenantId;
const userId = userInfo?.EntityItemId; // Optional, useful for tracking connection

// --- Audio Handling ---
const unlockAudio = () => {
    // We create the audio object on user interaction to bypass browser autoplay policies
    alertSound = new Audio('/sounds/notification.mp3'); // Ensure this file exists in /public/sounds/
    alertSound.play()
        .then(() => {
            alertSound.pause();
            alertSound.currentTime = 0;
            isAudioUnlocked.value = true;
        })
        .catch(e => console.error("Could not unlock audio", e));
};

const playSound = () => {
    if (alertSound && isAudioUnlocked.value) {
        alertSound.currentTime = 0;
        alertSound.play().catch(e => console.error("Sound play failed:", e));
    }
};

// --- WebSocket Logic ---
onMounted(() => {
    // 1. Define AWS WebSocket URL
    // REPLACE with your actual API Gateway WebSocket URL
    const WSS_URL = `wss://6jo7ogtbc6.execute-api.ap-southeast-1.amazonaws.com/dev`; 
    
    // 2. Connect
    // console.log(`Connecting to WebSocket: ${WSS_URL}?tenantId=${tenantId}`);
    ws.value = new WebSocket(`${WSS_URL}?tenantId=${tenantId}`);

    // 3. Handle Open
    ws.value.onopen = () => {
        console.log("✅ WebSocket Connected");
    };

    // 4. Handle Message (New Order)
    ws.value.onmessage = (event) => {
        // console.log("📩 Message received:", event.data);
        try {
            const parsedData = JSON.parse(event.data);
            handleNewOrder(parsedData);
        } catch (e) {
            console.error("Error parsing WebSocket message:", e);
        }
    };

    // 5. Handle Errors
    ws.value.onerror = (error) => {
        console.error("❌ WebSocket Error:", error);
    };

    // 6. Handle Close (Auto-reconnect logic could go here)
    ws.value.onclose = () => {
        console.log("⚠️ WebSocket Disconnected");
    };
});

onUnmounted(() => {
    if (ws.value) {
        ws.value.close();
    }
});

// --- Notification Logic ---
const handleNewOrder = (orderData) => {
    console.log('New order detected via socket!', orderData);
    // 1. Create notification object
    const notification = {
        data: orderData, // Store the raw data
        // Flatten properties for easier display if it's a single item, 
        // or handle array logic in template
        ...((Array.isArray(orderData) && orderData.length > 0) ? orderData[0] : orderData), 
        id: Date.now() + Math.random()
    };

    // 2. Add to list
    notifications.value.push(notification);

    // 3. Emit event to Parent (BaristaFlow) to refresh API list
    emit('new-order-received', orderData);

    // 4. Play Sound
    playSound();

    // 5. Auto-remove after 8 seconds
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
    position: relative; /* Important for absolute progress bar */
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-bottom: 10px; /* Add spacing between multiple toasts */
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