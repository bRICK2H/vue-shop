import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// Children vShop
import vRegister from '@/views/auth/v-register'
import cProducts from '@/components/content/inner-main/c-products'
import vProductDetail from '@/views/projects/inner-shop/v-product-detail'

const routes = [
  {
    name: 'Shop',
    path: '/',
  },
  {
    name: 'Register',
    path: '/register',
    component: vRegister,
  },
  {
    name: 'Category',
    path: '/category',
    redirect: { name: 'Shop' }
  },
  {
    name: 'CategoryId',
    path: '/category/:categoryId',
    component: cProducts,
    children: [
      {
        name: 'ProductId',
        path: ':productId',
        props: true,
        component: vProductDetail,
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
