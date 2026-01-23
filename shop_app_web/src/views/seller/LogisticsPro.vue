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
      <div v-if="logisticOrder && logisticOrder.length">
        <div v-for="order in logisticOrder" :key="order.id" class="list" >
          <!-- ✅ 訂單複選框 -->
          <label class="checkbox-row">
            <input
              type="checkbox"
              v-model="selectedOrders"
              :value="order.orderId"
            />
              <span >選擇訂單</span>
          </label>
          <label>賣家Id:</label>
          
            <!-- 訂單內容 -->
            <el-descriptions >
              <el-descriptions-item label="訂單編號">{{order.orderId}}</el-descriptions-item>
              <el-descriptions-item label="訂單狀態 :">{{order.logisticsStatus}}</el-descriptions-item>
              
            </el-descriptions>
        </div>

        <!-- ✅ 出貨按鈕 -->
        <div class="ship-btn-container">
          <el-button
            type="primary"
            :disabled="selectedOrders.length === 0"
            @click="PrintShippingLabel"
          >
            列印寄貨單
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
    import { goGetLogisticOrder, goPrintShippingLabel} from '@/api/token.js'
   


    const token = useTokenStore()
    const config = ref()
    const router = useRouter()
    const logisticOrder = ref([])

    const oldButtonId = ref('7-ELEVEN')
    const activeButton = ref('button1');
    const underlineStyle = ref({});
    const isfirstEntry = ref(true)
    const selectedOrders = ref([])
    

    const buttons = ref([
      { id: '1', label: '7-ELEVEN' },
      { id: '2', label: '全家' },
      { id: '3', label: '萊爾富' },
      { id: '4', label: 'OK mart' },
    ]);

    onMounted(async()=>{
        config.value={
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer `+token.token
            }
        }
        
        //有問題
        const data = await goGetLogisticOrder('1',config);
        logisticOrder.value = data.data
        console.log(logisticOrder.value);
    })

    const clickButton = async function (buttonId){
    console.log(buttonId)
    if(oldButtonId.value !== buttonId){
      isfirstEntry.value = false
      moveUnderline(buttonId)
      const data = await goGetLogisticOrder(buttonId,config)
      logisticOrder.value = data.data
      console.log(logisticOrder.value)
      oldButtonId.value = buttonId
      isfirstEntry.value = true
      }
    };

    // 初始化時移動下劃線
    nextTick(() => {
        moveUnderline('7-ELEVEN');
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

    const PrintShippingLabel = async () => {
        const PrintShippingLabelDto = {
            logisticsOrderIds : selectedOrders.value ,
            storeType : oldButtonId.value
        }
        console.log(PrintShippingLabelDto)
        await goPrintShippingLabel(PrintShippingLabelDto,config).then(res =>{
            const { actionUrl, formData } = res.data
            console.log(res.data)
            submitStoreMapForm(actionUrl, formData)
        })

    }

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