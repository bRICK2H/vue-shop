<template>
	<div class="main-shop">
		<!-- Categories -->
		<c-categories 
			@init-default-transform-value="defaultTransformValue = $event"
		/>	

		<!-- Products -->
		<transition name="product-view">
			<router-view
				:defaultTransformValue="defaultTransformValue"
			/>
		</transition>
	</div>
</template>

<script>
import cCategories from '@/components/content/inner-main/c-categories'

export default {
	name: 'cMain',
	components: {
		cCategories,
	},
	data: () => ({
		defaultTransformValue: null,
	}),
}
</script>

<style lang="scss">
	.main-shop {
		height: inherit;
	}
	.product-view-enter-active {
		opacity: 0;
		animation: product-view-enter 1s;

		@keyframes product-view-enter {
			100% { opacity: 1; }
		}
	}
	.product-view-leave-active {
		animation: product-view-leave 1s;

		@keyframes product-view-leave {
			100% { opacity: 0; }
		}
	}
</style>