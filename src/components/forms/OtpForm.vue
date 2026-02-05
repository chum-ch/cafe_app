<script setup>
import { ref, inject, reactive } from "vue";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";
import { useRouter } from "vue-router";
import { useOnboardingStore } from '@/stores/onboarding';

const emit = defineEmits(["onBackClick", "onSuccess"]);
const props = defineProps({
    isShowBackBtn: { type: Boolean, default: true },
    email: { type: String, required: false },
    additionalData: { type: Object, default: () => ({}) },
});

const $api = inject('$api');
const onboarding = useOnboardingStore();
const toast = useToast();
const loading = ref(false);
const resendStatus = ref('idle'); // 'idle' | 'loading' | 'success' | 'error'
const isShowResetPwdForm = ref(false);
const otpCode = ref('');

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

const handleVerify = async () => {
  try {
    // 1. Call API /v1/auth/verify-otp
    // Use onboarding.email to know who we are verifying
    await $api.auth.verifyOtp({ 
      email: onboarding.email, 
      code: otpCode.value 
    });

    // 2. Update Store (Unlock the Set Password route)
    onboarding.verifySuccess();

    // 3. Route
    router.push({ name: 'set-password' });
  } catch (error) { /* handle error */ }
}

</script>

<template>
    <div class="otp-view-wrapper flex items-center justify-center min-h-[80vh] p-4">
        <PriToast />

        <div v-if="!isShowResetPwdForm" class="otp-container shadow-2xl transition-all duration-300">

            <div class="text-center mb-5">
                <div class="icon-badge-wrapper mb-4">
                    <div class="icon-pulse"></div>
                    <div class="icon-badge shadow-inner">
                        <transition name="scale" mode="out-in">
                            <i v-if="loading" class="pi pi-spin pi-spinner text-3xl text-primary"></i>
                            <i v-else-if="formData.Passcode.length === 6"
                                class="pi pi-lock-open text-3xl text-primary"></i>
                            <i v-else class="pi pi-shield text-3xl text-primary"></i>
                        </transition>
                    </div>
                </div>

                <h3 class="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Verify Identity</h3>
                <p class="text-slate-500 mt-3 px-2 text-sm md:text-base leading-relaxed">
                    We've sent a 6-digit verification code to <br />
                    <span class="font-bold text-primary break-all select-all">{{ email || 'your email' }}</span>
                </p>
            </div>

            <Form :initialValues="formData" @submit="onFormSubmit" class="flex flex-col gap-4">

                <div class="flex flex-col items-center w-full">
                    <div class="otp-input-wrapper  sm:scale-100">
                        <PriInputOtp name="Passcode" integerOnly v-model="formData.Passcode" :length="6"
                            class="gap-1 sm:gap-2" />
                    </div>

                    <PriMessage v-if="resendStatus === 'error'" severity="error" size="small" variant="simple"
                        class="mt-2">
                        Failed to resend. Try again later.
                    </PriMessage>
                </div>

                <div class="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
                    <span class="text-slate-500">Didn't receive a code?</span>
                    <PriButton @click="handleResendOTP" variant="text"
                        class="p-0 text-primary hover:underline font-bold flex items-center gap-2 transition-colors"
                        :disabled="resendStatus === 'loading'">
                        <span>Resend Code</span>
                        <i v-if="resendStatus === 'loading'" class="pi pi-spin pi-spinner text-xs"></i>
                        <i v-else-if="resendStatus === 'success'" class="pi pi-check text-green-500 text-xs"></i>
                    </PriButton>
                </div>

                <div class="pt-2">
                    <PriButton type="submit" label="Verify & Proceed"
                        class="style-slide-up w-full py-3.5 text-lg shadow-lg shadow-primary/20" :loading="loading"
                        icon="pi pi-check-circle" :disabled="formData.Passcode.length !== 6" />
                </div>

                <!-- <div v-if="isShowBackBtn" class="text-center">
                    <span class="text-xs text-slate-400 cursor-pointer hover:text-slate-600"
                        @click="$emit('onBackClick')">
                        Change email address
                    </span>
                </div> -->
            </Form>
        </div>
    </div>
</template>

<style scoped>
.otp-container {
    width: 100%;
    max-width: 440px;
    padding: 1.5rem;
    background: linear-gradient(#fffffff0, #fffffff0), 
              url('/imgs/bg3.png') no-repeat center center;
  background-size: cover;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
}

@media (min-width: 640px) {
    .otp-container {
        padding: 2.5rem;
    }
}

/* Fixes OTP input overflowing on very small screens (iPhone SE etc) */
.otp-input-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
}

@media (min-width: 640px) {
    :deep(.p-inputotp-input) {
        width: 3.3rem !important;
        height: 3.3rem !important;
        font-size: 1.5rem;
    }
}

/* --- Icon Badge & Pulse --- */
.icon-badge-wrapper {
    position: relative;
    width: 84px;
    height: 84px;
    margin: 0 auto;
}

.icon-badge {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: #eff6ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px solid #ffffff;
}

.icon-pulse {
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    z-index: 1;
    background: var(--p-primary-color);
    border-radius: 50%;
    opacity: 0.1;
    animation: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-ring {
    0% {
        transform: scale(0.9);
        opacity: 0.2;
    }

    50% {
        transform: scale(1.3);
        opacity: 0.05;
    }

    100% {
        transform: scale(0.9);
        opacity: 0.2;
    }
}

/* Transition for icon switch */
.scale-enter-active,
.scale-leave-active {
    transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0.8);
}
</style>