<script setup>
import cloud from './cloudinary/cloud.vue';
import { inject } from 'vue';
import { useRoute } from 'vue-router';

const { close_druwer } = inject('CommandForDruwer')

const props = defineProps({
    item: Object,
    delete_product: Function
})
const router = useRoute()
</script>

<template>
    <div class="flex items-center border shadow-md border-slate-200 p-4 rounded-xl gap-7">
        <RouterLink :to="{path: '/info_sneaker/' + props.item.product_code}">
            <div @click="close_druwer" class="w-24 mx-1 md:mx-4 cursor-pointer">
                <cloud alt="sneakers" :fullurl="props.item.main_image" />
            </div>
        </RouterLink>
        <div class="flex flex-col h-full w-3/4 md:w-full ">
            <p class="font-bold">{{ props.item.name }}</p>
            <div class="flex items-center">
                <p>Код:</p>
                <p class="font-bold ml-2">{{ props.item.product_code }}</p>
            </div>
            <div class="flex items-center">
                <p>Розмір:</p>
                <p class="font-bold ml-2">{{ props.item.size }}</p>
            </div>
            <div class="flex justify-between mt-2">
                <b>{{ props.item.price }} грн.</b>
                <img @click="delete_product" class="w-10 h-10 opacity-80 cursor-pointer hover:opacity-100 transition"
                    src="/btn-remove.svg">
            </div>
        </div>
    </div>
</template>