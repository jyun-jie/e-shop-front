<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2 class="login-title">{{ isRegister ? '註冊帳號' : '登入帳號' }}</h2>
        <p class="login-subtitle">{{ isRegister ? '創建新帳號以開始購物' : '歡迎回來！' }}</p>
      </div>

      <!-- 註冊表單 -->
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="100px"
        class="login-form"
        v-if="isRegister"
      >
        <el-form-item label="用戶名" prop="username">
          <el-input 
            v-model="ruleForm.username" 
            autocomplete="off"
            placeholder="請輸入用戶名（6-16個字符）"
            size="large"
          />
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input 
            v-model="ruleForm.password" 
            type="password" 
            autocomplete="off"
            placeholder="請輸入密碼（6-16個字符）"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item label="確認密碼" prop="repassword">
          <el-input 
            v-model="ruleForm.repassword" 
            type="password" 
            autocomplete="off"
            placeholder="請再次輸入密碼"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="register(ruleForm)"
            size="large"
            class="submit-button"
            :loading="isSubmitting"
          >
            註冊
          </el-button>
        </el-form-item>
        <el-form-item>
          <div class="form-footer">
            <span class="footer-text">已有帳號？</span>
            <el-button 
              type="text" 
              @click="isRegister=false;clearform()"
              class="switch-button"
            >
              立即登入
            </el-button>
          </div>
        </el-form-item>
      </el-form>

      <!-- 登入表單 -->
      <el-form
        ref="ruleFormRef" 
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="100px"
        class="login-form"
        v-else
      >
        <el-form-item label="用戶名" prop="username">
          <el-input 
            v-model="ruleForm.username" 
            autocomplete="off"
            placeholder="請輸入用戶名"
            size="large"
          />
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input 
            v-model="ruleForm.password" 
            type="password" 
            autocomplete="off"
            placeholder="請輸入密碼"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="submitForm(ruleForm)"
            size="large"
            class="submit-button"
            :loading="isSubmitting"
          >
            登入
          </el-button>
        </el-form-item>
        <el-form-item>
          <div class="form-footer">
            <span class="footer-text">還沒有帳號？</span>
            <el-button 
              type="text" 
              @click="isRegister=true;clearform()"
              class="switch-button"
            >
              立即註冊
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/store/index.js'
import { jwtDecode } from "jwt-decode";
import { ElMessage } from 'element-plus'
import { goLogin  , goRegister} from '@/api/token.js'

const router = useRouter()
const tokenStore = useTokenStore();
const ruleFormRef = ref(null)
const isSubmitting = ref(false)

const clearform = () => {
  ruleForm.username = ''
  ruleForm.password = ''
  ruleForm.repassword = ''
  if (ruleFormRef.value) {
    ruleFormRef.value.clearValidate()
  }
}

const ruleForm = reactive({
  username: '',
  password: '',
  repassword: '',
})

// 驗證確認密碼
const checkrepass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error("請輸入確認密碼"))
  } else if (value !== ruleForm.password) {
    callback(new Error("與密碼不相同"))
  } else {
    callback()
  }
}

const rules = ref({
  username: [
    { required: true, message: '請輸入用戶名', trigger: 'blur' },
    { min: 6, max: 16, message: '長度為6-16個字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, max: 16, message: '長度為6-16個字符', trigger: 'blur' }
  ],
  repassword: [
    { validator: checkrepass, trigger: 'blur' }
  ]
})

const isRegister = ref(false)

const submitForm = async (form) => {
  if (!ruleFormRef.value) return
  
  try {
    await ruleFormRef.value.validate()
    isSubmitting.value = true
    
    const response = await goLogin(form)
    //const response = await axios.post('http://localhost:8080/login/user', form)
    const data = response.data
    
    console.log(data)
    const token = data.token
    console.log(token)
    tokenStore.setToken(token)
    
    const payload = jwtDecode(token);
    
    ElMessage.success('登入成功')
    
    if (payload.role === "SELLER") {
      router.push("/seller");
    } else {
      router.push("/Read");
    }
  } catch (err) {
    if (err.errors) {
      // 表單驗證錯誤
      return
    }
    console.error('登入失敗:', err)
    ElMessage.error(err.response?.data?.message || '登入失敗，請檢查用戶名和密碼')
  } finally {
    isSubmitting.value = false
  }
}

const register = async (form) => {
  if (!ruleFormRef.value) return
  
  try {
    await ruleFormRef.value.validate()
    isSubmitting.value = true
    
    const response = await goRegister(form) ; 
    //const response = await axios.post('/api/login/register', form)
    const data = response.data
    
    ElMessage.success('註冊成功！請登入')
    isRegister.value = false
    clearform()
  } catch (err) {
    if (err.errors) {
      // 表單驗證錯誤
      return
    }
    console.error('註冊失敗:', err)
    ElMessage.error(err.response?.data?.message || '註冊失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  box-sizing: border-box;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.login-form {
  width: 100%;
}

.login-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

.login-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #e0e0e0 inset;
  border-radius: 6px;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409eff inset;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

.submit-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
}

.form-footer {
  width: 100%;
  text-align: center;
  margin-top: 8px;
}

.footer-text {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
}

.switch-button {
  padding: 0;
  font-size: 14px;
  color: #409eff;
  font-weight: 600;
}

.switch-button:hover {
  color: #66b1ff;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .login-card {
    padding: 32px 24px;
  }

  .login-title {
    font-size: 24px;
  }
}
</style>