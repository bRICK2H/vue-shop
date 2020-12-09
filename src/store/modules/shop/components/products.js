import Vue from 'vue';
import { products } from './product-list'

const vm = new Vue

export default {
	state: {
		products,
		currCategory: '',
	},
	getters: {
		GET_PRODUCTS: state => state.products,
		GET_PRODUCT: state => ({ categoryId, productId }) => state.products[categoryId].list.find(curr => curr.id == productId),
		GET_PRODUCTS_CURR_CATEGORY: state => category => state.products[category].list,

		GET_CATEGORIES(state) {
			const CATEGORIES = Object.entries(state.products);
			return CATEGORIES.reduce((acc, curr) => {
				let [type, name] = curr;
				acc[type] = name;
				return acc;
			}, {});
		},
		GET_PRICE_MODIFICATION: () => price => {
			if (typeof price !== 'number') {
				console.error('You need transfer only type of number!')
				return false;
			}
			const TEMP_PRICE = [];
			const ARRAY_PRICE = String(price).split('');

			if (ARRAY_PRICE.length <= 3) return String(price);


			while (Boolean(ARRAY_PRICE.length)) {
				TEMP_PRICE.unshift(' ', ...ARRAY_PRICE.splice(ARRAY_PRICE.length - 3, 3));

				if (ARRAY_PRICE.length <= 3) {
					TEMP_PRICE.unshift(...ARRAY_PRICE.splice(0));
				}
			}

			return TEMP_PRICE.join('');
		}
	},
	mutations: {
		SET_IN_CART(s, { product }) {
			vm.$set(product, 'inCart', true);
		},
		DELETE_FROM_CART(s, { product }) {
			vm.$set(product, 'inCart', false);
		},
	},
	actions: {
		SET_IN_CART({ commit, getters }, { categoryId, productId }) {
			commit('SET_IN_CART', { product: getters.GET_PRODUCT({ categoryId, productId }) });
		},
		DELETE_FROM_CART({ commit, getters }, { categoryId, productId }) {
			commit('DELETE_FROM_CART', { product: getters.GET_PRODUCT({ categoryId, productId }) });
		},
	},
}