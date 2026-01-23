<template>
  <div class="product-detail-container">
    <div class="product-card">
      <div v-if="product.imageUrl" class="product-image">
        <img :src="product.imageUrl" :alt="product.name" />
      </div>
      
      <el-form :model="product" label-width="120px" class="product-form">
        <el-form-item label="產品名稱">
          <el-input v-model="product.name" disabled />
        </el-form-item>
        <el-form-item label="產品類型">
          <el-select v-model="product.type" placeholder="請選擇類型" disabled>
            <el-option label="電子" value="electronic" />
            <el-option label="民生" value="livelihood" />
          </el-select>
        </el-form-item>
        <el-form-item label="產品價格">
          <el-input v-model="product.price" disabled>
            <template #prefix>NT$</template>
          </el-input>
        </el-form-item>
        <el-form-item label="產品數量">
          <el-input-number 
            v-model="quantity" 
            :min="1"
            :max="999"
            @change="handleChange"
            size="large"
          />
        </el-form-item>
        <el-form-item label="發送地址">
          <el-input v-model="product.address" disabled />
        </el-form-item>
        <el-form-item label="產品描述">
          <el-input 
            v-model="product.description" 
            type="textarea" 
            :rows="4"
            disabled
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="getGoAddCart"
            size="large"
            :loading="isAdding"
            class="action-button"
          >
            加入購物車
          </el-button>
          <el-button 
            @click="Cancel"
            size="large"
            class="action-button"
          >
            返回
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
import { goAddCart, goReadDetailPro } from '@/api/token.js'
import { ElMessage } from 'element-plus'

const token = useTokenStore()
const route = useRoute()
const router = useRouter()
const proid = route.params.id;
const config = ref()
const isAdding = ref(false)

let product = ref({
  name: '',
  type: '',
  price: 0,
  imageUrl: '',
  address: '',
  description: ''
});

let quantity = ref(1)

onMounted(() => {
  config.value = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.token}`
    }
  }

  const getGoReadDetailPro = async function () {
    try {
      let data = await goReadDetailPro(proid, config)
      product.value = data.data
    } catch (error) {
      ElMessage.error('載入產品資訊失敗')
    }
  }
  getGoReadDetailPro()
})

const handleChange = () => {
  // 數量變更處理
}

const getGoAddCart = async function () {
  try {
    isAdding.value = true
    let data = await goAddCart(proid, quantity, config)
    ElMessage.success('已加入購物車')
    console.log(data.data)
  } catch (error) {
    ElMessage.error('加入購物車失敗')
  } finally {
    isAdding.value = false
  }
}

const Cancel = () => {
  router.push("/Read")
}
</script>

<style scoped>
.product-detail-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.product-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  gap: 30px;
}

.product-image {
  flex: 0 0 400px;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-form {
  flex: 1;
}

.action-button {
  min-width: 120px;
}

@media (max-width: 768px) {
  .product-card {
    flex-direction: column;
  }

  .product-image {
    flex: 0 0 auto;
    width: 100%;
    height: 300px;
  }
}
</style>
