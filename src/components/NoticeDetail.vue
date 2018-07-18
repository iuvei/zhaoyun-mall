<template>
	<div class="container notice-detail">
		<shop-title title="详情">
			<span class="more">{{detail.createTime|time('yyyy-MM-dd hh:mm:ss')}}</span>
		</shop-title>
		<h3 class="title">{{detail.informsName}}</h3>
		<div class="detail">{{detail.informsContent}}</div>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import {$httpSign} from 'common/js/httpAll'

	export default {
		data(){
			return {
				detail:{}
			}
		},
		mounted(){
      this.details()
    },
    methods:{
    	details(){
        $httpSign({
    			url:'/informs/infromsDetail',
    			params:{
    				infromsID:this.$route.params.noticeid
    			},
    			success:function(data){
    				this.detail=data.infroms
    			}.bind(this)
    		})
    	}
    },
		components:{
			ShopTitle
		}
	}
</script>

<style lang="stylus" scoped>
	@import '~common/stylus/variable.styl'
	.notice-detail{
		padding:40px 0 60px
		.title{
			margin-top:30px
			color:$size-color2
			text-align:center
		}
		.detail{
			padding:20px
			font-size:$font-s
			line-height:24px
			color:$size-color2
			word-wrap: break-word
		}
	}
</style>
