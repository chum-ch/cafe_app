<script setup>
import { ref, inject, onMounted } from "vue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { FilterMatchMode } from '@primevue/core/api';
import { useAuthStore } from "@/stores/auth";

// --- Mock Data Service ---
const cafeItems = ref([]);

// --- State Management ---
const $api = inject('$api');

const authStore = useAuthStore();
const userInfo = authStore.getUserSessionStorage();
const tenantId = userInfo?.TenantId;
const userId = userInfo?.EntityItemId;
const emailLogin = userInfo?.Email;
const roleLogin = userInfo?.Role;
const dialogVisible = ref(false);
const isEditing = ref(null);
const isSubmitting = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const price = ref(0);
const priceError = ref(''); // For manual validation message
const defaultImage = 'https://placehold.net/400x400.png';

// Options
const CONFIG = {
  sizes: ['S', 'M', 'L'],
  sugarLevels: ['30%', '50%', '70%', '100%'],
  moods: [
    { id: 'HOT', label: 'Hot', color: 'bg-orange-500', ring: 'ring-orange-100' },
    { id: 'COLD', label: 'Cold', color: 'bg-blue-500', ring: 'ring-blue-100' }
  ],
  status: [
    { id: 'PENDING', label: 'Pending', color: 'bg-slate-900', ring: 'text-white ring-3 ring-amber-100' },
    { id: 'PREPARING', label: 'Preparing', color: 'bg-blue-500', ring: 'text-white ring-3 ring-blue-100' },
    { id: 'BREWING', label: 'Brewing', color: 'bg-orange-500', ring: 'text-white ring-3 ring-orange-100' },
    { id: 'COMPLETED', label: 'Completed', color: 'bg-emerald-500', ring: 'text-white ring-3 ring-emerald-100' },
    { id: 'CANCELLED', label: 'Cancelled', color: 'bg-red-500', ring: 'text-white ring-3 ring-red-100' },
  ]
};

// Define unique styles for each size when selected
const sizeStyles = {
  S: 'bg-amber-400 text-white ring-3 ring-amber-100',    // Small = Amber/Gold
  M: 'bg-orange-500 text-white ring-3 ring-orange-100', // Medium = Orange (The "Default" pop)
  L: 'bg-emerald-500 text-white ring-3 ring-emerald-100' // Large = Emerald/Green
};

const sizeOptions = ref(CONFIG.sizes);
const sugarOptions = ref(CONFIG.sugarLevels);
const moodOptions = ref(CONFIG.moods.map(m => m.id));
// --- Form Validation Schema (Zod) ---
const resolver = zodResolver(
  z.object({
    id: z.number().optional(),
    Name: z.string().min(1, "Name is required."),

    Category: z.string().min(1, "Category is required."),
    Description: z.string().optional(),
    Image: z.string().optional(),
    Size: z.string().min(1, "Select at least one size."),
    Mood: z.string().min(1, "Select a mood."),
    Sugar: z.string().min(1, "Select sugar level."),
  })
);

// --- Form Initial Values ---
const getInitialValues = () => ({
  Name: "",
  Price: null,
  Category: "",
  Description: "",
  Image: "",
  Popular: false,
  Rating: 0,
  Size: "",
  Mood: "HOT",
  Sugar: "",
  EntityItemId: "",
});

const formValues = ref(getInitialValues());

// --- Actions (CRUD) ---
// --- Actions (CRUD) ---
const openNew = () => {
  formValues.value = getInitialValues();
  price.value = null; // 2. Reset separate variable
  priceError.value = '';
  isEditing.value = null;
  dialogVisible.value = true;
};

const editItem = (item) => {
  formValues.value = JSON.parse(JSON.stringify(item));
  // 3. Set separate variable from item data
  price.value = item.Price;
  priceError.value = '';
  isEditing.value = item.EntityItemId;
  dialogVisible.value = true;
};

const deleteItem = (item) => {
  cafeItems.value = cafeItems.value.filter(i => i.id !== item.id);
};

