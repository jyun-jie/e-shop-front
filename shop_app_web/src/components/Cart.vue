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
        {{key}}
       <label>賣家Id:</label>
       {{seller.sellerId}}
    </input>
    <!-- @change.prevent="doProductAll(sellerCart.id)" -->
    <form v-for="product in seller.sellerCart" class="Cartproduct">
      <div class="product">
        <input type="checkbox" 
            :value="product.id" 
            class="checkbox" 
            @click="doProduct(product,seller)"  
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
</template>


<script setup>
  import { useRoute , useRouter} from 'vue-router';
  import { ref , onMounted, reactive ,watch} from 'vue'
  import {useTokenStore} from '@/store/index.js'
  import { goCart } from '@/api/token.js'
  import axios from 'axios'

  const token = useTokenStore()
  const config = ref()
  const Cart = ref([
    
  ]);


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
      //console.log(Cart.value)
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
    if(!SellerChecked.value.includes(seller.sellerId)){
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
    for(let i = 0 ; i<seller.sellerCart.length ; i++){
      newProductCheck.value.push(seller.sellerCart[i].id)
    }
    //兩個陣列相加
    ProductChecked.value =  [...ProductChecked.value,...newProductCheck.value]
  })

  //將sellerCart中所有product取消打勾
  const doProductAllFalse= ((seller)=>{
    for(let i = 0 ; i<seller.sellerCart.length ; i++){
        ProductCheckedfilter(seller.sellerCart[i])
    }
  })

  //刪除ProductChecked中有product.id
  const ProductCheckedfilter= ((product)=>{
    ProductChecked.value=  ProductChecked.value.filter(ProductChecked=>
      ProductChecked !== product.id
    )
  })

  //param(產品 , 購物車) 完成
  const doProduct = ((product,seller)=>{
    if(!ProductChecked.value.includes(product.id)){
      ProductChecked.value.push(product.id)
      //確認購物車產品是否全勾選 放入seller
      doProductAllChecked(seller)
      doSellerAllChecked()
    }else{
      ProductCheckedfilter(product)
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
      for(let i=0 ; i<seller.sellerCart.length ; i++){
        if(ProductChecked.value.includes(seller.sellerCart[i].id)){
            count++
        }
      }
      //如果 是 就seller就打勾
      if(seller.sellerCart.length === count){
        SellerChecked.value.push(seller.sellerId)
      }
  })


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
