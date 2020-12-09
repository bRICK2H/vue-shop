import firebase from 'firebase/app'
import Vue from 'vue'

const vm = new Vue

export default {
	state: {
		productsCart: [],
		isCartMenu: false,
		isOrderRequest: false,
		iconCart: require('@/assets/img/icons/shop.svg'),
		iconDelete: require('@/assets/img/icons/delete.svg'),
		iconCloseCart: require('@/assets/img/icons/hide-arrow.svg'),
	},
	getters: {
		GET_PRODUCTS_IN_CART: state => state.productsCart,
		GET_CURR_PRODUCT: state => id => state.productsCart.find(curr => curr.id === id),
		GET_PRODUCT_COUNTER_IN_CART: state => state.productsCart.length,
		GET_DISCOUNT_PRODUCT_IN_CART: state => state.productsCart.find(curr => curr.discount),

		GET_TOTAL_SUM: state => {
			return state.productsCart.reduce((acc, curr) => {
				acc += curr.totalPrice;
				return acc;
			}, 0);
		},

		GET_IS_CART_MENU: state => state.isCartMenu,
		GET_IS_ISSET_DISCOUNT_PRODUCT_IN_CART: state => id => state.productsCart.find(curr => curr.id === id),
		GET_IS_ORDER_REQUEST: state => state.isOrderRequest,

		GET_ICON_CART: state => state.iconCart,
		GET_ICON_DELETE: state => state.iconDelete,
		GET_ICON_CLOSE_CART: state => state.iconCloseCart,
		
		IS_ISSET_ID_PRODUCT: state => ({ id }) => {
			return state.productsCart.some(currId => currId === id);
		},
		IS_ISSET_PRODUCT_IN_CART: state => Boolean(state.productsCart.length),
	},
	mutations: {
		TOGGLE_CART_MENU: state => state.isCartMenu = !state.isCartMenu,
		OPEN_CART_MENU: state => state.isCartMenu = true,
		CLOSE_CART_MENU: state => state.isCartMenu = false,
		ADD_PRODUCT(state, product) {
			const CURR_TOTAL_PRICE = product.discountPrice ? product.discountPrice : product.price;
			
			vm.$set(product, 'totalPrice', CURR_TOTAL_PRICE);
			state.productsCart.push({ ...product });
		},
		SAVE_PRODUCTS_TO_LOCAL_STORAGE: state => {
			localStorage.setItem('productsCart', state.productsCart);
		},
		DELETE_PRODUCT(state, id) {
			const DELETE_PRODUCT_INDEX = state.productsCart.findIndex(curr => curr.id === id);
			
			state.productsCart.splice(DELETE_PRODUCT_INDEX, 1);
		},
		UPDATE_AMOUNT_PRODUCT(state, { string, productId }) {
			const CURR_PRODUCT = state.productsCart.find(curr => curr.id === productId);
			const CURR_TOTAL_PRICE = CURR_PRODUCT.discount
				? CURR_PRODUCT.discountPrice
				: CURR_PRODUCT.price;
			
			switch (string) {
				case 'plus':
					CURR_PRODUCT.amount += 1;
					break;
				case 'minus':
					if (CURR_PRODUCT.amount <= 1) return;
					CURR_PRODUCT.amount -= 1;
					break;
				}

			vm.$set(CURR_PRODUCT, 'totalPrice', CURR_PRODUCT.amount * CURR_TOTAL_PRICE);
		},
		DISABLE_DISCOUNT_IN_CART: (s, discountProduct) => {
			const { price, amount } = discountProduct;
			
			vm.$set(discountProduct, 'discount', 0);
			vm.$set(discountProduct, 'totalPrice', price * amount);
		},
		SET_DISCOUNT_IN_CART: (s, { product, amount, discount, discountPrice}) => {
			vm.$set(product, 'discount', discount);
			vm.$set(product, 'discountPrice', discountPrice);
			vm.$set(product, 'totalPrice', discountPrice * amount);
		},
		SET_IS_ORDER_REQUEST: (state, isOrderRequest) => state.isOrderRequest = isOrderRequest,

		UPDATE_PRODUCTS_CART_IN_LOCAL_STORAGE(state) {
			const COPY_PRODUCTS_CART = state.productsCart
				.map(curr => {
					const TEMP_CURR_PRODUCT = { ...curr };
					if (TEMP_CURR_PRODUCT.discount) {
						TEMP_CURR_PRODUCT.discount = 0;
						TEMP_CURR_PRODUCT.totalPrice = TEMP_CURR_PRODUCT.price;
						delete TEMP_CURR_PRODUCT.discountPrice;
					}

					return TEMP_CURR_PRODUCT;
				});

			localStorage.setItem('productsCart', JSON.stringify(COPY_PRODUCTS_CART));
		},
		SAVE_PRODUCTS_CART_FROM_LOCAL_STORAGE(state, { getProduct }) {
			state.productsCart = JSON.parse(localStorage.getItem('productsCart'));

			state.productsCart.forEach(curr => {
				vm.$set(
					getProduct({
						categoryId: curr.category,
						productId: curr.id
					}), 'inCart', true);
			});
		},
		CLEAR_PRODUCTS_CART: (state, { getProduct }) => {
			state.productsCart.forEach(curr => {
				vm.$set(
					getProduct({
						categoryId: curr.category,
						productId: curr.id
					}), 'inCart', false);
			});
			state.productsCart = [];
		},
		CLEAR_LOCAL_STORAGE: (s, key) => localStorage.removeItem(key),
	},
	actions: {
		TOGGLE_CART_MENU: ({ commit }) => commit('TOGGLE_CART_MENU'),
		OPEN_CART_MENU: ({ commit }) => commit('OPEN_CART_MENU'),
		CLOSE_CART_MENU: ({ commit }) => commit('CLOSE_CART_MENU'),
		ADD_PRODUCT({ dispatch, commit, getters }, productOptions) {
			const { category, product } = productOptions;
			const IS_ISSET_ID_PRODUCT = getters.IS_ISSET_ID_PRODUCT(product);

			if (!IS_ISSET_ID_PRODUCT) {
				commit('ADD_PRODUCT', product);
				dispatch('SET_IN_CART', {
					categoryId: category,
					productId: product.id
				});
				dispatch('UPDATE_PRODUCTS_CART_IN_LOCAL_STORAGE');
				dispatch('shop/cartList/SET_NEXT_PAGINATION_LIST_PAGE', null, { root: true });
			}
		},
		SAVE_PRODUCTS_TO_LOCAL_STORAGE: ({ commit }) => commit('SAVE_PRODUCTS_TO_LOCAL_STORAGE'),
		DELETE_PRODUCT({ dispatch, commit }, { categoryId, productId }) {
			commit('DELETE_PRODUCT', productId);
			dispatch('DELETE_FROM_CART', { categoryId, productId });
			dispatch('UPDATE_PRODUCTS_CART_IN_LOCAL_STORAGE');
			dispatch('shop/cartList/SET_PREV_PAGINATION_LIST_PAGE', null, { root: true });
		},
		UPDATE_AMOUNT_PRODUCT({ dispatch, commit }, productInfo) {
			commit('UPDATE_AMOUNT_PRODUCT', productInfo);
			dispatch('UPDATE_PRODUCTS_CART_IN_LOCAL_STORAGE');
		},
		DISABLE_DISCOUNT_IN_CART({ commit, getters }) {
			const DISCOUNT_PRODUCT_IN_CART = getters.GET_DISCOUNT_PRODUCT_IN_CART;
			if (DISCOUNT_PRODUCT_IN_CART) {
				commit('DISABLE_DISCOUNT_IN_CART', DISCOUNT_PRODUCT_IN_CART);
			}
		},
		SET_DISCOUNT_IN_CART({ commit, getters }, { id, amount, discount, discountPrice }) {
			const IS_ISSET_DISCOUNT_PRODUCT_IN_CART = getters.GET_IS_ISSET_DISCOUNT_PRODUCT_IN_CART(id);

			if (IS_ISSET_DISCOUNT_PRODUCT_IN_CART) {
				commit('SET_DISCOUNT_IN_CART', {
					product: getters.GET_CURR_PRODUCT(id),
					amount,
					discount,
					discountPrice
				});
			}
		},
		ORDER_PRODUCTS({ dispatch, commit, getters, rootGetters }) {
			const userId = rootGetters.GET_USER['uid'];
			commit('SET_IS_ORDER_REQUEST', true);
			
			if (!userId) {
				dispatch('OPEN_MODAL', 'cModalAlertAuthorization', { root: true });
				commit('SET_IS_ORDER_REQUEST', false);
				return;
			} 
			
			const totalPrice = getters.GET_TOTAL_SUM;
			const products = getters.GET_PRODUCTS_IN_CART.map(curr => {
				return {
					...curr,
					price: rootGetters['shop/GET_PRICE_MODIFICATION'](curr.price),
					totalPrice: rootGetters['shop/GET_PRICE_MODIFICATION'](curr.totalPrice),
				}
			});

			firebase.database()
				.ref(`orders/${userId}`)
				.push()
				.set({
					date: new Date().toLocaleDateString(),
					time: new Date().toLocaleTimeString(),
					locale: new Date().toString(),
					finalPrice: rootGetters['shop/GET_PRICE_MODIFICATION'](totalPrice),
					products
				})
				.then(() => {
					commit('SET_IS_ORDER_REQUEST', false);
					dispatch('OPEN_MODAL', 'cModalSuccessOrder', { root: true });
					dispatch('CLEAR_LOCAL_STORAGE', 'productsCart');
					dispatch('CLEAR_PRODUCTS_CART');
					commit('CLOSE_CART_MENU');
				})
				.catch((e) => {
					console.error('Error in component cart.js, check your method "ORDER_PRODUCTS"', e);
				})
		},
		
		SAVE_PRODUCTS_CART_FROM_LOCAL_STORAGE: ({ commit, getters, rootGetters }) => {
			const PRODUCTS_CART_FROM_LOCAL_STORAGE = JSON.parse(localStorage.getItem('productsCart'));
			
			if (getters.GET_PRODUCT_COUNTER_IN_CART === 0) {
				if (PRODUCTS_CART_FROM_LOCAL_STORAGE && PRODUCTS_CART_FROM_LOCAL_STORAGE.length) {
					commit('SAVE_PRODUCTS_CART_FROM_LOCAL_STORAGE', { 
						getProduct: rootGetters['shop/GET_PRODUCT']
					 });
				}
			}
		},
		UPDATE_PRODUCTS_CART_IN_LOCAL_STORAGE: ({ commit }) => commit('UPDATE_PRODUCTS_CART_IN_LOCAL_STORAGE'),
		CLEAR_PRODUCTS_CART: ({ commit, rootGetters }) => commit('CLEAR_PRODUCTS_CART', {
			getProduct: rootGetters['shop/GET_PRODUCT']
		}),
		CLEAR_LOCAL_STORAGE: ({ commit }, key) => commit('CLEAR_LOCAL_STORAGE', key),
	}
}