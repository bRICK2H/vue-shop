<template>
	<div class="product">

		<!-- Product detail -->
		<transition name="product-detail">
			<router-view></router-view>
		</transition>

		<!-- Product scroll -->
		<div class="product-scroll-bar">
			<span class="product-scroll-bar__slider"
				:style="[getCurrStyleHeightScroll, getCurrStyleTranslateScroll]"
			></span>
		</div>

		<!-- Product list -->
		<div class="product-container"
			:style="[getCurrStyleTranslateProducts, getCurrStyleHeightProductContainer]"
			@wheel="scrollProducts"
		>
			<transition-group
				class="product-list"
				tag="ul"
				name="product"
			>
				<li class="product-item product-list__product-item"
					v-for="product of GET_PRODUCTS_CURR_CATEGORY($route.params.categoryId)"
					:key="product.id"
					:style="getCurrStyleFlexPruduct"
				>
					<div class="product-content product-item__product-content">
						<div class="product-content__header">
							<router-link class="product-content__link"
								:to="{ name: 'ProductId', params: { productId: product.id } }"
							>
								<img class="product-content__img"
									:src="product.img" :alt="product.name"
								>
							</router-link>
							<div class="container-discount product-item__container-discount"
								v-if="product.discount"
							>
								<div class="box-discount container-discount__box-discount">
									<span class="box-discount__discount">
										-{{ product.discount }}
									</span>
									<span class="box-discount__procent">%</span>
								</div>
								<span class="container-discount__timer">
									{{ GET_TIME_DISCOUNT('string') }}
								</span>
							</div>
							<div class="product-item__box-price">
								<span class="product-item__total-price"
									:class="{ 'product-item__total-price--discount': product.discount }"
								>
									{{ GET_PRICE_MODIFICATION(product.discountPrice ? product.discountPrice : product.price) }} ₽
								</span>
								<span class="product-item__price"
									v-if="product.discount"
								>
									{{ GET_PRICE_MODIFICATION(product.price) }} ₽
								</span>
							</div>
							<p class="product-item__name">
								{{ product.name }}
							</p>
						</div>
					</div>

					<div class="product-item__box-button">
						<template>
							<button class="product-item__pay"
								v-if="!product.inCart"
								@click="addProduct(product)"
							>Купить</button>
							<button class="product-item__pay product-item__pay--in-cart"
								v-else
								@click="toggleMenu"
							>В корзине</button>
						</template>
						<router-link class="product-item__detail"
							:to="{ name: 'ProductId', params: { productId: product.id } }"
							@click.native="CLOSE_CART_MENU"
						>Подробнее</router-link>
					</div>
				</li>
			</transition-group>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'cProducts',
	props: {
		defaultTransformValue: {
			type: Object,
			default: () => ({}),
		}
	},
	data: () => ({
		currTranslateProduct: 0,
		currTranslateScroll: 0,
		staticOffsetProduct: 19.5,
		staticOffsetScroll: 40,
		currProductPage: 1,
		productsPerPage: 8,
		productRowPerPage: 2,
		isWheel: true,
	}),
	computed: {
		...mapGetters('shop', [
			'GET_PRODUCTS_CURR_CATEGORY',
			'GET_TIME_DISCOUNT',
			'GET_PRICE_MODIFICATION',
		]),
		currProductRows() {
			const LENGTH_PRODUCTS = this.GET_PRODUCTS_CURR_CATEGORY(this.$route.params.categoryId).length;
			const ROWS = Math.ceil(LENGTH_PRODUCTS / (this.productsPerPage / this.productRowPerPage));
			return this.productRowPerPage === 2 ? ROWS - 1 : ROWS;
		},
		getCurrStyleFlexPruduct() {
			return {flex: `0 1 calc(${100 / (this.productsPerPage / this.productRowPerPage)}% - 1rem)`}
		},
		getCurrStyleTranslateProducts() {
			return { transform: `translateY(-${this.currTranslateProduct}rem)` }
		},
		getCurrStyleHeightProductContainer() {
			return { height: `${this.currProductRows * this.staticOffsetScroll }rem` }
		},
		getHeightScroll() {
			return (this.staticOffsetScroll - 2) / this.currProductRows;
		},
		getCurrStyleHeightScroll() {
			return { height: `${this.getHeightScroll}rem` }
		},
		getCurrStyleTranslateScroll() {
			return { transform: `translateY(${this.currTranslateScroll}rem)` }
		},
	},
	methods: {
		...mapActions('shop', [
			'ADD_PRODUCT',
			'OPEN_CART_MENU',
			'CLOSE_CART_MENU',
			'CLOSE_PROFILE_MENU',
		]),
		scrollProducts() {
			if (!this.isWheel) return;

			if (event.deltaY < 0) {
				this.currProductPage -= 1;
				if (this.currProductPage < 1) {
					this.currProductPage = 1;
				};
			} else {
				this.currProductPage += 1;
				if (this.currProductPage >= this.currProductRows) {
					this.currProductPage = this.currProductRows;
				};
			}

			this.currTranslateProduct = (this.currProductPage - 1) * this.staticOffsetProduct;
			this.currTranslateScroll = (this.currProductPage - 1) * this.getHeightScroll;
			this.isWheel = false;

			setTimeout(() => {
				this.isWheel = true;
			}, 100)
		},
		addProduct(product) {
			this.ADD_PRODUCT({
				product,
				category: this.$route.params.categoryId
			});
		},
		toggleMenu() {
			this.OPEN_CART_MENU();
			this.CLOSE_PROFILE_MENU();
		}
	},
	watch: {
		defaultTransformValue({ defaultTransformValue }) {
			this.currProductPage = 1;
			this.currTranslateProduct = defaultTransformValue;
			this.currTranslateScroll = defaultTransformValue;
		},
	},
	created() {
		let setProductsPerPage = () => {
			this.currProductPage = 1;
			this.currTranslateProduct = 0;
			this.currTranslateScroll = 0;

			if (innerWidth <= 320) {
				this.productRowPerPage = 1;
				this.staticOffsetScroll = 20;
				this.staticOffsetProduct = 19;
			} else {
				this.productRowPerPage = 2;
				this.staticOffsetScroll = 40;
				this.staticOffsetProduct = 19.5;
			}

			if(innerWidth <= 320) {
				this.productsPerPage = 1;
			} else if(innerWidth <= 540) {
				this.productsPerPage = 2;
				
			} else if(innerWidth <= 765) {
				this.productsPerPage = 4
			} else if(innerWidth <= 1024) {
				this.productsPerPage = 6
			} else {
				this.productsPerPage = 8
			}
		}

		setProductsPerPage();
		window.addEventListener('resize', setProductsPerPage);
	}
}
</script>

