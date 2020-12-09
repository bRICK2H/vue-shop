<template>
	<aside class="cart-menu">
		<span class="cart-menu__hide-menu"
			:style="{ 'background-image': `url(${GET_ICON_CLOSE_CART})` }"
			@click="CLOSE_CART_MENU"
		></span>
		<h3 class="cart-menu__title">Корзина</h3>
		<p class="cart-menu__cart-product-empty"
			v-if="!IS_ISSET_PRODUCT_IN_CART"
		>В корзине нет товаров.</p>
		<template v-else>
			<transition-group tag="ul" name="cart-list"
				class="cart-product-list cart-menu__cart-product-list"
			>
				<li class="cart-product-list__item"
					v-for="product of GET_PAGINATION_LIST"
					:key="product.id"
				>
					<div class="cart-product-list__box-discount"
						v-if="product.discount"
					>
						<span class="cart-product-list__discount-timer">
							{{ GET_TIME_DISCOUNT('object').minutes }}
						</span>
						<span class="cart-product-list__discount-timer">
							{{ GET_TIME_DISCOUNT('object').seconds }}
						</span>
					</div>
					<router-link class="cart-product-list__box-icon"
						:to="{ name: 'ProductId', params: { productId: product.id, categoryId: product.category } }"
						@click.native="CLOSE_CART_MENU"
					>
						<img class="cart-product-list__icon"
						:src="product.img" :alt="product.name"
					>
					</router-link>
					<div class="cart-product-list__content">
						<div class="cart-product-list__header">
							<span class="cart-product-list__price"
								:class="{ 'cart-product-list__price--discount': product.discount }"
							>
								{{ GET_PRICE_MODIFICATION(product.totalPrice) }} ₽
							</span>
							<div class="cart-product-list__box-amount">
								<span class="cart-product-list__amount-minus"
									:class="{ 'cart-product-list__amount-minus--one': product.amount === 1 }"
									@click="updateAmount('minus', product.id)"
								></span>
								<span class="cart-product-list__amount">
									{{ product.amount }}
								</span>
								<span class="cart-product-list__amount-plus"
									@click="updateAmount('plus', product.id)"
								></span>
							</div>
						</div>
						<h3 class="cart-product-list__name">
							{{ product.name }}
						</h3>
					</div>
					<span class="cart-product-list__box-delete"
						@click.once="deleteProduct(product.category, product.id)"
					>
						<img class="cart-product-list__delete"
							:src="GET_ICON_DELETE"
							alt="delete"
						>
					</span>
				</li>
			</transition-group>
			<div class="cart-menu__pagination-container">
				<c-pagination-cart-list
					:paginationOptions="[GET_PRODUCTS_IN_CART, itemsInPage]"
				/>
			</div>
			<div class="cart-total-sum cart-menu__cart-total-sum">
				<p class="cart-total-sum__box-sum">
					<span class="cart-total-sum__name">Сумма</span>
					<span class="cart-total-sum__total">{{ GET_PRICE_MODIFICATION(GET_TOTAL_SUM) }} ₽</span>
				</p>
				<button class="cart-total-sum__buy"
					:class="{'cart-total-sum__buy--process': GET_IS_ORDER_REQUEST}"
					:disabled="GET_IS_ORDER_REQUEST"
					@click="orderProducts"
				>Заказать</button>
			</div>
		</template>
	</aside>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import cPaginationCartList from '@/components/content/c-pagination-cart-list'

export default {
	name: 'cCart',
	components: {
		cPaginationCartList
	},
	data: () => ({
		maxProductInCartPage: 6,
		staticOffsetCartPage: 36,
		dynamicOffsetCartPage: 0,
		currDot: 1,
		itemsInPage: null,
	}),
	computed: {
		...mapGetters('shop', [
			'GET_TOTAL_SUM',
			'GET_ICON_DELETE',
			'GET_ICON_CLOSE_CART',
			'GET_PRODUCTS_IN_CART',
			'GET_TIME_DISCOUNT',
			'GET_PRICE_MODIFICATION',
			'IS_ISSET_PRODUCT_IN_CART',
			'GET_IS_ORDER_REQUEST',
		]),
		...mapGetters('shop/cartList', ['GET_PAGINATION_LIST']),
	},
	methods: {
		...mapActions('shop', [
			'CLOSE_CART_MENU',
			'DELETE_PRODUCT',
			'UPDATE_AMOUNT_PRODUCT',
			'ORDER_PRODUCTS',
		]),
		...mapActions('shop/cartList', ['SET_FIRST_PAGINATION_LIST_PAGE']),
		deleteProduct(categoryId, productId) {
			this.DELETE_PRODUCT({ categoryId, productId });
		},
		changeProductCartPage(currDot) {
			this.currDot = currDot;
			this.dynamicOffsetCartPage = this.staticOffsetCartPage * (this.currDot - 1);
		},
		updateAmount(string, id) {
			this.UPDATE_AMOUNT_PRODUCT({ string, productId: id });
		},
		orderProducts() {
			this.ORDER_PRODUCTS();
		}
	},
	created() {
		const watchItemsInPage = () => {
			const DEFAULT_ITEM_IN_PAGE = 8;
			const MEDIA_SIZES = [
				{ 3: [568, 653] },
				{ 4: [640, 667] },
				{ 5: [720, 731, 736] },
				{ 6: [768, 812, 823] },
				{ 9: [1024] },
				{ 13: [1366] },
			];

			const SET_ITEM_IN_PAGE = mediaSizes => {
				const ITEM_IN_PAGE = mediaSizes.find(curr => {
					const [ sizes ] = Object.values(curr);
					return sizes.includes(innerHeight);
				});

				this.itemsInPage = ITEM_IN_PAGE
					? +Object.keys(ITEM_IN_PAGE)
					: DEFAULT_ITEM_IN_PAGE;
			}

			SET_ITEM_IN_PAGE(MEDIA_SIZES);
			this.SET_FIRST_PAGINATION_LIST_PAGE();
		}

		watchItemsInPage();
		window.addEventListener('resize', watchItemsInPage);
	}
}
</script>

