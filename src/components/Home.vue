<script setup>
import axios from 'axios';
import { onMounted, ref, reactive, watch } from 'vue';
import qs from 'qs';


import Card_list from './Card_list.vue';

const date_full = ref([])

////////////////////for phone///////////////////////
const filters = ref(true)

//////////////////////////pagination///////////////////
const offset_info = ref({
    right_offset: true,
    left_offset: false
})

const offset_main = ref(1)

const change_offset = (number) => {
    offset_main.value = number
    if (number <= 3) {
        offset_info.value.left_offset = false
        offset_info.value.right_offset = true
        if (offset_info.value.all_offset > 4) {
            offset_info.value.middle_offset = [1, 2, 3, 4]
        }
        else {
            offset_info.value.middle_offset = Array.from({ length: offset_info.value.all_offset }, (_, i) => i + 1);
            offset_info.value.right_offset = false
        }
        return
    }
    else if ((number + 1) >= offset_info.value.all_offset) {
        const number = offset_info.value.all_offset
        offset_info.value.middle_offset = [number - 3, number - 2, number - 1, number]
        offset_info.value.right_offset = false
        offset_info.value.left_offset = true
        return
    }
    offset_info.value.middle_offset = [number - 1, number, number + 1]
    offset_info.value.left_offset = true
    offset_info.value.right_offset = true
}
////////////////////////////////////////////////////////////////////////////////filters///////////////////
//////////for sort_left///////////////////////////
const items = ref([{ id: 1, label: "шльопанці", checked: false },
{ id: 2, label: "в'єтнамки", checked: false },
{ id: 3, label: "крокси", checked: false },
{ id: 4, label: "босоніжки", checked: false },
{ id: 5, label: "капці", checked: false },
{ id: 6, label: "чешки", checked: false },
{ id: 7, label: "мокасини", checked: false },
{ id: 8, label: "кросівки", checked: false },
{ id: 9, label: "туфлі", checked: false },
{ id: 10, label: "чобітки", checked: false }])

const items_for_gender = ref([{ id: 1, label: 'Чоловік', for_api:'man', checked: false },
{ id: 2, label: 'Жінка', for_api:'woman', checked: false }
])

const items_for_size = ref([{ id: 1, label: 'Дитяче (20 - 37)', for_api:'children', checked: false },
{ id: 2, label: 'Доросле (36 - 46)', for_api:'older', checked: false }
])

const items_for_season = ref([{ id: 1, label: 'Зима', checked: false },
{ id: 2, label: 'Весна', checked: false },
{ id: 3, label: 'Літо', checked: false },
{ id: 4, label: 'Осінь', checked: false }
])

const open_type = ref(false)
const change_type = () => {
    open_type.value = !open_type.value
}

const gender = ref(false)
const change_gender = () => {
    gender.value = !gender.value
}

const price_type = ref(false)
const change_price_type = () => {
    price_type.value = !price_type.value
}

const size = ref(false)
const change_size = () => {
    size.value = !size.value
}

const season = ref(false)
const change_season = () => {
    season.value = !season.value
}


/////////////////// sort //////////////////////////////////////////////////////////////////
const sort_price_search = reactive({
    sort_price: '',
    sort_min_price: 0,
    sort_max_price: 0,
    sort_searche: '',
    sort_type: [],
    sort_gender: [],
    sort_size_api: [],
    sort_season: []
})

const change_sort_price = (meaning) => {
    sort_price_search.sort_price = meaning.target.value
}

const addOrDelete_type_in_query = (item) => {
    item.checked = !item.checked
    if (item.checked) {
        sort_price_search.sort_type.push(item.label)
    }
    else {
        const index = sort_price_search.sort_type.indexOf(item.label);

        if (index !== -1) {
            sort_price_search.sort_type.splice(index, 1); // Видаляємо 1 елемент за вказаним індексом
        }
    }
    console.log(sort_price_search.sort_type)
}

const addOrDelete_gender_in_query = (item) => {
    item.checked = !item.checked
    if (item.checked) {
        sort_price_search.sort_gender.push(item.for_api)
    }
    else {
        const index = sort_price_search.sort_gender.indexOf(item.for_api);

        if (index !== -1) {
            sort_price_search.sort_gender.splice(index, 1); // Видаляємо 1 елемент за вказаним індексом
        }
    }
}

const addOrDelete_size_in_query = (item) => {
    item.checked = !item.checked
    if (item.checked) {
        sort_price_search.sort_size_api.push(item.for_api)
    }
    else {
        const index = sort_price_search.sort_size_api.indexOf(item.for_api);

        if (index !== -1) {
            sort_price_search.sort_size_api.splice(index, 1); // Видаляємо 1 елемент за вказаним індексом
        }
    }
}

const addOrDelete_season_in_query = (item) => {
    item.checked = !item.checked
    if (item.checked) {
        sort_price_search.sort_season.push(item.id)
    }
    else {
        const index = sort_price_search.sort_season.indexOf(item.id);

        if (index !== -1) {
            sort_price_search.sort_season.splice(index, 1); // Видаляємо 1 елемент за вказаним індексом
        }
    }
}

