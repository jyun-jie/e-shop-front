<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="home-image-container">
          <el-link href="/buyer" target="_self"><img src="@/assets/header.png" /></el-link>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
        <el-row class="tac">
          <el-col>
            <h5 class="mb-2">功能</h5>
            <el-menu
              class="el-menu-vertical-demo"
              text-color="pink"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-sub-menu index="1" >
                  <template #title>
                    <span>賣家功能</span>
                  </template>
                  <el-menu-item-group title="賣家" >
                    
                      <el-link href="/seller" target="_self">
                      <el-menu-item index="1-1">賣家管理</el-menu-item>
                      </el-link>

                      <el-link href="/coupon" target="_self">
                      <el-menu-item index="1-2">促銷管理</el-menu-item>
                      </el-link>
                  </el-menu-item-group>
              </el-sub-menu>
              <el-menu-item index="2">
                <template #title>
                  <span>優惠券</span>
                </template>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
        </el-aside>

        <el-container>
          <el-main>Main</el-main>
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
  const hello = ref()
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
    console.log()
    axios.get("http://localhost:8080/visitor",config.value).then((response)=>{
      console.log(response.data);
      hello.value = response.data
      console.log("hello1")
    }).catch((error)=>{
      console.log(error);
    }) 
  })
</script>

<style>
.el-header {
  margin-right: 8px;
  border-style: double;
  background-color: orange;
}
.el-aside{
 background-color: plum;
}
.el-main{
  background-color: greenyellow;
}
.el-footer{
  background-color: navy;
}
.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
  width:100px;
  height: 100px;
}
.home-image-container img{
  width:200px;
  height: 50px;
  border: 1px solid #000;
}
.home-coupon-container .el-link{
  border: 1px solid #000;;
}


</style>