<style lang="scss">
	.cart-menu {
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
			right: .2rem;

			&:active {
				filter: invert(.5);
			}
		}
		&__title {
			text-align: center;
			margin: 1.5rem 0 2rem;
			font-size: 2rem;
			color: #fff;
		}
		&__cart-product-empty {
			height: calc(100% - 8.5rem);
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
		}
		&__pagination-container {
			height: 2rem;
			position: absolute;
			bottom: 13rem;
			left: 50%;
			transform: translateX(-50%);
		}
		&__cart-product-list {
			padding: 0 2rem;
		}
		&__cart-total-sum {
			margin: 2rem;
			position: absolute;
			left: 0;
			bottom: 0;
		}
	}

	.cart-product-list {
		display: flex;
		flex-direction: column;

		&__item {
			display: flex;
			position: relative;
			background: #fff;
			margin-bottom: 1rem;
			padding: 1rem;
			border-radius: .3rem;
			box-shadow: 0 .3rem 1rem #000;
		}
		&__box-icon {
			height: 5rem;
			flex: 1 0 8.6rem;
			display: flex;
			justify-content: center;
			position: relative;
		}
		&__box-discount {
			width: 2rem;
			position: absolute;
			top: 50%;
			left: -1rem;
			transform: translateY(-50%);
			display: flex;
			flex-direction: column;
		}
		&__discount-timer {
			height: 2rem;
			font-size: 1.1rem;
			color: #fff;
			font-weight: 500;
			border-radius: .3rem;
			background: #000;
			display: flex;
			justify-content: center;
			align-items: center;

			&:not(:last-of-type) {
				margin-bottom: .2rem;
			}
		}
		&__icon {
			height: 100%;
		}
		&__content {
			margin-left: 1rem;
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		&__header {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		&__price {
			display: inline-block;
			font-size: 1.6rem;
			font-weight: 600;

			&--discount {
				color: red;
				
				&::after {
					content: '%';
					font-size: 1.3rem;
					font-weight: 600;
					border-radius: .3rem;
					color: red;
					position: absolute;
					top: -.6rem;
					left: -1.2rem;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
		&__box-amount {
			font-size: 1.6rem;
			display: flex;
			align-items: center;
		}
		&__amount {
			display: inline-block;
			width: 3rem;
			text-align: center;
    		font-weight: 600;
		}
		&__amount-plus,
		&__amount-minus {
			width: 1.4rem;
			height: 1.4rem;
			cursor: pointer;
			background-repeat: no-repeat;
			background-size: cover;

			&--one {
				filter: invert(.5);
			}
		}
		&__amount-minus {
			background-image: url('/static/icons/minus.svg');
		}
		&__amount-plus {
			background-image: url('/static/icons/plus.svg');
		}
		&__box-delete {
			width: 1.8rem;
			height: 1.8rem;
			background: #f05656;
			border-radius: .3rem;
			position: absolute;
			bottom: 0;
			right: -.9rem;
			box-shadow: -.2rem 0 1rem #000;
			cursor: pointer;

			&:hover {
				background: #f08080;
			}
		}
		&__delete {
			width: 1.6rem;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		&__name {
			font-size: 1rem;
			line-height: 1.2;
			font-weight: 500;
			margin-right: .5rem;
		}
	}
	.cart-total-sum {
		width: calc(100% - 4rem);
		text-align: center;

		&__box-sum {
			color: #fff;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 2.5rem;
		}
		&__total {
			font-size: 2.5rem;
			font-weight: 500;
			color: #f37f00;
		}
		&__buy {
			font-size: 2rem;
			border: none;
			border-radius: .5rem;
			background: #d67000;
			padding: 1rem 3rem;
			color: #fff;
			transition: .2s;

			&:hover {
				background: #d87911;
			}
			&--process {
				background: #555;

				&:hover {
					background: #666;
				}
			}
		}
	}

	.cart-list-enter-active {
		opacity: 0;
		animation: cart-list-enter .2s .2s;

		@keyframes cart-list-enter {
			100% { opacity: 1; }
		}
	}
	.cart-list-leave-active {
		animation: cart-list-leave .2s;

		@keyframes cart-list-leave {
			100% { opacity: 0; }
		}
	}
</style>