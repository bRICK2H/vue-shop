export default {
	state: {
		minutes: 5,
		computedTime: {
			minutes: 0,
			seconds: 0,
		},
		isTimeCompleted: false,
	},
	getters: {
		GET_TIME_DISCOUNT: state => format => {
			const MINUTES = state.computedTime.minutes < 10
				? `0${state.computedTime.minutes}`
				: state.computedTime.minutes;
			const SECOUNDS = state.computedTime.seconds === 60	
				? '00'
				: state.computedTime.seconds < 10
					? `0${state.computedTime.seconds}`
					: state.computedTime.seconds;
			return format === 'string' ? `${MINUTES}:${SECOUNDS}` : { minutes: MINUTES, seconds: SECOUNDS }
		},
		GET_COMPUTED_SECONDS: state => state.computedTime.seconds,
		GET_COMPUTED_MINUTES: state => state.computedTime.minutes,
		IS_TIME_COMPLETED: state => state.isTimeCompleted,
	},
	mutations: {
		INIT_TIME_DISCOUNT(state) {
			state.computedTime.minutes = state.minutes - 1;
			state.computedTime.seconds = 59;
		},
		SET_TIME_COMPLETED: (state, isTimeCompleted) => state.isTimeCompleted = isTimeCompleted,
		SET_COMPUTED_SECONDS: state => state.computedTime.seconds -= 1,
		SET_COMPUTED_MINUTES: state => state.computedTime.minutes -= 1,
		SET_DEFAULT_SECONDS: state => state.computedTime.seconds = 59,
	},
	actions: {
		SET_TIME_DISCOUNT({ dispatch, commit, getters }) {
			dispatch('SET_DISCOUNT_PRODUCT');
			commit('INIT_TIME_DISCOUNT');
			
			setInterval(() => {
				commit('SET_TIME_COMPLETED', false);
				commit('SET_COMPUTED_SECONDS');

				if (getters.GET_COMPUTED_SECONDS < 1 && getters.GET_COMPUTED_MINUTES === 0) {
					commit('SET_TIME_COMPLETED', true);
					dispatch('SET_DISCOUNT_PRODUCT');
					commit('INIT_TIME_DISCOUNT');
				}
				if (getters.GET_COMPUTED_SECONDS < 0) { 
					commit('SET_COMPUTED_MINUTES');
					commit('SET_DEFAULT_SECONDS');
				 }
			}, 1000);
		},
	}
}