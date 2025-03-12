<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import CardItem_list from '../Card-item_list.vue';
import { full_validate } from './validate.js'


const end_order = ref(false)

const close_window_ending = () => {
    end_order.value = false
    document.body.classList.remove('overflow-hidden')
    router.push('/')
}

const delivery = ref('NovaPoshta')
const change_delivery = (item) => {
    delivery.value = item
}

const pay = ref('cash')
const change_pay = (item) => {
    pay.value = item
}

const date = ref([])
const full_price = ref(0)
const read_product = () => {
    date.value = JSON.parse(localStorage.getItem('buy_list')) || []
    if (date.value.length == 0) {
        router.push('/')
    }
}

const change_full_price = () => {
    full_price.value = 0
    for (let item of date.value) {
        full_price.value = full_price.value + item.price
    }
}

const delete_with_buy_list = async (item) => {
    const buy_list = JSON.parse(localStorage.getItem('buy_list'))
    const indexToRemove = buy_list.findIndex((product) => (product.product_code === item.product_code && product.size === item.size));

    buy_list.splice(indexToRemove, 1)

    date.value = buy_list
    if (date.value.length == 0) {
        router.push('/')
    }

    localStorage.setItem('buy_list', JSON.stringify(buy_list));
}
/////////////////////////////////////////////
const phone_number = ref()
const city = ref()
const info_city = ref({ city: '', region: '' })
const city_offers = ref([])
const adres = ref()
const adres_offers = ref([])
const index = ref()
const name = ref()
const surname = ref()
const middle_name = ref()

const surname_errors = ref()
const name_errors = ref()
const middle_name_errors = ref()
const phone_number_errors = ref()
const city_errors = ref()
const index_errors = ref()
const adres_errors = ref()



const router = useRouter()

const accept_order = async () => {
    try {
        const params = {
            sneaker_id: [],
            size: [],
            phone_number: phone_number.value,
            adress: `${city.value}, ${delivery.value}, ${adres.value}`,
            full_name: `${surname.value} ${name.value} ${middle_name.value}`,
            payment: pay.value
        }
        for (let item of date.value) {
            params.sneaker_id.push(item.id)
            params.size.push(item.size)
        }

        const rez = full_validate(surname.value, name.value, middle_name.value, phone_number.value, city.value, adres.value, index.value)
        surname_errors.value = rez.surname_error
        name_errors.value = rez.name_error
        middle_name_errors.value = rez.middle_name_error
        phone_number_errors.value = rez.number_phone_error
        city_errors.value = rez.city_errors
        adres_errors.value = rez.adres_errors
        index_errors.value = rez.index_errors

        if (delivery.value == 'NovaPoshta') {
            if (surname_errors.value || name_errors.value || middle_name_errors.value || phone_number_errors.value || city_errors.value || adres_errors.value) {
                return null
            }
        }
        else {
            if (surname_errors.value || name_errors.value || middle_name_errors.value || phone_number_errors.value || city_errors.value || index_errors.value) {
                return null
            }
        }
        const response = await axios.post('/api/client/buy_sneakers', params);
        localStorage.removeItem('buy_list')
        end_order.value = true
        document.body.classList.add('overflow-hidden')


    }
    catch (error) {
        console.log(error)
    }



}

///////////////////////////////////////////////
const read_city = async () => {
    if (city.value.length >= 3) {
        const { data } = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
            apiKey: 'f135ce6f8036dc840d73608de4fff672',
            modelName: 'AddressGeneral',
            calledMethod: 'getSettlements',
            methodProperties: {
                Warehouse: '1',
                FindByString: `${city.value}`
            }
        })
        if (data.data.length == 0) {
            const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
                apiKey: 'f135ce6f8036dc840d73608de4fff672',
                modelName: 'AddressGeneral',
                calledMethod: 'getSettlements',
                methodProperties: {
                    Warehouse: '0',
                    FindByString: `${city.value}`
                }
            })
            city_offers.value = response.data.data
            return
        }
        city_offers.value = data.data
    }
    else {
        city_offers.value = []
    }
}

const query_to_novaposhta = async () => {
    if (city.value) {
        const { data } = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
            apiKey: 'f135ce6f8036dc840d73608de4fff672',
            modelName: 'AddressGeneral',
            calledMethod: 'getWarehouses',
            methodProperties: {
                FindByString: adres.value,
                CityName: info_city.value.city,
                Page: '1',
                Limit: '20',
                Language: 'UA',
            }
        })
        adres_offers.value = data.data
    }

}

