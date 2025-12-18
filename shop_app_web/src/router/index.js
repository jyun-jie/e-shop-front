//存 router
import { createRouter, createWebHistory } from 'vue-router'
import { useTokenStore } from '@/store/index.js';
import { jwtDecode } from 'jwt-decode';



const routes = 
    [ 
      {
        path: '/',
        redirect: '/Read',
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('../components/Login.vue')
      },
      {
        path: '/Read',
        name: 'home',
        component: ()=> import('../components/Read.vue'),
        children : [
          { 
            path : '/Read/unAuth/Pro/:id',
            name : 'details',
            component : ()=>import('../views/read/UpdatePro.vue'),
            meta: {
              requiresAuth: true,
              roles: ["User"]
            },
          },
        ],
      },{
        
        path: '/Read/myPurchase',
        name: 'purchase',
        component: ()=> import('../components/Read.vue'),
        meta: {
          requiresAuth: true,
          roles: ["User"]
        },
        
      },
      {
        path: '/seller',
        name: 'seller',
        component: ()=> import('../components/Seller.vue'),
        children :[
          { path :'/sellerPro' , 
            component : ()=>import('../views/seller/SellerPro.vue'),
            meta: {
              requiresAuth: true,
              roles: ["SELLER"]
            },
          },
          { path :'/seller/insert' , 
            component : ()=>import('../views/seller/InsertPro.vue'),
            meta: {
              requiresAuth: true,
              roles: ["SELLER"]
            },
          },
          { path :'/seller/update/:id' , 
            name : 'update',
            component : ()=>import('../views/seller/UpdatePro.vue'),
            meta: {
              requiresAuth: true,
              roles: ["SELLER"]
            },
          },
          {
            path :'/seller/delete/:id' , 
            name : 'delete',
            component : ()=>import('../views/seller/DeletePro.vue'),
            meta: {
              requiresAuth: true,
              roles: ["SELLER"]
            },
          },
          {
            path :'/seller/checkOrder' , 
            name : 'checkOrder',
            component : ()=>import('../views/seller/CheckOrder.vue'),
            meta: {
              requiresAuth: true,
              roles: ["SELLER"]
            },
          },
        ],
        meta: {
          requiresAuth: true,
          roles: ["SELLER"]
        },
      },{
        path: '/Cart',
        name: 'Cart',
        component: ()=> import('../components/Cart.vue'),
        meta: {
          requiresAuth: true,
          roles: ["User"]
        },

      },{
        path :'/checkOrder' , 
        name : 'orderCheck',
        component : ()=>import('../views/cart/OrderCheck.vue'),
        meta: {
          requiresAuth: true,
          roles: ["User"]
        },
      },{
        path :'/logout' , 
        name : 'Logout',
        component : ()=>import('../components/Logout.vue')
      },{
        path :'/payment', 
        name :'Payment' ,
        component : ()=>import('../components/Payment.vue'),
        children :[
          { path :'/queryTrade' , 
            name : 'queryTrade',
            component : ()=>import('../views/payment/QueryTrade.vue'),
            meta: {
              requiresAuth: true,
              roles: ["User"]
            },
          },
        ],
        meta: {
          requiresAuth: true,
          roles: ["User"]
        },
      }
      
      
    ]


const router = createRouter({
  // 4. Provide the history implementation to use. We
  // are using the hash history for simplicity here.
  history: createWebHistory(),
  routes // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore()   // 這裡要呼叫 useTokenStore()
  const token = tokenStore.getToken()

  // 1️⃣ 需要登入但沒登入
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  console.log(to)
  // 2️⃣ 有角色限制
  if (to.meta.roles && token) {
    const payload = jwtDecode(token);
    console.log(payload.role)
    if (!to.meta.roles.includes(payload.role) ) {
      if(payload.role === 'SELLER'){
        return next("/seller");
      }else if (payload.role === 'User'){
        return next("/Read")
      }
      
    }
  }

  next();
});

export default router