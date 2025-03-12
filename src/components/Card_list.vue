<script setup>
import Card from './Card.vue';

defineProps({
    items: Array
})

const emit = defineEmits(['changes-favorites'])

</script>

<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card 
        v-for="item in items"
        :key="item.id"
        :image-url="item.main_image" 
        :itemss="item"
        :product_code="item.product_code"
        :description="item.description"
        :productName="item.name" 
        :price="item.price" 
        :IsFavorite='item.IsFavorite'
        :ChangeFavorites="() => emit('changes-favorites', item)"
        :ForFavorite="item.ForFavorite"></Card>


    </div>
</template>