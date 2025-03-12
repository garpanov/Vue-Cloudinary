<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

const city = ref()
const info_city = ref({ city: '', region: '' })
const city_offers = ref([])

const adres = ref()
const adres_offers = ref([])
const index = ref()

const delivery = ref('NovaPoshta')
const change_delivery = (item) => {
    delivery.value = item
}

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

watch(city, read_city)
watch(adres, query_to_novaposhta)
</script>

<template>
    <div class="static w-full md:w-2/4">
        <h1 class="shadow-xl md:shadow-none py-2 md:py-0 text-3xl text-center md:text-left font-lato font-bold">
            Доставка</h1>
        <div class="p-1 mt-10 md:mt-2 md:p-8 flex gap-4 items-center">
            <p class="text-lg font-bold">Ваш населений пункт:</p>
            <input v-model="city" maxlength="100"
                class="w-4/5 md:w-2/5 pl-5 pr-1 py-2 border border-gray-300 hover:border-gray-500 transition text-sm"
                placeholder="Місто">
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
            <div v-if="delivery == 'NovaPoshta'" class="flex gap-4">
                <p class="text-lg font-bold">Адреса пункту отримання:</p>
                <input v-model="adres" maxlength="100"
                    class="w-4/5 md:w-2/5 pl-5 pr-1 py-2 border border-gray-300 hover:border-gray-500 transition text-sm"
                    placeholder="Адреса">
            </div>
            <div v-if="delivery == 'Ukrposhta'" class="flex gap-4">
                <p class="text-lg font-bold">Введіть ваш поштовий індекс:</p>
                <input v-model="index" :maxlength="15"
                    class="w-4/5 md:w-2/5 pl-5 pr-1 py-2 border border-gray-300 hover:border-gray-500 transition text-sm"
                    placeholder="Індекс">
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
</template>