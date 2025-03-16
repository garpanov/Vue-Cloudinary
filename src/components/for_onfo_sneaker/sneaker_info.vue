<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

import cloud from '../cloudinary/cloud.vue';

const router = useRoute()
const date = ref(null)

const characteristic3 = ref([])
const main_image = ref()
const image_list = ref([])

const change_image = (image_for_change) => {
    main_image.value = image_for_change
}
///////////////preparing buy_list/////////////
const text_added_for_button = ref('ДОДАТИ В КОШИК')
const size_for_buy = ref()
const warning_for_size = ref()

const add_size_for_buy = (size) => {
    size_for_buy.value = size
}

const fetch_buy = async () => {
    const date = JSON.parse(localStorage.getItem('buy_list')) || []
}

const change_buy = async () => {
    try {
        let item = date.value.sneaker_info
        item.size = size_for_buy.value

        const list_buy = JSON.parse(localStorage.getItem('buy_list')) || [];

        const indexToRemove = list_buy.findIndex((product) => product.product_code === item.product_code);

        if (size_for_buy.value) {
            list_buy.push(item);
            text_added_for_button.value = 'ДОДАНО'
            warning_for_size.value = null
            size_for_buy.value = null
            setTimeout(() => {
                text_added_for_button.value = 'ДОДАТИ В КОШИК'; // Повертаємо початковий текст через 2 секунди
            }, 1000);
        }
        else {
            warning_for_size.value = 'Виберіть розмір'
            return null
        }

        localStorage.setItem('buy_list', JSON.stringify(list_buy));
        item.IsAdded = !item.IsAdded;

    } catch (error) {
        console.log("Ошибка при изменении избранного:", error);
    }
};


const fetch_item = async () => {
    try{
        const { data } = await axios.get(`/api/client/read_sneaker/${router.params.code}`)
        
        date.value = data

        characteristic3.value = date.value.sneaker_info.material_sneaker.split(',')
        main_image.value = date.value.sneaker_info.main_image
        image_list.value = date.value.images
        image_list.value.push(date.value.sneaker_info.main_image)
        



    }
    catch(error) {
        console.log(error)
    }
}

onMounted(async () => {
    await fetch_buy()
    await fetch_item()
})
</script>
<!-- w-12 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition -->
<template>
    <div v-if="date" class="flex flex-col md:flex-row md:justify-between items-center">
        <div class="flex items-center gap-10 lg:ml-1 xl:ml-40">
            <div class="hidden md:flex flex-col gap-4 mr-1 mt-1 sm:mr-1 md:mr-10 md:mt-10">
                <cloud @click="change_image(image)" v-for="image in image_list" :fullurl="image" class="w-14 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition gap-6"/>
            </div>
            <cloud :fullurl="main_image" class="w-96 md:w-200" />
        </div>
        <div class="flex flex-row md:hidden gap-3 mt-10 grid grid-cols-5">
                <cloud @click="change_image(image)" v-for="image in image_list" :fullurl="image" class="w-14 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition gap-6"/>
            </div>
        <div class="mr-1 w-83 lg:mr-4 xl:mr-20 md:w-96 mt-10">
            <div class="gap-4">
                <h1 class="text-2xl font-bold font-sans">{{ date.sneaker_info.name }}</h1>
                <div class="flex gap-2 opacity-70">
                    <p>Код:</p>
                    <h2 class="font-bold">{{ date.sneaker_info.product_code }}</h2>
                </div>

                <div class='flex justify-between mt-5'>
                    <h1 class="font-bold text-xl">{{ date.sneaker_info.price }},00 ₴</h1>
                    <div class="flex items-center gap-2 opacity-50">
                        <img src="/for_info/in_sale.png" class="w-4 h-4">
                        <p>В наявності</p>
                    </div>
                </div>

                <div class="mt-10">
                    <h1 class="font-bold">Розмір</h1>
                    <div class="flex gap-2 grid grid-cols-3 md:grid-cols-4">
                        <button v-for="size in date.size_info" @click="add_size_for_buy(size.size)" class="border-2 px-2 py-4 flex flex-col items-center justify-center 
                        transition hover:border hover:border-gray-900 focus:border-2 focus:border-black">
                            <h1 class="font-bold text-lg">{{ size.size }}</h1>
                            <p class="font-sans">({{ size.size_in_sm }} см.)</p>
                        </button>

                    </div>
                    <button @click="change_buy" class="border mt-5 text-white text-sm font-bold w-full py-3 bg-black
                                   transition hover:border-gray-900 hover:bg-zinc-900">{{ text_added_for_button
                        }}</button>
                    <p class="text-red-500 text-lg">{{ warning_for_size }}</p>
                </div>



            </div>

        </div>
    </div>

    <div v-if="date" class="flex flex-col justify-center items-center mt-22 md:mt-32">
        <div class="w-10/12 md:w-7/12 flex flex-col justify-center items-center">
            <h1 class="font-bold text-2xl">ПРО ТОВАР</h1>
            <p class="my-10 leading-loose">{{ date.sneaker_info.description }}</p>
        </div>
        <div class="w-9/12 md:w-7/12">
            <h2 class="text-left font-bold">Характеристики</h2>
            <ul class="list-disc mx-5 mt-3 md:mx-20 md:mt-7 gap-10">
                <li v-for="characteristic in characteristic3" class="break-words my-2">
                    {{ characteristic }}
                </li>
            </ul>
        </div>
    </div>

</template>