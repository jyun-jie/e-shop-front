<template>
  <div class="layout">
    <header class="header">
      <Header />
    </header>

    <div class="body">
      <aside class="aside">
        <Aside />
      </aside>

      <main class="main">
        <div v-if="$route.path === '/Read'"> 
        <ReadPro /> 
        </div> <!--變myPurchase--> 
        <div v-if="$route.path === '/Read/myPurchase'"> 
        <PurchasePro /> 
        </div>
        <router-view />
      </main>
    </div>

    <footer class="footer">
      <p>© 2024 E-Shop. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted ,reactive,ref } from "vue";
import { useTokenStore } from '@/store/index.js'
import Header from '@/page/Header.vue'
import Aside from '@/page/Aside.vue'
import { goVisitor } from '@/api/token.js'
import  ReadPro  from '@/views/read/ReadPro.vue'
import PurchasePro from "@/views/buyer/PurchasePro.vue"

  const hello = ref([])
  const token = useTokenStore()
  const config = ref()
  
  
  onMounted(()=>{
    if(token.token !== ''){
      config.value={
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `+token.token
        }
      }
    }
    //同步獲取返回結果
    const getGoVistor =async function(){
      let data = await goVisitor(config)
      hello.value=data
    }
    getGoVistor();

  })
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;
}

/* 中間區塊 */
.body {
  flex: 1;
  display: flex;
  min-height: 0; /* 🔥 */
}

/* Aside */
.aside {
  width: 12%;
  background: #ffffff;
  border-right: 1px solid #e9ecef;
  flex-shrink: 0;
}

/* Main（Grid 的爸爸） */
.main {
  flex: 1;
  min-width: 0;        /* 🔥 Grid 必須 */
  overflow-y: auto;
  background: #f5f5f5;
  padding: 64px 5px 15px 0px;
}

/* Footer */
.footer {
  height: 60px;
  background: #ffffff;
  border-top: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  flex-shrink: 0;
}
</style>