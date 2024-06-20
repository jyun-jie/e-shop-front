import axios from 'axios';

//請求位置 引用
/*const baseURL = 'http://localhost:8080';
const instance = axios.create({baseURL})*/
import request from '@/utils/request';
import buyer from '@/utils/buyer.js';

//重複的程式
export async function goVisitor(config){
  try {
    const data = await buyer.get('/Read',config.value);
    console.log('Visitor Data:', data);
  } catch (error) {
    console.error('Error fetching visitor data:', error);
  }
}

export async function goReadPro(params,config){
  //需要用{params,config } 就可包含url參數與請求頭
  /*try {
    const data = await buyer.get('/buyer/unAuth/Pro',{params:params,...config.value});
    console.log('Visitor Data:', data);
  } catch (error) {
    console.error('Error fetching visitor data:', error);
  }*/
  return await request.get("/Read/unAuth/Pro",{params:params,...config.value})
}

export async function goReadDetailPro(proid,config){
  return await request.get("/Read/unAuth/Pro/"+proid,config.value)
}


export async function goSeller(config){
  return await request.get("/seller",config.value)

}

export async function goInsertPro(product,config){
  return await request.post("/seller/Pro",product,config.value)
}

export async function goSellerPro(params,config){
  //需要用{params,config } 就可包含url參數與請求頭
  return await request.get("/seller/Pro",{params:params,...config.value})
}

export async function goDetailPro(proid,config){
  return await request.get("/seller/Pro/"+proid,config.value)
}

export async function goDeletePro(proid,config){
  return await request.delete("/seller/Pro/"+proid,config.value)
}

