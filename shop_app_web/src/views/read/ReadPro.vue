<template>
  <div class="div-container" ref="scrollContainer">
  <ul class="ul-container">
        <li v-for="pro in product" class="li-container" >
          <!--:to="name=網址 param = post傳值"-->
          <router-link :to="{name:'details',params:{id:pro.id}}" class="update-container">
            <div>
              <img id="img" v-if="pro.imageUrl === null || pro.imageUrl==='' " src="@/image/loading.svg" class="loading-container" alt="產品圖片" >
              <img id="img" v-else :src="pro.imageUrl" class="product-container" >
            </div>
            <div>
              {{pro.name}}
            </div>
              <div>價格:{{pro.price}}</div>
              <div>數量:{{pro.quantity}}</div>
              <div>評分:{{pro.rate}}</div>
              <div>位址:{{pro.address}}</div>
          </router-link>
        </li>
  </ul>
  <div ref="loadMoreTrigger" class="load-more-trigger" ></div>
  </div>
</template>


<script setup>
import axios from 'axios'
import {useRouter} from 'vue-router'
import {onMounted , reactive,ref , onUnmounted} from 'vue'
import {useTokenStore} from '@/store/index.js'
import {goReadPro } from '@/api/token.js'

  const router = useRouter()
  const product = ref([])
  const config = ref()
  const token = useTokenStore()
  const isLoading = ref(false) // 1. 增加加載鎖
  const isFinished = ref(false) // 增加是否全部加載完的判斷
  
  
  const scrollContainer = ref(null)
  //分頁加載
  const pageNum = ref(0)//當前頁
  const pageSize = ref(15) //加載條數
  const loadMoreTrigger = ref(null)

  onMounted(()=>{

    getGoReadPro()

    //當Trigger 進入畫面就觸發加載 
    //並觀察trigger 變化
    if (loadMoreTrigger.value) {
      observer.observe(loadMoreTrigger.value)
    }
    
  })

  config.value={
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer `+token.token
    }
  }
    
  const getGoReadPro =async function(){
    if (isLoading.value || isFinished.value) return // 如果正在加載或已結束，則跳出

    isLoading.value = true

    let params ={
      pageNum:pageNum.value,
      pageSize:pageSize.value
    }
    try {
      let data = await goReadPro(params, config)
      console.log(data.data)
      const newList = data.data.productList
    
      if (newList && newList.length > 0) {
        pageNum.value = data.data.pageNum
        product.value = [...product.value, ...newList]
      } else {
        isFinished.value = true // 沒數據了，停止觀察
      }
    } catch (error) {
      console.error("加載失敗", error)
    } finally {
      isLoading.value = false // 3. 請求結束後解鎖
    }
  }

  const observer = new IntersectionObserver(
      (entries) => {
        //是否進到觀察畫面裡
        if (entries[0].isIntersecting && !isLoading.value) {
          getGoReadPro()
        }
      },
      { 
        //觀察的元素
        root:scrollContainer.value, threshold: 0.1 
      }
    )


  onUnmounted(()=>{
    if (loadMoreTrigger.value) {

      observer.unobserve(loadMoreTrigger.value)
    }
  })
  




</script>

<style scoped>
.div-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.div-container::-webkit-scrollbar {
  width: 8px;
}

.div-container::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 4px;
}

.div-container::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

.ul-container {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding-bottom: 40px;
}

.li-container {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 320px;
}

.li-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #409eff;
}

.update-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
  padding: 16px;
}

.update-container > div:first-child {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 12px;
  overflow: hidden;
}

.update-container > div:not(:first-child) {
  padding: 4px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.update-container > div:nth-child(2) {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.update-container > div:nth-child(3) {
  color: #409eff;
  font-size: 18px;
  font-weight: 700;
}

.update-container > div:nth-child(4),
.update-container > div:nth-child(5),
.update-container > div:nth-child(6) {
  color: #666;
  font-size: 13px;
}

.load-more-trigger {
  height: 60px;
  text-align: center;
  line-height: 60px;
  color: #999;
  font-size: 14px;
  width: 100%;
  grid-column: 1 / -1;
}

/* 圖片加載 */
.loading-container {
  width: 60px;
  height: 60px;
  animation: rotate 2s linear infinite;
}

.product-container {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 創建動畫效果 rotate */
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 響應式設計 */
@media (max-width: 1200px) {
  .ul-container {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .ul-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .li-container {
    min-height: 280px;
  }
  
  .update-container > div:first-child {
    height: 150px;
  }
}
</style>
