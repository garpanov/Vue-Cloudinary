<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import auth from './auth.vue';
import add_product from './other_command.vue/add_product.vue';
import delete_product from './other_command.vue/delete_product.vue';
import change_product from './other_command.vue/change_product.vue';
import orders_activ from './other_command.vue/orders_activ.vue';
import send_orders from './other_command.vue/send_orders.vue';
import return_product from './other_command.vue/return_product.vue';

const auth_result = ref('no')
const change_result = (item) => {
    auth_result.value = item
}

const status_for_open = ref('order')
const change_status_open = (key) => {
    status_for_open.value = key
}

const jwt_check = async () => {
    try {
        await axios.get('/api/info_for_me', {
            withCredentials: true, // Включает отправку cookie
        })
        change_result('yes')
    }
    catch (error) {
        console.log(error)
        change_result('no')
    }
}

onMounted(jwt_check)
</script>

<template>
    <auth :change_auth="change_result" v-if="auth_result != 'yes'"></auth>
    <div v-if="auth_result == 'yes'" class="flex justify-between">
        <div class="flex flex-col gap-4">
            <div @click="change_status_open('order')" class="p-2 bg-lime-500 text-center shadow cursor-pointer rounded-md border border-black 
                        hover:shadow-xl transition">
                <h1 class="text-xl font-bold">Активні закази</h1>
            </div>
            <div @click="change_status_open('add')" class="p-2 text-center shadow cursor-pointer border rounded-md border-gray-300 
                        hover:shadow-md transition focus:border-green-500">
                <h1 class="text-xl font-bold">Додати товар</h1>
            </div>
            <div @click="change_status_open('change')" class="p-2 text-center shadow cursor-pointer border rounded-md border-gray-300 
                        hover:shadow-md transition">
                <h1 class="text-xl font-bold">Редагувати товар</h1>
            </div>
            <div @click="change_status_open('delete')" class="p-2 text-center shadow cursor-pointer border rounded-md border-gray-300 
                        hover:shadow-md transition">
                <h1 class="text-xl font-bold">Видалити товар</h1>
            </div>
            <div @click="change_status_open('send')" class="p-2 text-center shadow cursor-pointer border rounded-md border-gray-300 
                        hover:shadow-md transition">
                <h1 class="text-xl font-bold">Відправлені закази</h1>
            </div>
            <div @click="change_status_open('return')" class="p-2 text-center shadow cursor-pointer border rounded-md border-gray-300 
                        hover:shadow-md transition">
                <h1 class="text-xl font-bold">Повернення замовлення</h1>
            </div>
        </div>
        <div class="flex p-5 w-full justify-center items-center">
            <add_product :examination="change_result" v-if="status_for_open == 'add'"></add_product>
            <delete_product :examination="change_result" v-if="status_for_open == 'delete'"></delete_product>
            <change_product :examination="change_result" v-if="status_for_open == 'change'"></change_product>
            <orders_activ :examination="change_result" v-if="status_for_open == 'order'"></orders_activ>
            <send_orders :examination="change_result" v-if="status_for_open == 'send'"></send_orders>
            <return_product :examination="change_result" v-if="status_for_open == 'return'"></return_product>
        </div>
    </div>
</template>