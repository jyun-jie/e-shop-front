<template>
  <div class="common-layout">
    <el-container>
      <Header />
    <el-container>
        
    <el-aside width="200px">
      <router-link to="/seller/insert">我要賣商品</router-link>
      <el-link href="/coupon" target="_self">優惠券</el-link>
      
    </el-aside>
        <el-container>
          <el-main><router-view></router-view></el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted ,reactive,ref } from "vue";
import { useTokenStore } from '@/store/index.js'
import {useRouter} from 'vue-router'
import Header from '@/page/Header.vue'
import {goSeller} from '@/api/token.js'
  const hello = ref()
  const token = useTokenStore()
  const router = useRouter()
  const config = ref()
  
  
  onMounted(()=>{
    config.value={
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `+token.token
        }
      }
    const getGoSeller =async function(){
      let data = await goSeller(config)
      hello.value=data
    }
    getGoSeller();
  
  })


</script>

<style>

.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}
.home-image-container img{
  width:200px;
  height: 50px;
  border: 1px solid #000;;
}
.search-bar{
  flex:1;
  height:40px;
  padding-left:10px;
  font-size: 16px;
  /*border-width: 1px;
  border-style: solid;
  border-color: rgb(192, 192, 192); 為以下*/
  border: 1px solid rgb(192, 192, 192);
  border-radius: 2px;
  box-shadow: inset 1px 2px 5px rgba(0,0,0,0.05);
}
.middle-section{
  display :flex;
  flex: 1 ;
  margin-left: 100px;
  margin-right: 100px;
  max-width: 500px;
  align-items: center;
}
</style>