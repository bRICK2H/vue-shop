export default {
   getters: {
      GET_PAGINATION_LIST(state) {
         const from = (state.currPage * state.itemsInPage) - state.itemsInPage;
			const to = from + state.itemsInPage;
			
         return state.list.slice(from, to);
      },
      GET_PAGINATION_CURR_LIST_PAGE: state => state.currPage,
		GET_PAGINATION_LIST_PER_PAGE(state) {
         if (!Boolean(state.list.length)) return false;
         return Math.ceil(state.list.length / state.itemsInPage)
      },
      GET_IS_SHOW_PAGINATION_LIST(state) {
         if (!Boolean(state.list.length)) return false;
         return state.list.length > state.itemsInPage;
      },
   },
   mutations: {
      SET_INIT_PAGINATION_OPTIONS(state, { list, itemsInPage }) {
         state.list = list;
         state.itemsInPage = itemsInPage;
      }, 

      SET_CURR_PAGINATION_LIST_PAGE: (state, page) => state.currPage = page,
      SET_PREV_PAGINATION_LIST_PAGE(state, paginationList) {
         if (paginationList.length === 0) {
            state.currPage = state.currPage - 1;
         }
      },
      SET_NEXT_PAGINATION_LIST_PAGE(state, paginationCountListPage) {
         if (state.list.length > (state.currPage * state.itemsInPage)) {
            state.currPage = paginationCountListPage;
         }
      },
      SET_FIRST_PAGINATION_LIST_PAGE: state => state.currPage = 1,
   },
   actions: {
		SET_INIT_PAGINATION_OPTIONS({ commit }, options) {
         const IS_SOME_OPTION_EMPTY = Object.values(options).some(curr => curr === null);

         if (!IS_SOME_OPTION_EMPTY) {
            commit('SET_INIT_PAGINATION_OPTIONS', options)
         }
      },

      SET_CURR_PAGINATION_LIST_PAGE: ({ commit }, page) => commit('SET_CURR_PAGINATION_LIST_PAGE', page),
      SET_PREV_PAGINATION_LIST_PAGE: ({ commit, getters }) => commit('SET_PREV_PAGINATION_LIST_PAGE', getters.GET_PAGINATION_LIST),
      SET_NEXT_PAGINATION_LIST_PAGE: ({ commit, getters }) => commit('SET_NEXT_PAGINATION_LIST_PAGE', getters.GET_PAGINATION_LIST_PER_PAGE),
      SET_FIRST_PAGINATION_LIST_PAGE: ({ commit }) => commit('SET_FIRST_PAGINATION_LIST_PAGE'),
   },
};