// --- Form Submission Handler ---
const onFormSubmit = async (e) => {
  // 4. Manual Validation for Price
  if (price.value === null || price.value === 0) {
    priceError.value = 'Price is required and must be greater than 0.';
    return;
  } else {
    priceError.value = '';
  }

  if (!e.valid) return;

  isSubmitting.value = true;
  const data = { ...e.values, Price: price.value, Image: 'https://placehold.net/400x400.png' };

  // Handle default image
  if (!data.Image || data.Image.trim() === "") {
    data.Image = defaultImage;
  }

  try {
    const payload = {
      TenantId: tenantId,
      ...data,
    }
    console.log(payload);
    if (isEditing.value) {
      // Update existing data
      console.log(isEditing.value);
    } else {
      // Insert new data
      cafeItems.value.push({ ...data, id: Date.now() });
    }

    // 1. Close form after successful submission
    dialogVisible.value = false;
    formValues.value = getInitialValues();
  } catch (error) {
    console.error('Error saving item', error);
  } finally {
    isSubmitting.value = false;
  }
};
const listOrders = async () => {
  try {
    const orders = await $api.order.listOrders(tenantId, userId);
    cafeItems.value = orders.data
  } catch (error) {
    console.error('Error from list order', error);
  }
}
onMounted(async () => {
  await listOrders();
});
</script>

