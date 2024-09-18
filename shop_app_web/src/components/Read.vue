<template>
  <div class="common-layout">
    <el-container>
      <Header ></Header>
      <el-container>
        <Aside ></Aside>
        <el-container>
          <el-main>
              <div v-if="$route.path === '/Read'">
                <ReadPro />
              </div>
              <div v-if="$route.path === '/Read/myPurchase'">
                <PurchasePro />
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
import Header from '@/page/Header.vue'
import Aside from '@/page/Aside.vue'
import { goVisitor } from '@/api/token.js'
import  ReadPro  from '@/views/read/ReadPro.vue'
import PurchasePro from "@/views/buyer/PurchasePro.vue"

  const hello = ref([])
  const token = useTokenStore()
  const config = ref()
  
  
  onMounted(()=>{
    if(token.token !== ''){
      config.value={
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `+token.token
        }
      }
    }
    //同步獲取返回結果
    const getGoVistor =async function(){
      let data = await goVisitor(config)
      hello.value=data
    }
    getGoVistor();

  })
</script>

<style >
</style>