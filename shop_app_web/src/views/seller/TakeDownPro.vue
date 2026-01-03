<template>
  {{proid}}
</template>

<script setup>
  import { onMounted , ref} from 'vue'
  import axios from 'axios'
  import { useRoute , useRouter} from 'vue-router'
  import { useTokenStore} from '@/store/index.js'
  import { goTakeDownPro } from '@/api/token.js'
  const route = useRoute()
  const router = useRouter()
  const proid = route.params.id;
  const result = ref()
  const config = ref()
  const token = useTokenStore()


  onMounted(()=>{
    config.value={
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `+token.token
        }
    }

    const getgoTakeDownPro = async function(){

      console.log(proid)
    
      await goTakeDownPro(proid,config).then(res => {
        console.log(res)
// res.data 才是你 Postman 看到的那個物件
        if (res.code === 0) {
          alert("成功！");
        } else {
          // 🚨 這裡！你要抓的是 res.data.message
          alert("失敗原因：" + res.message); 
        }
      })
      
      router.push("/seller")
      console.log("到seller")
    }

    getgoTakeDownPro()
  })
  
  

</script> 