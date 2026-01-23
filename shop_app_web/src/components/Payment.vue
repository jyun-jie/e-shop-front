<template>
  <div class="payment-container">
    <div class="payment-header">
      <h2 class="payment-title">付款管理</h2>
      <div class="payment-tabs">
        <router-link 
          to="/queryTrade" 
          class="tab-link"
          :class="{ active: $route.path === '/queryTrade' }"
        >
          交易查詢
        </router-link>
        <router-link 
          to="/CodPay" 
          class="tab-link"
          :class="{ active: $route.path === '/CodPay' }"
        >
          貨到付款
        </router-link>
      </div>
    </div>
    <div class="payment-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, reactive } from 'vue'
import { useTokenStore } from '@/store/index.js'
</script>

<style scoped>
.payment-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.payment-header {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.payment-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

.payment-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e9ecef;
}

.tab-link {
  padding: 12px 24px;
  text-decoration: none;
  color: #666;
  font-size: 15px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-link:hover {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.05);
}

.tab-link.active {
  color: #409eff;
  border-bottom-color: #409eff;
  font-weight: 600;
}

.payment-content {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-height: 400px;
}
</style>
