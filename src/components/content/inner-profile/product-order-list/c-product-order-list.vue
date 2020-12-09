<template>
   <div class="product-order-container profile-order-wrapper__product-order-container"
		v-if="GET_IS_ISSET_ORDERED_PRODUCTS"
	>
		<img class="product-order-container__close-history"
			:src="GET_ICON_CLOSE_ORDER_MENU"
			alt="close-history"
			@click="closeOrderMenu"
		>
		<div>
			<span class="product-order-container__history-title">
				Заказ №
				<span>{{ GET_ORDER_NUMBER }}</span>
			</span>
			<span class="product-order-container__final-price">
				<span>на сумму</span> {{ GET_FINAL_PRICE }} ₽
			</span>
		</div>
      <transition-group tag="ul" :name="GET_ANIMATE_NAME_ORDER_PRODUCT_LIST" mode="out-in"
			class="product-order-list product-order-container__product-order-list"
		>
         <li class="product-order-item product-order-list__product-order-item"
				:class="{ 'product-order-item--discount': order.discount }"
            v-for="order in GET_PAGINATION_LIST"
            :key="order.name"
         >
				<div class="product-order-conatiner-img product-order-item__product-order-conatiner-img">
					<div class="product-order-conatiner-img__box-img">
						<img class="product-order-conatiner-img__img"
							:src="order.img"
							:alt="order.name"
						>
					</div>
				</div>
				<div class="product-order-content product-order-item__product-order-content">
					<div class="product-order-content__header-box">
						<span class="product-order-content__total-price">
							{{ order.totalPrice }} ₽
						</span>
						<span class="product-order-content__amount">
							{{ order.amount }} шт.
						</span>	
					</div>
					<h4 class="product-order-content__name">
						{{ order.name }}
					</h4>
				</div>
         </li>
      </transition-group>
		
      <c-pagination-product-order-list
			:paginationOptions="[GET_ORDERED_PRODUCTS, itemsInPage]"
      />
   </div>
</template>

<script>
import cPaginationProductOrderList from '@/components/content/inner-profile/product-order-list/c-pagination-product-order-list'
import { mapActions, mapGetters } from 'vuex'

export default {
   name: 'cProductOrderList',
   components: {
		cPaginationProductOrderList,
	},
	data: () => ({
		itemsInPage: 4,
	}),
   computed: {
      ...mapGetters('shop', [
			'GET_IS_ISSET_ORDERED_PRODUCTS',
			'GET_ICON_CLOSE_ORDER_MENU',
			'GET_ORDERED_PRODUCTS',
			'GET_ORDER_NUMBER',
			'GET_FINAL_PRICE',
			'GET_ANIMATE_NAME_ORDER_PRODUCT_LIST',
		]),
		...mapGetters('shop/productOrderList', ['GET_PAGINATION_LIST']),
	},
	methods: {
		...mapActions('shop/productOrderList', ['SET_FIRST_PAGINATION_LIST_PAGE']),
		...mapActions('shop', ['SET_OFFSET_PRODUCT_ORDER_LIST']),
		closeOrderMenu() {
			this.SET_FIRST_PAGINATION_LIST_PAGE();
			this.SET_OFFSET_PRODUCT_ORDER_LIST({
				offset: 0,
			})
		}
	},
	created() {
		const watchItemsInPage = () => {
			const DEFAULT_ITEM_IN_PAGE = 8;
			const MEDIA_SIZES = [
				{ 3: [568] },
				{ 4: [640, 653, 667] },
				{ 5: [720, 731, 736, 768] },
				{ 6: [823, 812] },
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
   .product-order-container {
      flex: 0 1 50%;
		background: linear-gradient(180deg, #131313, transparent);
		position: relative;

		&__close-history {
			width: 2rem;
			height: 2rem;
			background-repeat: no-repeat;
			background-size: cover;
			transform: rotate(180deg);
			filter: invert(1);
			cursor: pointer;
			position: absolute;
			top: .8rem;
			right: .8rem;
		}
		&__history-title,
		&__final-price {
			display: block;
			margin: 1rem 0 0;
			text-align: center;
			color: #fff;
		}
		&__history-title {
			height: 4rem;
			font-size: 1.6rem;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		&__final-price {
			font-size: 1.8rem;
			color: #d67000;
			font-weight: 500;
		}
		&__product-order-list {
			flex: 1 1 auto;
			margin: 2rem 1.5rem 0;
		}
	}
	.product-order-list {

		&__product-order-item {
			display: flex;
			align-items: center;
			margin-bottom: 1rem;
			box-shadow: 0 .3rem 1rem #000;
		}
	}
	.product-order-item {
		height: 6.5rem;
		border-radius: .3rem;
		background: #fff;
		padding-right: 1rem;
		position: relative;

		&--discount {
			&::before {
				content: '%';
				width: 1.5rem;
				height: 1.5rem;
				border-radius: .3rem;
				position: absolute;
				top: .5rem;
				left: .5rem;
				font-family: 'Gloria Hallelujah', cursive;
				font-size: 1.3rem;
				font-weight: 500;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		&__product-order-content {
			display: flex;
			justify-content: space-around;
			align-items: center;
		}
	}
	.product-order-conatiner-img {
		flex: 1 1 auto;
		
		&__box-img {
			height: 5rem;
			display: flex;
			justify-content: center;
		}
		&__img {
			height: 100%;
		}
	}
	.product-order-content {
		flex: 0 1 60%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;

		&__header-box {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: .5rem;
		}
		&__total-price {
			font-size: 1.6rem;
			font-weight: 600;
		}
		&__amount {
			font-size: 1.3rem;
			font-weight: 500;
		}
		&__name {
			font-size: 1.2rem;
		}
	}

	.product-order-list-enter-active {
		opacity: 0;
		animation: product-order-list-enter .2s .2s;

		@keyframes product-order-list-enter {
			100% { opacity: 1; }
		}
	}
	.product-order-list-leave-active {
		animation: product-order-list-leave .1s;

		@keyframes product-order-list-leave {
			100% { opacity: 0; }
		}
	}
</style>