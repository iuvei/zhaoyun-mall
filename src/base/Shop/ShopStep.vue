<template>
	<div class="shopcart-step">
	  <h2 class="text">{{step==='1'?'购物车':step==='2'?'填写订单':'完成付款'}}</h2>
	  <div class="status">
	    <div class="step" :class="'step'+step"></div>
	    <span>购物车</span>
	    <span>填写订单</span>
	    <span>完成付款</span>
	  </div>
	</div>
</template>

<script>
	export default {
		props:{
			step:String
		}
	}
</script>

<style lang="stylus" scoped>
	@import "~common/stylus/variable.styl"

	.shopcart {
	  &-step {
	    display: flex
	    height: 104px
	    align-items: center
	    justify-content: space-between
	    .text {
	      font-size: $font-xxl
	      font-weight: normal
	    }
	    .status {
	      width: 324px
	      text-align: center
	      font-size: 0
	      margin-left: -20px
	      span {
	        display: inline-block
	        width: 108px
	        font-size: $font-x
	      }
	    }
	    .step {
	      width: 100%
	      height: 20px
	      margin-bottom: 5px
	      background: url("~images/step.png") 0 0
	      for i in 0 1 2 {
	        &{i+1} {
	          background-position: 0 -20px * i
	        }

	      }
	    }
	  }
	}
</style>