<template>
  <el-form :model="product" label-width="auto" style="max-width: 600px">
    <el-form-item label="產品名稱">
      <el-input v-model="product.name" />
    </el-form-item>
    <el-form-item label="產品封面圖片">
      <div class="image-item">
        <img v-if="coverWatch" :src="coverWatch.url" alt="封面" />
        <input type="file" class="image-item" accept="image/*" @change="selectNewCover" />
      </div>
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
      <div 
        v-for="(img ,index) in images" 
        :key="img.id" 
        class="image-item"
        @click="removeImage(img ,index)"
      >
        <img :src="img.url"/>
      </div>


       <div class="add-image-box">
        <input 
          type="file" 
          multiple
          accept="image/*"
          @change="onSelectImages"
        />
        <p>新增圖片</p>
      </div>
    </el-form-item>
    <el-form-item label="發送地址">
      <el-input v-model="product.address" />
    </el-form-item>
    <el-form-item label="產品描述">
      <el-input v-model="product.description" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="updateProduct">Update</el-button>
      <el-button @click="Cancel">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
  import { useRoute , useRouter} from 'vue-router';
  import { ref , onMounted, reactive} from 'vue'
  import {useTokenStore} from '@/store/index.js'
  import { goDetailPro ,goUpdateProduct } from '@/api/token.js'
  import axios from 'axios'

  const token = useTokenStore()
  //使用route 
  const route = useRoute()
  const router = useRouter()
  //獲取 router link 傳過來的參數
  const proid = route.params.id;
  const config = ref()
  const product = ref({
    id: 0,
    name: '',
    type: '',
    price: 0,
    quantity: 0,
    imageUrl: '',
    address: '',
    description: ''
  });
  const images = ref([])
  const newImages = ref([])
  const deleteImages = ref([])
  const coverWatch = ref();
  let isCoverChange = ref(false);
  const cover = ref()

  onMounted(()=>{
    config.value={
        headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer `+token.token
        }
      }

    const getGoDetailPro = async function(){
      let res = await goDetailPro(proid,config)
      
      const list = res.data
      console.log(list)

      

      product.value=list[0];
      images.value = list.map(p => ({
        id: p.imageId,
        url: p.imageUrl,
        type: p.imageType
      }));

      coverWatch.value = images.value.find(img => img.type === 'cover');
      images.value = images.value.filter(img => img.type !== 'cover');
      console.log(coverWatch.value)
      console.log(images.value)
    }
    getGoDetailPro()
  })

  //確定更新
  const updateProduct = (async ()=>{
    const dto = {
      id : proid,
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

      newImages.value.forEach(file => {
        formData.append("newImages", file);
      });
      
      if(isCoverChange === true ){
        formData.append("cover" , cover.value) ; 
        console.log("丟cover")
      }else{
        formData.append("cover", null) ; 
      }
      

      formData.append("deleteImages",new Blob([JSON.stringify(deleteImages.value)], { type: "application/json" }) );


      console.log(formData.get("data"));
      console.log(formData.getAll("newImages"));
      console.log(formData.getAll("deleteImages"));
      console.log(formData.get("cover"));



      let data = await goUpdateProduct(formData,config)
      console.log(data)
  })


  //不要更新
  const Cancel = (()=>{
    router.push("/seller")
  })

  const removeImage = (img , index) => {
    deleteImages.value.push({
      id : img.id,
      url: img.url,
    });

    images.value.splice(index, 1)

    console.log(deleteImages.value)
  }
  
  const onSelectImages = (event)=>{
    const files = event.target.files
    newImages.value = Array.from(files)
    console.log("上傳圖片 : " + newImages.value)
  }

  const selectNewCover = (event)=>{
    const file = event.target.files[0]
    if (!file) return

    deleteImages.value.push(coverWatch.value)

      

    // 生成暫時 URL，用來在頁面預覽
    const url = URL.createObjectURL(file)
    isCoverChange = true ; 
    coverWatch.value = {
      url : url ,
    }
    cover.value= file ; 
    console.log(deleteImages.value)
    console.log(cover.value)
  }


</script>

<style>
.image-list {
  display: flex;
  gap: 10px;
}
.image-item img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  transition: 0.2s;
}
.image-item img:hover {
  border-color: red;
  opacity: 0.8;
}
.add-image-box {
  width: 120px;
  height: 120px;
  border: 2px dashed #aaa;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-direction: column;
}
</style>