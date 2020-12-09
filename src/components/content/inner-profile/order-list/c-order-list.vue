<template>
   <div class="order-container profile-order-wrapper__order-container">
		<span class="order-container__history-title">
			История заказов
		</span>
		<template v-if="GET_IS_ISSET_ORDERED_LIST">
			<transition-group tag="ul" name="order-list" mode="out-in"
				class="order-list order-container__order-list">
				<li class="order-item order-list__order-item" 
					v-for="order in GET_PAGINATION_LIST"
					:key="order.orderNumber"
					@click="openOrderMenu(order.orderNumber)"
				>
					<div class="order-content order-item__order-content">
						<div class="order-content__box-locale">
							<span class="order-content__date">
								{{ order.date }}
							</span>
							<span class="order-content__time">
								{{ order.time | time}}
							</span>
						</div>
						<span class="order-content__final-price">
							{{ order.finalPrice }} ₽
						</span>
					</div>
				</li>
			</transition-group>

			<c-pagination-order-list
				:list="GET_ORDERED_LIST"
				:itemsInPage="itemsInPage"
			/>
		</template>
		<template v-else>
			<span class="order-container__empty-info">
				Вы еще ничего не купили!
			</span>
		</template>
   </div>
</template>

<script>
import cPaginationOrderList from '@/components/content/inner-profile/order-list/c-pagination-order-list'
import { mapActions, mapGetters } from 'vuex'

export default {
   name: 'cOrderList',
   components: {
		cPaginationOrderList,
	},
	data: () => ({
		itemsInPage: 5,
	}),
	filters: {
		time(val) {
			const [hours, minutes] = val.split(':');
			return `${hours}:${minutes}`;
		}
	},
   computed: {
      ...mapGetters('shop', [
			'GET_ORDERED_LIST',
			'GET_IS_ISSET_ORDERED_LIST'
		]),
		...mapGetters('shop/orderList', ['GET_PAGINATION_LIST']),
	},
	methods: {
		...mapActions('shop', [
			'SET_ORDERED_PRODUCTS',
			'SET_OFFSET_PRODUCT_ORDER_LIST',
			'SET_IS_ANIMATE_PRODUCT_ORDER_LIST'
		]),
		...mapActions('shop/productOrderList', {
			SET_FIRST_PAGE_IN_PRODUCT_ORDER_LIST: 'SET_FIRST_PAGINATION_LIST_PAGE'
		}),
		...mapActions('shop/orderList', {
			SET_FIRST_PAGE_IN_ORDER_LIST: 'SET_FIRST_PAGINATION_LIST_PAGE'
		}),
		openOrderMenu(orderNumber) {
			this.SET_ORDERED_PRODUCTS(orderNumber);
			this.SET_OFFSET_PRODUCT_ORDER_LIST({ offset: -100 });
			this.SET_IS_ANIMATE_PRODUCT_ORDER_LIST(false);
			this.SET_FIRST_PAGE_IN_PRODUCT_ORDER_LIST();
		}
	},
	created() {
		const watchItemsInPage = () => {
			const MEDIA_SIZES = [
				{ 4: [568] },
				{ 5: [640, 667, 720] },
				{ 6: [653, 731, 736, 768] },
				{ 7: [812, 823] },
				{ 9: [1024] },
				{ 13: [1366] },
			];

			const SET_ITEM_IN_PAGE = mediaSizes => {
				const DEFAULT_ITEM_IN_PAGE = 8;
				const ITEM_IN_PAGE = mediaSizes.find(curr => {
					const [ sizes ] = Object.values(curr);
					return sizes.includes(innerHeight);
				});

				this.itemsInPage = ITEM_IN_PAGE
					? +Object.keys(ITEM_IN_PAGE)
					: DEFAULT_ITEM_IN_PAGE;
			}

			SET_ITEM_IN_PAGE(MEDIA_SIZES);
			this.SET_FIRST_PAGE_IN_ORDER_LIST();
		}

		watchItemsInPage();
		window.addEventListener('resize', watchItemsInPage);
	}
}
</script>

<style lang="scss">
   .order-container {
		flex: 0 1 50%;
		background: linear-gradient(180deg, #131313, transparent);
		position: relative;

		&__history-title {
			display: block;
			margin: 1rem 0 0;
			text-align: center;
			color: #fff;
		}
		&__empty-info {
			height: 100%;
			color: tomato;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		&__order-list {
			flex: 1 1 auto;
			margin: 2rem 1.5rem 0;
		}
	}
	.order-list {

		&__order-item {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			margin-bottom: 1rem;
		}
	}
	.order-item {
		height: 6.5rem;
		border-radius: .3rem;
		background: linear-gradient(180deg, #2f393c, #111);
		box-shadow: 0 0 1rem #111;
		cursor: pointer;

		@media (max-width: 375px) {
			height: 6rem;
		}
		&:hover {
			background: linear-gradient(180deg, #111, #2f393c);
		}
		&__order-content {
			display: flex;
			justify-content: space-around;
			align-items: center;
		}
	}
	.order-content {
		&__box-locale {
			font-size: 1.4rem;
			font-weight: 500;
			color: #bbb;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
		}
		&__date {
			margin-bottom: .5rem;
		}
		&__time {
			font-size: 1.2rem;
			color: #bbb;
		}
		&__final-price {
			font-weight: 600;
			color: #d67000;
		}
	}

	.order-list-enter-active {
		opacity: 0;
		animation: order-list-enter .2s .2s;

		@keyframes order-list-enter {
			100% { opacity: 1; }
		}
	}
	.order-list-leave-active {
		animation: order-list-leave .2s;

		@keyframes order-list-leave {
			100% { opacity: 0; }
		}
	}
</style>