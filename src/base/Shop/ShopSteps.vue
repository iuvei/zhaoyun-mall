<template>
	<ul class="step">
	  <li v-for="(title,index) in titleArr" :key="index" :class="{'active':index+1===step}">{{title}}</li>
	</ul>
</template>

<script>
	export default {
		props:{
			step:Number,
			titleArr:Array
		}
	}
</script>

<style lang="stylus" scoped>
	@import "~common/stylus/variable.styl"
	
	.step{
		display:flex
		background-color:#f8f8f8
		height:50px
		line-height:50px
		color:#fff
		font-size:$font-m
		li{
			margin-right:25px
			background-color:#dadada
			flex:1
			text-align:center
			position:relative
			&:first-child:before,&:last-child:after{
				border:none
			}
			&:before,&:after{
				content:''
				position:absolute
				border:25px solid #f8f8f8
			}
			&:before{
				left:0
				border-color:transparent transparent transparent #f8f8f8
			}
			&:after{
				right:-50px
				border-color:transparent transparent transparent #dadada
			}
			&.active{
				background-color:$main-color
				&:after{
					border-color:transparent transparent transparent $main-color
				}
			}
			&:last-child{
				margin-right:0
			}
		}
	}
</style>