<template>
   <div class="product-detail-content product-detail-container__product-detail-content">
		<div class="product-detail-content__header">
			<div class="left-detail-content product-detail-content__left-detail-content">
				<img class="left-detail-content__img"
					:src="currProduct.img" :alt="currProduct.name"
				>
				<span class="left-detail-content__total-price"
					:class="{ 'left-detail-content__total-price--discount': currProduct.discount }"
				>
					{{ GET_PRICE_MODIFICATION(currProduct.discountPrice ? currProduct.discountPrice : currProduct.price) }} ₽
				</span>
				<span class="left-detail-content__price"
					v-if="currProduct.discount"
				>
					{{ GET_PRICE_MODIFICATION(currProduct.price) }} ₽
				</span>
			</div>
			<div class="right-detail-content product-detail-content__right-detail-content">
				<div class="right-detail-content__box-discount"
					v-if="currProduct.discount"
				>
					<span class="right-detail-content__discount-procent">%</span>
					<span class="right-detail-content__discount-timer">
						{{ GET_TIME_DISCOUNT('string') }}
					</span>
				</div>
				<h3 class="right-detail-content__name">
					{{ currProduct.name }}
				</h3>
			</div>
		</div>
      <table class="table-descr product-detail-content__table-descr">
			<caption class="table-descr__title">Характеристики</caption>
			<tr class="table-descr__row"
				v-for="(value, key) in currProduct.descr"
				:key="key"
			>
				<td class="table-descr__cell">{{ key }}</td>
				<td class="table-descr__cell">{{ value }}</td>
			</tr>
      </table>
		<template>
      	<button class="product-detail-content__pay-product"
				v-if="!currProduct.inCart"
				@click="payProduct"
			>
				Купить
			</button>
      	<button class="product-detail-content__pay-product product-detail-content__pay-product--in-cart"
				v-else
				@click="OPEN_CART_MENU"
			>
				В корзине
			</button>
		</template>
   </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
   name: 'cProductDetail',
   props: ['categoryId', 'productId'],
   computed: {
      ...mapGetters('shop', ['GET_PRODUCT', 'GET_TIME_DISCOUNT', 'GET_PRICE_MODIFICATION']),
      currProduct() {
         return this.GET_PRODUCT({ categoryId: this.categoryId, productId: this.productId });
      },
	},
	methods: {
		...mapActions('shop', ['ADD_PRODUCT', 'OPEN_CART_MENU']),
		payProduct() {
			this.ADD_PRODUCT({
				product: this.currProduct,
				category: this.categoryId
			});
		}
	}
}
</script>

<style lang="scss">
   .product-detail-content {
      border-radius: 1rem;
      background: #fff;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;

		@media (max-width: 320px) {
			padding: 1rem;
		}
		&__header {
			display: flex;
			margin-bottom: 1rem;

			@media (max-width: 320px) {
				margin-bottom: .5rem;
			}
		}
		&__pay-product {
			padding: .7rem 3rem;
			background: #145a85;
			border: none;
			border-radius: 1rem;
			color: #fff;
			transition: .2s;

			@media (max-width: 320px) {
				padding: .5rem 1rem;
				font-size: 1.4rem;
			}

			&:hover {
				background: #0285b2;
			}

			&--in-cart {
				background: #2c772c;

				&:hover {
					background: #389438;
				}
			}
		}
   }
	.left-detail-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		
		&__img {
			margin-bottom: .5rem;

			@media (max-width: 320px) {
				height: 2rem;
				margin-bottom: .3rem;
			}
		}
		&__total-price {
			min-width: 10rem;
			text-align: center;
			font-size: 1.8rem;
			font-weight: 600;

			&--discount {
				color: red;
			}
			@media (max-width: 320px) {
				font-size: 1.3rem;
			}
		}
		&__price {
			position: absolute;
			bottom: -1.8rem;
			text-align: center;
			font-size: 1.5rem;
			font-weight: 400;
			color: #777;
			text-decoration: line-through;

			@media (max-width: 320px) {
				font-size: 1.2rem;
				bottom: -1rem;
			}
		}
	}
	.right-detail-content {
		display: flex;
		flex-direction: column;
		margin-left: 2rem;

		@media (max-width: 320px) {
			margin-left: 0;
		}

		&__box-discount {
			height: 2.5rem;
			display: flex;

			@media (max-width: 320px) {
				height: 2rem;
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-50%);
			}
		}
		&__discount-procent,
		&__discount-timer {
			height: 100%;
			font-weight: 400;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		&__discount-procent {
			width: 2.5rem;
			font-family: 'Gloria Hallelujah', cursive;
			text-align: center;
			background: red;
			border-top-left-radius: .5rem;
			border-bottom-left-radius: .5rem;

			@media (max-width: 320px) {
				font-size: 1.3rem;
			}
		}
		&__discount-timer {
			width: 4.5rem;
			font-size: 1.4rem;
			background: #000;
			border-top-right-radius: .5rem;
			border-bottom-right-radius: .5rem;

			@media (max-width: 320px) {
				font-size: 1.3rem;
			}
		}
		&__name {
			height: 100%;
			font-size: 2rem;
			font-weight: 500;
			display: flex;
			align-items: center;

			@media (max-width: 550px) {
				font-size: 1.6rem;
			}
			@media (max-width: 320px) {
				font-size: 1.1rem;
			}
		}
	}
	.table-descr {
		width: 100%;

		&__title {
			font-weight: 600;
			margin-bottom: 1rem;

			@media (max-width: 550px) {
				font-size: 1.6rem;
			}
			@media (max-width: 320px) {
				font-size: 1.3rem;
				margin-bottom: .5rem;
			}
		}
		&__cell {
			font-size: 1.6rem;

			@media (max-width: 550px) {
				font-size: 1.4rem;
			}
			@media (max-width: 320px) {
				font-size: 1rem;
			}

			&:nth-child(odd) {
				width: 50%;
				font-weight: 400;

				@media (max-width: 320px) {
					width: 60%;
				}
			}
			&:nth-child(even) {
				font-size: 1.5rem;

				@media (max-width: 550px) {
				font-size: 1.3rem;
			}
				@media (max-width: 320px) {
					font-size: .7rem;
				}
			}
		}
	}
</style>