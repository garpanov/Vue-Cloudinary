<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import cloud from '@/components/cloudinary/cloud.vue';

const props = defineProps(['examination'])

const date = ref()

const accept_order = async (code) => {
    const date = {
        order_code: code,
        status: 'sent'
    }

    try {
        const result = await axios.patch('/api/admin/change_status_order', date, {
            withCredentials: true
        })

        fetch_product('examination')
    }
    catch (error) {
        console.log(error)
        props.examination('no')
    }
}

const cancel_order = async (code) => {
    const date = {
        order_code: code,
        status: 'examination'
    }

    try {
        const result = await axios.delete('/api/admin/delete_order', {
            data: date,
            withCredentials: true
        })

        fetch_product('examination')
    }
    catch (error) {
        console.log(error)
        props.examination('no')
    }
}

const fetch_product = async (status_orders) => {
    try {
        const { data } = await axios.get('/api/admin/all_order', {
            params: {status: status_orders},
            withCredentials: true
        })
        date.value = data

        date.value = date.value.map(item => {
            return {
                ...item,
                show: false
            }
        })
    }
    catch (error) {
        console.log(error)
        props.examination('no')
    }

}

onMounted(() => fetch_product('examination'));

</script>

<template>
    <div class="flex flex-col gap-4 w-full">
        <div class="flex flex-col py-3 px-6 gap-4 shadow-md">
            <h1 v-if="date == 0" class="text-2xl font-bold text-center">Активних замовлень немає</h1>
            <div v-for="item in date" class="w-full">
                <div @click="item.show = !item.show"
                    class='flex py-3 px-6 justify-between border cursor-pointer shadow-md'>
                    <h1 class="text-2xl font-bold">Замовлення {{ item.order_code }}</h1>
                    <div class="flex right-0 gap-2">
                        <button @click.stop="accept_order(item.order_code)" class="bg-green-500 rounded p-2 text-white text-lg font-sans
                            hover:bg-green-600 active:bg-green-700 transition disabled:bg-slate-400 cursor-pointer">
                            Підтвердити
                        </button>
                        <button @click.stop="cancel_order(item.order_code)" class="bg-red-500 rounded p-2 text-white text-lg font-sans
                            hover:bg-red-600 active:bg-red-700 transition disabled:bg-slate-400 cursor-pointer">
                            Скасувати
                        </button>
                    </div>
                </div>
                <div v-if="item.show"
                    class="flex items-center justify-center border border-gray-200 shadow-xl p-5 w-full"
                    v-for="product in item.date">
                    <cloud :fullurl="product.image_url" alt="Product Image" class="w-24" />
                    <div class="flex grid grid-cols-3 gap-4 justify-center content-center items-center">
                        <div class="flex flex-col px-5 gap-3">
                            <h1 class="text-xl font-bold">{{ product.name_product }}</h1>
                            <div class="flex gap-2">
                                <p>Код: </p>
                                <h1 class="font-bold">{{ product.code_product }}</h1>

                            </div>
                        </div>
                        <div class="pr-5">
                            <div class="flex gap-2">
                                <p class="text-lg">Розмір:</p>
                                <h1 class="text-xl font-bold">{{ product.size }}</h1>
                            </div>
                            <div class="flex gap-2 text-center">
                                <p class="text-lg">Ціна:</p>
                                <h1 class="text-xl font-bold">{{ product.price }} грн.</h1>
                            </div>
                        </div>
                        <div>
                            <div class="flex gap-2">
                                <p class="text-lg">Телефон:</p>
                                <h1 class="text-xl font-bold">{{ product.phone_number }}</h1>
                            </div>
                            <div class="flex gap-2 text-center ">
                                <p class="text-lg">Адреса:</p>
                                <h1 class="text-lg font-bold">{{ product.adress }} </h1>
                            </div>

                        </div>
                        <div class="flex gap-2 text-center px-5">
                            <p class="text-lg">Замовник:</p>
                            <h1 class="text-lg font-bold">{{ product.full_name }} </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>