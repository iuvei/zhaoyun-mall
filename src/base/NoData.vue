<template>
	<div class="nodata">
		<div class="img"><img :src="imgUrl"></div>
		<div class="info">
			<p class="desc">{{desc}}</p>
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			imgUrl:String,
			desc:String
		}
	}
</script>

<style lang="stylus" scoped>
	@import "~common/stylus/variable.styl"

	.nodata{
		display:flex
		align-items:center
		justify-content:center
		height:240px
		.img{
			background-color:#ccc
			margin-right:10px
		}
		.img,.img img{
			width:76px
			height:76px
		}
		.desc{
			font-size:$font-s
			color:$size-color2
			margin-bottom:8px
			line-height:24px
		}
		.op1{
			font-size:$font-x
			color:$size-color3
			a{
				color:$main-color
				&:hover{
					text-decoration:underline
				}
			}
		}
		
	}
</style>