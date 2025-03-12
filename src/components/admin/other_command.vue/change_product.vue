<script setup>
import { ref } from 'vue';
import axios from 'axios';
const props = defineProps(['examination'])

const change_category = (meaning) => {
    category_item.value = meaning.target.value
}

const change_gender = (meaning) => {
    gender_item.value = meaning.target.value
}

const change_size_add = (meaning) => {
    size_item_add.value = meaning.target.value
}

const change_season_add = (meaning) => {
    season_item_add.value = meaning.target.value
}

const type_list = [{id:1, label:'шльопанці'},
                    {id:2, label:"в'єтнамки"},
                    {id:3, label:"крокси"},
                    {id:4, label:"босоніжки"},
                    {id:5, label:"капці"},
                    {id:6, label:"чешки"},
                    {id:7, label:"мокасини"},
                    {id:8, label:"кросівки"},
                    {id:9, label:"туфлі"},
                    {id:10, label:"чобітки"}]

const season_list = [{id:1, label:'Зима'},
                    {id:2, label:'Весна'},
                    {id:3, label:'Літо'},
                    {id:4, label:'Осінь'}]

const code_item = ref()
const name_item = ref()
const price_item = ref()
const description_item = ref()
const material_item = ref()
const category_item = ref(1)
const gender_item = ref('man')
const size_item_add = ref('older')
const season_item_add = ref(1)

const change_item = async () => {
    const date = {
        product_code: code_item.value,
        name: name_item.value,
        price: price_item.value,
        gender: gender_item.value,
        description: description_item.value,
        material_sneaker: material_item.value,
        category_id: category_item.value,
        size: size_item_add.value,
        id_season: season_item_add.value
    }
    try {
        await axios.patch('/api/admin/change_sneaker', date, {
            withCredentials: true, // Включает отправку cookie
        })
    }
    catch (error) {
        console.log(error)
        props.examination('no')
    }


}

</script>

<template>
    <div class="flex flex-col justify-center items-center">
        <h1 class="text-3xl font-bold pb-5 mb-3 border-b border-black">Змінити Товар</h1>
        <div class="flex flex-col gap-2">
            <input v-model="code_item" class="border border-gray-300 w-full outline-hidden rounded-md py-2 pl-4 pr-4 shadow-md
            focus:border-black transition" placeholder="Код товара">
            <h1 class="text-3xl font-bold pb-5 mb-3 mt-10 border-b border-black">Нова інформація</h1>
            <input v-model="name_item" class="border border-gray-300 w-full outline-hidden rounded-md py-2 pl-4 pr-4 shadow-md
            focus:border-black transition" placeholder="Назва">
            <input v-model="price_item" type="number" class="border border-gray-300 w-3/5 outline-hidden rounded-md py-2 pl-4 pr-4 shadow-md
            focus:border-black transition" placeholder="Ціна">

            <label for="charack" class="text-sm font-medium">
                Характеристика (матеріал, через кому)</label>
            <textarea v-model="material_item" id="charack" rows="4" maxlength="1500"
                class="w-full p-2.5 text-sm rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введіть характеристику"></textarea>

            <label for="message" class="text-sm font-medium">
                Опис</label>
            <textarea v-model="description_item" id="message" rows="4" maxlength="1500"
                class="w-full p-2.5 w-full text-sm rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введіть опис"></textarea>

            <select @change="change_category"
                class="outline-hidden border rounded-md py-2 px-3 focus:border-gray-400 transition">
                <option :value="product_type.id" v-for="product_type in type_list">{{ product_type.label }}</option>
            </select>
            <select @change="change_gender"
                class="outline-hidden border rounded-md py-2 px-3 focus:border-gray-400 transition">
                <option value="man">Чоловік</option>
                <option value="woman">Жінка</option>
                <option value="">Для всіх</option>
            </select>
            <select @change="change_size_add"
                class="outline-hidden border rounded-md py-2 px-3 focus:border-gray-400 transition">
                <option value="children">Дитяче (20 - 37)</option>
                <option value="older">Доросле (36 - 46)</option>
                <option value="">Для всіх</option>
            </select>
            <select @change="change_season_add"
                class="outline-hidden border rounded-md py-2 px-3 focus:border-gray-400 transition">
                <option :value="product_season.id" v-for="product_season in season_list">{{ product_season.label }}
                </option>
            </select>

            <button @click="change_item" class="bg-yellow-500 rounded py-2 mt-3 text-white text-lg font-sans
                            hover:bg-yellow-600 active:bg-yellow-700 transition disabled:bg-slate-400 cursor-pointer">
                Змінити
            </button>
        </div>

    </div>
</template>