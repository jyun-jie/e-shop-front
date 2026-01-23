<template>
  <div class="common-layout seller-layout">
    <el-container>
      <Header />
      <el-container>
        <el-aside width="220px" class="seller-aside">
          <div class="aside-content">
            <h3 class="aside-title">賣家中心</h3>
            <nav class="seller-nav">
              <router-link 
                to="/seller" 
                class="nav-item"
                :class="{ active: $route.path === '/seller' }"
              >
                <span>待出售商品</span>
              </router-link>
              <router-link 
                to="/seller/takenDown" 
                class="nav-item"
                :class="{ active: $route.path === '/seller/takenDown' }"
              >
                <span>下架的商品</span>
              </router-link>
              <router-link 
                to="/seller/insert" 
                class="nav-item"
                :class="{ active: $route.path === '/seller/insert' }"
              >
                <span>我要賣商品</span>
              </router-link>
              <router-link 
                to="/seller/checkOrder" 
                class="nav-item"
                :class="{ active: $route.path === '/seller/checkOrder' }"
              >
                <span>我的銷售訂單</span>
              </router-link>
              <router-link 
                to="/seller/createLogistics" 
                class="nav-item"
                :class="{ active: $route.path === '/seller/createLogistics' }"
              >
                <span>未確認訂單</span>
              </router-link>
            </nav>
          </div>
        </el-aside>
        <el-container>
          <el-main class="seller-main">
            <div v-if="$route.path === '/seller'">
              <SellerPro />
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
      console.log(hello.value)
    }
    getGoSeller();
  
  })


</script>

<style scoped>
.seller-layout {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.seller-aside {
  background-color: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
  border-right: 1px solid #e9ecef;
  padding: 0;
}

.aside-content {
  padding: 20px;
}

.aside-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.seller-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: block;
  padding: 12px 16px;
  color: #666;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 15px;
}

.nav-item:hover {
  background-color: #f0f7ff;
  color: #409eff;
}

.nav-item.active {
  background-color: #e6f4ff;
  color: #409eff;
  font-weight: 600;
}

.seller-main {
  background-color: #f5f5f5;
  padding: 20px;
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
  left: 220px;
  right: 0;
  z-index: 100;
}

.footer-content {
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .seller-aside {
    width: 180px !important;
  }
  
  .custom-footer {
    left: 180px;
  }
}
</style>