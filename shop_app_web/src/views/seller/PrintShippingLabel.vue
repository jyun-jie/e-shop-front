<template>
    <p class="size">商品編號<input v-model="inputValue"></p>
    <button  @click="queryShipment()">
        查詢
    </button>
</template>

<script setup>
  import { useRoute , useRouter} from 'vue-router';
  import { ref , onMounted, reactive} from 'vue'
  import {useTokenStore} from '@/store/index.js'
  import {goPrintShippingLabel  ,goQueryShippingDto} from '@/api/token.js'
  import axios from 'axios'

    const token = useTokenStore()
    const router = useRouter()
    const route = useRoute()

    const tradeNo = ref([])
    const config = ref()
    const inputValue =ref();


    onMounted(async()=>{
        config.value={
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer `+token.token
            }
        }
    })

    const queryShipment = async () => {
        const shippingQueryDto = {
            merchantOrderNo : inputValue.value
        }
        console.log(shippingQueryDto)
        const res =await goQueryShippingDto(shippingQueryDto,config)
        console.log(res)
        /*.then(res =>{
            const { actionUrl, formData } = res.data
            console.log(res.data)
            submitStoreMapForm(actionUrl, formData)
        })*/
    
    }

    const submitStoreMapForm =async (actionUrl, formData) => {
    try {
      console.log(actionUrl)
      console.log(formData) 
      // 開啟新視窗
      //const popup = window.open('', 'newebpay', 'width=1000,height=800');
      
      // 建立表單
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = actionUrl;
      
      // 加入表單欄位
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      
      console.log(form)
      // 提交表單
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);


    } catch (error) {
      console.error('開啟門市地圖失敗:', error);
    }
  }
</script>

<style scoped>

</style>