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
          <p class="size">住址<input v-model="cart.receiverAddress" class="address" placeholder="address" type="text"></input></p>
          <select v-model="cart.payment_method" class="option">
            <option value="0">貨到付款</option>
            <option value="1">信用卡</option>
          </select>
          <label class="total">此賣家購物車商品總計:{{cart.total}}</label>
      </div>
    </form>
  </div>
  <div class="orderButton ">
    <button  class="size" @click="order()">下單去</button>
  </div>
</template>

<script setup>
  import { useRoute , useRouter} from 'vue-router';
  import { ref , onMounted, reactive} from 'vue'
  import {useTokenStore} from '@/store/index.js'
  import { goOrder } from '@/api/token.js'
  import axios from 'axios'

  const token = useTokenStore()
  const router = useRouter()
  const route = useRoute()
  const data = route.query.data;
  const config = ref()
  const cartList = ref([])

  onMounted(()=>{
    config.value={
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `+token.token
        }
      }

    cartList.value = JSON.parse(data)
  })

  const order =(()=>{
    goOrder(cartList , config).then(orderId=>{
      if(orderId.code === 1){
        alert(orderId.message);
      }
    
    })
    router.push("/Read")
  })


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