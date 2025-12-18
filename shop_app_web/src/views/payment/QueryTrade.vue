<template>
  <div>

    <form @submit.prevent="queryTradeInfo">
      <input type="text" name="MerchantOrderNo" v-model="merchantOrderNo" />
      <input type="text" name="Amt" v-model="amt" />

      <button type="submit">submit trade info</button>
    </form>
  </div>
</template>

<script setup>
    //import { useRoute , useRouter} from 'vue-router';
    import { ref , onMounted, reactive} from 'vue'
    import {useTokenStore} from '@/store/index.js'
    import { goQueryTradeInfo } from '@/api/token.js'


    const token = useTokenStore()
    const config = ref()

    const merchantID = ref('trade id')
    const merchantOrderNo = ref('trade no')
    const amt = ref('$')



    onMounted(()=>{
        config.value={
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer `+token.token
            }
        }

    })

    const queryTradeInfo = async () => {
        try {

            console.log(merchantID)
            console.log(merchantOrderNo)
            console.log(amt)
            
            const res = await goQueryTradeInfo({
            MerchantID: merchantID.value,
            MerchantOrderNo: merchantOrderNo.value,
            Amt: amt.value
            },config)

            // ⚠️ 若回傳的是 HTML（藍新常見）
            console.log(res)
            const newWindow = window.open('', '_self')
            newWindow.document.open()
            newWindow.document.write(res)
            newWindow.document.close()

        } catch (err) {
            console.error('queryTradeInfo error', err)
        }
    }
</script>

