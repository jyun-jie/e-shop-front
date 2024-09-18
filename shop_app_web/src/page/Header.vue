<template>
  <header>
        <div class="left-section">
          <a href="/Read" target="_self">
            <img class="home-logo" src="@/assets/header.png" />
          </a>
        </div>
        <div class="middle-section">
          <input class="search-bar" type="search" v-model.lazy.trim="search" placeholder="輸入商品名稱">
        </div>
        <div class="right-section">
          <div>
            <router-link :to="{name:'Cart'}">
              <img class="set" src="@/assets/cart.jpg">
            </router-link>
          </div>
          <div>
            <a href="/Read/myPurchase" target="_self">
              <img class="short_pic" src="@/assets/ghost.jpg">
            </a>
          </div>
          <div>
            <router-link :to="{name:'Logout'}">
              <img class="set" src="@/assets/cart.jpg">
            </router-link>
          </div>
        </div>
  </header>
</template>