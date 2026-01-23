<template>
  <div class="delete-pro-container">
    <div class="loading-card">
      <el-icon class="is-loading loading-icon"><Loading /></el-icon>
      <p class="loading-text">正在處理刪除請求...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTokenStore } from '@/store/index.js'
import { goDeletePro } from '@/api/token.js'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const proid = route.params.id;
const config = ref()
const token = useTokenStore()

onMounted(() => {
  config.value = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.token}`
    }
  }

  const getDeletePro = async function () {
    try {
      console.log(proid)
      const res = await goDeletePro(proid, config)
      console.log(res)

      if (res.code === 0) {
        ElMessage.success('商品刪除成功')
      } else {
        ElMessage.error('刪除失敗：' + res.message)
      }
    } catch (error) {
      console.error('刪除失敗:', error)
      ElMessage.error('刪除失敗，請稍後再試')
    } finally {
      router.push("/seller/takenDown")
    }
  }

  getDeletePro()
})
</script>

<style scoped>
.delete-pro-container {
  width: 100%;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.loading-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-width: 300px;
}

.loading-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 20px;
}

.loading-text {
  font-size: 16px;
  color: #666;
  margin: 0;
}
</style>
