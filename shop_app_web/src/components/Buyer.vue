<template>
  <div class="common-layout">
    <el-container>
      <Header />
      <el-container>
        <Aside />
        <el-container>
          <el-main class="pro">Main</el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container> 
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted ,reactive,ref } from "vue";
import { useTokenStore } from '@/store/index.js'
import Header from '@/page/Header.vue'
import Aside from '@/page/Aside.vue'
import { goVisitor } from '@/api/token.js'
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

<style >
</style>