<template>
  <div class="purchase-container">
    <!-- 標籤按鈕區 -->
    <div class="tab-container">
      <button 
        v-for="button in buttons" 
        :key="button.id" 
        @click="clickButton(button.id)"
        :class="{ active: activeButton === button.id }"
        class="tab-button"
      >
        {{ button.label }}
      </button>
      <div class="tab-indicator" :style="underlineStyle"></div>
    </div>

    <!-- 訂單列表區 -->
    <div class="orders-container" ref="scrollContainer">
      <!-- 待收貨時的批量操作區 -->
      <div v-if="oldButtonId === 'ReadyForPickup' && PurchaseList.length > 0" class="batch-action-bar">
        <el-checkbox 
          v-model="isAllSelected" 
          @change="toggleSelectAll"
          class="select-all-checkbox"
        >
          全選
        </el-checkbox>
        <el-button
          type="primary"
          :disabled="selectedOrders.length === 0"
          @click="pickupOrder"
          class="pickup-button"
        >
          確認取貨 ({{ selectedOrders.length }})
        </el-button>
      </div>

      <!-- 訂單列表 -->
      <div v-if="PurchaseList && PurchaseList.length > 0" class="orders-list">
        <div 
          v-for="order in PurchaseList" 
          :key="order.id" 
          class="order-card"
        >
          <!-- 待收貨時的單選框 -->
          <div v-if="oldButtonId === 'ReadyForPickup'" class="order-checkbox">
            <el-checkbox 
              :model-value="selectedOrders.includes(order.id)"
              @change="toggleOrder(order.id)"
            />
          </div>

          <div class="order-content">
            <div class="order-header">
              <div class="order-info">
                <span class="order-id">訂單編號: {{ order.id }}</span>
                <span class="seller-name">{{ order.postalName }}</span>
              </div>
              <div class="order-total">
                <span class="total-label">總計</span>
                <span class="total-amount">NT$ {{ formatPrice(order.total) }}</span>
              </div>
            </div>

            <div class="products-section">
              <div 
                v-for="product in order.orderProductList" 
                :key="product.product_Id" 
                class="product-item"
              >
                <div class="product-info">
                  <span class="product-name">{{ product.productName }}</span>
                  <div class="product-details">
                    <span class="product-price">NT$ {{ formatPrice(product.price) }}</span>
                    <span class="product-quantity">x {{ product.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 無限滾動觸發點 -->
        <div 
          ref="loadMoreTrigger" 
          class="load-more-trigger"
          v-if="hasMore && !isLoading"
        >
          <span class="loading-text">滾動加載更多...</span>
        </div>

        <!-- 加載中提示 -->
        <div v-if="isLoading" class="loading-indicator">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>載入中...</span>
        </div>

        <!-- 沒有更多數據提示 -->
        <div v-if="!hasMore && PurchaseList.length > 0" class="no-more-data">
          已載入全部訂單
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-else-if="!isLoading" class="empty-state">
        <el-empty description="暫無訂單數據" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { ref, onMounted, nextTick, onUnmounted, computed } from 'vue'
  import { useTokenStore } from '@/store/index.js'
  import { goPurchaseList, goPickupOrder } from '@/api/token.js'
  import { Loading } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const route = useRoute()
  const selectedOrders = ref([])
  const token = useTokenStore()
  const config = ref()
  const PurchaseList = ref([])
  const router = useRouter()
  const oldButtonId = ref('')
  const status = ref(null)
  
  const buttons = ref([
    { id: 'UNCHECKED' , label: '未確認'},
    { id: 'Not_Ship', label: '未出貨' },
    { id: 'Shipping', label: '運輸中' },
    { id: 'Not_Paid', label: '未付款' },
    { id: 'ReadyForPickup', label: '待收貨' },
    { id: 'Complete', label: '已完成' },
  ]);

  const activeButton = ref('Not_Ship')
  const underlineStyle = ref({})
  
  // 無限滾動相關
  const scrollContainer = ref(null)
  const loadMoreTrigger = ref(null)
  const pageNum = ref(0)
  const pageSize = ref(10)
  const hasMore = ref(true)
  const isLoading = ref(false)
  let observer = null

  // 全選狀態
  const isAllSelected = computed({
    get: () => {
      if (PurchaseList.value.length === 0) return false
      return PurchaseList.value.every(order => selectedOrders.value.includes(order.id))
    },
    set: (value) => {
      if (value) {
        selectedOrders.value = PurchaseList.value.map(order => order.id)
      } else {
        selectedOrders.value = []
      }
    }
  })

  // 格式化價格
  const formatPrice = (price) => {
    if (!price) return '0'
    return Number(price).toLocaleString('zh-TW')
  }

  // 初始化配置
  onMounted(() => {
    config.value = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}`
      }
    }
    
    status.value = route.query.status?.trim()
    console.log(status.value);
    // 初始化第一個標籤
    if(status.value === 'UNCHECKED'){
      clickButton('UNCHECKED')
      console.log("是")
    }else{
      clickButton('Not_Ship')
    }
    
    // 設置無限滾動觀察器
    setupInfiniteScroll()
  })

  onUnmounted(() => {
    if (observer && loadMoreTrigger.value) {
      observer.unobserve(loadMoreTrigger.value)
    }
  })

  // 設置無限滾動
  const setupInfiniteScroll = () => {
    nextTick(() => {
      if (loadMoreTrigger.value) {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && hasMore.value && !isLoading.value) {
              loadMoreOrders()
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
  }

  // 載入訂單列表
  const loadOrders = async (buttonId, reset = true) => {
    if (isLoading.value) return
    
    isLoading.value = true
    
    try {
      if (reset) {
        pageNum.value = 0
        PurchaseList.value = []
        hasMore.value = true
        selectedOrders.value = []
      }

      // 構建請求參數（合併分頁參數到 config）
      const requestConfig = {
        headers: config.value.headers,
        params: {
          type: buttonId,
          pageNum: pageNum.value,
          pageSize: pageSize.value
        }
      }

      const data = await goPurchaseList(buttonId, { value: requestConfig })
      
      // 處理響應數據（根據實際後端響應結構調整）
      const orders = data.data || []
      
      if (reset) {
        PurchaseList.value = orders
      } else {
        PurchaseList.value = [...PurchaseList.value, ...orders]
      }

      // 判斷是否還有更多數據
      if (orders.length < pageSize.value) {
        hasMore.value = false
      } else {
        hasMore.value = true
        pageNum.value += 1
      }
    } catch (error) {
      console.error('載入訂單失敗:', error)
      ElMessage.error('載入訂單失敗，請稍後再試')
      hasMore.value = false
    } finally {
      isLoading.value = false
    }
  }

  // 載入更多訂單
  const loadMoreOrders = () => {
    if (!hasMore.value || isLoading.value) return
    loadOrders(oldButtonId.value, false)
  }

  // 切換標籤
  const clickButton = async (buttonId) => {
    console.log(buttonId)
    console.log(oldButtonId.value)
    if (oldButtonId.value !== buttonId) {
      oldButtonId.value = buttonId
      activeButton.value = buttonId
      moveUnderline(buttonId)


      await loadOrders(buttonId, true)
      
      // 重新設置無限滾動觀察器
      nextTick(() => {
        if (observer && loadMoreTrigger.value) {
          observer.unobserve(loadMoreTrigger.value)
        }
        setupInfiniteScroll()
      })
    }
  }

  // 移動下劃線指示器
  const moveUnderline = (buttonId) => {
    nextTick(() => {
      const buttonElement = document.querySelector(`.tab-button.active`)
      if (buttonElement) {
        const container = buttonElement.parentElement
        underlineStyle.value = {
          width: `${buttonElement.offsetWidth}px`,
          transform: `translateX(${buttonElement.offsetLeft}px)`
        }
      }
    })
  }

  // 切換單個訂單選擇
  const toggleOrder = (orderId) => {
    const index = selectedOrders.value.indexOf(orderId)
    if (index > -1) {
      selectedOrders.value.splice(index, 1)
    } else {
      selectedOrders.value.push(orderId)
    }
  }

  // 全選/取消全選
  const toggleSelectAll = () => {
    // computed setter 會自動處理
  }

  // 確認取貨
  const pickupOrder = async () => {
    if (selectedOrders.value.length === 0) {
      ElMessage.warning('請選擇要確認取貨的訂單')
      return
    }

    try {
      await ElMessageBox.confirm(
        `確定要確認 ${selectedOrders.value.length} 筆訂單已取貨嗎？`,
        '確認取貨',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      await goPickupOrder(selectedOrders.value, config)
      ElMessage.success('取貨確認成功')
      
      selectedOrders.value = []
      // 重新載入當前標籤的訂單
      await loadOrders(oldButtonId.value, true)
    } catch (error) {
      if (error !== 'cancel') {
        console.error('取貨確認失敗:', error)
        ElMessage.error('取貨確認失敗，請稍後再試')
      }
    }
  }
</script>
<style scoped>
.purchase-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  box-sizing: border-box;
}

/* 標籤容器 */
.tab-container {
  max-width: 1200px;
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
  display: flex;
  gap: 0;
  overflow-x: auto;
  justify-content: space-between;
  margin: 0 auto 20px; /* ⬅️ 關鍵 */
}

.tab-container::-webkit-scrollbar {
  height: 4px;
}

.tab-container::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 2px;
}

.tab-button {
  padding: 16px 24px;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  position: relative;
  white-space: nowrap;
  transition: color 0.3s ease;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.05);
}

.tab-button.active {
  color: #409eff;
  font-weight: 600;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: #409eff;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px 2px 0 0;
}

/* 訂單列表容器 */
.orders-container {
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
  min-height: 400px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.orders-container::-webkit-scrollbar {
  width: 8px;
}

.orders-container::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 4px;
}

.orders-container::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

/* 批量操作欄 */
.batch-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
}

.select-all-checkbox {
  font-size: 15px;
}

.pickup-button {
  min-width: 120px;
}

/* 訂單列表 */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 訂單卡片 */
.order-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #409eff;
}

.order-checkbox {
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
}

.order-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 訂單標題 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.order-id {
  font-size: 14px;
  color: #999;
  font-weight: 400;
}

.seller-name {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.order-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.total-label {
  font-size: 12px;
  color: #999;
}

.total-amount {
  font-size: 20px;
  color: #409eff;
  font-weight: 700;
}

/* 商品區域 */
.products-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-name {
  font-size: 15px;
  color: #333;
  font-weight: 500;
  flex: 1;
}

.product-details {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-price {
  font-size: 15px;
  color: #666;
  font-weight: 500;
}

.product-quantity {
  font-size: 14px;
  color: #999;
  padding: 4px 12px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

/* 加載相關 */
.load-more-trigger {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.loading-text {
  font-size: 14px;
  color: #999;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
  color: #999;
  font-size: 14px;
}

.no-more-data {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
}

/* 空狀態 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .purchase-container {
    padding: 12px;
  }

  .tab-container {
    padding: 0 12px;
  }

  .tab-button {
    padding: 12px 16px;
    font-size: 14px;
  }

  .orders-container {
    padding: 16px;
    max-height: calc(100vh - 180px);
  }

  .order-card {
    padding: 16px;
    flex-direction: column;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .order-total {
    align-items: flex-start;
  }

  .product-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .product-details {
    width: 100%;
    justify-content: space-between;
  }

  .batch-action-bar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .pickup-button {
    width: 100%;
  }
}
</style>