const addorDelete_maxMinPrice_in_query = (item_name, item_value) => {
    if (item_value.target.value) {
        sort_price_search[item_name] = item_value.target.value
    }
    else {
        sort_price_search[item_name] = 0
    }

}

const change_sort_search = (meaning) => {
    sort_price_search.sort_searche = meaning.target.value
}

/////////////// Add or delete favorite ///////////

const fetchFavorites = () => {
    try {
        const favorites = JSON.parse(localStorage.getItem('favorite_list'))

        if (!favorites) {
            return null
        }

        date_full.value = date_full.value.map((item) => {
            const favorite = favorites.find((favorite) => favorite.id === item.id)

            if (!favorite) {
                return item
            }

            return {
                ...item,
                IsFavorite: true,
                favoriteId: favorite.id
            }
        })

    } catch (error) {
        console.log(error)
    }
}

const change_favorite = async (item) => {
    try {
        const favorites = JSON.parse(localStorage.getItem('favorite_list')) || [];

        const indexToRemove = favorites.findIndex((favorite) => favorite.id === item.id);

        if (indexToRemove !== -1) {
            favorites.splice(indexToRemove, 1);
        } else {

            favorites.push(item);
        }

        localStorage.setItem('favorite_list', JSON.stringify(favorites));
        item.IsFavorite = !item.IsFavorite;

    } catch (error) {
        console.log("Ошибка при изменении избранного:", error);
    }
};


////////////////// start data ////////////////////////////
const fetchItems = async () => {
    if (window.innerWidth < 768) {
        filters.value = false
    }
    try {
        const params = {
            sort: sort_price_search.sort_price,
            sort_type: sort_price_search.sort_type,
            sort_gender: sort_price_search.sort_gender,
            sort_min_price: sort_price_search.sort_min_price,
            sort_max_price: sort_price_search.sort_max_price,
            size: sort_price_search.sort_size_api,
            season: sort_price_search.sort_season
        }


        if (sort_price_search.sort_searche) {
            params.in_name = sort_price_search.sort_searche

        }

        const { data } = await axios.get(`/api/client/date/${offset_main.value}`, {
            params,
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
        },

        )
        date_full.value = data.date
        offset_info.value.all_offset = data.about_offest
        if (offset_info.value.all_offset > 4) {
            offset_info.value.right_offset = true
            change_offset(offset_main.value)

        }
        else {
            offset_info.value.middle_offset = Array.from({ length: offset_info.value.all_offset }, (_, i) => i + 1);
            offset_info.value.right_offset = false
        }

        date_full.value = date_full.value.map(item => {
            return {
                ...item,
                IsFavorite: false,
                IsAdded: false
            }
        })

    } catch (error) {
        console.log(error)
    }
}
//////////////////////////////////////////////////

onMounted(async () => {
    await fetchItems(),
        await fetchFavorites()
})

watch(sort_price_search, () => { fetchItems(); offset_main.value = 1 }, { deep: true })
watch(offset_main, fetchItems)

</script>

