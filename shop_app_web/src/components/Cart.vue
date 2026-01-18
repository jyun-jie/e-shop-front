<template>
  <div class="cart-container">
    <!-- 標題和全選 -->
    <div class="cart-header">
      <div class="header-content">
        <h2 class="cart-title">購物車</h2>
        <el-checkbox 
          v-model="isAllChecked" 
          @change="doAll"
          class="select-all-checkbox"
        >
          全選
        </el-checkbox>
      </div>
    </div>

    <!-- 購物車內容 -->
    <div v-if="Cart && Cart.length > 0" class="cart-content">
      <div v-for="seller in Cart" :key="seller.sellerId" class="seller-group">
        <!-- 賣家標題 -->
        <div class="seller-header">
          <el-checkbox 
            :model-value="SellerChecked.includes(seller.sellerId)"
            @change="() => doSellerAll(seller)"
            class="seller-checkbox"
          >
            <span class="seller-name">賣家: {{ seller.sellerId }}</span>
          </el-checkbox>
        </div>

        <!-- 商品列表 -->
        <div class="products-list">
          <div 
            v-for="product in seller.cartProductList" 
            :key="product.id" 
            class="product-card"
          >
            <el-checkbox 
              :model-value="isChecked(product)"
              @change="() => doProduct(product, seller)"
              class="product-checkbox"
            />
            
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-details">
                <span class="product-price">NT$ {{ formatPrice(product.price) }}</span>
                <el-input-number 
                  v-model="product.quantity" 
                  :min="1"
                  :max="999"
                  size="small"
                  class="quantity-input"
                />
                <span class="product-total">
                  小計: NT$ {{ formatPrice(product.price * product.quantity) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 結帳按鈕 -->
      <div class="checkout-section">
        <div class="checkout-info">
          <span class="selected-count">已選擇 {{ ProductChecked.length }} 項商品</span>
        </div>
        <el-button 
          type="primary" 
          size="large"
          :disabled="ProductChecked.length === 0"
          @click="getsubmitCart"
          class="checkout-button"
        >
          前往結帳
        </el-button>
      </div>
    </div>

    <!-- 空購物車 -->
    <div v-else class="empty-cart">
      <el-empty description="購物車是空的" />
      <router-link to="/Read">
        <el-button type="primary">去購物</el-button>
      </router-link>
    </div>
  </div>
</template>


<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { ref, onMounted, computed } from 'vue'
  import { useTokenStore } from '@/store/index.js'
  import { goCart } from '@/api/token.js'
  import { submitCart } from '@/api/token.js'

  const token = useTokenStore()
  const config = ref()
  const Cart = ref([]);
  const router = useRouter()

  const isAllChecked = ref(false);
  const SellerChecked = ref([]);
  const ProductChecked = ref([]);

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

    const getgoCart = async function() {
      try {
        let data = await goCart(config)
        Cart.value = data.data || []
      } catch (error) {
        console.error('載入購物車失敗:', error)
      }
    }
    getgoCart()
  })

  //將全部都變true or false
  const doAll = (()=>{
    //變 true
    if( !isAllChecked.value === true){
      ProductChecked.value = []
      SellerChecked.value = []
      //每個都去遍歷
      for(let i = 0 ; i<Cart.value.length ; i++){
        doSellerAll((Cart.value)[i])
      }
    }else{
      ProductChecked.value = []
      SellerChecked.value = []
    }
  })
  
  //seller為 某賣家購物車
  //product 為 某product

  //將該seller所有product 變 true or false
  const doSellerAll = ((seller)=>{
    const index = SellerChecked.value.findIndex(s => s===seller.sellerId);
    if(index === -1){
        SellerChecked.value.push(seller.sellerId)
        doProductAllTrue(seller)
        doSellerAllChecked()
        
    }else{
        doProductAllFalse(seller)
        SellerChecked.value =  SellerChecked.value.filter(
          SellerChecked=>SellerChecked !== seller.sellerId
        );
        isAllChecked.value=false
    }
    //console.log(ProductChecked.value)
  })

  //確認所有的sellerId 是不是都勾選 if yes return isAllChecked=true
  const doSellerAllChecked =(()=>{
    let count = 0;
    for(let i=0 ;i<Cart.value.length;i++){
      if(SellerChecked.value.includes((Cart.value)[i].sellerId)){
        count++
      }
    }
    if(Cart.value.length === count){
      isAllChecked.value =  true
    }
  })

  //將該seller的所有product打勾
  const doProductAllTrue= ((seller)=>{
    const newProductCheck = ref([])
    for(let i = 0 ; i<seller.cartProductList.length ; i++){
      newProductCheck.value.push(seller.cartProductList[i])
    }
    //兩個陣列相加
    ProductChecked.value =  [...ProductChecked.value,...newProductCheck.value]

  })

  //將cartProductList中所有product取消打勾
  const doProductAllFalse= ((seller)=>{
    for(let i = 0 ; i<seller.cartProductList.length ; i++){
        ProductCheckedfilter(seller.cartProductList[i])
    }
  })

  //刪除ProductChecked中有product.id
  const ProductCheckedfilter= ((product)=>{
    const index = ProductChecked.value.findIndex(p=>p.id===product.id)
    if(index>-1){
      ProductChecked.value.splice(index,1);
    }
  })

  //param(產品 , 購物車) 完成
  const doProduct = ((product,seller)=>{
    const index= ProductChecked.value.findIndex(p=>p.id===product.id)
    if(index===-1){
      ProductChecked.value.push(product)
      //確認購物車產品是否全勾選 放入seller
      doProductAllChecked(seller)
      doSellerAllChecked()
    }else{
      ProductChecked.value.splice(index,1);
      //seller.sellerId 移除
      SellerChecked.value= SellerChecked.value.filter(SellerChecked=>
        SellerChecked !== seller.sellerId
      )
      isAllChecked.value=false
    }
  })

  //確認product 是否全部都勾選 if yes , sellerChecked.push(seller.sellerId)
  const doProductAllChecked = ((seller)=>{
    let count = 0;
      //確認購物車產品是否全在ProductChecked
      for(let i=0 ; i<seller.cartProductList.length ; i++){
        if(ProductChecked.value.includes(seller.cartProductList[i])){
            count++
        }
      }
      //如果 是 就seller就打勾
      if(seller.cartProductList.length === count){
        SellerChecked.value.push(seller.sellerId)
      }
  })

  const isChecked =((product)=>{
    return ProductChecked.value.some(p=>p.id===product.id)
  })

  const getsubmitCart = async function(){
    //const data = await submitCart(ProductChecked,config)
    //router.push({path:'/checkOrder', query:{data: JSON.stringify(data.data)}})
    localStorage.setItem('CHECKOUT_CART', JSON.stringify(ProductChecked.value))
    router.push({path: '/checkOrder',
    //query:{ProductChecked : JSON.stringify(ProductChecked.value)}
    });
  }



</script>

<style scoped>
.cart-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.cart-header {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.select-all-checkbox {
  font-size: 15px;
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.seller-group {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.seller-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 16px;
}

.seller-checkbox {
  font-size: 16px;
  font-weight: 600;
}

.seller-name {
  color: #333;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.product-card:hover {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.product-checkbox {
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.product-details {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.product-price {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.quantity-input {
  width: 120px;
}

.product-total {
  font-size: 16px;
  color: #409eff;
  font-weight: 600;
  margin-left: auto;
}

.checkout-section {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  bottom: 20px;
}

.checkout-info {
  display: flex;
  align-items: center;
}

.selected-count {
  font-size: 16px;
  color: #666;
}

.checkout-button {
  min-width: 150px;
  height: 48px;
  font-size: 16px;
}

.empty-cart {
  background: #ffffff;
  border-radius: 8px;
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .cart-container {
    padding: 12px;
  }

  .product-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-details {
    width: 100%;
    justify-content: space-between;
  }

  .product-total {
    margin-left: 0;
  }

  .checkout-section {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .checkout-button {
    width: 100%;
  }
}
</style>
