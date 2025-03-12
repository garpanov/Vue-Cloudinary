<script setup>
import { ref, provide } from 'vue';
import { RouterView } from 'vue-router'


import Headers from './components/Header.vue';
import Druwer from './components/for_druwer/Druwer.vue';
import Footer from './components/Footer.vue';
import info_top from './components/info_top.vue';
import Filters from './components/filters.vue';




///////////////// Druwer ///////////////////////

const druwer_status = ref(false)
const filter_status = ref(true)

const open_druwer = () => {
    druwer_status.value = true
    document.body.classList.add('overflow-hidden')
}

const close_druwer = () => {
    druwer_status.value = false
    document.body.classList.remove('overflow-hidden')
}

provide('CommandForDruwer', { open_druwer, close_druwer })

////////////////////////////////////////////////////

</script>


<template>
    <div class="min-h-screen flex flex-col">
        <info_top></info_top>
        <Druwer v-if="druwer_status"></Druwer>

        <div class="bg-white w-11/12 md:w-11/12 h-full m-auto rounded-xl shadow-xl mt-10">
            <Headers @druwer-open="open_druwer"></Headers>

            <div class="p-10 ">
                <RouterView />
            </div>
        </div>
    </div>
    <Footer></Footer>
</template>
