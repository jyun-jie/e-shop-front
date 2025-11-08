<template>
  <div class="common-layout all-back">
    <el-container>
      <Header />
    <el-container>
        
    <el-aside width="200px">
      <router-link to="/seller">待出售商品</router-link>
      <br>
      <router-link to="/seller/insert">我要賣商品</router-link>
      <br>
      <router-link to="/seller/checkOrder">我的銷售訂單</router-link>
      
    </el-aside>
        <el-container>
          <el-main>
             <div v-if="$route.path === '/seller'">
              <SellerPro />
            </div>
              <router-view></router-view>
          </el-main>
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
import SellerPro from '@/views/seller/SellerPro.vue'
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
.all-back{
  margin:0px;
  padding: 0px;
  position: fixed;
  left: 0%;
  top: 0%;
  
  width: 100%;
  height: 100%;
  background-color: plum;
}
</style>