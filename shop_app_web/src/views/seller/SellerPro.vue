<template>
  <ul class="pro">

        <li v-for="pro in product" class="pro-container">
          <!--:to="name=網址 param = post傳值"-->
          <router-link :to="{name:'update',params:{id:pro.id}}" class="update-container">
            <div>{{pro.id}} </div>
            <div>image</div>
            <div>
              {{pro.name}}
            </div>
            <div>
              <div>{{pro.price}}</div>
              <div>{{pro.rate}}</div>
              <div>{{pro.address}}</div>
            </div>
          </router-link>
          <div class="del-button"><button @click="goDelete">刪除</button></div>
        </li>
  </ul>
</template>


<script setup>
import axios from 'axios'
import {useRouter} from 'vue-router'
import {onMounted , reactive,ref } from 'vue'
import {useTokenStore} from '@/store/index.js'
import {goSellerPro} from '@/api/token.js'

  const router = useRouter()
  const product = ref()
  const config = ref()
  const token = useTokenStore()
  onMounted(()=>{
    config.value={
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `+token.token
        }
      }
    const getGoSellerPro =async function(){
      let data = await goSellerPro(config)
      product.value=data.data
      console.log(product.value)
    }
    getGoSellerPro();

  })
  const goDelete = (()=>{
    router.push("/seller/delete")
  })
</script>

<style>
.pro{
  /*不要點點*/
  list-style:none;
  left: 25%;
  top: 60px;
  right: 15%;
  bottom: 60px;

  width: 60%;
  height: 80%;

  border: double;
  margin: 0px;
  padding: 0px;

  position:fixed;
  display: grid ;
  
  /*分割 格線布局 5個 每個都 1fr*/
  grid-template-columns: repeat(5, 1fr);

  
}
.pro-container{
  position: relative;
  border:double;
  border-color: black;
  

  top: 0px;
  bottom: 23px;
  right: 0px;

  margin:0px;
  padding: 0px;
  z-index: 99;
  

}
.update-container{
  position: absolute;
  bottom: 23px;
}
.del-button{
  position: absolute;
  height: 23px;
  margin: 0px;
  padding: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 100;
}
</style>