<template>
  <div class="card p-3 md:p-5">
    <div class="flex flex-column sm:flex-row sm:justify-content-between sm:align-items-center gap-3 mb-4">
      <h2 class="text-2xl font-bold m-0 text-center sm:text-left">Cafe Menu Management</h2>

      <div class="flex flex-column sm:flex-row gap-2 w-full sm:w-auto">
        <PriInputGroup class="w-full sm:w-auto">
          <PriInputGroupAddon>
            <i class="pi pi-search"></i>
          </PriInputGroupAddon>
          <PriInputText v-model="filters['global'].value" placeholder="Search menu..." class="w-full" />
        </PriInputGroup>

        <PriButton label="New Item" icon="pi pi-plus" severity="primary" @click="openNew" class="w-full sm:w-auto" />
      </div>
    </div>

    <PriDataTable :value="cafeItems" v-model:filters="filters" tableStyle="min-width: 60rem" paginator :rows="5"
      :rowsPerPageOptions="[5, 10, 20]" responsiveLayout="stack" breakpoint="960px" :metaKeySelection="true"
      dataKey="id" rowHover>
      <template #empty>
        <div class="text-center p-4">No items found.</div>
      </template>

      <PriColumn field="Image" header="Image" :style="{ width: '80px' }">
        <template #body="slotProps">
          <PriAvatar :image="slotProps.data.Image" :alt="slotProps.data.Name" shape="circle" />

          <!-- <img  class="w-4rem h-4rem border-round shadow-2 w-3rem shadow-2 object-cover" /> -->
        </template>
      </PriColumn>
      <PriColumn field="Name" header="Name" sortable></PriColumn>
      <PriColumn field="Price" header="Price" sortable>
        <template #body="slotProps">
          <span class="font-bold text-primary">
            {{ '$' + Number(slotProps.data.Price).toFixed(2) }}
          </span>
        </template>
      </PriColumn>
      <PriColumn field="Category" header="Category"></PriColumn>
      <PriColumn field="Sugar" header="Sugar">
        <template #body="slotProps">
          <div class="flex gap-1 flex-wrap">
            <PriTag :value="slotProps.data.Sugar" severity="" />
          </div>
        </template>
      </PriColumn>
      <PriColumn field="Mood" header="Mood">
        <template #body="slotProps">
          <div class="flex flex-wrap rounded-full text-center flex justify-center ring-3 ring-amber-100"
            :class="[CONFIG.moods.find(m => m.id === slotProps.data.Mood)?.color, CONFIG.moods.find(m => m.id === slotProps.data.Mood)?.ring]">
            {{CONFIG.moods.find(m => m.id === slotProps.data.Mood)?.label}}
          </div>
          <!-- <PriTag :value="CONFIG.moods.find(m => m.id === slotProps.data.Mood)?.label" severity="info" /> -->
        </template>
      </PriColumn>

      <PriColumn field="Size" header="Sizes">
        <template #body="slotProps">
          <!-- <PriTag :value="slotProps.data.Size" severity="info" /> -->
          <div class="flex flex-wrap rounded-full text-center flex justify-center"
            :class="sizeStyles[slotProps.data.Size]">
            {{ slotProps.data.Size }}
          </div>
        </template>
      </PriColumn>

      <PriColumn field="Status" header="Status">
        <template #body="slotProps">
          <div class="flex gap-1 rounded-full text-center flex justify-center"
            :class="[CONFIG.status.find(s => s.id === slotProps.data.Status)?.color, CONFIG.status.find(s => s.id === slotProps.data.Status)?.ring]">
            {{CONFIG.status.find(s => s.id === slotProps.data.Status)?.label}}
          </div>
          <!-- <PriTag :value="CONFIG.status.find(s => s.id === slotProps.data.Status)?.label" severity="info" /> -->
        </template>
      </PriColumn>
      <PriColumn header="Actions" :style="{ width: '120px' }">
        <template #body="slotProps">
          <div class="flex gap-2">
            <PriButton icon="pi pi-pencil" severity="info" rounded outlined @click="editItem(slotProps.data)" />
            <PriButton icon="pi pi-trash" severity="danger" rounded outlined @click="deleteItem(slotProps.data)" />
          </div>
        </template>
      </PriColumn>
    </PriDataTable>

    <PriDialog v-model:visible="dialogVisible" :header="isEditing ? 'Edit Item' : 'New Item'" modal
      :breakpoints="{ '960px': '75vw', '641px': '90vw' }" :style="{ width: '40vw' }">
      <Form v-slot="$form" :initialValues="formValues" :resolver="resolver" @submit="onFormSubmit"
        class="flex flex-column md:columns-2">

        <input type="hidden" name="EntityItemId" />
        <div class="field">
          <label for="Name" class="font-bold block">Name*</label>
          <PriInputText name="Name" placeholder="Product Name" fluid />
          <PriMessage v-if="$form.Name?.invalid" severity="error" size="small" variant="simple">{{
            $form.Name.error.message }}</PriMessage>
        </div>
        <div class="field">
          <label for="Price" class="font-bold block">Price*</label>

          <PriInputNumber :min="1" v-model="price" mode="currency" currency="USD" locale="en-US" fluid
            :useGrouping="false" placeholder="Enter price" />

          <small v-if="priceError" class="text-red-500 p-error">{{ priceError }}</small>
        </div>

        <div class="field">
          <label for="Category" class="font-bold block">Category*</label>
          <PriInputText name="Category" placeholder="e.g. Hot Coffee" fluid />
          <PriMessage v-if="$form.Category?.invalid" severity="error" size="small" variant="simple">{{
            $form.Category.error.message }}</PriMessage>
        </div>

        <div class="field">
          <label class="font-bold block">Sizes*</label>
          <div class="flex flex-wrap gap-3">
            <div v-for="size in sizeOptions" :key="size" class="flex align-items-center gap-2">
              <PriCheckbox name="Size" :inputId="size" :value="size" />
              <label :for="size">{{ size }}</label>
            </div>
          </div>
          <PriMessage v-if="$form.Size?.invalid" severity="error" size="small" variant="simple">{{
            $form.Size.error.message
            }}</PriMessage>
        </div>

        <div class="field">
          <label class="font-bold block mb-2">Sugar Level*</label>
          <div class="flex flex-wrap gap-3">
            <div v-for="sugar in sugarOptions" :key="sugar" class="flex align-items-center gap-2">
              <PriCheckbox name="Sugar" :inputId="sugar" :value="sugar" />
              <label :for="sugar">{{ sugar }}</label>
            </div>
          </div>
          <PriMessage v-if="$form.Sugar?.invalid" severity="error" size="small" variant="simple">{{
            $form.Sugar.error.message }}</PriMessage>
        </div>

        <div class="field">
          <label class="font-bold block mb-2">Mood*</label>
          <div class="flex flex-wrap gap-3">
            <div v-for="mood in moodOptions" :key="mood" class="flex align-items-center gap-2">
              <PriRadioButton name="Mood" :inputId="mood" :value="mood" />
              <label :for="mood">{{ mood }}</label>
            </div>
          </div>
          <PriMessage v-if="$form.Mood?.invalid" severity="error" size="small" variant="simple">{{
            $form.Mood.error.message
            }}</PriMessage>
        </div>

        <div class="flex justify-content-end gap-2 mt-3 pt-3 border-top-1 surface-border">
          <PriButton label="Cancel" severity="secondary" @click="dialogVisible = false" />
          <PriButton type="submit" :label="isEditing ? 'Save Changes' : 'Submit'" :loading="isSubmitting" />
        </div>
      </Form>
    </PriDialog>
  </div>
</template>

<style scoped>
/* Ensure inputs fill the grid columns correctly */
:deep(.p-inputtext),
:deep(.p-inputnumber-input) {
  width: 100%;
}
</style>