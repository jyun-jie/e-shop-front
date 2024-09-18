<template>
  <div   class="labelname">
    <input type="checkbox" v-model="isAllChecked" @click="doAll()">
      <label>商品</label>
      <label>單價</label>
      <label>數量</label>
      <label>總計</label>
      <label>操作</label>
    </input>
  </div>
  <form v-for="seller in Cart" class="Cart"  >
    <input type="checkbox" 
      :value="seller.sellerId" 
      @click="doSellerAll(seller)"
      v-model="SellerChecked"
    >
       <label>賣家Id:</label>
       {{seller.sellerId}}
    </input>
    <!-- @change.prevent="doProductAll(cartProductList.id)" -->
    <form v-for="product in seller.cartProductList" class="Cartproduct">
      <div class="product">
        <input type="checkbox" 
            :value="product" 
            class="checkbox" 
            @click="doProduct(product,seller)"  
            :ckeck ="isChecked(product)"
            v-model="ProductChecked"
        >
          <label>{{product.name}}</label>
        </input>
        <el-form-item>
          {{product.price}} 
        </el-form-item>
        <el-form-item>
          <el-input-number v-model="product.quantity" />
        </el-form-item>
        <br>
      </div>
    </form>
  </form>
  <button @click="getsubmitCart">下訂單</button>
</template>


<script setup>
  import { useRoute , useRouter} from 'vue-router';
  import { ref , onMounted, reactive ,watch} from 'vue'
  import {useTokenStore} from '@/store/index.js'
  import { goCart } from '@/api/token.js'
  import { submitCart } from '@/api/token.js'
  import axios from 'axios'

  const token = useTokenStore()
  const config = ref()
  const Cart = ref([]);
  const router = useRouter()


  const isAllChecked = ref(false);
  const SellerChecked = ref([]);
  const ProductChecked = ref([]);


  onMounted(()=>{
    config.value={
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `+token.token
        }
      }

    const getgoCart = async function(){
      let data = await goCart(config)
      Cart.value = data.data
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
    const data = await submitCart(ProductChecked,config)
    router.push({path:'/checkOrder', query:{data: JSON.stringify(data.data)}})
  }


</script>

<style>
.Cart{
  padding:50px 100px ;
  width: 90%;
  border: 1px solid black;
  border-radius: 2px;
}
.Cartproduct{

  padding:10px;

}
.labelname{
  padding:50px 100px;
  width: 90%;
  border: 1px solid black;
  border-radius: 2px;
  display:grid;
  grid-template-columns: 4% 50% 11% 11.4% 11% 11%;
  
  
}

.product{
  display:grid;
  grid-template-columns: 4% 50% 8% 11% 14% 11%;
  border: 1px solid blue;
  border-radius: 2px;
  justify-content: left;
  align-items: center;

}
.checkbox{
  width:20px;
}

</style>
