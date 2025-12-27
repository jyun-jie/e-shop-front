<template>
    <div>
        <router-link to="/queryTrade">Go to Foo</router-link>
        <router-link to="/CodPay">Go to Paid</router-link>
        <!-- 🔥 子路由顯示位置 -->
        <router-view></router-view>
    </div>

</template>
<script setup>
    import {  useRouter } from 'vue-router';
    import { ref , onMounted, reactive} from 'vue'
    import {useTokenStore} from '@/store/index.js'





</script>