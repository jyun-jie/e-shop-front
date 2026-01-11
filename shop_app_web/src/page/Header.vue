<template>
  <header>
    <div class="left-section">
      <router-link to="/Read" class="logo-link">
        <img class="home-logo" src="@/assets/header.png" alt="首頁" />
      </router-link>
    </div>
    <div class="middle-section">
      <input 
        class="search-bar" 
        type="search" 
        v-model.lazy.trim="search" 
        placeholder="輸入商品名稱"
      />
    </div>
    <div class="right-section">
      <router-link :to="{name:'Cart'}" class="icon-link" title="購物車">
        <img class="set" src="@/assets/cart.jpg" alt="購物車" />
      </router-link>
      <router-link to="/Read/myPurchase" class="icon-link" title="我的訂單">
        <img class="short_pic" src="@/assets/ghost.jpg" alt="我的訂單" />
      </router-link>
      <router-link :to="{name:'Logout'}" class="icon-link" title="登出">
        <img class="set" src="@/assets/header.png" alt="登出" />
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
</script>

<style scoped>
.logo-link,
.icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

.logo-link:hover,
.icon-link:hover {
  opacity: 0.8;
}
</style>