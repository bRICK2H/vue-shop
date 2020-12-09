<template>
	<div class="modal-success-order modal-container__modal-success-order"
		@click.stop=""
	>
		<div class="modal-success-order__box-close"
			@click="CLOSE_MODAL"
		>
			<span class="modal-success-order__close"></span>
		</div>

		<!-- Success order -->
		<p class="content-success-order modal-success-order__content-success-order">
			Благодарю за заказ! <br />
			Ожидать его конечно же не стоит :D
		</p>

	</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
	name: 'cModalSuccessOrder',
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

	&__modal-success-order {
		position: relative;
	}
}
.modal-success-order {
	overflow: hidden;
	padding: 5rem;
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
}
</style>