<script setup>
import { ref, inject, onMounted } from "vue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { FilterMatchMode } from '@primevue/core/api';
import { useAuthStore } from "@/stores/auth";

// --- Mock Data Service ---
const menuItems = ref([]);

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
const showDialogDelete = ref(false);
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
    { id: 'PENDING', label: 'Pending', color: 'bg-slate-900', ring: 'text-white ring-2 ring-amber-100' },
    { id: 'PREPARING', label: 'Preparing', color: 'bg-blue-500', ring: 'text-white ring-2 ring-blue-100' },
    { id: 'BREWING', label: 'Brewing', color: 'bg-orange-500', ring: 'text-white ring-2 ring-orange-100' },
    { id: 'COMPLETED', label: 'Completed', color: 'bg-emerald-500', ring: 'text-white ring-2 ring-emerald-100' },
    { id: 'CANCELLED', label: 'Cancelled', color: 'bg-red-500', ring: 'text-white ring-2 ring-red-100' },
  ]
};

// Define unique styles for each size when selected
const sizeStyles = {
  S: 'bg-amber-400 text-white ring-2 ring-amber-100',    // Small = Amber/Gold
  M: 'bg-orange-500 text-white ring-2 ring-orange-100', // Medium = Orange (The "Default" pop)
  L: 'bg-emerald-500 text-white ring-2 ring-emerald-100' // Large = Emerald/Green
};

const sizeOptions = ref(CONFIG.sizes);
const sugarOptions = ref(CONFIG.sugarLevels);
const moodOptions = ref(CONFIG.moods);
const selectedMood = ref(CONFIG.moods.map(m => m.id));
const selectedSugar = ref(CONFIG.sugarLevels);
// --- Form Validation Schema (Zod) ---
const resolver = zodResolver(
  z.object({
    id: z.number().optional(),
    Name: z.string().min(1, "Name is required."),
    Mood: z.array(z.string()).min(1, "Select a mood."),
    Sugar: z.array(z.string()).min(1, "Select sugar level."),
    // Image: z.string().optional(),
    // Size: z.string().min(1, "Select at least one size."),
    // Category: z.string().min(1, "Category is required."),
    // Description: z.string().optional(),
  })
);

// --- Form Initial Values ---
const getInitialValues = () => ({
  Name: "",
  Price: null,
  Image: "",
  // Set the default selections here instead of using a separate ref v-model
  Sugar: CONFIG.sugarLevels,
  Mood: CONFIG.moods.map(m => m.id),
  EntityItemId: "",
  // Category: "",
  // Description: "",
  // Popular: false,
  // Rating: 0,
  // Size: "",
});

const formValues = ref(getInitialValues());

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

const deleteItem = async (menuId) => {
  try {
    isSubmitting.value = true;
    await $api.order.deleteMenu(tenantId, userId, menuId);
    await listMenuItem();
  } catch (error) {
    console.error('Error Delete Menu', error);
  } finally {
    showDialogDelete.value = false;
    isEditing.value = false;
  }
};

// --- Form Submission Handler ---
const onFormSubmit = async (e) => {
  // console.log('Form Submit', e.values);
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
      // TenantId: tenantId,
      ...data,
    }
    // console.log('pa', payload);
    if (isEditing.value) {
      // Update existing data
      await $api.order.updateMenu(payload, tenantId, userId, isEditing.value);
    } else {
      // Insert new data
      await $api.order.createMenu(payload, tenantId, userId);
    }
  } catch (error) {
    console.error('Error saving item', error);
  } finally {
    // 1. Close form after successful submission
    dialogVisible.value = false;
    formValues.value = getInitialValues();
    isSubmitting.value = false;
    await listMenuItem();
  }
};
const listMenuItem = async () => {
  try {
    const response = await $api.order.listMenu(tenantId, userId);
    menuItems.value = response.data;
  } catch (error) {
    console.error('Error from list order', error);
  }
}

