<template>
  <div class="cod-paid-container">
    <div class="cod-card">
      <h3 class="cod-title">貨到付款確認</h3>
      <el-form class="cod-form">
        <el-form-item label="訂單編號">
          <el-input 
            type="text" 
            v-model="merchat" 
            placeholder="請輸入訂單編號"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="changePaid"
            size="large"
            :loading="isSubmitting"
            class="submit-button"
          >
            確認收貨
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue'
import { useTokenStore } from '@/store/index.js'
import { goPaid } from '@/api/token.js'
import { ElMessage } from 'element-plus'

const token = useTokenStore();
const merchat = ref('');
const config = ref();
const isSubmitting = ref(false)

onMounted(() => {
  config.value = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.token}`
    }
  }
})

const changePaid = async () => {
  if (!merchat.value) {
    ElMessage.warning('請輸入訂單編號')
    return
  }

  try {
    isSubmitting.value = true
    await goPaid(merchat, config)
    ElMessage.success('收貨確認成功')
    merchat.value = ''
  } catch (error) {
    console.error('確認收貨失敗:', error)
    ElMessage.error('確認收貨失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.cod-paid-container {
  width: 100%;
  min-height: 400px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
}

.cod-card {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.cod-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px 0;
}

.cod-form {
  width: 100%;
}

.submit-button {
  width: 100%;
  height: 48px;
}
</style>
