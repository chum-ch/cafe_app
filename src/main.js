import './assets/main.css'
import './assets/main.css'
import '/node_modules/primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import axios from "axios";
import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import API from "./api/api";

// PrimeVue Components
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import Button from "primevue/button"
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Password from 'primevue/password';
import InputNumber from 'primevue/inputnumber';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Menu from 'primevue/menu';
import Drawer from 'primevue/drawer';
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import OverlayBadge from 'primevue/overlaybadge';
import RadioButton from 'primevue/radiobutton';
import RadioButtonGroup from 'primevue/radiobuttongroup';
import InputOtp from 'primevue/inputotp';
import Checkbox from 'primevue/checkbox';
import CheckboxGroup from 'primevue/checkboxgroup';
import Tooltip from 'primevue/tooltip';
import DatePicker from 'primevue/datepicker';
import Skeleton from 'primevue/skeleton';
import Textarea from "primevue/textarea";
import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';

import OtpForm from './components/forms/OtpForm.vue';
import SetAndResetPwd from './components/forms/SetAndResetPwdForm.vue';
import IconCafe from './components/icons/IconCafe.vue';
// Custome component
// Create Vue App
const app = createApp(App)

app.component('PriButton', Button);
app.component('PriToast', Toast);
app.component('PriInputText', InputText);
app.component('PriMessage', Message);
app.component('PriPassword', Password);
app.component('PriInputNumber', InputNumber);
app.component('PriCard', Card);
app.component('PriTag', Tag);
app.component('PriMenu', Menu);
app.component('PriDrawer', Drawer);
app.component('PriAvatar', Avatar);
app.component('PriBadge', Badge);
app.component('PriOverlayBadge', OverlayBadge);
app.component('PriRadioButton', RadioButton);
app.component('PriRadioButtonGroup', RadioButtonGroup);
app.component('PriInputOtp', InputOtp);
app.component('PriCheckbox', Checkbox);
app.component('PriCheckboxGroup', CheckboxGroup);
app.component('PriDatePicker', DatePicker);
app.component('PriSkeleton', Skeleton);
app.component('PriTextarea', Textarea);
app.component('PriMultiSelect', MultiSelect);
app.component('PriSelect', Select);
app.component('PriDivider', Divider)
app.component('PriDialog', Dialog)


app.component('OtpForm', OtpForm)
app.component('SetAndResetPwd', SetAndResetPwd)
app.component('IconCafe', IconCafe)

app.provide("$api", API(axios));
// app.use(PrimeVue, {
//     theme: {
//         preset: Aura
//     }
// });

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}'
    },
    colorScheme: {
      light: {
        formField: {
          hoverBorderColor: '{primary.color}'
        }
      },
      dark: {
        formField: {
          hoverBorderColor: '{primary.color}'
        }
      }
    }
  }
});

app.use(PrimeVue, {
  theme: {
    preset: MyPreset
  }
});

app.use(createPinia())
app.use(router)
app.use(ToastService);
app.directive('tooltip', Tooltip);

app.mount('#app')
