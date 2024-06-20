//存 router
import { createRouter, createWebHistory } from 'vue-router'


const routes = 
    [ 
      {
        path: '/',
        redirect: '/Read'
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
            component : ()=>import('../views/read/UpdatePro.vue')
          },
        ]
      },
      {
        path: '/seller',
        name: 'seller',
        component: ()=> import('../components/Seller.vue'),
        children :[
          { path :'/seller/insert' , 
            component : ()=>import('../views/seller/InsertPro.vue')
          },
          { path :'/seller/update/:id' , 
            name : 'update',
            component : ()=>import('../views/seller/UpdatePro.vue')
          },
          {
            path :'/seller/delete/:id' , 
            name : 'delete',
            component : ()=>import('../views/seller/DeletePro.vue')
          }
        ]
      }
      
    ]


const router = createRouter({
  // 4. Provide the history implementation to use. We
  // are using the hash history for simplicity here.
  history: createWebHistory(),
  routes // short for `routes: routes`
});


export default router