<template>
	<div class="modal-alert-authorization modal-container__modal-alert-authorization"
		@click.stop=""
	>
		<div class="modal-alert-authorization__box-close"
			@click="CLOSE_MODAL"
		>
			<span class="modal-alert-authorization__close"></span>
		</div>

		<p class="content-authorization modal-alert-authorization__content-authorization">

			<!-- Alert autorisation -->
			Для оформления заказа,<br /> Вам следует
			<span class="content-authorization__login-link"
				@click="OPEN_MODAL('cModalLoginRegister')"
			>войти</span>
			в систему либо 
			<a	class="content-authorization__register-link"
				@click.prevent="visitRegisterPage"
			>зарегистрироваться</a>!

		</p>

	</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
	name: 'cModalAlertAuthorization',
	methods: {
      ...mapActions([
			'OPEN_MODAL',
			'CLOSE_MODAL',
		]),
		...mapActions('shop', ['CLOSE_CART_MENU']),
      visitRegisterPage() {
         if (this.$route.name !== 'Register') {
            this.$router.push({ name: 'Register' });
         }
         
			this.CLOSE_MODAL();
			this.CLOSE_CART_MENU();
		},
	},
}
</script>

<style lang="scss">
.modal-container {

	&__modal-alert-authorization {
		position: relative;
	}
}
.modal-alert-authorization {
	overflow: hidden;
	padding: 5rem;
	border: 1px solid #fff;
	background: #fff;
	border-radius: 1rem;
	text-align: center;

	@media (max-width: 499px) {
		width: calc(100vw - 10rem);
	}
	@media (max-width: 460px) {
		width: calc(100vw - 5rem);
	}
	@media (max-width: 375px) {
		padding: 3rem;
		font-size: 1.6rem;
	}

	&__box-close {
		width: 2rem;
		height: 2rem;
		position: absolute;
		top: 1rem;
		right: 1rem;
		cursor: pointer;
		transition: .2s;

		&:hover {
			transform: scale(1.2);
		}
	}
	&__close {
		display: block;
		width: 100%;
		height: 100%;
		background: url('/static/icons/close.svg') no-repeat center / cover;
	}
	&__content-autorisation {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		backface-visibility: hidden;
	}
}
.content-authorization {

	&__login-link, &__register-link {
		color: #336699;
		font-weight: 500;
		cursor: pointer;
	}
}
</style>