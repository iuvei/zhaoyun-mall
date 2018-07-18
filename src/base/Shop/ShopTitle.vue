<template>
	<div class="shopcart-title">
	  <h3 class="text">{{title}}</h3>
	  <slot></slot>
	</div>
</template>

<script>
	export default {
		props:{
			title:String
		}
	}
</script>

<style lang="stylus" scoped>
	@import "~common/stylus/variable.styl"
	
	.shopcart {
	  &-title {
	    display: flex
	    justify-content: space-between
	    background: url("~images/bg.jpg") repeat-x 0 0 #f7f7f7
	    height: 50px
	    line-height: 50px
	    .text {
	      margin-left: 16px
	      font-weight: normal
	      font-size: $font-m
	    }
	    .more {
	      margin-right: 16px
	      font-size: $font-x
	      color: $size-color3
	      &:hover {
	        color: $hover-color
	      }
	    }
	  }
	}
</style>