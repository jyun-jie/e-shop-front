import axios from 'axios';

//請求位置 引用
/*const baseURL = 'http://localhost:8080';
const instance = axios.create({baseURL})*/
import request from '@/utils/request';
import buyer from '@/utils/buyer.js';

//重複的程式
export async function goVisitor(config){
  try {
    const data = await buyer.get('/visitor',config.value);
    console.log('Visitor Data:', data);
  } catch (error) {
    console.error('Error fetching visitor data:', error);
  }
}

export async function goSeller(config){
  return await request.get("/seller",config.value)

}

export async function goInsertPro(product,config){
  return await request.post("/seller/Pro",product,config.value)
}


