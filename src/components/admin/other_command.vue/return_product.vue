<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps(['examination'])

const not_all_not_null = ref('')

const code_item = ref()
const size_item = ref()

const add_return_product = async () => {
    if (
        !code_item.value ||
        !size_item.value
    ) {
        not_all_not_null.value = 'Заповніть будь-ласка всі поля'
        return null
    }
    else {
        not_all_not_null.value = ''
        const date = {
            product_code: code_item.value,
            size: size_item.value
        }
        try {
            const response = await axios.post('/api/admin/return_sneaker', date, {
                withCredentials: true, // Включает отправку cookie
            })
            
            
        }
        catch (error) {
            if (error.response.status == 404) {
                not_all_not_null.value = "Продукту з таким кодом не існує"
            }
            else if(error.response.status == 401) {
                props.examination('no')
            }
        }

    }


}
</script>

<template>
    <div class="flex flex-col justify-center items-center">
        <h1 class="text-3xl font-bold pb-5 mb-3 border-b border-black">Повернення Товара</h1>
        <div class="flex flex-col gap-2">
            <input v-model="code_item" class="border border-gray-300 w-full outline-hidden rounded-md py-2 pl-4 pr-4 shadow-md
            focus:border-black transition" placeholder="Код товара">
            <input v-model="size_item" type="number" class="border border-gray-300 w-3/5 outline-hidden rounded-md py-2 pl-4 pr-4 shadow-md
            focus:border-black transition" placeholder="Розмір">

            <button @click="add_return_product" class="bg-emerald-500 rounded py-2 mt-3 text-white text-lg font-sans
                            hover:bg-emerald-600 active:bg-emerald-700 transition disabled:bg-slate-400 cursor-pointer">
                Повернути
            </button>
            <p v-if="not_all_not_null" class="text-red-500 text-sm">{{ not_all_not_null }}</p>
        </div>

    </div>
</template>