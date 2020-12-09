import Vue from 'vue'
const vm = new Vue

export default {
	state: {
		discount: 10,
		prevRandomDiscountProductId: null,
	},
	getters: {
		GET_DISCOUNT_PRODUCT(s, g, { shop: { products: { products } } }) {
			return Object.entries(products).reduce((acc, curr) => {
				const [, { list }] = curr;
				const DISCOUNT_PRODUCT = list.find(curr => curr.discount);

				if (DISCOUNT_PRODUCT) {
					acc['currDiscountProduct'] = DISCOUNT_PRODUCT;
				}

				return acc;
			}, {});
		},
	},
	mutations: {
		CREATE_CURR_DISCOUNT_PRICE(s, randDiscountProduct) {
			const { price, discount } = randDiscountProduct;
			const DISCOUNT_PRICE = Math.round(price - (price / 100 * discount));

			vm.$set(randDiscountProduct, 'discountPrice', DISCOUNT_PRICE);
		},
		SET_RANDOM_DISCOUNT_TO_PRODUCT(state, randDiscountProduct) {
			vm.$set(randDiscountProduct, 'discount', state.discount);
			state.prevRandomDiscountProductId = randDiscountProduct.id;
		},
		DISABLE_CURR_DISCOUNT_FROM_PRODUCT(s, currDiscountProduct) {
			vm.$set(currDiscountProduct, 'discount', 0);
		},
		DELETE_CURR_DISCOUNT_PRICE(s, currDiscountProduct) {
			vm.$delete(currDiscountProduct, 'discountPrice');
		},
	},
	actions: {
		SET_DISCOUNT_PRODUCT({ dispatch, commit, state, getters, rootState }) {
			const { shop: { products: { products } } } = rootState;
			const { currDiscountProduct } = getters.GET_DISCOUNT_PRODUCT;
			
			const [randomCategory] = Object.entries(products)[Math.floor(Math.random() * Object.entries(products).length)];
			const getRandomDiscountProduct = () => {
				return products[randomCategory].list[Math.floor(Math.random() * products[randomCategory].list.length)];
			}
			
			let randDiscountProduct = getRandomDiscountProduct();
			randDiscountProduct =
			(state.prevRandomDiscountProductId &&
				state.prevRandomDiscountProductId === randDiscountProduct.id)
				? getRandomDiscountProduct()
				: randDiscountProduct;


			if (currDiscountProduct) {
				commit('DISABLE_CURR_DISCOUNT_FROM_PRODUCT', currDiscountProduct );
				commit('DELETE_CURR_DISCOUNT_PRICE', currDiscountProduct);
			}
			
			commit('SET_RANDOM_DISCOUNT_TO_PRODUCT', randDiscountProduct);
			commit('CREATE_CURR_DISCOUNT_PRICE', randDiscountProduct)
			
			dispatch('DISABLE_DISCOUNT_IN_CART');
			dispatch('SET_DISCOUNT_IN_CART', randDiscountProduct);
		}
	},
}