import axios from 'axios';

//請求位置 引用
/*const baseURL = 'http://localhost:8080';
const instance = axios.create({baseURL})*/
import request from '@/utils/request';
import buyer from '@/utils/buyer.js';

//重複的程式
export async function goVisitor(config){
  try {
    //const data = await buyer.get('/Read');
    return await request.get("/Read/unAuth/Pro/xxx",config)
  } catch (error) {
    console.error('Error fetching visitor data:', error);
  }
}

export async function goLogin(data){
  return await request.post("/login/user",data)
}

export async function goRegister(data){
  return await request.post("/login/register",data)
}

export async function goReadPro(params,config){
  //需要用{params,config } 就可包含url參數與請求頭
  /*try {
    const data = await buyer.get('/buyer/unAuth/Pro',{params:params,...config.value});
    console.log('Visitor Data:', data);
  } catch (error) {
    console.error('Error fetching visitor data:', error);
  }*/
  console.log(params)
  return await buyer.get("/Read/unAuth/Pro",{params:params},config)
}


export async function goReadDetailPro(proid,config){
  return await request.get("/Read/Pro/"+proid,config.value)
}


export async function goSeller(config){
  return await request.get("/seller",config.value)
}

export async function goInsertPro(formData,config){
  return await request.post("/seller/Pro",formData,config.value)
}
/*export async function goInsertPro(product,config){
  return await request.post("/public/test/upload",product,config.value)
}*/

export async function goSellerPro(params,config){
  //需要用{params,config } 就可包含url參數與請求頭
  return await request.get("/seller/Pro",{params:params,...config.value})
}

export async function goDetailPro(proid,config){
  return await request.get("/seller/Pro/"+proid,config.value)
}

export async function goTakeDownPro(proid,config){
  return await request.put("/seller/Pro/takenDown/"+proid,null,config.value)
}

export async function goDeletePro(proid,config){
  return await request.put("/seller/Pro/delete/"+proid,null,config.value)
}


export async function goUpdateProduct(formData,config){
  return await request.put("/seller/Pro",formData,config.value)
}

export async function goDeleteImage(imageUrl,config){
  return await request.delete("/seller/Image/"+imageUrl,config.value)
}

export async function goAddCart(proid,quantity,config){
  return await request.post("/Cart/add/"+proid+"/"+quantity.value,'',config.value)
}

export async function goCart(config){
  return await request.get("/Cart/findCartList",config.value)
}

export async function submitCart(productChecked , config){
  return await request.post("/Order/check",productChecked,config.value)
}

export async function goOrder(data , config){
  console.log(data)
  return await request.post("/Order/order",data,config.value)
}

export async function goPurchaseList(type ,config){
  // 合併 params，支持分頁參數
  const requestConfig = {
    ...config.value,
    params: {
      type: type,
      ...(config.value?.params || {})
    }
  }
  console.log(requestConfig)
  return await request.get("/Order/State/", requestConfig)
}

export async function goPickupOrder(pickupOrderList,config){
  console.log(pickupOrderList);
  return await request.put("/Order/received",{pickupOrderList},config.value)
}

export async function goCheckSalesOrder(orderState,config){
  return await request.get("/SalesOrder/check",{params:{orderState},...config.value})
}

export async function goShipSelectedOrders(shipOrderList,config){
  return await request.post("/SalesOrder/shipOrder",{shipOrderList},config.value)
}

export async function goToPay(orderId,config){
  return await request.post("/Api/Payment/newebpay", orderId ,config.value)
}

export async function goQueryTradeInfo(data ,config){
  console.log(data)
  return await request.post('/Api/Payment/queryTrade', data , config.value)
}

export async function goApplySeller(data ,config){
  return await request.post('/login/sellerApplication', data , config.value)
}

export async function goPaid(data ,config){
  console.log(data.value)
  console.log(config.value)
  return await request.post('/Api/Payment/changePaid?data='+ data.value, null , config.value)
}


export async function goQueryStoreMap(data ,config){
  return await request.post('/Logistics/queryStoreMap',data, config.value)
}

export async function goGetStoreResult(data,config){
  return await request.get('/Logistics/store/result?orderNo='+data,config.value);
}


export async function goCreateLogistics(data,config){
  return await request.post('/Logistics/create',data,config.value);
}

export async function goPrintShippingLabel(data,config){
  return await request.post('/Logistics/print',data,config.value);
}

export async function goQueryShippingDto(data,config){
  return await request.post('/Logistics/query',data,config.value);
}

export async function goGetLogisticOrder(data,config){
  return await request.get('/Logistics/order?storeType='+data , config.value)
}

export async function goGetOrderByUnchecked(storeType ,config){
  console.log(storeType)
  return await request.get("/SalesOrder/NonCreatedLogisticsOrders",{params:{storeType},...config.value})
}


export async function goCheckSelectedOrders(checkOrderList,config){
  return await request.post("/SalesOrder/createLogistics",{checkOrderList},config.value)
}