<template>
    <div class="flex flex-col md:flex-row md:justify-between items-center">
        <h2 class="text-3xl font-bold mb-8">Усі кросівки</h2>
        <div class="md:hidden">
            <img class="absolute ml-3 mt-3" src="/search.svg">
            <input @input="change_sort_search" class="border outline-hidden rounded-md py-2 pl-10 pr-4
                                focus:border-gray-400 transition" placeholder="Пошук">
        </div>
        <div class="flex gap-3 mt-4 md:mt-0 md:gap-4 md:gap-1">
            <div @click="filters = !filters"
                :class="filters ? 'boder border-black shadow-xl' : 'border border-gray-200'" class="flex lg:hidden border border-gray-200 gap-2 cursor-pointer items-center p-2
                    hover:bg-gray-100 hover:border-gray-400 transition">
                <img src="/фільтр.png" class="w-5 h-4">
                <p>Фільтри</p>
            </div>
            <select @change="change_sort_price"
                class="outline-hidden border rounded-md py-2 px-2 focus:border-gray-400 transition">
                <option value="">За назвою</option>
                <option value="price">Від дешевих</option>
                <option value="!price">Від дорогих</option>
            </select>
            <div class="hidden lg:flex">
                <img class="absolute ml-3 mt-3" src="/search.svg">
                <input @input="change_sort_search" class="border outline-hidden rounded-md py-2 pl-10 pr-4
                                focus:border-gray-400 transition" placeholder="Пошук">
            </div>
        </div>

    </div>

    <div>
        <div class="flex flex-col md:justify-between md:flex-row">
            <div v-if="filters" class="w-11/12 md:w-96 pt-10 mr-10">
                <div>
                    <h1 class="text-2xl font-bold">ФІЛЬТРИ</h1>
                </div>

                <div class="border border-y-gray-400 border-x-transparent py-2 mt-5">
                    <div @click="change_type" class="flex justify-between items-center cursor-pointer">
                        <p class="text-lg font-bold">ТИП ТОВАРУ</p>
                        <img :src="open_type ? '/minus.png' : '/plus.png'" class="w-3">
                    </div>
                    <ol v-if="open_type" class="flex flex-col gap-2 p-3">
                        <li v-for="item in items" class="flex">
                            <div>
                                <label class="flex gap-4 items-center cursor-pointer">
                                    <input :checked="item.checked" @click="addOrDelete_type_in_query(item)"
                                        type="checkbox"
                                        class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-sm shadow-sm hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800">
                                    {{ item.label }}
                                </label>
                            </div>
                        </li>
                    </ol>
                </div>

                <div class="border border-b-gray-400 border-x-transparent py-2">
                    <div @click="change_season" class="flex justify-between items-center cursor-pointer">
                        <p class="text-lg font-bold">ПОРА РОКУ</p>
                        <img :src="season ? '/minus.png' : '/plus.png'" class="w-3">
                    </div>
                    <ol v-if="season" class="flex flex-col gap-2 p-3">
                        <li class="flex">
                            <div>
                                <label v-for="item in items_for_season" class="flex gap-4 items-center cursor-pointer">
                                    <input :checked="item.checked" @click="addOrDelete_season_in_query(item)"
                                        type="checkbox"
                                        class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-sm shadow-sm hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800">
                                    {{ item.label }}
                                </label>
                            </div>
                        </li>
                    </ol>
                </div>

                <div class="border border-b-gray-400 border-x-transparent py-2">
                    <div @click="change_size" class="flex justify-between items-center cursor-pointer">
                        <p class="text-lg font-bold">РОЗМІР</p>
                        <img :src="size ? '/minus.png' : '/plus.png'" class="w-3">
                    </div>
                    <ol v-if="size" class="flex flex-col gap-2 p-3">
                        <li class="flex">
                            <div>
                                <label v-for="item in items_for_size" class="flex gap-4 items-center cursor-pointer">
                                    <input :checked="item.checked" @click="addOrDelete_size_in_query(item)"
                                        type="checkbox"
                                        class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-sm shadow-sm hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800">
                                    {{ item.label }}
                                </label>
                            </div>
                        </li>
                    </ol>
                </div>

                <div class="border border-b-gray-400 border-x-transparent py-2">
                    <div @click="change_gender" class="flex justify-between items-center cursor-pointer">
                        <p class="text-lg font-bold">СТАТЬ</p>
                        <img :src="gender ? '/minus.png' : '/plus.png'" class="w-3">
                    </div>
                    <ol v-if="gender" class="flex flex-col gap-2 p-3">
                        <li class="flex">
                            <div>
                                <label v-for="item in items_for_gender" class="flex gap-4 items-center cursor-pointer">
                                    <input :checked="item.checked" @click="addOrDelete_gender_in_query(item)"
                                        type="checkbox"
                                        class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-sm shadow-sm hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800">
                                    {{ item.label }}
                                </label>
                            </div>
                        </li>
                    </ol>
                </div>

                <div class="border border-b-gray-400 border-x-transparent py-2">
                    <div @click="change_price_type" class="flex justify-between items-center cursor-pointer">
                        <p class="text-lg font-bold">ЦІНА</p>
                        <img :src="price_type ? '/minus.png' : '/plus.png'" class="w-3">
                    </div>
                    <div v-if="price_type">
                        <div class="flex justify-between p-3 select-none">
                            <input @blur="(event) => addorDelete_maxMinPrice_in_query('sort_min_price', event)"
                                @keyup.enter="(event) => addorDelete_maxMinPrice_in_query('sort_min_price', event)"
                                maxlength="5"
                                class="w-24 px-5 py-2 border border-gray-300 text-center hover:border-gray-500 transition text-sm"
                                placeholder="ВІД">
                            <span>_</span>
                            <input @blur="(event) => addorDelete_maxMinPrice_in_query('sort_max_price', event)"
                                @keyup.enter="(event) => addorDelete_maxMinPrice_in_query('sort_max_price', event)"
                                maxlength="5"
                                class="w-24 px-5 py-2 border border-gray-300 text-center hover:border-gray-500 transition text-sm"
                                placeholder="ДО">
                        </div>
                    </div>
                </div>
            </div>
            <Card_list :items="date_full" @changes-favorites="change_favorite">
            </Card_list>
        </div>
        <div v-if="offset_info.all_offset" class="flex justify-center py-5 gap-2">
            <p @click="change_offset(1)" v-if="offset_info.left_offset"
                class="py-1 px-3 cursor-pointer border transition hover:border-gray-400">1</p>
            <p v-if="offset_info.left_offset" class="pt-1">...</p>
            <p @click="change_offset(number)" v-for="number in offset_info.middle_offset"
                :class="{ 'border-black': offset_main == number, 'border': true }"
                class="py-1 px-3 cursor-pointer border transition hover:border-gray-400">{{ number }}</p>
            <p v-if="offset_info.right_offset" class="pt-1">...</p>
            <p @click="change_offset(offset_info.all_offset)" v-if="offset_info.right_offset"
                class="py-1 px-3 cursor-pointer border transition hover:border-gray-400">{{
                    offset_info.all_offset }}</p>
        </div>
    </div>


</template>