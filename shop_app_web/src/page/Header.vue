<template>
  <header>
        <div class="left-section">
          <a href="/buyer" target="_self">
            <img class="home-logo" src="@/assets/header.png" />
          </a>
        </div>
        <div class="middle-section">
          <input class="search-bar" type="search" v-model.lazy.trim="search" placeholder="輸入商品名稱">
        </div>
        <div class="right-section">
          <div>
            <a href="/set" target="_self">
              <img class="set" src="@/assets/setting.jpg">
            </a>
          </div>
          <div>
            <a href="/my_profile" target="_self">
              <img class="short_pic" src="@/assets/ghost.jpg">
            </a>
          </div>
        </div>
  </header>
</template>