<template>
   <div class="product-detail-container">
      <cProductDetail
         :categoryId="categoryId"
         :productId="productId"
      />
   </div>
</template>

<script>
import cProductDetail from '@/components/content/inner-main/inner-products/c-product-detail'

export default {
   name: 'vProductDetail',
   components: {
      cProductDetail
   },
   props: {
      categoryId: {
         type: String,
         required: true,
      },
      productId: {
         type: [Number, String],
         required: true,
      }
   },
}
</script>

<style lang="scss">
   .product-detail-container {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      z-index: 10;
      padding: 1rem;
      background: #2f393c;
      
      &__product-detail-content {
         width: 50rem;
         height: 100%;
         margin: auto;

         @media (max-width: 575px) {
            width: 100%;
         }
      }
   }
</style>