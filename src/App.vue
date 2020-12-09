<template>
	<div class="shop">
		<div class="shop-container shop__shop-container">

			<nav class="nav-shop shop-container__nav-shop">
				<div class="nav-shop__logo"
					@click="visitShopPage"
				>fakeShop</div>
				<div class="profile nav-shop__profile">
					<span class="profile__login"
						v-if="!GET_IS_USER"
						@click="openLoginUser"
					>
						Вход | Регистрация
					</span>
					<div class="personal-cabinet"
						v-if="GET_IS_USER"
						@click="toggleProfile"
					>
						<span class="personal-cabinet__name">{{ GET_USER_NAME }}</span>
					</div>
					<div class="nav-shop__cart"
						@click="toggleCart"
					>
						<img class="nav-shop__cart-icon" :src="GET_ICON_CART" alt="cart">
						<span class="nav-shop__cart-count">
							{{ GET_PRODUCT_COUNTER_IN_CART }}
						</span>
					</div>
				</div>
			</nav>
			
			<div class="content-shop shop-container__content-shop">
				<!-- Main -->
				<c-main v-if="!isRegister"/>

				<!-- Profile -->
				<transition name="aside-menu">
					<c-profile v-if="GET_IS_PROFILE_MENU"/>
				</transition>

				<!-- Cart -->
				<transition name="aside-menu">
					<c-cart v-if="GET_IS_CART_MENU"/>
				</transition>
				
				<!-- Enter | Register component -->
				<c-modal/>

				<!-- Register page -->
				<router-view v-if="isRegister"/>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import cModal from '@/components/_dry/modal/c-modal'
import cMain from '@/components/content/c-main'
import cProfile from '@/components/content/c-profile'
import cCart from '@/components/content/c-cart'

export default {
	name: 'cShop',
	components: {
		cModal,
		cMain,
		cProfile,
		cCart,
	},
	data: () => ({
		isRegister: false,
		time: 10,
	}),
	computed: {
		...mapGetters(['GET_IS_MODAL', 'GET_IS_USER', 'GET_USER_NAME']),
		...mapGetters('shop', [
			'GET_IS_PROFILE_MENU',
			'GET_IS_CART_MENU',
			'GET_ICON_CART',
			'GET_PRODUCT_COUNTER_IN_CART',
		]),
		isShopPage() {
			return this.$route.name === 'Shop';
		},
	},
	methods: {
		...mapActions([
			'OPEN_MODAL',
			'CLOSE_MODAL',
			'CHECK_USER',
		]),
		...mapActions('shop', [
			'TOGGLE_PROFILE_MENU',
			'CLOSE_PROFILE_MENU',
			'TOGGLE_CART_MENU',
      'CLOSE_CART_MENU',
      'SET_TIME_DISCOUNT',
      'SAVE_PRODUCTS_CART_FROM_LOCAL_STORAGE',
    ]),
		visitShopPage() {
			if (this.GET_IS_CART_MENU) {
				this.CLOSE_CART_MENU();
			}
			if (this.GET_IS_PROFILE_MENU) {
				this.CLOSE_PROFILE_MENU();
			}
			if (this.GET_IS_MODAL) {
				this.CLOSE_MODAL();
			}
			if (!this.isShopPage) {
				this.$router.push({ name: 'Shop' });
			}
		},
		openLoginUser() {
			this.CLOSE_CART_MENU();
			this.OPEN_MODAL('cModalLoginRegister');
		},
		toggleProfile() {
			if (this.GET_IS_MODAL) {
				this.CLOSE_MODAL();
			}
			this.CLOSE_CART_MENU();
			this.TOGGLE_PROFILE_MENU();
		},
		toggleCart() {
			if (this.GET_IS_MODAL) {
				this.CLOSE_MODAL();
			}
			this.CLOSE_PROFILE_MENU();
			this.TOGGLE_CART_MENU();
		},
	},
	watch: {
		$route: {
			immediate: true,
			handler(route) {
				this.isRegister = route.name === 'Register';
			} 
		},
	},
	created() {
    this.CHECK_USER();
    this.SAVE_PRODUCTS_CART_FROM_LOCAL_STORAGE();
		this.SET_TIME_DISCOUNT();
	},
	beforeDestroy() {
		this.CLOSE_PROFILE_MENU();
		this.CLOSE_CART_MENU();
	}
}
</script>

<style lang="scss">
	.shop {
		height: 100%;

		&__shop-container {
			position: relative;
			height: inherit;
		}
	}
	.shop-container {
    height: 100vh;
		color: #000;
		box-shadow: .1rem .1rem 2rem #000;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.nav-shop {
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #1d2325;
		color: #fff;

		&__logo {
			font-family: 'Gloria Hallelujah', cursive;
			cursor: pointer;
		}
		&__cart {
			width: 4rem;
			margin-left: 2rem;
			position: relative;
			cursor: pointer;
		}
		&__cart-icon {
			width: 100%;
			filter: invert(1);

			&:hover {
				filter: invert(.5);
			}
		}
		&__cart-count {
			width: 2rem;
			height: 2rem;
			border-radius: 50%;
			background: #fff;
			color: #000;
			position: absolute;
			top: 0;
			right: -.5rem;
			display: flex;
			justify-content: center;
			align-items: center;
			font-family: cursive;
			font-size: 1.3rem;
			font-weight: 600;
		}
	}
	.content-shop {
		background: #2f393c;
		height: 100%;
		position: relative;
	}
	.profile {
		display: flex;
		align-items: center;

		&__login {
			cursor: pointer;

			@media (max-width: 1024px) {
				margin-left: 4rem;
				font-size: 1.4rem;
			}
		}
	}
	.personal-cabinet {
		width: 4rem;
		height: 4rem;
		user-select: none;
		background: #fff;
		color: #000;
		font-weight: 600;
		border-radius: 50%;	
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		
		&:hover {
			background: #777;
		}
		&__name {
			font-family: 'Gloria Hallelujah';
			font-size: 2.4rem;
		}
	}

	.aside-menu-enter-active {
		animation: aside-menu-enter .3s;
	}
	@keyframes aside-menu-enter {
		0% { right: -45rem }
		100% { right: 0; };
	}
	.aside-menu-leave-active {
		animation: aside-menu-leave .2s;
	}
	@keyframes aside-menu-leave {
		100% { right: -45rem; };
	}
</style>