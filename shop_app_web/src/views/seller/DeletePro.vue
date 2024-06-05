<template>
  {{proid}}
</template>

<script setup>
  import { onMounted , ref} from 'vue'
  import axios from 'axios'
  import { useRoute , useRouter} from 'vue-router'
  import { useTokenStore} from '@/store/index.js'
  import { goDeletePro } from '@/api/token.js'
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

    const getDeletePro = async function(){
      let data = await goDeletePro(proid,config)
      result.value = data.data
      router.push("/seller")
      console.log("到seller")
    }

    getDeletePro()
  })
  
  

</script> 