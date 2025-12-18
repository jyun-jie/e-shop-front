// 存用戶狀態 token?
import { defineStore } from "pinia";
import { ref } from 'vue';

/*
  第1參數"名字
  2
  3
*/ 
export const useTokenStore = defineStore('token',()=>{
  // ref() 就是 state 屬性
  const token = ref('')
  //
  const getToken = (()=>{ return token.value })
  // computed() = getters
  const setToken = ((newToken) => token.value= newToken)
  // function = actions
  const removeToken = (()=> {
    token.value=''
  })

  return { token, getToken , setToken, removeToken }
},{
  persist:true //持久化儲存
}

);