onMounted(async () => {
  await listMenuItem();
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

    <PriDataTable :value="menuItems" v-model:filters="filters" tableStyle="min-width: 60rem" paginator :rows="5"
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
      <!-- <PriColumn field="Category" header="Category"></PriColumn> -->
      <PriColumn field="Sugar" header="Sugar">
        <template #body="slotProps">
          <div class="flex gap-1 flex-wrap">
            <PriTag v-for="sugar in slotProps.data.Sugar" :key="sugar" :value="sugar" severity="" />
          </div>
        </template>
      </PriColumn>
      <PriColumn field="Mood" header="Mood">
        <template #body="slotProps">
          <div class="flex w-full flex-wrap text-center flex justify-center">
            <h5 class="rounded-full px-3 ring-2 ring-amber-100 mx-1"
              v-for="mood in slotProps.data.Mood" :key="mood.id"
              :class="[CONFIG.moods.find(m => m.id === mood)?.color, CONFIG.moods.find(m => m.id === mood)?.ring]">
              {{CONFIG.moods.find(m => m.id === mood)?.label}}
            </h5>
            <!-- <PriTag :value="CONFIG.moods.find(m => m.id === slotProps.data.Mood)?.label" severity="info" /> -->
        </div>
        </template>
      </PriColumn>

      <!-- <PriColumn field="Size" header="Sizes">
        <template #body="slotProps">
          <PriTag :value="slotProps.data.Size" severity="info" />
          <div class="flex flex-wrap rounded-full text-center flex justify-center"
            :class="sizeStyles[slotProps.data.Size]">
            {{ slotProps.data.Size }}
          </div>
        </template>
      </PriColumn> -->

      <!-- <PriColumn field="Status" header="Status">
        <template #body="slotProps">
          <div class="flex gap-1 rounded-full text-center flex justify-center"
            :class="[CONFIG.status.find(s => s.id === slotProps.data.Status)?.color, CONFIG.status.find(s => s.id === slotProps.data.Status)?.ring]">
            {{CONFIG.status.find(s => s.id === slotProps.data.Status)?.label}}
          </div>
          <PriTag :value="CONFIG.status.find(s => s.id === slotProps.data.Status)?.label" severity="info" />
        </template>
      </PriColumn> -->
      <PriColumn header="Actions" :style="{ width: '120px' }">
        <template #body="slotProps">
          <div class="flex gap-2">
            <PriButton icon="pi pi-pencil" severity="info" rounded outlined @click="editItem(slotProps.data)" />
            <PriButton icon="pi pi-trash" severity="danger" rounded outlined @click="showDialogDelete = true" />

            <PriDialog v-model:visible="showDialogDelete" modal :draggable="false" dismissableMask
                class="mx-3 sm:mx-0 w-full max-w-lg">
                <template #header>
                  <div class="flex items-center gap-3">
                    <i class="pi pi-exclamation-triangle text-red-600 dark:text-red-400 text-xl"></i>
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 tracking-tight">
                      Confirm Deletion
                    </h2>
                  </div>
                </template>

                <div class="p-2">
                  <p class="text-surface-600 dark:text-surface-300">
                    Are you sure you want to delete the menu
                    <strong class="font-bold text-indigo-500 dark:text-surface-0">{{ slotProps.data.Name }}</strong>? <br>
                    This action
                    <strong class="text-red-600 dark:text-red-400">cannot be undone</strong>.
                  </p>
                </div>

                <template #footer>
                  <div class="flex justify-end">
                    <PriButton label="Delete" severity="danger"
                      size="small"
                      :icon="isSubmitting ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                      :disabled="isSubmitting"
                      @click="deleteItem(slotProps.data.EntityItemId)" />
                  </div>
                </template>
              </PriDialog>

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

        <!-- <div class="field">
          <label for="Category" class="font-bold block">Category*</label>
          <PriInputText name="Category" placeholder="e.g. Hot Coffee" fluid />
          <PriMessage v-if="$form.Category?.invalid" severity="error" size="small" variant="simple">{{
            $form.Category.error.message }}</PriMessage>
        </div> -->

        <!-- <div class="field">
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
        </div> -->

        <div class="field">
          <label class="font-bold block mb-2">Sugar Level*</label>
          <div class="flex flex-wrap gap-3">
            <div v-for="sugar in sugarOptions" :key="sugar" class="flex align-items-center gap-2">
              <PriCheckbox name="Sugar" :inputId="sugar" :value="sugar" 
              :disabled="$form.Sugar?.value?.length === 1 && $form.Sugar?.value?.includes(sugar)"
              />
              <label :for="sugar">{{ sugar }}</label>
            </div>
          </div>
          <!-- <PriMessage v-if="$form.Sugar?.invalid" severity="error" size="small" variant="simple">{{
            $form.Sugar.error.message }}</PriMessage> -->
        </div>

        <div class="field">
          <label class="font-bold block mb-2">Mood*</label>
          <div class="flex flex-wrap gap-3">
            <div v-for="mood in moodOptions" :key="mood.id" class="flex align-items-center gap-2">
              <PriCheckbox  name="Mood" :inputId="mood.id" :value="mood.id"
                :disabled="$form.Mood?.value?.length === 1 && $form.Mood?.value?.includes(mood.id)"
               />
              <label :for="mood.id">{{ mood.label }}</label>
            </div>
          </div>
          <!-- <PriMessage v-if="$form.Mood?.invalid" severity="error" size="small" variant="simple">{{
            $form.Mood.error.message
          }}</PriMessage> -->
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