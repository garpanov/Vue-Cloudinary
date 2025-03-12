<script setup>
const emit_druw = defineEmits(['druwerOpen'])
</script>


<template>
    <header class="flex flex-col items-center md:flex-row md:justify-between gap-4 border-b border-slate-950 px-10 py-8">
        <RouterLink to="/">
            <div class="flex items-center gap-4">
                <img src="/logo.png" alt="logo" class="w-10">
                <div>
                    <h1 class="text-xl font-bold uppercase">Восьминіжка</h1>
                    <p class="text-slate-500 font-bold">Взуття на будь-яку ніжку</p>
                </div>
            </div>
        </RouterLink>

        <ul class="flex items-center gap-10">
            <li @click="() => emit_druw('druwerOpen')"
                class="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-black">
                <img src="/cart.svg" alt="cart">
                <b>Кошик</b>
            </li>
            <RouterLink to="/favorite">
                <li class="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-black">
                    <img src="/heart.svg" alt="heart">
                    <b>Бажання</b>
                </li>
            </RouterLink>
        </ul>
    </header>
</template>