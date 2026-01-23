<template>
  <div class="logout-container">
    <div class="logout-card">
      <h2 class="logout-title">確認登出</h2>
      <p class="logout-message">您確定要登出嗎？</p>
      <div class="logout-actions">
        <el-button type="primary" @click="logout" size="large">
          確認登出
        </el-button>
        <el-button @click="cancel" size="large">
          取消
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/store/index.js'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const tokenStore = useTokenStore();

const logout = async () => {
  try {
    await ElMessageBox.confirm('確定要登出嗎？', '確認登出', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    tokenStore.removeToken()
    router.push("/login")
  } catch {
    // 用戶取消
  }
}

const cancel = () => {
  router.push("/Read")
}
</script>

<style scoped>
.logout-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.logout-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 40px;
  text-align: center;
  min-width: 400px;
}

.logout-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.logout-message {
  font-size: 16px;
  color: #666;
  margin: 0 0 32px 0;
}

.logout-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.logout-actions .el-button {
  min-width: 120px;
}
</style>