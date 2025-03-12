<script setup>
import { ref, watch } from 'vue';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/vue';

const props = defineProps({ fullurl: String });

const cld = new Cloudinary({ cloud: { cloudName: import.meta.env.VITE_CLOUD_NAME } })
const img_url = ref(cld.image(props.fullurl)) // Делаем реактивным

// Следим за изменениями fullurl и обновляем картинку
watch(() => props.fullurl, (newUrl) => {
  img_url.value = cld.image(newUrl)
})

</script>
<template>
<AdvancedImage :cldImg="img_url"></AdvancedImage>
</template>