<script setup>
import cloud from './cloudinary/cloud.vue';
const props = defineProps({
    imageUrl: String,
    productName: String,
    product_code: String,
    itemss: Object,
    price: Number,
    description: String,
    IsFavorite: Boolean,
    IsAdded: Boolean,
    ChangeFavorites: Function,
    ForFavorite: Boolean
});

</script>

<template>

    <div class="relative bg-white border-slate-100 rounded-3xl p-8 cursor-pointer 
                        hover:-translate-y-2 hover:shadow-xl transition">
        <img v-if="!ForFavorite" @click="ChangeFavorites" :src="!IsFavorite ? '/unliked_2.png' : '/like_2.png'"
            alt="like" class="w-4 absolute top-8 left-8">
        <img v-if="ForFavorite" @click="ChangeFavorites" src="/хрестик.png" class="absolute top-8 left-8">
        <RouterLink :to="{path: '/info_sneaker/' + props.product_code}">
            <div>
                <cloud :fullurl="props.imageUrl"/>
                <p class="mt-2">{{ productName }}</p>

                <div class="flex justify-between mt-5">
                    <div class="flex flex-col">
                        <span class="text-slate-400">Ціна:</span>
                        <b>{{ price }} грн</b>
                    </div>

                    <!-- <div>
                    <img v-if="!ForFavorite" @click="ClickAdded" :src="!IsAdded ? '/plus.svg' : '/btn-checked.svg'"
                        alt="plus">
                </div> -->
                </div>
            </div>
        </RouterLink>
    </div>

</template>