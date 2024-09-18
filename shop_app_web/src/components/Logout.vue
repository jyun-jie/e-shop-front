<template>
  <button @click="logout()">登出</button>
  <button @click="cancel">取消登出</button>
</template>

<script setup>
import axios from 'axios';
import {useRouter} from 'vue-router'
import { useTokenStore } from '@/store/index.js'

  const router = useRouter()
  const tokenStore = useTokenStore();

  const logout = (()=>{
    tokenStore.removeToken()
    router.push("/login")
  })

  const cancel= (()=>{
    router.push("/Read")
  })
</script>