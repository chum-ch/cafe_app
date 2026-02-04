<script setup>
import { ref, inject, computed, watch } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";
import IconAnimatedKey from "../icons/IconAnimatedKey.vue";
const props = defineProps({
    isShowBackBtn: { type: Boolean, default: true },
    additionalData: { type: Object, default: () => ({}) },
    isForgotPwd: { type: Boolean, default: false },
});

const emit = defineEmits(["onBackClick", "onSuccess"]);
const $api = inject("$api");
const toast = useToast();

const loading = ref(false);
const isSuccess = ref(false);

const formData = ref({
    NewPassword: "",
    ConfirmPassword: "",
});

// Real-time requirements check
const requirements = computed(() => [
    { label: '6-20 Characters', met: formData.value.NewPassword.length >= 6 && formData.value.NewPassword.length <= 20 },
    { label: 'Upper & Lowercase', met: /[a-z]/.test(formData.value.NewPassword) && /[A-Z]/.test(formData.value.NewPassword) },
    { label: 'Contains Number', met: /\d/.test(formData.value.NewPassword) },
    { label: 'Special Character', met: /[!@#$%^&*]/.test(formData.value.NewPassword) },
]);

const strength = computed(() => {
    const metCount = requirements.value.filter(r => r.met).length;
    return (metCount / requirements.value.length) * 100;
});

const schema = z.object({
    NewPassword: z.string().min(6).max(20)
        .refine((val) => /[a-z]/.test(val) && /[A-Z]/.test(val), '')
        .refine((val) => /\d/.test(val), '')
        .refine((val) => /[!@#$%^&*]/.test(val), ''),
    ConfirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.NewPassword === data.ConfirmPassword, {
    message: "Passwords do not match",
    path: ["ConfirmPassword"],
});

const onFormSubmit = async (e) => {
    if (!e.valid) return;
    loading.value = true;
    try {
        const payload = {
            Password: formData.value.NewPassword,
            ConfirmPassword: formData.value.ConfirmPassword,
            ...(props.isForgotPwd && {
                Email: props.additionalData.Email,
                OtpCode: Number(props.additionalData.OtpCode),
                Code: Number(props.additionalData.CodeShop)
            })
        };
        if (props.isForgotPwd) await $api.user.forgotPassword(props.additionalData.TenantId, payload);
        else await $api.user.setPassword(props.additionalData.TenantId, payload);

        isSuccess.value = true;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Password updated', life: 3000 });
        setTimeout(() => emit('onSuccess'), 2200);
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'Update failed', life: 5000 });
    } finally {
        loading.value = false;
    }
};
</script>
<template>
    <div class="set-pwd-container flex items-center justify-center min-h-[90vh] p-4 sm:p-6">
        <PriToast />

        <div class="pwd-card shadow-2xl rounded-2xl w-full max-w-[450px] transition-all duration-300">
            <Transition name="view-flip" mode="out-in">
                <div v-if="isSuccess" class="text-center py-8 success-view">
                    <div class="success-circle">
                        <i class="pi pi-check text-4xl md:text-5xl"></i>
                    </div>
                    <h2 class="text-2xl font-bold mt-6 text-slate-800">Security Updated</h2>
                    <p class="text-slate-500 mt-2">Redirecting you to login...</p>
                </div>

                <div v-else>
                    <div class="header-box flex flex-col items-center mb-4">
                        <IconAnimatedKey class="mb-2" />
                        <h2 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Security Settings</h2>
                        <p class="text-slate-500 text-sm text-center px-4">
                            {{ isForgotPwd ? 'Reset your forgotten password' : 'Create a secure password' }}
                        </p>
                    </div>

                    <Form v-slot="$form" :resolver="zodResolver(schema)" :initialValues="formData"
                        @submit="onFormSubmit" class="flex flex-col gap-3">
                        <div class="flex flex-col gap-2">
                            <div class="flex justify-between items-end mb-1">
                                <label class="text-sm font-bold text-slate-600">New Password</label>
                                <span class="text-xs font-mono font-bold"
                                    :class="strength === 100 ? 'text-green-500' : 'text-slate-400'">
                                    {{ Math.round(strength) }}%
                                </span>
                            </div>

                            <PriPassword name="NewPassword" v-model="formData.NewPassword" toggleMask fluid
                                :feedback="false" placeholder="New Password" class="premium-input" />

                            <div class="strength-bar-container">
                                <div class="strength-fill"
                                    :style="{ width: strength + '%', background: strength < 50 ? '#ef4444' : strength < 100 ? '#f59e0b' : '#22c55e' }">
                                </div>
                            </div>

                            <div
                                class="grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-2 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div v-for="req in requirements" :key="req.label"
                                    class="flex items-center gap-2 text-[11px] sm:text-[12px] transition-colors duration-300"
                                    :class="req.met ? 'text-green-600 font-medium' : 'text-slate-400'">
                                    <i :class="req.met ? 'pi pi-check-circle' : 'pi pi-circle'" class="text-[10px]"></i>
                                    {{ req.label }}
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-bold text-slate-600">Confirm Password</label>
                            <PriPassword name="ConfirmPassword" v-model="formData.ConfirmPassword" :feedback="false"
                                toggleMask fluid placeholder="Confirm Password" class="premium-input" />
                            <PriMessage v-if="$form.ConfirmPassword?.invalid" severity="error" variant="simple"
                                size="small">
                                {{ $form.ConfirmPassword.error?.message }}
                            </PriMessage>
                        </div>

                        <div class="flex flex-col gap-3 mt-3">
                            <PriButton type="submit" label="Update Security" :loading="loading"
                                class="update-btn text-lg style-slide-up" :disabled="!$form.valid"
                                :style="!$form.valid ? { cursor: 'not-allowed' } : ''" />
                        </div>
                    </Form>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.pwd-card {
    /* Using a semi-transparent background overlay so text is readable over the image */
    background: linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)),
        url('/imgs/bg3.png') no-repeat center center;
    background-size: cover;
    padding: 1.5rem;
    /* Smaller padding for mobile */
}

/* Tablet and Desktop padding increase */
@media (min-width: 640px) {
    .pwd-card {
        padding: 2.5rem 2rem;
    }
}

/* Strength Bar */
.strength-bar-container {
    height: 6px;
    background: #f1f5f9;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 6px;
}

.strength-fill {
    height: 100%;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Success View */
.success-circle {
    width: 80px;
    height: 80px;
    background: #22c55e;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
    animation: scaleUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scaleUp {
    from {
        transform: scale(0);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>