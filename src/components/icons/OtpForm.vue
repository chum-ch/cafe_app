<script setup>
import { ref, inject, reactive } from "vue";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";

// Consider using a composable for i18n if 't' is required
// const { t } = useI18n(); 

const props = defineProps({
    isShowBackBtn: { type: Boolean, default: true },
    email: { type: String, required: false },
    additionalData: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["onBackClick", "onSuccess"]);

const $api = inject("$api");
const toast = useToast();

// State management
const loading = ref(false);
const resendStatus = ref('idle'); // 'idle' | 'loading' | 'success' | 'error'
const isShowResetPwdForm = ref(false);

const formData = reactive({
    Passcode: "",
});

// Zod Schema

const handleResendOTP = async () => {
    if (resendStatus.value === 'loading') return;

    resendStatus.value = 'loading';
    try {
        await $api.user.resendOTP(props.additionalData.TenantId, {
            Email: props.email,
        });

        resendStatus.value = 'success';
        toast.add({
            severity: "success",
            summary: "OTP Sent",
            detail: "A new code has been sent to your email.",
            life: 3000,
        });
    } catch (error) {
        resendStatus.value = 'error';
        console.error("Resend OTP error:", error);
    } finally {
        // Reset status after a delay so the icon doesn't stick forever
        setTimeout(() => { resendStatus.value = 'idle'; }, 5000);
    }
};

const onFormSubmit = async (e) => {
    if (!e.valid) return;

    loading.value = true;
    try {
        const payload = { OTP: Number(formData.Passcode) };
        await $api.user.sendOTP(props.additionalData.TenantId, payload);

        // Instead of local state, consider emitting the verified data
        isShowResetPwdForm.value = true;
        // Example: emit('onSuccess', { email: props.email, code: formData.Passcode });

    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Verification Failed",
            detail: error.response?.data?.message || "Invalid OTP",
            life: 3000,
        });
        console.error("Form otp error:", error);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="otp-container" v-if="!isShowResetPwdForm">
        <div class="text-center mb-5">
            <div class="icon-badge-wrapper mb-4">
                <div class="icon-pulse"></div>
                <div class="icon-badge">
                    <transition name="scale" mode="out-in">
                        <i v-if="loading" class="pi pi-spin pi-spinner text-3xl text-primary"></i>
                        <i v-else-if="formData.Passcode.length > 0" class="pi pi-lock-open text-3xl text-primary"></i>
                        <i v-else class="pi pi-shield text-3xl text-primary"></i>
                    </transition>
                </div>
            </div>

            <h3 class="text-3xl font-extrabold text-slate-800">Verify Identity</h3>
            <p class="text-slate-500 mt-2 px-4">
                We've sent a 6-digit verification code to <br />
                <span class="font-bold text-primary break-all"> yoeurnchum@gmail.com</span>
            </p>
        </div>

        <Form :initialValues="formData" @submit="onFormSubmit" class="flex flex-col gap-4">
            <div class="flex flex-col items-center">
                <PriInputOtp name="Passcode" integerOnly v-model="formData.Passcode" :length="6" />
                <PriMessage v-if="resendStatus === 'error'" severity="error" size="small" variant="simple">
                    Failed to resend. Try again later.
                </PriMessage>
            </div>

            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Didn't receive a code?</span>
                <PriButton @click="handleResendOTP" variant="text"
                    class="text-primary hover:underline font-medium flex items-center gap-2"
                    :disabled="resendStatus === 'loading'">
                    Resend
                    <i v-if="resendStatus === 'loading'" class="pi pi-spin pi-spinner text-xs"></i>
                    <i v-else-if="resendStatus === 'success'" class="pi pi-check text-green-500 text-xs"></i>
                </PriButton>
            </div>

            <PriButton type="submit" label="Verify & Proceed" class="w-full" :loading="loading"
                icon="pi pi-check-circle" :disabled="formData.Passcode.length !== 6" />
        </Form>
    </div>

</template>

<style scoped>
.otp-container {
    margin: 2rem auto;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    /* Use max-width instead of fixed % for better responsiveness */
    background: white;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
}

/* --- Icon Animations --- */
.icon-badge-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto;
}

.icon-badge {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: #f8fafc;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #e2e8f0;
}

.icon-badge {
    width: 80px;
    height: 80px;
    background: #eff6ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}
.icon-pulse {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 1;
    background: var(--p-primary-color);
    border-radius: 50%;
    opacity: 0.15;
    animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-ring {
    0% { transform: scale(0.95); opacity: 0.2; }
    50% { transform: scale(1.15); opacity: 0.1; }
    100% { transform: scale(0.95); opacity: 0.2; }
}
</style>