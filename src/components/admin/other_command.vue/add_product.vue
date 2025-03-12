<script setup>
import { ref } from 'vue';
import axios from 'axios';


const cloudName = import.meta.env.VITE_CLOUD_NAME; // Вкажи свій Cloud Name
const uploadPreset = "images"; // Вкажи свій Upload Preset
const type_list = [{ id: 1, label: 'шльопанці' },
{ id: 2, label: "в'єтнамки" },
{ id: 3, label: "крокси" },
{ id: 4, label: "босоніжки" },
{ id: 5, label: "капці" },
{ id: 6, label: "чешки" },
{ id: 7, label: "мокасини" },
{ id: 8, label: "кросівки" },
{ id: 9, label: "туфлі" },
{ id: 10, label: "чобітки" }]

const season_list = [{ id: 1, label: 'Зима' },
{ id: 2, label: 'Весна' },
{ id: 3, label: 'Літо' },
{ id: 4, label: 'Осінь' }]

const mainFileImg = ref(null);
const anotherFileImg = ref([])

// Зберігаємо файл при виборі
const handleFileChangeMain = (event) => {
    mainFileImg.value = event.target.files[0];
}

const handleFileChangeAnother = (event) => {
    anotherFileImg.value = event.target.files;
};
///////////////////////////////////////////
const props = defineProps(['examination'])

const size = ref()
const size_in_sm = ref()
const count_size = ref()

const add_size = () => {
    sizes_item.value.push({ 'size': size.value, "count": count_size.value, "size_in_sm": size_in_sm.value })
}

const delete_size = (item) => {
    const indexToRemove = sizes_item.value.findIndex((product) => product.size === item.size && product.count === item.count);

    if (indexToRemove !== -1) {
        sizes_item.value.splice(indexToRemove, 1);
    }
}


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
///////////////////////////////////////////
const not_all_not_null = ref()

const code_item = ref()
const name_item = ref()
const sizes_item = ref([])
const price_item = ref()
const description_item = ref()
const material_item = ref()
const category_item = ref(1)
const gender_item = ref('man')
const size_item_add = ref('older')
const season_item_add = ref(1)

const extractPublicId = (url) => {
    if (!url) return ''; // Проверяем, чтобы не было ошибок
    const parts = url.split('/upload/')[1];
    return parts ? parts.replace(/\.[^/.]+$/, '') : ''; // Убираем расширение
}

const add_item = async () => {
    if (
        !code_item.value ||
        !name_item.value ||
        !sizes_item.value.length ||  // Если sizes_item пуст
        !price_item.value ||
        !description_item.value ||
        !material_item.value ||
        !category_item.value ||
        !mainFileImg.value ||
        !anotherFileImg.value.length >= 1
    ) {
        not_all_not_null.value = 'yes'
        return null
    }
    else {
        not_all_not_null.value = 'no'
        const date = {
            product_code: code_item.value,
            name: name_item.value,
            price: price_item.value,
            description: description_item.value,
            material_sneaker: material_item.value,
            category_id: category_item.value,
            size_sneaker: sizes_item.value,
            id_season: season_item_add.value,
            another_images: []
        }
        if (gender_item.value) {
            date.gender = gender_item.value
        }
        if (size_item_add.value) {
            date.size = size_item_add.value
        }

        try {
            const formData = new FormData();
            formData.append("file", mainFileImg.value);
            formData.append("upload_preset", uploadPreset);
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData,
                { headers: { 'Content-Type': 'multipart/form-data' } })

            const url_img = response.data.secure_url;
            date.main_image = extractPublicId(url_img)
            console.log("main Фото завантажене:", url_img);

            for (let img of anotherFileImg.value) {
                const formData = new FormData();
                formData.append("file", img);
                formData.append("upload_preset", uploadPreset);

                try {
                    const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } })

                    const url_img = response.data.secure_url;
                    date.another_images.push(extractPublicId(url_img))
                    console.log("another Фото завантажене:", url_img);


                } catch (error) {
                    console.error("Помилка завантаження:", error);
                }
            }
            await axios.post('/api/admin/add_sneaker', date, {
                withCredentials: true, // Включает отправку cookie
            })

        }
        catch (error) {
            console.log(error)
            props.examination('no')
        }
    }

}

</script>

