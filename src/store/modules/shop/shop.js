import cart from './components/cart'
import profile from './components/profile'
import products from './components/products'
import discountTime from './components/discount-time'
import discountProduct from './components/discount-product'
import pagination from '../_dry/pagination'

const GET_PAGINATION_STATE = () => {
	return {
		list: [],
		currPage: 1,
		itemsInPage: null,
	}
}

export default {
	namespaced: true,
	modules: {
		cart,
		profile,
		products,
		discountTime,
		discountProduct,
		cartList: {
			namespaced: true,
			state: GET_PAGINATION_STATE(),
			...pagination
		},
		orderList: {
			namespaced: true,
			state: GET_PAGINATION_STATE(),
			...pagination
		},
		productOrderList: {
			namespaced: true,
			state: GET_PAGINATION_STATE(),
			...pagination
		}
	}
}