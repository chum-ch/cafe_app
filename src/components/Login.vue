<template>
  <div class="login-container flex items-center justify-center rounded-xl border border-white/10">
    <PriToast />
    <div class="form shadow-2xl rounded-xl border border-white/10">
      <div class="text-center mb-6">
        <IconCafe
          class="text-center w-full"
          :size="100"
        />
        <h2 class="text-2xl font-bold text-slate-800">Cafe Login</h2>
        <p class="text-slate-500 text-sm">Please enter your credentials</p>
      </div>
        <Form
          v-slot="$form"
          :initialValues="initialValues"
          :resolver="resolver"
          :validateOnValueUpdate="true"
          :validateOnBlur="true"
          @submit="onFormSubmit"
          class="flex flex-wrap w-full"
        >
          <div class="col-12">
            <PriInputText
              name="username"
              type="text"
              placeholder="Username*"
              fluid
              :class="{ 'p-invalid': $form?.username?.invalid, 'style-glass-next': true }"
            />
            <PriMessage
              v-if="$form?.username?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.username.error.message }}
            </PriMessage>
          </div>

          <div class="col-12">
            <PriPassword
              name="password"
              placeholder="Password*"
              v-model="initialValues.password"
              toggleMask
              fluid
              :class="{ 'p-invalid': $form?.password?.invalid,'style-glass-back': true }"
            />
            <template v-if="$form?.password?.invalid">
                <PriMessage v-for="(error, index) of $form.password.errors" :key="index" severity="error" size="small" variant="simple">{{ error.message }}</PriMessage>
            </template>
            <!-- <PriMessage
              v-if="$form?.password?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              <ul class="m-0 p-0 list-none flex flex-col gap-1">
                <li v-for="(error, index) of $form.password.errors" :key="index">
                  • {{ error.message }}
                </li>
              </ul>
            </PriMessage> -->
          </div>
          <div class="col-12">
          <PriButton 
            type="submit" 
            severity="primary" 
            label="Login" 
            :loading="isSubmitting"
            :style="!$form.valid ? { cursor: 'not-allowed'} : ''"
            :disabled="!$form.valid"
            class="mt-2 col-12 style-slide-up"
          />
          </div>
        </Form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import IconCafe from "./icons/IconCafe.vue";
const toast = useToast();
const isSubmitting = ref(false);

const initialValues = ref({
  username: "",
  password: "",
});

const resolver = zodResolver(
  z.object({
    username: z.string().trim().min(1, "Username is required."),
    password: z.string().trim().min(1, "Password is required."),
    // password: z
    //   .string()
    //   .min(3, "Min 3 characters.")
    //   .max(8, "Max 8 characters.")
    //   .regex(/[a-z]/, "Must have a lowercase letter.")
    //   .regex(/[A-Z]/, "Must have an uppercase letter.")
    //   .regex(/\d/, "Must have a number.")
  })
);

const onFormSubmit = async (e) => {
  if (!e.valid) return;

  isSubmitting.ref = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.add({
      severity: "success",
      summary: "Welcome back!",
      detail: `Authenticated as ${e.values.username}`,
      life: 3000,
    });
    
    // e.reset(); // Uncomment to clear form after success
  } catch (error) {
    toast.add({ severity: "error", summary: "Login Failed", life: 3000 });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.login-container {
  width: 40%;
  background: url('/imgs/bg3.png') no-repeat center center;
  background-size: cover;
}
.form {
  padding: 2rem;
}
/* Red border for input when invalid */
:deep(.p-invalid) {
  border-color: #ef4444 !important;
}

</style>