<template>
    <div class="flex flex-col justify-center items-center">
        <h1 class="text-3xl font-bold pb-5 mb-3 border-b border-black">Додати Товар</h1>
        <div class="flex flex-col gap-2">
            <input v-model="code_item" class="border border-gray-300 w-full outline-hidden rounded-md py-2 pl-4 pr-4 shadow-md
            focus:border-black transition" placeholder="Код товара">
            <input v-model="name_item" class="border border-gray-300 w-full outline-hidden rounded-md py-2 pl-4 pr-4 shadow-md
            focus:border-black transition" placeholder="Назва">
            <input v-model="price_item" type="number" class="border border-gray-300 w-3/5 outline-hidden rounded-md py-2 pl-4 pr-4 shadow-md
            focus:border-black transition" placeholder="Ціна">
            <h1 class="text-3xl font-bold pb-5 mb-3 border-b border-black">Розміри</h1>
            <div class="flex flex-col gap-2">
                <input type="number" v-model="size" class="border border-gray-300 w-full outline-hidden text-center rounded-md py-2 pl-4 pr-4 shadow-md
            focus:border-black transition" placeholder="Розмір">
                <input type="number" onkeydown="if(event.key === ',') event.preventDefault()" v-model="size_in_sm" class="border border-gray-300 w-full outline-hidden text-center rounded-md py-2 pl-4 pr-4 shadow-md
            focus:border-black transition" placeholder="В сантиметрах">
                <input type="number" v-model="count_size" class="border border-gray-300 w-full outline-hidden text-center rounded-md py-2 pl-4 pr-4 shadow-md
            focus:border-black transition" placeholder="Кількість">
                <button @click="add_size" class="bg-cyan-500 rounded py-2 mt-3 text-white text-lg font-sans
                            hover:bg-cyan-600 active:bg-cyan-700 transition disabled:bg-slate-400 cursor-pointer">
                    Додати
                </button>
                <div v-for="item in sizes_item" class="flex border shadow-xl p-4 justify-between items-center">
                    <div>
                        <div class="flex gap-2 text-center">
                            <h1 class="font-bold">Розмір:</h1>
                            <p class="font-lato">{{ item.size }}</p>
                        </div>
                        <div class="flex gap-2 text-center">
                            <h1 class="font-bold">Розмір (см):</h1>
                            <p class="font-lato">{{ item.size_in_sm }}</p>
                        </div>
                        <div class="flex gap-2 text-center">
                            <h1 class="font-bold">Кількість:</h1>
                            <p class="font-lato">{{ item.count }}</p>
                        </div>
                    </div>
                    <img src="../../../../public/хрестик_2.png" @click="delete_size(item)"
                        class="flex w-3 h-3 mr-3 cursor-pointer">
                </div>
            </div>
            <h1 class="text-3xl font-bold pb-5 mb-3 border-b border-black">Додаткова інформація</h1>

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
            <div>
                <div class="flex flex-col items-center text-center m-4">
                    <label for="main_image"
                        class="text-center py-1 w-full border border-black shadow-xl cursor-pointer ">Завантажити
                        головне фото</label>
                    <input class="hidden" type="file" @change="handleFileChangeMain" id="main_image">
                    <p v-if="mainFileImg" class="font-bold max-w-xs">Завантажено</p>
                    <p v-if="mainFileImg" class="font-lato max-w-xs">{{ mainFileImg.name }}</p>
                </div>
                <div class="flex flex-col items-center text-center m-4">
                    <label for="another_image"
                        class="text-center py-1 w-full border border-black shadow-xl cursor-pointer ">Завантажити інші
                        фото</label>
                    <input class="hidden" type="file" @change="handleFileChangeAnother" id="another_image" multiple>
                    <p v-if="anotherFileImg.length >= 1" class="font-bold max-w-xs">Завантажено</p>
                    <p v-for="img in anotherFileImg" v-if="anotherFileImg.length >= 1" class="font-lato max-w-xs">{{
                        img.name }}</p>
                </div>
            </div>

            <button @click="add_item" class="bg-green-500 rounded py-2 mt-3 text-white text-lg font-sans
                            hover:bg-green-600 active:bg-green-700 transition disabled:bg-slate-400 cursor-pointer">
                Зберегти
            </button>
            <p v-if="not_all_not_null == 'yes'" class="text-red-500 text-sm">Заповніть будь-ласка всі поля</p>
        </div>

    </div>
</template>