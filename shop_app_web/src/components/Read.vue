<template>
  <div class="common-layout">
    <el-container>
      <Header />
      <el-container>
        <Aside />
        <el-container>
          <el-main>
            <!--變ReadPro-->
            <div v-if="$route.path === '/Read'">
              <ReadPro />
            </div>
            <!--變myPurchase-->
            <div v-if="$route.path === '/Read/myPurchase'">
              <PurchasePro />
            </div>
            <router-view></router-view>
          </el-main>
          <el-footer class="custom-footer">
            <div class="footer-content">
              <p>&copy; 2024 E-Shop. All rights reserved.</p>
            </div>
          </el-footer>
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

<style scoped>
.common-layout {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.custom-footer {
  background-color: #ffffff;
  border-top: 1px solid #e9ecef;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;
  left: 15%;
  right: 0;
  width: 85%;
  z-index: 100;
}

.footer-content {
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>