<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="home-image-container">
          <el-link href="/buyer" target="_self"><img src="@/assets/header.png" /></el-link>
        </div>
      </el-header>
    <el-container>
        
    <el-aside width="200px">
      <el-link href="/seller" target="_self">賣家管理</el-link>
      <el-link href="/coupon" target="_self">優惠券</el-link>
      
    </el-aside>
        <el-container>
          <el-main>Main</el-main>
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
  const hello = ref()
  const token = useTokenStore()
  const router = useRouter()
  const config = ref()
  
  
  onMounted(()=>{
    if(token.token === ''){
      router.push("/login")
    }else{
    config.value={
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `+token.token
        }
      }
    axios.get("http://localhost:8080/seller",config.value).then((response)=>{
      console.log(response.data);
      hello.value = response.data
      console.log("hello1")
    }).catch((error)=>{
      console.log(error);
    }) 
  }
  })
</script>

<style>
.el-header {
  margin-right: 8px;
  border-style: double;
  background-color: orange;
}
.el-aside{
 background-color: plum;
}
.el-main{
  background-color: greenyellow;
}
.el-footer{
  background-color: navy;
}
.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
  width:100px;
  height: 100px;
}
.home-image-container img{
  width:200px;
  height: 50px;
  border: 1px solid #000;;
}
</style>