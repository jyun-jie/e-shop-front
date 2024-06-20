<template>
  <el-form :model="product" label-width="auto" style="max-width: 600px">
    <el-form-item label="產品名稱">
      <el-input v-model="product.name" />
    </el-form-item>
    <el-form-item label="產品類型">
      <el-select v-model="product.type" placeholder="請選擇類型">
        <el-option label="電子" value="electronic" />
        <el-option label="民生" value="livelihood" />
      </el-select>
    </el-form-item>
    <el-form-item label="產品價格">
      <el-input v-model="product.price" />
    </el-form-item>
    <el-form-item label="產品數量">
    <el-input-number v-model="product.quantity" @change="handleChange" />
    </el-form-item>
    <el-form-item label="發送地址">
      <el-input v-model="product.address" />
    </el-form-item>
    <el-form-item label="產品描述">
      <el-input v-model="product.description" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">cart</el-button>
      <el-button @click="Cancel">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
  import { useRoute , useRouter} from 'vue-router';
  import { ref , onMounted, reactive} from 'vue'
  import {useTokenStore} from '@/store/index.js'
  import { goReadDetailPro } from '@/api/token.js'
  import axios from 'axios'

  const token = useTokenStore()
  //使用route 
  const route = useRoute()
  const router = useRouter()
  //獲取 router link 傳過來的參數
  const proid = route.params.id;
  const config = ref()
  let product = ref({
    name: '',
    type: '',
    price: 0,
    quantity: 0,
    imageUrl: '',
    address: '',
    description: ''
  });

  onMounted(()=>{
    config.value={
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `+token.token
        }
      }

    const getGoReadDetailPro = async function(){
      let data = await  goReadDetailPro(proid,config)
      product.value=data.data
      console.log(product.value)
    }
    getGoReadDetailPro()
  })

  //確定更新
  const onSubmit = (()=>{
    axios.put("http://localhost:8080/seller/Pro/"+proid,product.value,config.value).then((response)=>{
      product.value=response.data.data
      console.log(product.value)
      alert("成功更新商品")
      router.push("/seller")
    }).catch((error)=>{
      console.log(error)
    })
  })

  //不要更新
  const Cancel = (()=>{
    router.push("/Read")
  })

</script>