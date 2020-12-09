<template>
	<transition name="modal">
		<div class="modal"
			v-if="isModal"
			@click="CLOSE_MODAL"
		>
			<div class="modal-container modal__modal-container">
				<component :is="GET_CURR_TYPE_OF_MODAL" />
			</div>
		</div>
	</transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import cModalLoginRegister from '@/components/_dry/modal/inner-modal/c-modal-login-register'
import cModalAlertAuthorization from '@/components/_dry/modal/inner-modal/c-modal-alert-authorization'
import cModalSuccessOrder from '@/components/_dry/modal/inner-modal/c-modal-success-order'

export default {
	name: 'cModal',
	components: {
		cModalLoginRegister,
		cModalAlertAuthorization,
		cModalSuccessOrder
	},
	data: () => ({
		isModal: false,
	}),
	computed: mapGetters(['GET_CURR_TYPE_OF_MODAL', 'GET_IS_MODAL']),
	methods: mapActions(['CLOSE_MODAL']),
	watch: {
		GET_IS_MODAL(val) {
			this.isModal = val;
		}
	},
	created() {
		window.addEventListener('keydown', e => {
			if (e.keyCode === 27) this.CLOSE_MODAL()
		})
	},
	destroyed() {
		this.CLOSE_MODAL();
	},
}
</script>

<style lang="scss">
   .modal {
      width: 100%;
      height: 100%;
      background: rgba(0,0,0, .8);
		backface-visibility: hidden;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;

      &__modal-container {
         position: absolute;
         top: 50%;
         left: 50%;
         transform: translate(-50%, -50%);
      }
   }

.modal-enter, .modal-leave-to {
	opacity: 0;
}
.modal-enter-active, .modal-leave-active {
	transition: .3s;
}
.modal-enter-to {
	opacity: 1;
}
.modal-enter-active .modal-container {
	animation: modal-enter .3s;
}
@keyframes modal-enter {
	0% { transform: translate(-50%, -50%) scale(0); }
	50% { transform: translate(-50%, -50%) scale(1.2); }
	100% { transform: translate(-50%, -50%) scale(1); }
}
.modal-leave-active .modal-container {
	animation: modal-leave .3s;
}
@keyframes modal-leave {
	100% { transform: translate(-50%, -50%) scale(0); }
}
</style>