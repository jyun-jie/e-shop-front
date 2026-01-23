<template>
  <div class="order-check-container">
    <div class="order-header">
      <h2 class="order-title">訂單確認</h2>
    </div>

    <!-- 商品列表 -->
    <div class="cart-summary">
      <div class="summary-header">
        <h3>商品資訊</h3>
      </div>
      
      <div v-for="cart in cartList" :key="cart.sellerId" class="seller-group">
        <div class="seller-header">
          <span class="seller-label">賣家 ID: {{ cart.sellerId }}</span>
        </div>
        
        <div class="products-list">
          <div 
            v-for="product in cart.cartProductList" 
            :key="product.id" 
            class="product-item"
          >
            <div class="product-name">{{ product.name }}</div>
            <div class="product-details">
              <span class="product-quantity">數量: {{ product.quantity }}</span>
              <span class="product-price">單價: NT$ {{ formatPrice(product.price) }}</span>
              <span class="product-total">小計: NT$ {{ formatPrice(product.quantity * product.price) }}</span>
            </div>
          </div>
        </div>
        
        <div class="seller-total">
          <span class="total-label">此賣家商品總計: NT$ {{ formatPrice(cart.total) }}</span>
        </div>
      </div>
    </div>

    <!-- 配送資訊 -->
    <div class="shipping-section">
      <h3 class="section-title">配送資訊</h3>
      
      <el-form class="shipping-form" label-width="120px">
        <el-form-item label="收件地址">
          <el-input 
            v-model="receiverAddress" 
            placeholder="請輸入收件地址"
            size="large"
          />
        </el-form-item>

        <el-form-item label="付款方式">
          <el-select v-model="payment_method" size="large" class="payment-select">
            <el-option label="貨到付款" value="COD" />
            <el-option label="信用卡" value="CREDIT_CARD" />
          </el-select>
        </el-form-item>

        <el-form-item label="超商選擇">
          <el-select v-model="shipType" size="large" class="store-select">
            <el-option label="7-11" value="1" />
            <el-option label="全家" value="2" />
            <el-option label="萊爾富" value="3" />
            <el-option label="OK" value="4" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :disabled="loading"
            @click="openStoreMap"
            size="large"
            class="store-btn"
          >
            {{ loading ? '開啟中...' : '選擇取貨門市' }}
          </el-button>
        </el-form-item>

        <div v-if="selectedStore" class="store-info-card">
          <h4 class="store-title">已選擇門市</h4>
          <div class="store-details">
            <p><strong>門市名稱：</strong>{{ selectedStore.name }}</p>
            <p><strong>門市地址：</strong>{{ selectedStore.address }}</p>
          </div>
          
          <el-form-item label="聯絡電話">
            <el-input 
              v-model="receiverPhone" 
              placeholder="請輸入聯絡電話"
              size="large"
            />
          </el-form-item>
          
          <el-form-item label="電子郵件">
            <el-input 
              v-model="getReceiverEmail" 
              placeholder="請輸入電子郵件"
              size="large"
              type="email"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 提交按鈕 -->
    <div class="submit-section">
      <el-button 
        type="primary" 
        @click="order"
        size="large"
        :disabled="!canSubmit"
        class="submit-button"
      >
        確認下單
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue'
import { useTokenStore } from '@/store/index.js'
import { goOrder, goToPay, goQueryStoreMap, submitCart, goGetStoreResult } from '@/api/token.js'
import { ElMessage } from 'element-plus'

const token = useTokenStore()
const router = useRouter()
const route = useRoute()
const data = ref();
const ProductChecked = ref();
const config = ref()
const cartList = ref([])
const payment_method = ref('COD');
const receiverAddress = ref('');
const receiverPhone = ref('');
const getReceiverEmail = ref('');
const loading = ref(false)

const orderNo = 'ORDER_20260115_001'
const lgsType = 'C2C'
const shipType = ref('1')
const selectedStore = ref(null)

// 格式化價格
const formatPrice = (price) => {
  if (!price) return '0'
  return Number(price).toLocaleString('zh-TW')
}

