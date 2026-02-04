<template>
  <div class="login-container flex items-center justify-center rounded-xl">
    <PriToast />
    <div class="form shadow-2xl rounded-xl">
      <div class="text-center mb-6">
        <IconMail class="text-center w-full" :size="100" :color="'#6F4E37'" />
        <h2 class="text-2xl font-bold text-slate-800">Create an account</h2>
        <p class="text-slate-500 text-sm">Start your brewing journey with us</p>
      </div>
      <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" :validateOnValueUpdate="true"
        :validateOnBlur="true" @submit="onFormSubmit" class="flex flex-wrap w-full">
        <div class="col-12 mb-2">
          <PriInputText name="email" type="text" placeholder="Email*" fluid
            :class="{ 'p-invalid': $form?.email?.invalid }" />
          <PriMessage v-if="$form?.email?.invalid" severity="error" size="small" variant="simple">
            {{ $form.email.error.message }}
          </PriMessage>
        </div>
        <div class="col-12">
          <PriButton type="submit" severity="primary" label="Register" :loading="isSubmitting"
            :style="!$form.valid ? { cursor: 'not-allowed' } : ''" :disabled="!$form.valid"
            class="mt-2 col-12 style-slide-up" />
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
import IconMail from "../icons/IconMail.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);

const initialValues = reactive({
  brandName: "",
  email: "",
});

const resolver = zodResolver(
  z.object({
    brandName: z.string().min(1, "Brand name is required."),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address."),
  })
);

const onFormSubmit = async (e) => {
  if (!e.valid) return;

  isSubmitting.value = true; // Fixed: was isSubmitting.ref
    router.push('/set-password')

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
  padding: 2rem 1.5rem;
}
</style>