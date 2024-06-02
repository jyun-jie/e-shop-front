//token攔截器

import axios from 'axios';

//定義要訪問的後端 url前綴  ,  baseURL
const baseURL = 'http://localhost:8080';
const instance = axios.create({baseURL})

//添加響應攔截器 本身就是異步處理 buyer除外
instance.interceptors.response.use(
    result=>{
            //200成功 直接回傳
            return result.data;  
    }//有錯誤訊息
    ,err =>{
        const res = err.response.status

        //401的話 token 未登入或過期
        if (res === 401) {
            alert("請登入使用者");
            window.location.href = "/login";
        }else{
            return Promise.reject(err);
        }
    }
)

export default instance;