<script setup>
import { ref } from 'vue'
import axios from 'axios';

const label1 = ref()
const label2 = ref()

const props = defineProps({
    change_auth: Function
})

const give_jwt = async () => {
    try {
        const formData = new URLSearchParams();
        formData.append("username", `${label1.value}`);
        formData.append("password", `${label2.value}`);
        await axios.post("/api/token", formData, { withCredentials: true })
        props.change_auth('yes')
    }
    catch (error) {
        console.log(error)
    }
}
</script>

<template>
    <div class="flex items-center justify-center">
        <div class="flex flex-col gap-4 w-1/4 h-4/4 rounded-md items-center p-8 border border-black shadow-2xl">
            <h1 class="text-2xl font-bold">Авторізація</h1>
            <input v-model="label1" class="border border-gray-300 w-3/5 outline-hidden rounded-md py-2 pl-4 pr-4 shadow-md
            focus:border-black transition" placeholder="Логін">
            <input v-model="label2" type="password" class="border border-gray-300 w-3/5 outline-hidden rounded-md py-2 pl-4 pr-4 shadow-md
            focus:border-black transition" placeholder="Пароль">
            <button @click="give_jwt"
                class="bg-linear-to-r from-sky-500 to-indigo-500 rounded py-2 px-4 text-white text-lg font-sans
                            hover:from-sky-600 hover:to-indigo-600 active:from-sky-700 active:to-indigo-700 transition cursor-pointer">
                Авторизуватися</button>
        </div>
    </div>
</template>