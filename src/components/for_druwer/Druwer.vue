<script setup>
import { inject, watch, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import CardItem_list from '../Card-item_list.vue';

const { close_druwer } = inject('CommandForDruwer')

const date = ref([])
const read_product = () => {
    date.value = JSON.parse(localStorage.getItem('buy_list')) || []
}

const full_price_buy = ref(0)
const change_full_price = () => {
    full_price_buy.value = 0
    for (let item of date.value) {
        full_price_buy.value = full_price_buy.value + item.price
    }
}

const delete_with_buy_list = async (item) => {
    const buy_list = JSON.parse(localStorage.getItem('buy_list'))
    const indexToRemove = buy_list.findIndex((product) => (product.product_code === item.product_code && product.size === item.size));

    buy_list.splice(indexToRemove, 1)

    date.value = buy_list

    localStorage.setItem('buy_list', JSON.stringify(buy_list));
}

onMounted(() => {
    read_product()
})

watch(date, change_full_price)
</script>

<template>
    <div class="fixed top-0 left-0 h-full w-full bg-black z-20 opacity-70"></div>
    <div class="bg-white w-11/12 md:w-7/12 xl:w-2/5 2xl:w-1/4 h-full fixed right-0 top-0 z-20 p-4 md:p-8 overflow-y-scroll">
        <div class="flex items-center gap-5 mb-8">
            <img @click="close_druwer" src="/стрелка-корзина.png"
                class="w-8 rotate-180 cursor-pointer opacity-40 hover:opacity-100 transition hover:-translate-x-1">
            <h2 class="text-2xl font-bold">Кошик</h2>
        </div>
        <div>
            <CardItem_list @delete_product="delete_with_buy_list" :items="date"></CardItem_list>
        </div>
        <div v-if="full_price_buy" class="mt-3">
            <div class="flex flex-col gap-5">
                <div class="flex gap-2">
                    <span>Вартість:</span>
                    <div class="flex-1 border-b border-slate-200"></div>
                    <b>{{ full_price_buy }} ₴</b>
                </div>

                <RouterLink to="/forms">
                    <button @click="close_druwer" class="w-full bg-sky-500 rounded py-3 text-white text-lg font-sans
                            hover:bg-sky-600 active:bg-sky-700 transition disabled:bg-slate-400 cursor-pointer">
                        Оформити замовлення
                    </button>
                </RouterLink>
            </div>
        </div>
        <div v-if="!full_price_buy" class="flex flex-col gap-2 items-center justify-center">
            <img class="w-2/4 h-2/4" src="/public/пуста корзина.png">
            <h1 class="text-xl font-bold">Кошик порожній</h1>
            <p>Але ти можеш це виправити :)</p>
        </div>
    </div>
</template>