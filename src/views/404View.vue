<script setup>
import IconBack from '@/components/icons/IconBack.vue';
import { useRouter } from 'vue-router';

// Senior tip: Props make this component reusable for different "Not Found" scenarios
defineProps({
  title: {
    type: String,
    default: "Look like you're lost"
  },
  message: {
    type: String,
    default: "The page you are looking for is not available!"
  }
});

const router = useRouter();

const goHome = () => {
  // Using router.push avoids a full page refresh
  router.push('/home');
};
</script>

<template>
  <section class="py-10 font-mono flex items-center justify-center">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto text-center">
        
        <div class="error-bg-container relative">
          <div class="four_zero_four_bg h-[100px] md:h-[300px] bg-center bg-no-repeat"></div>
        </div>

        <div class="style-slide-up relative z-10">
          <h3 class="text-3xl md:text-4xl font-semibold mb-4 style-glass-next">
            {{ title }}
          </h3>
          <p class="text-gray-600 mb-4 text-lg style-glass-back">
            {{ message }}
          </p>
          
          <PriButton 
            @click="goHome"
            class="bg-indigo-600 font-serif text-white px-4 py-2 rounded-lg shadow-md shadow-indigo-900/20 hover:bg-indigo-700 hover:shadow-indigo-800/30"
          >
          <IconBack class="" />Go to Home
          </PriButton>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>

.four_zero_four_bg {
  /* https://cdn.dribbble.com/users/722246/screenshots/3066818/404-page.gif */
  background-image: url('/imgs/404.gif');
  background-size: contain;
}
</style>