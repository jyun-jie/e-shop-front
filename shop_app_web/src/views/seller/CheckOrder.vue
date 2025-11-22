<template>
    <div class="all">
        <div class="buttons">
            <button 
            v-for="button in buttons" 
            :key="button.id" 
            @click=" clickButton(button.id)"
            :class="{ active: activeButton === button.id }"
            >
            {{ button.label }}
            </button>
        </div>
        <div class="split"></div>
        <div class="underline" :style="underlineStyle"></div>
    

    <div v-if="isfirstEntry == true" >
      <div v-if="salesOrder && salesOrder.length">
        <div v-for="order in salesOrder" :key="order.id" class="list" >
          <!-- ✅ 訂單複選框 -->
          <label class="checkbox-row">
            <input
              type="checkbox"
              v-model="selectedOrders"
              :value="order.id"
            />
              <span v-if="oldButtonId === 'Not_Ship'">選擇訂單</span>
              <span v-else-if="oldButtonId === 'Shipping'">選擇已送出產品</span>
              <span v-else-if="oldButtonId === 'Shipping'">選擇已送出產品</span>
          </label>
          <label>賣家Id:</label>
          
            <!-- 訂單內容 -->
            <el-descriptions >
              <el-descriptions-item label="訂單編號">{{order.id}}</el-descriptions-item>
              <el-descriptions-item label="賣家名稱 :">{{order.postalName}}</el-descriptions-item>
              <el-descriptions-item label="總花費 :">{{order.total}}</el-descriptions-item>
              <div v-for="product in order.orderProductList" :key="product.product_Id" class="productList">
                <el-descriptions-item label="產品名稱 :">{{product.productName}}</el-descriptions-item>
                <el-descriptions-item label="價格 :">{{product.price}}</el-descriptions-item>
                <el-descriptions-item label="數量 :">{{product.quantity}}</el-descriptions-item>
              </div>
            </el-descriptions>
        </div>

        <!-- ✅ 出貨按鈕 -->
        <div class="ship-btn-container">
          <el-button
            type="primary"
            :disabled="selectedOrders.length === 0"
            @click="shipSelectedOrders"
          >
            出貨所選訂單
          </el-button>
        </div>
    </div>
    </div>
    </div>
</template>

<script setup>
    import { useRoute , useRouter} from 'vue-router';
    import { ref , onMounted, reactive ,nextTick , watch, watchEffect} from 'vue'
    import {useTokenStore} from '@/store/index.js'
    import { goCheckSalesOrder  , goShipSelectedOrders} from '@/api/token.js'
   


    const token = useTokenStore()
    const config = ref()
    const router = useRouter()
    const salesOrder = ref([])

    const oldButtonId = ref('Not_Ship')
    const activeButton = ref('button1');
    const underlineStyle = ref({});
    const isfirstEntry = ref(true)
    const selectedOrders = ref([])
    const PurchaseList = ref([])
    

    const buttons = ref([
      { id: 'Not_Ship', label: '未出貨' },
      { id: 'Shipping', label: '運輸中' },
      { id: 'Not_Paid', label: '未收款' },
      { id: 'To_Receive', label: '已出貨' },
      { id: 'Complete', label: '已完成' },
    ]);

    onMounted(async()=>{
        config.value={
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer `+token.token
            }
        }
        
        //有問題
        const data = await goCheckSalesOrder("Not_Ship",config);
        salesOrder.value = data.data
        console.log(salesOrder.value);
    })

    const clickButton = async function (buttonId){
    console.log(buttonId)
    if(oldButtonId.value !== buttonId){
      isfirstEntry.value = false
      moveUnderline(buttonId)
      const data = await goCheckSalesOrder(buttonId,config)
      PurchaseList.value = data.data
      oldButtonId.value = buttonId
      isfirstEntry.value = true
      }
    };

    // 初始化時移動下劃線
    nextTick(() => {
        moveUnderline('Not_Ship');
    });

    const moveUnderline = (buttonId) => {
      activeButton.value = buttonId;
      console.log(activeButton.value)
      nextTick(() => {
        const buttonElement = document.querySelector(`button.active`);

        if (buttonElement) {
          underlineStyle.value = {
            width: `${buttonElement.offsetWidth}px`,
            transform: `translateX(${buttonElement.offsetLeft-50}px)`
          };
        }
      });
    };


    const shipSelectedOrders = () => {

      // 可改成 axios/後端 API
      // axios.post('/ship', selectedOrders.value)
      const data = goShipSelectedOrders(selectedOrders.value,config)
      // 出貨後清空選擇
      
      console.log("出貨訂單 ID:", selectedOrders.value)
      selectedOrders.value = []
    }
</script>

<style >
.all{
    width: 100%;
    display: block;   /* 強制變成直向排列 */
}
.list{
  margin-top:50px;
  margin-left:30px;
  
}
/*.button-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}*/

.buttons {
  display: flex;
  
}

button {
  padding: 50px 0px;
  /*變指標 */
  cursor: pointer;
  background-color: transparent;
  /*border 和 outline 很相似，
  outline 不占空間，在元素周圍繪畫。
  outline 通常是矩形，但也可以是非矩形的。*/
  border: none;
  outline: none;
  font-size: 40px;
  position: relative;
  width : 200px;
  left: 30px;

  /*border-bottom: 10px solid gray;*/
}

button.active {
  color: #4374cf;
}
.split{
  position: relative;
  width: 105%;
  height: 10px;
  /*最後是透明度 */
  background-color: rgba(128, 128, 128, 0.3);
  top: -5px;
  border-radius: 30px;
}

.underline  {
  position: relative;
  width: 200px;
  left: 30px;
  height: 2px;
  background-color: #409eff;
  transition: transform 0.3s ease, width 0.3s ease;
  top: -10px;

}

button:hover{
  background-color: rgba(211, 192, 192, 0.856);
  border-radius: 5px;
}

.sentOrder{
  all: initial;
  font-size: 20px; 
  width: 40px;
  height: 40px;
  float: right;
  background: rgb(221, 131, 14);
}

.order-card {
  background: #fff;
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 10px;
  width: 360px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.checkbox-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 6px;
  font-size: 18px;
}

.product-list {
  margin-left: 20px;
}

.ship-btn-container {
  margin-top: 20px;
}

</style>