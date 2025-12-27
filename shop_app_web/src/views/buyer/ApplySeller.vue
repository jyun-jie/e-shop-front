<template>
    <div>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>

        <br>
        <br>
        <br>
        <br>
        <input v-model="shop_name" placeholder="shop_name" />
        <input v-model="card_number" placeholder="card_number" />
        <input v-model="bank_account" placeholder="bank_account" />
        <button @click="handleSubmit">送出</button>
    </div>
</template>

<script setup>
  import { useRoute , useRouter} from 'vue-router';
  import { ref , onMounted,} from 'vue'
  import {useTokenStore} from '@/store/index.js'
  import { goApplySeller} from '@/api/token.js'
  import axios from 'axios'
    const token = useTokenStore() ; 
    const config = ref('')

    const shop_name = ref('') ; 
    const card_number = ref('') ; 
    const bank_account = ref('') ; 


    onMounted(()=>{
        config.value={
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer `+token.token
            }
        }
    })


    const handleSubmit = ()=>{
        const data = {
            shop_name : shop_name.value,
            card_number : card_number.value,
            bank_account : bank_account.value,
        }

    console.log("this is data " , data) ; 
        goApplySeller(data  ,config ).then((resp)=>{
            console.log(resp)

        }) ; 
         
    }
</script>