// 是否可以提交
const canSubmit = computed(() => {
  return selectedStore.value && 
         getReceiverEmail.value !== '' && 
         receiverPhone.value !== '' &&
         receiverAddress.value !== ''
})

onMounted(async () => {
  config.value = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.token}`
    }
  }
  
  const orderNo = route.query.orderNo
  console.log(orderNo)

  ProductChecked.value = JSON.parse(localStorage.getItem('CHECKOUT_CART'));
  console.log(ProductChecked.value)
  data.value = await submitCart(ProductChecked.value, config)
  cartList.value = data.value.data

  if (orderNo !== null && orderNo !== undefined) {
    await loadStoreFromBackend(orderNo)
  }
})

const order = async () => {
  try {
    if (!selectedStore.value || getReceiverEmail.value === '' || receiverPhone.value === '') {
      ElMessage.warning('請先選擇取貨門市並填寫完整資訊')
      return
    }

    const dataToSend = {
      cartList: cartList.value,
      payment_method: payment_method.value,
      receiverPhone: receiverPhone.value,
      receiverEmail: getReceiverEmail.value,
      receiverAddress: receiverAddress.value,
      pickupStoreId: selectedStore.value.id,
      pickupStoreName: selectedStore.value.name,
      pickupStoreAddress: selectedStore.value.address,
      pickupStoreType: selectedStore.value.type,
      deliveryType: selectedStore.value.lgsType
    }

    const orderRes = await goOrder(dataToSend, config)
    console.log(orderRes)

    if (orderRes.code === 1) {
      ElMessage.error(orderRes.message)
      return
    }

    const payRes = await goToPay(orderRes.data, config)

    document.open()
    document.write(payRes)
    document.close()

  } catch (err) {
    console.error(err)
    ElMessage.error("付款發生錯誤")
  }
}

const openStoreMap = async () => {
  loading.value = true
  try {
    goQueryStoreMap({ orderNo, lgsType, shipType: shipType.value }, config).then(res => {
      const { actionUrl, formData } = res.data
      console.log(res.data)
      submitStoreMapForm(actionUrl, formData)
    })
  } catch (err) {
    ElMessage.error('開啟門市地圖失敗')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const submitStoreMapForm = async (actionUrl, formData) => {
  try {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = actionUrl;

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  } catch (error) {
    console.error('開啟門市地圖失敗:', error);
  }
}

const loadStoreFromBackend = async (orderNo) => {
  try {
    const res = await goGetStoreResult(orderNo, config);

    if (!res.data) return

    selectedStore.value = {
      id: res.data.storeId,
      name: res.data.storeName,
      address: res.data.storeAddress,
      type: res.data.storeType,
      lgsType: res.data.lgsType
    }

    console.log('已選門市', selectedStore.value)
  } catch (e) {
    console.log('尚未選擇門市')
  }
}
</script>

<style scoped>
.order-check-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.order-header {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.order-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.cart-summary {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.summary-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
}

.summary-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.seller-group {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.seller-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.seller-header {
  margin-bottom: 16px;
}

.seller-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.product-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.product-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.product-details {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.product-quantity,
.product-price {
  font-size: 14px;
  color: #666;
}

.product-total {
  font-size: 16px;
  color: #409eff;
  font-weight: 600;
  margin-left: auto;
}

.seller-total {
  text-align: right;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
}

.total-label {
  font-size: 18px;
  font-weight: 700;
  color: #409eff;
}

.shipping-section {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;
}

.shipping-form {
  width: 100%;
}

.payment-select,
.store-select {
  width: 100%;
}

.store-btn {
  width: 100%;
  height: 48px;
}

.store-info-card {
  margin-top: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.store-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.store-details {
  margin-bottom: 20px;
}

.store-details p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}

.submit-section {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  bottom: 20px;
}

.submit-button {
  width: 100%;
  height: 56px;
  font-size: 18px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .order-check-container {
    padding: 12px;
  }

  .product-details {
    flex-direction: column;
    gap: 8px;
  }

  .product-total {
    margin-left: 0;
  }
}
</style>
