<template>
  <el-aside>
    <el-row class="tac">
      <el-col>
        <el-menu
          class="el-menu-vertical-demo"
          :default-active="activeIndex"
          text-color="#666"
          active-text-color="#409eff"
          background-color="#ffffff"
        >
          <el-sub-menu index="1">
            <template #title>
              <span>賣家功能</span>
            </template>
            <el-menu-item-group title="賣家">
              <router-link to="/seller" class="sub-item">
                <el-menu-item index="1-1">賣家管理</el-menu-item>
              </router-link>
              <router-link to="/seller" class="sub-item">
                <el-menu-item index="1-2">促銷管理</el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-sub-menu>
          <el-menu-item index="2">
            <template #title>
              <span>優惠券</span>
            </template>
          </el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <span>買家功能</span>
            </template>
            <el-menu-item-group title="買家">
              <router-link to="/payment" class="sub-item">
                <el-menu-item index="3-1">交易查詢</el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeIndex = ref('1-1')
</script>

<style scoped>
.sub-item {
  text-decoration: none;
  color: inherit;
  display: block;
}

.sub-item :deep(.el-menu-item) {
  padding-left: 50px !important;
}

.sub-item :deep(.el-menu-item:hover) {
  background-color: #f0f7ff;
}

.sub-item :deep(.el-menu-item.is-active) {
  background-color: #e6f4ff;
  color: #409eff;
}
</style>