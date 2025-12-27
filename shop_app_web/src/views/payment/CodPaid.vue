<template>
<div>
    <input type="text" v-model="merchat">
    <button @click="changePaid">收貨</button>    
</div>
</template>

<script setup>
    import { useRoute , useRouter} from 'vue-router';
    import { ref , onMounted, reactive ,nextTick , watch, watchEffect} from 'vue'
    import {useTokenStore} from '@/store/index.js'
    import { goPaid} from '@/api/token.js'

    const token = useTokenStore();
    const merchat = ref('input') ;
    const config = ref() ; 


    onMounted(()=>{
        config.value={
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer `+token.token
            }
        }
    })

    const changePaid = ()=>{
        console.log(merchat.value)
        console.log(config.value)

        goPaid(merchat,config);

    }



</script>