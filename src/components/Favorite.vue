<script setup>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';

import Card_list from './Card_list.vue';

const date_full = ref([])
const null_in_date = ref(false)

const fetchFavorites = async () => {
    try {
        const data = JSON.parse(localStorage.getItem('favorite_list'))
        date_full.value = data

        date_full.value = date_full.value.map(item => {
            return {
                ...item,
                IsFavorite: false,
                IsAdded: false,
                ForFavorite: true
            }
        })


    } catch (error) {
        console.log(error)
    }
}


const click_for_added_buy = () => {
    console.log('заглушка')
}

const delete_favorite = async (item) => {
    const favorites = JSON.parse(localStorage.getItem('favorite_list'))
    const indexToRemove = favorites.findIndex((favorite) => favorite.id === item.id);

    if (indexToRemove !== -1) {
        favorites.splice(indexToRemove, 1);
    } else {

        favorites.push(item);
    }

    localStorage.setItem('favorite_list', JSON.stringify(favorites));

    date_full.value = favorites

    date_full.value = date_full.value.map(item => {
        return {
            ...item,
            IsFavorite: false,
            IsAdded: false,
            ForFavorite: true
        }
    })
}

// const checking_for_emptiness = () => {
//     if (date)
// }


const checking_for_emptiness = () => {
    if (!date_full.value[0]) {
        null_in_date.value = true
    }
    else {
        null_in_date.value = false
    }
}
onMounted(async () => {
    await fetchFavorites()
})

watch(date_full, checking_for_emptiness)

</script>


<template>
    <h2 class="text-3xl font-bold mb-8">Ваші бажання</h2>

    <Card_list :items="date_full" @add-to-buy="click_for_added_buy" @changes-favorites="delete_favorite"></Card_list>

    <div v-if="null_in_date" class="flex flex-col items-center justify-center text-center p-8">
        <h1 class="text-xl font-bold">Ваш список бажань порожній</h1>
        <p>Додайте щось, щоб зробити його особливим!</p>
    </div>
</template>