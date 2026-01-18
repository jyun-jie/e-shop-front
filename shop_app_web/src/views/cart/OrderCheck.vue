<template>
  <div   class="labelname">
      <h1>商品</h1>
      <label>單價</label>
      <label>數量</label>
      <label>總計</label>
      <label>操作</label>
    </input>
  </div>
  <div>
    <form v-for="cart in cartList" class="Cart">
      <label>賣家id:{{cart.sellerId}}</label>
      <div v-for="product in cart.cartProductList" class="product">
        <label>{{product.name}}</label>
        <label>{{product.quantity}}</label>
        <label>{{product.price}}</label>
        <label>{{product.quantity*product.price}}</label>
      </div>
      <div class="orderButton" >
        <label>{{cart.sellerId}}</label>
        <label class="total">此賣家購物車商品總計:{{cart.total}}</label>
      </div>
    </form>
    <p class="size">住址<input v-model="receiverAddress" class="address" placeholder="address" type="text"></input></p>
    <select v-model="payment_method" class="option">
      <option value="COD">貨到付款</option>
      <option value="CREDIT_CARD">信用卡</option>
    </select>
    <div class="store-map-box">
        <button
          class="store-btn"
          :disabled="loading"
          @click="openStoreMap"
        >
          {{ loading ? '開啟中...' : '選擇取貨門市' }}
        </button>

        <div v-if="selectedStore" class="store-info">
          <p><strong>門市名稱：</strong>{{ selectedStore.name }}</p>
          <p><strong>門市地址：</strong>{{ selectedStore.address }}</p>
        </div>
      </div>

  </div>
  <div class="orderButton ">
    <button  class="size" @click="order()">下單去</button>
  </div>
</template>

<script setup>
  import { useRoute , useRouter} from 'vue-router';
  import { ref , onMounted, reactive} from 'vue'
  import {useTokenStore} from '@/store/index.js'
  import { goOrder , goToPay ,goQueryStoreMap ,submitCart ,goGetStoreResult} from '@/api/token.js'
  import axios from 'axios'

  const token = useTokenStore()
  const router = useRouter()
  const route = useRoute()
  const data = ref();
  const ProductChecked = ref();
  const config = ref()
  const cartList = ref([])
  const payment_method = ref('');
  const receiverAddress = ref('');

  const loading = ref(false)
  const orderNo = 'ORDER_20260115_001'
  const lgsType = 'C2C'     // C2C / B2C
  const shipType = '3'      // 1=7-11, 2=全家, 3=萊爾富, 4=OK
  const selectedStore = ref(null)


  onMounted(async()=>{
    config.value={
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `+token.token
        }
      }
    const orderNo = route.query.orderNo
    console.log(orderNo)

    ProductChecked.value = JSON.parse(localStorage.getItem('CHECKOUT_CART'));
    console.log(ProductChecked.value)
    data.value = await submitCart(ProductChecked.value,config)
    cartList.value = data.value.data

    if(orderNo !== null || orderNo !== undefined){
      await loadStoreFromBackend(orderNo)
    }
  })


  const order = async () => {
    try {
      if (!selectedStore.value) {
        alert('請先選擇取貨門市')
        return
      }
      console.log(payment_method.value);
      console.log(receiverAddress.value)

      const dataToSend = {
        cartList: cartList.value,
        payment_method: payment_method.value,
        receiverAddress: receiverAddress.value,
        storeId: selectedStore.value.id,
        storeName: selectedStore.value.name,
        storeAddress: selectedStore.value.address
      }
      const orderRes = await goOrder(dataToSend, config)
      console.log(orderRes.data)

      if (orderRes.code === 1) {
        alert(orderRes.message)
        return
      }

      const payRes = await goToPay(orderRes.data, config)

      document.open()
      document.write(payRes)
      document.close()

      goCreateLogistics(config);


    } catch (err) {
      console.error(err)
      alert("付款發生錯誤")
    }
  }


  const openStoreMap = async () => {
  loading.value = true

  try {
    goQueryStoreMap({orderNo,lgsType,shipType},config).then(res =>{
      const { actionUrl, formData } = res.data
      console.log(res.data)
      submitStoreMapForm(actionUrl, formData)
    })

  } catch (err) {
    alert('開啟門市地圖失敗')
    console.error(err)
  } finally {
    loading.value = false
  }
}

/**
 * 動態建立 form → POST 到藍新
 */
  const submitStoreMapForm =async (actionUrl, formData) => {
    try {
      console.log(actionUrl)
      console.log(formData) 
      // 開啟新視窗
      //const popup = window.open('', 'newebpay', 'width=1000,height=800');
      
      // 建立表單
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = actionUrl;
      
      // 加入表單欄位
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      
      console.log(form)
      // 提交表單
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);


    } catch (error) {
      console.error('開啟門市地圖失敗:', error);
    }
  }
  const loadStoreFromBackend = async (orderNo) => {
    try {

      const res = await goGetStoreResult( orderNo ,config) ; 
      console.log(res)
      

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
      // 第一次進來沒選門市是正常的
      console.log('尚未選擇門市')
    }
  }



</script>

<style>
.Cart{
  padding:50px 100px ;
  width: 90%;
  border: 1px solid black;
  border-radius: 2px;
}
.labelname{
  padding:50px 100px;
  width: 90%;
  border: 1px solid black;
  border-radius: 2px;
  display:grid;
  grid-template-columns: 47% 11% 11.4% 11% 11%;
  align-items: center;
  font-size:30px
  
}
.product{
  display:grid;
  grid-template-columns: 47% 8% 11% 14% 11%;
  border: 1px solid blue;
  border-radius: 2px;
  justify-content: left;
  align-items: center;
  
  margin-bottom: 50px;
  font-size:30px

}
.total{
  text-align:right;
}
.orderButton{
  display: flex;
  justify-content: flex-end;
   align-items: center;
}
.size{
  font-size: 50px;
}
.address{
  width:400px;
  height: 60px;
  font-size:40px;
}
.option{
  width:200px;
  height: 60px;
  font-size:40px;
}
</style>>