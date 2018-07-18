<template>
<div class="main-banner">
  <swiper :options="swiperOption">
    <swiper-slide v-for="(item,index) in advertList.banner" :key="index">
      <a :href="item.link"><img :src="item.picUrl" alt=""></a>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</div>
</template>

<script>
    export default {
      data(){
        return{
          swiperOption: {
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: {
              delay: 2500,
              disableOnInteraction: false
            },
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            },
          },
        }
      }
    }
</script>

<style scoped lang="stylus">

</style>
