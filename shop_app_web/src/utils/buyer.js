//buyer攔截器
import axios from 'axios';
import instance from './request';

//定義要訪問的後端 url前綴  ,  baseURL
const baseURL = 'http://localhost:8080';
const buyer = axios.create({baseURL})

buyer.interceptors.response.use(
  //成功
  result =>{
    return result.data
  }
  //有錯誤
  ,err=>{
    console.log(err)
    return Promise.reject(err);
  }
)

export default buyer;