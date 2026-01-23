<template>
  <div class="apply-seller-container">
    <div class="apply-card">
      <div class="apply-header">
        <h2 class="apply-title">申請成為賣家</h2>
        <p class="apply-subtitle">填寫以下資訊以申請賣家資格</p>
      </div>

      <el-form 
        :model="form" 
        label-width="120px" 
        class="apply-form"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="商店名稱" prop="shop_name">
          <el-input 
            v-model="shop_name" 
            placeholder="請輸入商店名稱"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="信用卡號" prop="card_number">
          <el-input 
            v-model="card_number" 
            placeholder="請輸入信用卡號"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="銀行帳號" prop="bank_account">
          <el-input 
            v-model="bank_account" 
            placeholder="請輸入銀行帳號"
            size="large"
          />
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleSubmit"
            size="large"
            :loading="isSubmitting"
            class="submit-button"
          >
            送出申請
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
import { goApplySeller } from '@/api/token.js'
import { ElMessage } from 'element-plus'

const token = useTokenStore();
const config = ref('')
const formRef = ref(null)
const isSubmitting = ref(false)

const shop_name = ref('');
const card_number = ref('');
const bank_account = ref('');

const form = {
  shop_name,
  card_number,
  bank_account
}

const rules = {
  shop_name: [
    { required: true, message: '請輸入商店名稱', trigger: 'blur' }
  ],
  card_number: [
    { required: true, message: '請輸入信用卡號', trigger: 'blur' }
  ],
  bank_account: [
    { required: true, message: '請輸入銀行帳號', trigger: 'blur' }
  ]
}

onMounted(() => {
  config.value = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.token}`
    }
  }
})

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    isSubmitting.value = true

    const data = {
      shop_name: shop_name.value,
      card_number: card_number.value,
      bank_account: bank_account.value,
    }

    const resp = await goApplySeller(data, config)
    ElMessage.success('申請已送出，請等待審核')
    
    // 清空表單
    shop_name.value = ''
    card_number.value = ''
    bank_account.value = ''
  } catch (error) {
    if (error.errors) {
      return
    }
    console.error('申請失敗:', error)
    ElMessage.error('申請失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.apply-seller-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.apply-card {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 40px;
}

.apply-header {
  text-align: center;
  margin-bottom: 32px;
}

.apply-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.apply-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.apply-form {
  width: 100%;
}

.submit-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .apply-card {
    padding: 32px 24px;
  }
}
</style>