const install_city = (item) => {
    city.value = `${item.Description}, ${item.AreaDescription} обл.`
    info_city.value.city = item.Description
    info_city.value.region = `${item.Description} обл.`
}
const install_adress = (item) => {
    adres.value = `${item.Description}, ${item.AreaDescription}`
}


onMounted(() => {
    read_product()
})
watch(date, change_full_price)
watch(city, read_city)
watch(adres, query_to_novaposhta)
</script>

<template>
    <div v-if="end_order" class="fixed top-0 left-0 h-full w-full bg-black z-20 opacity-30"></div>
    <div class="flex justify-center">
        <h1 class="text-2xl md:text-3xl font-bold border-b pb-3 md:pb-0 border-b-gray-400 md:border-none">Оформлення
            замовлення</h1>
    </div>
    <div class="mt-8 md:mt-0 md:p-8">
        <div class="flex flex-col md:flex-row md:justify-between">
            <div class="static w-full md:w-2/4">
                <h1 class="shadow-xl md:shadow-none py-2 md:py-0 text-3xl text-center md:text-left font-lato font-bold">
                    Доставка</h1>
                <div class="p-1 mt-10 md:mt-2 md:p-8 flex gap-4 items-center">
                    <p class="text-lg font-bold">Ваш населений пункт:</p>
                    <div class="flex flex-col w-3/5 md:w-2/5">
                        <input v-model="city" maxlength="100"
                            class="w-full pl-5 pr-1 py-2 border border-gray-300 hover:border-gray-500 transition text-sm"
                            placeholder="Місто">
                        <p class="text-red-500 text-sm" v-if="city_errors">{{ city_errors }}</p>
                    </div>
                </div>
                <div v-if="city_offers.length > 0"
                    class="absolute ml-28 md:ml-58 mt-0 w-6/12 md:w-2/12 bg-white border border-gray-400">
                    <ul class="overflow-auto max-h-36 items-center">
                        <li @click="install_city(item)" v-for="item in city_offers"
                            class="py-2 px-3 cursor-pointer hover:bg-gray-100 transition">
                            <h1>{{ item.Description }},</h1>
                            <p>({{ item.AreaDescription }} обл.)</p>
                        </li>
                    </ul>
                </div>
                <div class="flex flex-col gap-5 mt-5 md:mt-0 md:pl-8">
                    <div @click="change_delivery('NovaPoshta')"
                        class="flex items-center border cursor-pointer gap-2 hover:border-gray-300 p-4 md:p-8 hover:shadow-lg">
                        <input :checked="delivery == 'NovaPoshta'" id="NovaPoshta" name="доставка" type="radio"
                            class="w-7 h-7 cursor-pointer">
                        <label for="NovaPoshta" class="font-lato text-xl">Нова Пошта</label>
                        <p class="right-0">Орієнтовна доставка: 2-4 днів</p>
                    </div>
                    <div @click="change_delivery('Ukrposhta')"
                        class="flex items-center border cursor-pointer gap-2 hover:border-gray-300 p-4 md:p-8 hover:shadow-lg">
                        <input :checked="delivery == 'Ukrposhta'" id="Ukrposhta" name="доставка" type="radio"
                            class="w-7 h-7 cursor-pointer">
                        <label for="Ukrposhta" class="font-lato text-xl">Укрпошта</label>
                        <p class="right-0">Орієнтовна доставка: 3-6 днів</p>
                    </div>
                    <div v-if="delivery == 'NovaPoshta'" class="flex gap-4 items-center w-full">
                        <p class="text-lg font-bold">Адреса пункту отримання:</p>
                        <div class="flex flex-col w-4/5 md:w-3/5 justify-center">
                            <input v-model="adres" maxlength="150"
                                class="w-full md:w-3/5 pl-5 pr-1 py-2 border border-gray-300 hover:border-gray-500 transition text-sm"
                                placeholder="Адреса">
                            <p class="text-red-500 text-sm" v-if="adres_errors">{{ adres_errors }}</p>
                        </div>
                    </div>
                    <div v-if="delivery == 'Ukrposhta'" class="flex gap-4 items-center">
                        <p class="text-lg font-bold">Введіть ваш поштовий індекс:</p>
                        <div class="flex flex-col w-full md:w-3/5 justify-center">
                            <input v-model="index" :maxlength="15"
                                class="w-full md:w-3/5 pl-5 pr-1 py-2 border border-gray-300 hover:border-gray-500 transition text-sm"
                                placeholder="Індекс">
                            <p class="text-red-500 text-sm" v-if="index_errors">{{ index_errors }}</p>
                        </div>
                    </div>
                    <div v-if="adres_offers.length > 0 && adres"
                        class="absolute ml-32 md:ml-62 mt-70 w-6/12 md:w-2/12 bg-white border border-gray-400">
                        <ul class="overflow-auto max-h-36 items-center">
                            <li @click="install_adress(item)" v-for="item in adres_offers"
                                class="py-2 px-3 cursor-pointer hover:bg-gray-100 transition">
                                <h1>{{ item.Description }},</h1>
                                <p>{{ item.AreaDescription }}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="static mt-5 md:mt-0 w-full md:w-2/5 justify-center items-center">
                <CardItem_list @delete_product="delete_with_buy_list" :items="date"></CardItem_list>
            </div>
        </div>

        <h1
            class="text-3xl font-lato text-center md:text-left font-bold shadow-xl md:shadow-none py-2 my-5 md:my-0 md:py-8">
            Контактна інформація</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mx-8 md:mx-12 justify-center">
            <div>
                <input v-model="name" class="pl-5 pr-1 py-3 w-full outline-hidden border border-gray-500 text-xl"
                    placeholder="Ім'я">
                <p class="text-red-500 text-sm" v-if="name_errors">{{ name_errors }}</p>
            </div>
            <div>
                <input v-model="middle_name" class="pl-5 pr-1 w-full py-3 outline-hidden border border-gray-500 text-xl"
                    placeholder="По батькові">
                <p class="text-red-500 text-sm" v-if="middle_name_errors">{{ middle_name_errors }}</p>
            </div>
            <div>
                <input v-model="surname" class="pl-5 pr-1 w-full py-3 outline-hidden border border-gray-500 text-xl"
                    placeholder="Прізвище">
                <p class="text-red-500 text-sm" v-if="surname_errors">{{ surname_errors }}</p>
            </div>
            <div>
                <input v-model="phone_number"
                    class="pl-5 pr-1 w-full py-3 outline-hidden border border-gray-500 text-xl" placeholder="Телефон">
                <p class="text-red-500 text-sm" v-if="phone_number_errors">{{ phone_number_errors }}</p>
            </div>

        </div>
        <div v-if="end_order" class="absolute flex left-0 w-full items-center justify-center z-20">
            <div
                class="flex flex-col w-9/10 md:w-3/12 h-2/12 bg-white border-2 border-black shadow-2xl py-5 px-3 gap-6 items-center rounded-b-lg text-center">
                <h1 class="text-2xl font-lato font-bold">{{ name }}, дякуюємо за замовлення!</h1>
                <div>
                    <p class="font-lato">Ми зв’яжемося з вами найближчим часом для його підтвердження.</p>
                    <p class="font-lato">Очікуйте дзвінок або повідомлення на вказаний номер.</p>
                </div>
                <button @click="close_window_ending"
                    class="cursor-pointer font-bold active:bg-neutral-200 shadow-md active:shadow-xl transition py-3 px-7 border-2 border-black rounded-xl">Продовжити</button>
            </div>
        </div>

        <h1 class="shadow-xl md:shadow-none text-center md:text-left text-3xl py-2 md:py-0 font-lato font-bold mt-14">
            Спосіб оплати</h1>
        <div class="flex flex-col gap-5 p-2 md:p-8 pl-2 md:pl-16 mt-3">
            <div @click="change_pay('card')"
                class="flex border w-full shadow-lg md:shadow-none md:w-2/5 cursor-pointer gap-2 hover:border-gray-300 p-4 items-center hover:shadow-lg">
                <input :checked="pay == 'card'" id="ForCard" name="Оплата" type="radio" class="w-4 h-4 cursor-pointer">
                <label for="ForCard" class="font-bold font-lato"> Банківська карта</label>
            </div>
            <div @click="change_pay('cash')"
                class="flex border w-full shadow-lg md:shadow-none md:w-2/5 cursor-pointer gap-2 hover:border-gray-300 p-4 items-center hover:shadow-lg">
                <input :checked="pay == 'cash'" id="OnPlace" name="Оплата" type="radio" class="w-4 h-4 cursor-pointer">
                <label for="OnPlace" class="font-bold font-lato"> Оплата готівкою на місці</label>
            </div>
        </div>
        <div class="flex p-5 md:p-10 gap-4 md:gap-2 items-center">
            <h1 class="text-2xl font-bold font-sans">До сплати:</h1>
            <span class="text-3xl font-lato font-bold">{{ full_price }} ₴</span>
        </div>
        <button @click="accept_order" class="ml-8 md:ml-16 bg-sky-500 rounded mt-5 md:mt-0 py-5 px-3 text-white text-xl font-bold font-lato
                            hover:bg-sky-600 active:bg-sky-700 transition disabled:bg-slate-400 cursor-pointer">
            Оформити замовлення
        </button>
    </div>
</template>