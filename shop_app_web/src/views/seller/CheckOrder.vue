<template>
  <div class="check-order-container">
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

    <div class="orders-container">
      <div v-if="salesOrder && salesOrder.length > 0" class="orders-list">
        <div 
          v-for="order in salesOrder" 
          :key="order.id" 
          class="order-card"
        >
          <div v-if="oldButtonId === 'Not_Ship'" class="order-checkbox">
            <el-checkbox 
              :model-value="selectedOrders.includes(order.id)"
              @change="toggleOrder(order.id)"
            />
          </div>

          <div class="order-content">
            <div class="order-header">
              <div class="order-info">
                <span class="order-id">訂單編號: {{ order.id }}</span>
                <span class="buyer-name">{{ order.postalName }}</span>
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

        <div v-if="oldButtonId === 'Not_Ship'" class="batch-action-bar">
          <el-button
            type="primary"
            :disabled="selectedOrders.length === 0"
            @click="shipSelectedOrders"
            size="large"
          >
            出貨所選訂單 ({{ selectedOrders.length }})
          </el-button>
        </div>
      </div>

      <div v-else class="empty-state">
        <el-empty description="暫無訂單數據" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, nextTick } from 'vue'
import { useTokenStore } from '@/store/index.js'
import { goCheckSalesOrder, goShipSelectedOrders } from '@/api/token.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const token = useTokenStore()
const config = ref()
const router = useRouter()
const salesOrder = ref([])

const oldButtonId = ref('Not_Ship')
const activeButton = ref('Not_Ship');
const underlineStyle = ref({});
const selectedOrders = ref([])

const buttons = ref([
  { id: 'Not_Ship', label: '未出貨' },
  { id: 'Shipping', label: '運輸中' },
  { id: 'Not_Paid', label: '未收款' },
  { id: 'ReadyForPickup', label: '待收貨' },
  { id: 'Complete', label: '已完成' },
]);

// 格式化價格
const formatPrice = (price) => {
  if (!price) return '0'
  return Number(price).toLocaleString('zh-TW')
}

onMounted(async () => {
  config.value = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.token}`
    }
  }

  const data = await goCheckSalesOrder("Not_Ship", config);
  salesOrder.value = data.data
  nextTick(() => {
    moveUnderline('Not_Ship');
  });
})

const clickButton = async function (buttonId) {
  if (oldButtonId.value !== buttonId) {
    oldButtonId.value = buttonId
    activeButton.value = buttonId
    moveUnderline(buttonId)
    selectedOrders.value = []
    const data = await goCheckSalesOrder(buttonId, config)
    salesOrder.value = data.data
  }
};

const moveUnderline = (buttonId) => {
  nextTick(() => {
    const buttonElement = document.querySelector(`.tab-button.active`)
    if (buttonElement) {
      underlineStyle.value = {
        width: `${buttonElement.offsetWidth}px`,
        transform: `translateX(${buttonElement.offsetLeft}px)`
      }
    }
  });
}

const toggleOrder = (orderId) => {
  const index = selectedOrders.value.indexOf(orderId)
  if (index > -1) {
    selectedOrders.value.splice(index, 1)
  } else {
    selectedOrders.value.push(orderId)
  }
}

const shipSelectedOrders = async () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('請選擇要出貨的訂單')
    return
  }

  try {
    await ElMessageBox.confirm(
      `確定要出貨 ${selectedOrders.value.length} 筆訂單嗎？`,
      '確認出貨',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await goShipSelectedOrders(selectedOrders.value, config)
    ElMessage.success('出貨成功')
    selectedOrders.value = []
    await clickButton('Not_Ship')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('出貨失敗:', error)
      ElMessage.error('出貨失敗，請稍後再試')
    }
  }
}
</script>

<style scoped>
.check-order-container {
  width: 100%;
  min-height: calc(100vh - 64px);
  background-color: #f5f5f5;
  padding: 20px;
}

.tab-container {
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
  display: flex;
  gap: 0;
  overflow-x: auto;
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

.orders-container {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
  min-height: 400px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
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

.buyer-name {
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

.batch-action-bar {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
}

@media (max-width: 768px) {
  .order-card {
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
}
</style>
