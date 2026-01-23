<template>
  <div class="query-trade-container">
    <div class="query-card">
      <h3 class="query-title">交易查詢</h3>
      <el-form @submit.prevent="queryTradeInfo" class="query-form">
        <el-form-item label="訂單編號">
          <el-input 
            type="text" 
            v-model="merchantOrderNo" 
            placeholder="請輸入訂單編號"
            size="large"
          />
        </el-form-item>
        <el-form-item label="交易金額">
          <el-input 
            type="text" 
            v-model="amt" 
            placeholder="請輸入交易金額"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="queryTradeInfo"
            size="large"
            :loading="isSubmitting"
            class="submit-button"
          >
            查詢交易資訊
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTokenStore } from '@/store/index.js'
import { goQueryTradeInfo } from '@/api/token.js'
import { ElMessage } from 'element-plus'

const token = useTokenStore()
const config = ref()
const isSubmitting = ref(false)

const merchantID = ref('')
const merchantOrderNo = ref('')
const amt = ref('')

onMounted(() => {
  config.value = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.token}`
    }
  }
})

const queryTradeInfo = async () => {
  if (!merchantOrderNo.value || !amt.value) {
    ElMessage.warning('請填寫完整資訊')
    return
  }

  try {
    isSubmitting.value = true
    const res = await goQueryTradeInfo({
      MerchantID: merchantID.value,
      MerchantOrderNo: merchantOrderNo.value,
      Amt: amt.value
    }, config)

    // 若回傳的是 HTML（藍新常見）
    const newWindow = window.open('', '_self')
    newWindow.document.open()
    newWindow.document.write(res)
    newWindow.document.close()
  } catch (err) {
    console.error('queryTradeInfo error', err)
    ElMessage.error('查詢失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.query-trade-container {
  width: 100%;
  min-height: 400px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
}

.query-card {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.query-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px 0;
}

.query-form {
  width: 100%;
}

.submit-button {
  width: 100%;
  height: 48px;
}
</style>
