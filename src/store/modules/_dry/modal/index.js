export default {
	state: {
		isModal: false,
		currTypeOfModal: 'cModalDelete',
		settingsOfDelete: {},
		settingsOfDescription: '',
	},
	getters: {
		GET_CURR_TYPE_OF_MODAL: state => state.currTypeOfModal,
		GET_IS_MODAL: state => state.isModal,
		GET_SETTINGS_OF_DELETE: state => state.settingsOfDelete,
		GET_DESCRIPTION: state => state.settingsOfDescription,
	},
	mutations: {
		OPEN_MODAL(state, typeOfModal) {
			state.isModal = true;
			state.currTypeOfModal = typeOfModal;
		},
		CLOSE_MODAL: state => state.isModal = false,

		SET_SETTINGS_OF_DESCRIPTION: (state, description) => state.settingsOfDescription = description,
		SET_SETTINGS_OF_DELETE: (state, settings) => state.settingsOfDelete = settings,
	},
	actions: {
		OPEN_MODAL: ({ commit }, typeOfModal) => commit('OPEN_MODAL', typeOfModal), 
		CLOSE_MODAL: ({ commit }) => commit('CLOSE_MODAL'),
		
		SET_SETTINGS_OF_DESCRIPTION({ dispatch, commit }, { typeOfModal, description }) {
			commit('SET_SETTINGS_OF_DESCRIPTION', description);
			dispatch('OPEN_MODAL', typeOfModal);
		},
		
		SET_SETTINGS_OF_DELETE({ dispatch, commit }, { method, namespace, typeOfModal }) {
			commit('SET_SETTINGS_OF_DELETE', { method, namespace });
			dispatch('OPEN_MODAL', typeOfModal);
		},
		DELETE_ELEMENT({ dispatch, getters }) {
			const { method, namespace } = getters.GET_SETTINGS_OF_DELETE;
			const PATH_TO_CALL = namespace
				? `${namespace}/${method}`
				: `${method}`
			dispatch(PATH_TO_CALL);
			dispatch('CLOSE_MODAL');
		},
	},
}