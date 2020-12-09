import firebase from 'firebase/app'

export default {
   state: {
		user: {
			uid: null,
			email: null
		},
		isError: false,
		isLoading: false,
		isRegister: false,
		currError: '',
		errors: {
			'auth/email-already-in-use': 'Почтовый адрес уже зарегестрирован!',
			'auth/too-many-requests': 'Вы использовали слишком много попыток входа, попробуйте позже!',
			'auth/user-not-found': 'Пользователь с такой почтой не зарегестрирован!',
			'auth/wrong-password': 'Не верный пароль!'
		},
	},
   getters: {
		GET_USER: state => state.user,
		GET_IS_USER: state => !!state.user.uid,
		GET_USER_NAME: state => state.user.email.replace(/\W/g, '').slice(0, 2).toUpperCase(),
		GET_ERROR: state => state.errors[state.currError],
		GET_IS_ERROR: state => state.isError,
		GET_IS_LOADING: state => state.isLoading,
		GET_CLASS_OF_PRELOADER(state) {
			return state.isLoading
				? 'auth-preloader__preloader--start-loading'
				: 'auth-preloader__preloader--end-loading'
		},
	},
   mutations: {
		SET_USER(state, { uid, email }) {
			state.user.uid = uid;
			state.user.email = email;
		},
		SET_IS_ERROR: (state, isError) => state.isError = isError,
		SET_ERROR: (state, error) => state.currError = error,
		SET_LOGADING: (state, isLoading) => state.isLoading = isLoading,
	},
   actions: {
		CHECK_USER({ dispatch, commit }) {
			firebase.auth().onAuthStateChanged(user => {
				if (user) {
					const { uid, email } = user;
					commit('SET_USER', { uid, email })
					dispatch('shop/FETCH_ORDERED_PRODUCTS', uid);
				} else {
					commit('SET_USER', { uid: null, email: null });
					dispatch('shop/orderList/SET_FIRST_PAGINATION_LIST_PAGE');
					dispatch('shop/productOrderList/SET_FIRST_PAGINATION_LIST_PAGE');
				}
			});

		},
		async REGISTER_USER({ commit, getters }, { email, password }) {
			if (getters.GET_IS_LOADING) return;
			commit('SET_LOGADING', true);
			commit('SET_IS_ERROR', false);
			commit('SET_ERROR', '');
			
			try {
				const { user: { uid } } = await firebase.auth().createUserWithEmailAndPassword(email, password);
				commit('SET_USER', { uid, email });
				commit('SET_LOGADING', false);
				return { success: true };
			} catch (error) {
				commit('SET_IS_ERROR', true);
				commit('SET_ERROR', error.code);
				commit('SET_LOGADING', false);
				return { success: false }
			}
		},
		async LOGIN_USER({ commit, getters }, { email, password }) {
			if (getters.GET_IS_LOADING) return;
			commit('SET_LOGADING', true);
			commit('SET_IS_ERROR', false);
			commit('SET_ERROR', '');
			
			try {
				const { user: { uid } } = await firebase.auth().signInWithEmailAndPassword(email, password);
				commit('SET_USER', { uid, email });
				commit('SET_LOGADING', false);
				return { success: true };
			} catch (error) {
				commit('SET_IS_ERROR', true);
				commit('SET_ERROR', error.code);
				commit('SET_LOGADING', false);
				return { success: false }
			}
		},
		LOGOUT_USER({ dispatch }, { isLocalStorage, methods } = false) {
			firebase.auth().signOut();	

			if (isLocalStorage) {
				for (const keyMethod in methods) {
					dispatch(`${keyMethod}`, methods[keyMethod], { root: true });
				}
			}
		},
		SET_ERROR: ({ commit }, error) => commit('SET_ERROR', error),
	},
}