<template>
	<aside class="profile-menu">
		<span class="profile-menu__hide-menu"
			:style="{ 'background-image': `url(${GET_ICON_CLOSE_PROFILE})` }"
			@click="CLOSE_PROFILE_MENU"
		></span>
		<h3 class="profile-menu__profile-name">
			{{ GET_USER['email'] | profileName }}
		</h3>

		<div class="profile-order profile-menu__profile-order">
			<div class="profile-order-wrapper profile-order__profile-order-wrapper"
				:style="getStyleOffsetOrderMenu"
			>
				<c-order-list />
				<c-product-order-list />
			</div>
		</div>
		
		<span class="profile-menu__logout"
			@click="logoutUser"
		>Выйти</span>
	</aside>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import cOrderList from '@/components/content/inner-profile/order-list/c-order-list'
import cProductOrderList from '@/components/content/inner-profile/product-order-list/c-product-order-list'

export default {
	name: 'cProfile',
	components: {
		cOrderList,
		cProductOrderList,
	},
	filters: {
		profileName(val) {
			return val.split('@')[0];
		}
	},
	computed: {
		...mapGetters(['GET_USER']),
		...mapGetters('shop', [
			'GET_ICON_CLOSE_PROFILE',
			'GET_OFFSET_ORDER_MENU',
		]),
		getStyleOffsetOrderMenu() {
			return {
				left: `${this.GET_OFFSET_ORDER_MENU}%`
			}
		}
	},
	methods: {
		...mapActions([
			'LOGOUT_USER',
		]),
		...mapActions('shop', [
			'TOGGLE_PROFILE_MENU',
			'CLOSE_PROFILE_MENU',
			'SET_OFFSET_PRODUCT_ORDER_LIST',
		]),
		logoutUser() {
			this.LOGOUT_USER({ 
				isLocalStorage: true,
				methods: {
					'shop/CLEAR_LOCAL_STORAGE': 'productsCart',
					'shop/CLEAR_PRODUCTS_CART': null
				},
			 });
			this.TOGGLE_PROFILE_MENU();
		},
	},
	destroyed() {
		this.SET_OFFSET_PRODUCT_ORDER_LIST({ offset: 0 });
	}
}
</script>

<style lang="scss">
	.profile-menu {
		width: 35rem;
		height: 100%;
		background: linear-gradient(180deg, #1d2325, #2f393c);
		position: absolute;
		top: .1rem;
		right: 0;
		z-index: 10;

		@media (max-width: 450px) {
			width: 100%;
		}

		&__hide-menu {
			width: 4rem;
			height: 4rem;
			background-repeat: no-repeat;
			background-size: cover;
			filter: invert(1);
			cursor: pointer;
			position: absolute;
			top: .5rem;
			right: 0;

			&:active {
				filter: invert(.5);
			}
		}
		&__profile-name {
			height: 5rem;
			color: #d2da57;
			font-family: 'Gloria Hallelujah', cursive;
			font-size: 2.4rem;
			box-shadow: inset 0 0 4rem #131313;
			border-bottom: .1rem solid #2f393c;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		&__profile-order {
			height: calc(100% - 12rem);
			position: relative;
		}
		&__logout {
			color: #fff;
			cursor: pointer;
			position: absolute;
			left: 50%;
			bottom: 2rem;
			transform: translateX(-50%);
			border-radius: .3rem;
			background: #2f393c;
			box-shadow: 0 .2rem .8rem #000;
			padding: .7rem 1.5rem 1rem;
			transition: .2s;

			&:hover {
				box-shadow: 0 .2rem .5rem #000;
			}
		}
	}
	.profile-order {
		overflow: hidden;
		
		&__profile-order-wrapper {
			display: flex;
			position: absolute;
			top: 0;
			left: 0;
			transition: .2s;
		}
	}
	.profile-order-wrapper {
		width: 200%;
		height: 100%;

		&__order-container,
		&__product-order-container {
			display: flex;
			flex-direction: column;
		}
	}
</style>