<style lang="scss">
.product {
	height: 40rem;
	overflow: hidden;
	margin: auto;
	position: relative;

	@media (max-width: 320px) {
		height: 20rem;
	}
}
.product-scroll-bar {
	width: .6rem;
	height: calc(40rem - 2rem);
	position: absolute;
	bottom: 1rem;
	right: 1rem;
	z-index: 1;

	@media (max-width: 320px) {
		height: calc(20rem - 2rem);
		right: .7rem;
	}

	&__slider {
		width: 100%;
		display: block;
		background: #fff;
		border-radius: 5rem;
		cursor: no-drop;
		transition: .2s ease-out;
	}
}
.product-container {
	display: flex;
	justify-content: center;
	background: #1d2325;
	background: linear-gradient(180deg, #1d2325, #272f31);
	transition: .2s ease-out;
}
.product-list {
	width: 60%;
	height: 40rem;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;

	@media(max-width: 1670px) {
		width: 70%;
	}
	@media(max-width: 1324px) {
		width: 90%;
	}
	@media (max-width: 320px) {
		height: 20rem;
	}

	&__product-item {
		height: calc(50% - 1.5rem);
		margin: 1rem .5rem 0;

		@media (max-width: 320px) {
			height: calc(100% - 2rem);
		}
	}
}
.product-item {
	position: relative;
	overflow: hidden;
	background: #fff;
	padding: 1rem;
	border-radius: .5rem;
	background-repeat: no-repeat;

	&__container-discount {
		width: 100%;
		height: 2.2rem;
		position: absolute;
		top: 0;
		left: 0;
	}
	&__box-price {
		position: relative;
	}
	&__total-price {
		display: inline-block;
		font-size: 2rem;
		font-weight: 600;
		margin: 2rem 0;

		@media (max-width: 1069px) {
			font-size: 1.7rem;
		}
		&--discount {
			color: red;
		}
	}
	&__price {
		position: absolute;
		bottom: .5rem;
		left: 0;
		font-size: 1.4rem;
		color: #555;
		text-decoration: line-through;
	}
	&__name {
		font-size: 1.4rem;
		font-weight: 400;
	}
	&__box-button {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		display: flex;
		padding: 1rem;
	}
	&__pay, &__detail {
		flex: 1 1 50%;
		text-align: center;
		font-size: 1.5rem;
		padding: .5rem 0;
		color: #fff;
		border-radius: .5rem;
		transition: .2s;
	}
	&__pay {
		margin-right: 1rem;
		border: none;
		background: #145a85;

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
	&__detail {
		background: #1d2325;

		&:hover {
			background: #2d373a;
		}
	}
}
.container-discount {
	font-weight: 500;
	
	&__box-discount {
		width: 10rem;
		height: 2.5rem;
		position: absolute;
		top: .5rem;
		right: -3.5rem;
		z-index: 2;
		color: #fff;
		background: red;
		display: flex;
		justify-content: center;
		align-items: center;
		transform: rotate(45deg);
	}
	&__timer {
		width: 5rem;
		height: 2rem;
		font-size: 1.4rem;
		color: #000;
		font-weight: 600;
		border-radius: .3rem;
		margin: .5rem 0 0 1rem;
		border: 2px solid red;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
.box-discount {
	
	&__discount {
		font-family: 'Gloria Hallelujah', cursive;
		font-size: 1.8rem;
	}
	&__procent {
		font-size: 1rem;
	}
}
.product-content {
	
	&__link {
		float: right;
		position: relative;
		z-index: 1;
		margin-bottom: .5rem;
		margin-left: .5rem;
	}
}

.product-enter-active {
	transform: scale(0);
	animation: product-enter .3s .3s;

	@keyframes product-enter {
		100% { transform: scale(1) }
	}
}
.product-leave-active {
	animation: product-leave .3s;

	@keyframes product-leave {
		100% { transform: scale(0) }
	}
}
.product-detail-enter-active {
	opacity: 0;
	animation: product-detail-enter .3s forwards;

	@keyframes product-detail-enter {
		100% { opacity: 1; }
	}
}
.product-detail-leave-active {
	animation: product-detail-leave .3s forwards;

	@keyframes product-detail-leave {
		100% { opacity: 0; }
	}
}
</style>