<script setup>
import FooterBtn from '@/components/Footer/FooterBtn.vue'
import Header from '@/components/Header.vue'
import ChatWidget from '@/components/Chat/ChatWidget.vue'
</script>
<template>
 <Header />
<RouterView></RouterView>
<ChatWidget />
<FooterBtn/>
</template>
