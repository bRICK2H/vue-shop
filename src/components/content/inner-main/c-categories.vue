<template>
	<div class="category-shop"
		:class="[
			{ 'category-shop--default': getClassFromCategory },
			{ 'category-shop--modify': getClassToCategory }
		]"
	>
		<ul class="category-list">
			<router-link class="category-item category-list__category-item"
				v-for="category in GET_CATEGORIES"
				:key="category.id"
				:to="{ name: 'CategoryId', params: { categoryId: category.id } }"
				tag="li"
				:class="[
					{ 'category-item--default': getClassFromCategory },
					{ 'category-item--modify': getClassToCategory },
				]"
				active-class="category-item--active"
				@click.native="initDefaultTransformValue"
			>
				<transition name="discount-category">
					<span class="category-item__discount"
						v-if="getDiscountCategory === category.id"
					>%</span>
				</transition>
				<img class="category-item__icon"
					:src="category.icon" :alt="category.name"
				>
			</router-link>
		</ul>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'cCategories',
	data: () => ({
		isFromRouteCategoryId: false,
	}),
	computed: {
		...mapGetters('shop', ['GET_CATEGORIES', 'GET_DISCOUNT_PRODUCT']),
		getClassToCategory() {
			let categoryId = this.$route.params.categoryId;
			return categoryId === 'laptop' || categoryId === 'phone';
		},
		getClassFromCategory() {
			return this.isFromRouteCategoryId;
		},
		getDiscountCategory() {
			const { currDiscountProduct } = this.GET_DISCOUNT_PRODUCT;
			return currDiscountProduct.category;
		}
	},
	methods: {
		...mapActions('shop', ['CLOSE_CART_MENU', 'CLOSE_PROFILE_MENU']),
		initDefaultTransformValue() {
			this.CLOSE_CART_MENU();
			this.CLOSE_PROFILE_MENU();
			this.$emit('init-default-transform-value', { defaultTransformValue: 0 });
		}
	},
	watch: {
		$route(to, from) {
			if (from.name === 'CategoryId') {
				this.isFromRouteCategoryId = true;
			} else {
				this.isFromRouteCategoryId = false;
			}
		}
	}
}
</script>

<style lang="scss">
.category-shop {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	&--default {
		height: calc(100% - 40rem);
		animation: default-category-wrapper .2s forwards;

		@media (max-width: 320px) {
			height: calc(100% - 20rem);
		}

		@keyframes default-category-wrapper {
			100% { height: 100%; }
		}
	}
	&--modify {
		animation: modify-category-wrapper .2s forwards;

		@keyframes modify-category-wrapper {
			100% { height: calc(100% - 40rem); }
		}

		@media (max-width: 320px) {
			@keyframes modify-category-wrapper {
				100% { height: calc(100% - 20rem); }
			}
		}
	}
}
.category-list {
	display: flex;
	justify-content: center;
	align-items: center;
	
	&__category-item {
		margin: 0 1rem;
	}
}
.category-item {
	width: 15rem;
	height: 15rem;
	border-radius: .8rem;
	cursor: pointer;
	position: relative;
	background-color: #1d2325;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: .2rem .4rem .9rem #000;
	transition: .2s;

	@media (max-width: 540px) {
		width: 7rem;
		height: 7rem;
	}

	&--active {
		background-color: #000;
	}
	&--default {
		width: 10rem;
		height: 10rem;
		animation: default-category-item .2s forwards;

		@keyframes default-category-item {
			100% { width: 15rem; height: 15rem; }
		}

		@media (max-width: 540px) {
			width: 5rem;
			height: 5rem;

			@keyframes default-category-item {
				100% { width: 7rem; height: 7rem; }
			}
		}
	}
	&--default > &__discount {
		font-size: 2.5rem;

		@media (max-width: 540px) {
			font-size: 1.4rem;
		}
	}
	&--modify {
		animation: modify-category-item .2s forwards;

		@keyframes modify-category-item {
			100% { width: 10rem; height: 10rem; }
		}

		@media (max-width: 540px) {
			@keyframes modify-category-item {
				100% { width: 5rem; height: 5rem; }
			}
		}
	}
	&--modify > &__discount {
		font-size: 1.8rem;

		@media (max-width: 540px) {
			font-size: 1rem;
		}
	}
	&__discount {
		position: absolute;
		top: .5rem;
		left: .5rem;
		border-radius: .5rem;
		font-family: 'Gloria Hallelujah', cursive;
		font-weight: 400;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;

		@media (max-width: 540px) {
			top: .3rem;
			left: .3rem;
		}
	}

	&:hover {
		box-shadow: .2rem .4rem .6rem #000;
	}
	&__icon {
		width: 80%;
		filter: invert(.7);
	}
	&--active &__icon {
		filter: invert(1);
	}
}
.discount-category-leave-active {
	animation: discount-category-leave .3s;

	@keyframes discount-category-leave {
		20% { transform: scale(1.2) }
		100% { transform: scale(0) }
	}
}
.discount-category-enter-active {
	animation: discount-category-enter .3s;

	@keyframes discount-category-enter {
		0% { transform: scale(0) }
		80% { transform: scale(1.2) }
		100% { transform: scale(1) }
	}
}
</style>