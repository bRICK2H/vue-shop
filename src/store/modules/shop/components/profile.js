import firebase from 'firebase/app'

export default {
	state: {
		isProfileMenu: false,
		isAnimateProductOrderList: false,
		iconCloseProfile: require('@/assets/img/icons/hide-arrow.svg'),
		iconCloseOrderMenu: require('@/assets/img/icons/close.svg'),
		orderedList: null,
		orderedProduct: null,
		offsetOrderMenu: 0,
	},
	getters: {
		GET_ICON_CLOSE_PROFILE: state => state.iconCloseProfile ? state.iconCloseProfile : null,
		GET_ICON_CLOSE_ORDER_MENU: state => state.iconCloseOrderMenu,
		GET_ORDERED_LIST: state => state.orderedList,
		GET_CURR_ORDERED_PRODUCT: state => order => state.orderedList.find(curr => curr.orderNumber === order),
		GET_ORDERED_PRODUCTS: state => state.orderedProduct.products,
		GET_ORDER_NUMBER: state => state.orderedProduct.orderNumber, 
		GET_FINAL_PRICE: state => state.orderedProduct.finalPrice, 
		GET_OFFSET_ORDER_MENU: state => state.offsetOrderMenu,
		
		GET_IS_PROFILE_MENU: state => state.isProfileMenu,
		GET_IS_ISSET_ORDERED_LIST: state => Boolean(state.orderedList),
		GET_IS_ISSET_ORDERED_PRODUCTS: state => Boolean(state.orderedProduct),
		GET_ANIMATE_NAME_ORDER_PRODUCT_LIST: state => state.isAnimateProductOrderList ? 'product-order-list' : '',

	},
	mutations: {
		TOGGLE_PROFILE_MENU: state => state.isProfileMenu = !state.isProfileMenu,
		CLOSE_PROFILE_MENU: state => state.isProfileMenu = false,
		SET_ORDERED_LIST(state, orderedList) {

			if (!orderedList) {
				state.orderedList = null;
				return false;
			}
			
			state.orderedList = Object.entries(orderedList)
				.reduce((acc, curr) => {
					const [ orderNumber, productInfo ] = curr;
		
					acc.push({ orderNumber, ...productInfo })
					return acc;
				}, [])
				.sort(({ locale: a }, { locale: b }) => {
					return new Date(b) - new Date(a);
				});
		},
		SET_ORDERED_PRODUCTS: (state, currOrderdProduct) => state.orderedProduct = currOrderdProduct,
		SET_OFFSET_PRODUCT_ORDER_LIST: (state, { offset }) => state.offsetOrderMenu = offset,
		SET_IS_ANIMATE_PRODUCT_ORDER_LIST: (state, isOffset) => state.isAnimateProductOrderList = isOffset,
	},
	actions: {
		TOGGLE_PROFILE_MENU: ({ commit }) => commit('TOGGLE_PROFILE_MENU'),
		CLOSE_PROFILE_MENU: ({ commit }) => commit('CLOSE_PROFILE_MENU'),
		FETCH_ORDERED_PRODUCTS({ commit }, user_id) {
			firebase.database()
				.ref(`orders/${user_id}`)
				.on('value', snapshot => {
					const orderedList = snapshot.val();
					commit('SET_ORDERED_LIST', orderedList);
				});
		},
		SET_ORDERED_PRODUCTS({ commit, getters }, orderNumber) {
			const CURR_ORDERED_PRODUCT = getters.GET_CURR_ORDERED_PRODUCT(orderNumber);
			commit('SET_ORDERED_PRODUCTS', CURR_ORDERED_PRODUCT);
		},
		SET_OFFSET_PRODUCT_ORDER_LIST: ({ commit }, offset) => commit('SET_OFFSET_PRODUCT_ORDER_LIST', offset),
		SET_IS_ANIMATE_PRODUCT_ORDER_LIST: ({ commit }, isOffset) => commit('SET_IS_ANIMATE_PRODUCT_ORDER_LIST', isOffset),
	}
}