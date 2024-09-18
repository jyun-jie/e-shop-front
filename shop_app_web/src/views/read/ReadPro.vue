<template>
  <div class="div-container" ref="scrollContainer">
  <ul class="ul-container">
        <li v-for="pro in product" class="li-container" >
          <!--:to="name=網址 param = post傳值"-->
          <router-link :to="{name:'details',params:{id:pro.id}}" class="update-container">
            <div><img id="img" src="@/image/loading.svg" class="loading-container" alt="產品圖片" ></div>
            <div>
              {{pro.name}}
            </div>
              <div>{{pro.price}}</div>
              <div>{{pro.rate}}</div>
              <div>{{pro.address}}</div>
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
    let params ={
    pageNum:pageNum.value,
    pageSize:pageSize.value
  }
    let data = await goReadPro(params,config)
    pageNum.value = data.data.pageNum
    //展開各自的object 並相加再組成陣列
    product.value = [...product.value,...data.data.productList]
    console.log(pageNum.value)
  }

  const observer = new IntersectionObserver(
      (entries) => {
        //是否進到觀察畫面裡
        if (entries[0].isIntersecting) {
          getGoReadPro()
        }
      },
      { 
        //觀察的元素
        root:scrollContainer.value,
      }
    )


  onUnmounted(()=>{
    if (loadMoreTrigger.value) {

      observer.unobserve(loadMoreTrigger.value)
    }
  })
  




</script>

<style>
.div-container{
  left: 15%;
  top: 60px;
  right: 15%;
  bottom: 60px;
  overflow-y: overlay;

  width: 70%;
  height: 84%;

  border: double;

  position:fixed;
  
}

.ul-container{
  /*不要點點*/
  list-style:none;
  margin: 0px;
  padding: 0px;

  position:relative;
  display: grid;

  height: 94%;
  
  grid-template-columns: repeat(5, 1fr);
  
}
.li-container{
  border:double;
  border-color: blue;
  height: 96%;
  margin-top: 2px;
  display: flex;
  flex-direction: column;
  max-height: 240px;


  
  top: 0px;
  bottom: 23px;
  right: 0px;

}
.update-container{
  position: relative;
  top: 0px;
  height: 90%;
  display:grid;
  grid-template-rows: 6fr 1fr 1fr 1fr 1fr
}

.load-more-trigger {
  position: relative;
  height: 5%;
  text-align: center;
  line-height: 50px;
  color: gray;
  top: 50px;
  bottom: 0px; 
  width: 100%;
  
}

/*圖片加載*/
.loading-container{

  display: flex;
  flex-direction: column;
  width: 80px;

  /*rotate 自定義效果名稱
    3s 完成時間
    linear 全程速度相同: 還有ease ease-in ease-out ease-in-out
    infinite 設置播放次數為無限次
  */
  animation: rotate 3s linear infinite;
  
}
/* 創建動畫效果 rotate 
    rotate(*deg)表示旋轉度數 還有其他
*/
@keyframes rotate {
  0% {
    transform: rotate(0deg);
    /*從0度開始*/ 
  }
  100% {
    transform: rotate(360deg);
    /*360度結束* */
  }
}


</style>
