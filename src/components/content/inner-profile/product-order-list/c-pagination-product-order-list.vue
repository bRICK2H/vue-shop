<template>
   <transition name="pagination-button">
      <ul class="pagination-orders"
         v-show="GET_IS_SHOW_PAGINATION_LIST"
      >
         <li class="pagination-orders__item"
            v-for="page of GET_PAGINATION_LIST_PER_PAGE"
            :key="page"
            @click="showSelectedPage(page)"
         >
            <span class="pagination-orders__page"
               :class="{ 'pagination-orders__page--active': GET_PAGINATION_CURR_LIST_PAGE === page}"
            >
               {{ page }}
            </span>
         </li>
      </ul>
   </transition>
</template>

<script>
import Vue from 'vue'
const vm = new Vue()
import { mapGetters, mapActions } from 'vuex'

export default {
   name: 'cPaginationProductOrderList',
   data: () => ({
      currList: null,
   }),
   props: {
		paginationOptions: {
			type: Array, 
			required: true,
		}
   },
   computed: {
		...mapGetters('shop/productOrderList', [
         'GET_IS_SHOW_PAGINATION_LIST',
         'GET_PAGINATION_LIST_PER_PAGE',
         'GET_PAGINATION_CURR_LIST_PAGE'
		]),
		getItemsInPage() {
			return this.itemsInPage;
		}
	},
	methods: {
      ...mapActions('shop/productOrderList', [
         'SET_INIT_PAGINATION_OPTIONS',
         'SET_CURR_PAGINATION_LIST_PAGE'
		]),
		...mapActions('shop', ['SET_IS_ANIMATE_PRODUCT_ORDER_LIST']),
		showSelectedPage(page) {
			this.SET_CURR_PAGINATION_LIST_PAGE(page);
			this.SET_IS_ANIMATE_PRODUCT_ORDER_LIST(true);
		}
   },
	watch: {
		paginationOptions: {
			immediate: true,
			handler(val) {
				const [list, itemsInPage] = val;
				
				this.SET_INIT_PAGINATION_OPTIONS({
               list, itemsInPage
				});
			}
		}
	}
}
</script>

<style lang="scss">
.pagination-orders {
   width: 100%;
   display: flex;
   justify-content: center;
	display: inline-flex;
	align-items: center;

	&__item {
		width: 2rem;
		height: 2rem;

		&:not(:last-child) {
			margin-right: .5rem;
		}
	}
	&__page {
		display: block;
		width: 100%;
		height: 100%;
      font-family: 'Gloria Hallelujah', cursive;
      font-size: 1.4rem;
      color: #fff;
		border-radius: .3rem;
		background: #444;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;

		&--active {
			transform: scale(1.1);
			background: #d67000;
		}
	}
}

// Transition
.pagination-button-enter,
.pagination-button-leave-to {
   transform: translateX(-5rem);
   opacity: 0;
}
.pagination-button-enter-active,
.pagination-button-leave-active {
   transition: .4s;
}
.pagination-button-enter-to {
   transform: translateX(0);
   opacity: 1;
}
@keyframes pagination-button {
   100% { transform: translateX(0); }
}
</style>