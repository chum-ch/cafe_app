<template>
  <div class="login-container flex items-center justify-center rounded-xl">
    <PriToast />
    <div class="form shadow-2xl rounded-xl">
      <div class="text-center mb-6">
        <IconCafe class="text-center w-full" :size="100" :color="'#6F4E37'" />
        <h2 class="text-2xl font-bold text-slate-800">Cafe Login</h2>
        <p class="text-slate-500 text-sm">Please enter your credentials</p>
      </div>
      <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" :validateOnValueUpdate="true"
        :validateOnBlur="true" @submit="onFormSubmit" class="flex flex-wrap w-full">
        <div class="col-12">
          <PriInputText name="email" type="text" placeholder="Email*" fluid
            :class="{ 'p-invalid': $form?.email?.invalid }" />
          <PriMessage v-if="$form?.email?.invalid" severity="error" size="small" variant="simple">
            {{ $form.email.error.message }}
          </PriMessage>
        </div>

        <div class="col-12">

          <PriPassword name="password" placeholder="Password*" v-model="initialValues.password" toggleMask
            :feedback="false" fluid :class="{ 'p-invalid': $form?.password?.invalid }" />
          <template v-if="$form?.password?.invalid">
            <PriMessage v-for="(error, index) of $form.password.errors" :key="index" severity="error" size="small"
              variant="simple">{{ error.message }}</PriMessage>
          </template>
          <div class="float-right mt-1">
            <span class="text-primary cursor-pointer hover:underline font-medium flex items-center gap-2"
            @click="goEmailForm"
            >
              Forgot password?

            </span>

          </div>
        </div>
        <div class="col-12">
          <PriButton type="submit" severity="primary" label="Login" :loading="isSubmitting"
            :style="!$form.valid ? { cursor: 'not-allowed' } : ''" :disabled="!$form.valid"
            class="mt-2 col-12 style-slide-up" />

        </div>
        <div class="text-center col-12">
          <p class="text-sm text-slate-600">
            Don't have an account?
            <span class="text-primary cursor-pointer hover:underline font-medium bg-green" @click="goRegisterForm">Register
            </span>
          </p>
        </div>
      </Form>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import IconCafe from "../icons/IconCafe.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);
const isLogin = ref(true);
const initialValues = reactive({
  email: "",
  password: "",
});

const goRegisterForm = () => router.push('/register')
const goEmailForm = () => router.push('/email')
const resolver = zodResolver(
  z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
);

const onFormSubmit = async (e) => {
  if (!e.valid) return;

  isSubmitting.value = true; // Fixed: was isSubmitting.ref

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.add({
      severity: "success",
      summary: "Success",
      detail: `Welcome back, ${e.values.email}!`, // Fixed: variable name
      life: 3000,
    });

  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Login Failed",
      detail: "Invalid credentials. Please try again.",
      life: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>

.form {
  width: 40%;
  background: url('/imgs/bg3.png') no-repeat center center;
  background-size: cover;
  padding: 2rem;
}

/* Red border for input when invalid */
:deep(.p-invalid) {
  border-color: #ef4444 !important;
}
</style>