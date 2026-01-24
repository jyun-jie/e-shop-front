<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const status = ref('')
const message = ref('')

onMounted(() => {
  status.value = route.query.status

  message.value = route.query.msg || '' 
  
  console.log('支付結果:', status.value)
})

const isSuccess = computed(() => {
  return status.value === 'SUCCESS'
})

const goHome = () => {
  router.push('/')
}

const viewOrder = () => {
  router.push(`/Read/myPurchase?status=UNCHECKED`)

}
</script>

<template>
  <div class="payment-container">
    <div class="card">
      <!-- 成功畫面 -->
      <div v-if="isSuccess" class="result-content success">
        <div class="icon-circle">
          <i class="check-icon">✔</i>
        </div>
        <h2>付款成功！</h2>
        <p class="desc">感謝您的購買，我們將盡快為您出貨。</p>
        
        <div class="btn-group">
          <button @click="viewOrder" class="btn primary">查看訂單</button>
          <button @click="goHome" class="btn outline">回首頁</button>
        </div>
      </div>

      <!-- 失敗畫面 -->
      <div v-else class="result-content error">
        <div class="icon-circle error-circle">
          <i class="cross-icon">✖</i>
        </div>
        <h2>付款失敗</h2>
        <p class="error-msg">錯誤代碼：{{ status }}</p>
        <p v-if="message" class="error-msg">原因：{{ message }}</p>
        <p class="desc">請重新嘗試付款或聯繫客服。</p>
        
        <div class="btn-group">
          <button @click="goHome" class="btn primary">回首頁</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.icon-circle {
  width: 80px;
  height: 80px;
  background-color: #e6f7e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.check-icon {
  font-style: normal;
  font-size: 40px;
  color: #28a745;
}

.error-circle {
  background-color: #fdecea;
}

.cross-icon {
  font-style: normal;
  font-size: 40px;
  color: #dc3545;
}

h2 {
  margin-bottom: 10px;
  color: #333;
}

.order-info {
  font-weight: bold;
  color: #555;
  margin: 10px 0;
}

.desc {
  color: #888;
  margin-bottom: 30px;
}

.error-msg {
  color: #dc3545;
  font-size: 0.9rem;
}

.btn-group {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  border: none;
  transition: all 0.3s;
}

.btn.primary {
  background-color: #409eff;
  color: white;
}

.btn.primary:hover {
  background-color: #66b1ff;
}

.btn.outline {
  background-color: transparent;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.btn.outline:hover {
  border-color: #409eff;
  color: #409eff;
}
</style>