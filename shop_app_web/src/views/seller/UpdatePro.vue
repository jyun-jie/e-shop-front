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
    <el-form-item label="(假設)產品圖片地址">
      <el-input v-model="product.imageUrl" />
    </el-form-item>
    <el-form-item label="發送地址">
      <el-input v-model="product.address" />
    </el-form-item>
    <el-form-item label="產品描述">
      <el-input v-model="product.description" type="textarea" />
    </el-form-item>
    <el-form-item>
      <!--<el-button type="primary" @click="onSubmit">Update</el-button>-->
      <el-button @click="Cancel">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
  import { useRoute , useRouter} from 'vue-router';
  import { ref , onMounted, reactive} from 'vue'
  import {useTokenStore} from '@/store/index.js'
  import { goDetailPro } from '@/api/token.js'
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

    const getGoDetailPro = async function(){
      let data = await goDetailPro(proid,config)
      product.value=data.data
    }
    getGoDetailPro()
  })

  //確定更新

  //不要更新
  const Cancel = (()=>{
    router.push("/seller")
  })

</script>