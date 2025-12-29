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
      <input type="file" @change="onFileChange" />
    </el-form-item>
    <el-form-item label="發送地址">
      <el-input v-model="product.address" />
    </el-form-item>
    <el-form-item label="產品描述">
      <el-input v-model="product.description" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button @click="Cancel">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive , onMounted ,ref} from 'vue'
import { useRouter }from 'vue-router'

import axios from 'axios'
import { useTokenStore } from '@/store/index.js'
import { goInsertPro } from '@/api/token.js'

const router = useRouter()
const hello = ref()
// do not use same name with ref
const product = reactive({
  name: '',
  type: '',
  price: 0,
  quantity: 1,
  address: '',
  description: '',
})
const imageFile = ref(null)

const config = ref()
const token = useTokenStore()
onMounted(()=>{
  config.value={
        headers: {
        
        'Authorization': `Bearer `+token.token
        }
      }
})

//"Content-Type": "multipart/form-data",
const onSubmit = async function(){
  //要進到攔截器 查看是否登入token
  //攜帶product物件, header
  const dto = {
    name: product.name,
    type: product.type,
    price: product.price,
    quantity: product.quantity,
    address: product.address,
    description: product.description
  }

  const formData = new FormData();
  const jsonBlob = new Blob([JSON.stringify(dto)], { type: "application/json" });
  formData.append("data", jsonBlob);
  formData.append("image", imageFile.value);



  let data = await goInsertPro(formData,config)


  hello.value=data
  alert(hello.value.data)
  router.push("/seller")
}

const onFileChange = (event) => {
  imageFile.value = event.target.files[0]
}

const Cancel = (()=>{
    router.push("/seller")
  })

</script>