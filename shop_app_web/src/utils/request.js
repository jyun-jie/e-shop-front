//token攔截器

import axios from 'axios';

//定義要訪問的後端 url前綴  ,  baseURL
const baseURL = 'http://localhost:8080';
const instance = axios.create({baseURL})


const WHITE_LIST = [
  "/Api/Payment/newebpay",
  "/Api/Payment/notify"
]

//添加響應攔截器 本身就是異步處理 buyer除外
instance.interceptors.response.use(
  (response) => {
    // 正常回傳後端 data
    return response.data;
  },
  (error) => {
    // 如果連 response 都沒有（網路錯誤）
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const requestUrl = error.config?.url || "";

    // 判斷是否在白名單
    const isWhiteList = WHITE_LIST.some(url =>
      requestUrl.includes(url)
    );

    // 非白名單才導去登入頁
    if (status === 401 && !isWhiteList) {
      alert("你沒有權限執行此操作 請登入有該權限使用者");
      //window.location.href = "/login";
      return;
    }

    if (status === 403 && !isWhiteList) {
      alert("你沒有權限執行此操作");
      return;
    }

    // 白名單 or 其他錯誤，原樣丟回去
    return Promise.reject(error);
  }
);
export default instance;