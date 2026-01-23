<template>
  <div class="seller-pro-container" ref="scrollContainer">
    <div class="products-grid">
      <div 
        v-for="pro in product" 
        :key="pro.id" 
        class="product-card"
      >
        <router-link 
          :to="{name:'update',params:{id:pro.id}}" 
          class="product-link"
        >
          <div class="product-image">
            <img 
              v-if="pro.imageUrl === null || pro.imageUrl===''" 
              src="@/image/loading.svg" 
              class="loading-container" 
              alt="產品圖片"
            >
            <img 
              v-else 
              :src="pro.imageUrl" 
              class="product-img"
              :alt="pro.name"
            >
          </div>
          <div class="product-info">
            <div class="product-name">{{ pro.name }}</div>
            <div class="product-price">NT$ {{ formatPrice(pro.price) }}</div>
            <div class="product-rate">評分: {{ pro.rate || 'N/A' }}</div>
            <div class="product-address">{{ pro.address }}</div>
          </div>
        </router-link>
        <div class="product-actions">
          <el-button 
            type="danger" 
            size="small"
            @click="goTakeDown(pro.id)"
            class="action-btn"
          >
            下架
          </el-button>
        </div>
      </div>
    </div>
    
    <div 
      ref="loadMoreTrigger" 
      class="load-more-trigger"
    >
      <span v-if="hasMore">載入更多...</span>
      <span v-else>已載入全部商品</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref, onUnmounted } from 'vue'
import { useTokenStore } from '@/store/index.js'
import { goSellerPro } from '@/api/token.js'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const product = ref([])
const config = ref()
const token = useTokenStore()

const scrollContainer = ref(null)
const pageNum = ref(0)
const pageSize = ref(15)
const loadMoreTrigger = ref(null)
const hasMore = ref(true)
let observer = null

// 格式化價格
const formatPrice = (price) => {
  if (!price) return '0'
  return Number(price).toLocaleString('zh-TW')
}

onMounted(() => {
  config.value = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.token}`
    }
  }

  getGoSellerPro()

  if (loadMoreTrigger.value) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore.value) {
          getGoSellerPro()
        }
      },
      {
        root: scrollContainer.value,
        rootMargin: '100px',
        threshold: 0.1
      }
    )
    observer.observe(loadMoreTrigger.value)
  }
})

const getGoSellerPro = async function () {
  try {
    let params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      status: "in_stock",
    }
    let data = await goSellerPro(params, config)
    console.log(data)
    
    if (data.data !== null) {
      pageNum.value = data.data.pageNum
      product.value = [...product.value, ...data.data.productList]
      
      if (data.data.productList.length < pageSize.value) {
        hasMore.value = false
      } else {
        pageNum.value += 1
      }
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('載入商品失敗:', error)
    hasMore.value = false
  }
}

const goTakeDown = async function (proid) {
  try {
    await ElMessageBox.confirm('確認是否下架此商品？', '確認下架', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await router.push({ name: 'takeDown', params: { id: proid } })
  } catch {
    // 用戶取消
  }
}

onUnmounted(() => {
  if (observer && loadMoreTrigger.value) {
    observer.unobserve(loadMoreTrigger.value)
  }
})
</script>

<style scoped>
.seller-pro-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.seller-pro-container::-webkit-scrollbar {
  width: 8px;
}

.seller-pro-container::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 4px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding-bottom: 40px;
}

.product-card {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 320px;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #409eff;
}

.product-link {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  padding: 16px;
}

.product-image {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 12px;
  overflow: hidden;
}

.loading-container {
  width: 60px;
  height: 60px;
  animation: rotate 2s linear infinite;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  color: #409eff;
  font-size: 18px;
  font-weight: 700;
}

.product-rate,
.product-address {
  font-size: 13px;
  color: #666;
}

.product-actions {
  padding: 12px 16px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: center;
}

.action-btn {
  width: 100%;
}

.load-more-trigger {
  height: 60px;
  text-align: center;
  line-height: 60px;
  color: #999;
  font-size: 14px;
  grid-column: 1 / -1;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .product-card {
    min-height: 280px;
  }
  
  .product-image {
    height: 150px;
  }
}
</style>
