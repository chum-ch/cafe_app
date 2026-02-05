<script setup>
import { ref } from 'vue';
import CardOrder from '@/components/CardOrder.vue';

const coffees = ref([
  {
    id: 1,
    name: 'Caramel Frappuccino',
    price: 3.95,
    category: 'Blended',
    description: 'Velvety caramel syrup blended with premium coffee and chilled milk.',
    image: 'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: true
  },
  {
    id: 2,
    name: 'Midnight Mocha',
    price: 4.50,
    category: 'Hot Coffee',
    description: 'Rich dark chocolate ganache swirled into a double shot of intense espresso.',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: false
  },
  {
    id: 3,
    name: 'Vanilla Oat Latte',
    price: 5.25,
    category: 'Plant Based',
    description: 'Creamy oat milk and Madagascar vanilla bean extract for a smooth treat.',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: true
  },
  {
    id: 1,
    name: 'Caramel Frappuccino',
    price: 3.95,
    category: 'Blended',
    description: 'Velvety caramel syrup blended with premium coffee and chilled milk.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=400&auto=format&fit=crop',
    popular: true
  },
  {
    id: 9,
    name: 'Espresso Con Panna',
    price: 3.25,
    category: 'Classic',
    description: 'A heavy-hitting double shot of espresso topped with a mountain of cold whipped cream.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400&auto=format&fit=crop',
    popular: false
  },
  {
    id: 10,
    name: 'Toffee Nut Iced Latte',
    price: 5.85,
    category: 'Seasonal',
    description: 'Buttery toffee and toasted nuts blended with chilled espresso and whole milk.',
    image: 'https://images.unsplash.com/photo-1553909489-ec2175ef3f52?q=80&w=400&auto=format&fit=crop',
    popular: true
  },

  {
    id: 7,
    name: 'Turkish Hazelnut',
    price: 3.50,
    category: 'Traditional',
    description: 'Finely ground beans simmered with cardamom and toasted hazelnut.',
    image: 'https://images.pexels.com/photos/849646/pexels-photo-849646.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: false
  },
  {
    id: 8,
    name: 'Rose Water Macchiato',
    price: 4.95,
    category: 'Floral',
    description: 'Espresso marked with foam and a delicate spritz of rose water.',
    image: 'https://images.pexels.com/photos/1193335/pexels-photo-1193335.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: false
  },
  {
    id: 10,
    name: 'Toffee Nut Iced Latte',
    price: 5.85,
    category: 'Seasonal',
    description: 'Buttery toffee and toasted nuts blended with chilled espresso.',
    image: 'https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: true
  }
]);

const addToCart = (item) => console.log('item', item);

</script>

<template>
  <div class="style-glass-back mt-4">
      <div class="flex flex-wrap justify-center gap-[2rem]">
        <CardOrder v-for="item in coffees" :key="item.id" :item="item" @add-to-cart="addToCart" />
      </div>
      
  </div>
</template>
<style scoped></style>