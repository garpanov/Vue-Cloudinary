<script setup>
import Card_item from './Card-item.vue';

defineProps({
    items: Array
})
const emit = defineEmits(['delete_product'])
</script>

<template>
    <div class="flex flex-col gap-4">
        <Card_item v-for="item in items"
                :item="item"
                :delete_product="() => emit('delete_product', item)"></Card_item>
    </div>
</template>