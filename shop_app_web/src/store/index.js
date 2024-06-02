// 存用戶狀態 token?
import { defineStore } from "pinia";
import { ref } from 'vue';

/*
  第1參數"名字
  2
  3
*/ 
export const useTokenStore = defineStore('token',()=>{
  // 1.ref() 就是 state 屬性
  const token = ref('')
  // 2.computed() = getters
  const setToken = ((newToken) => token.value= newToken)
  // 3. function = actions
  const removeToken = (()=> {
    token.value=''
  })

  return { token, setToken, removeToken }
},{
  persist:true //持久化儲存
}

);