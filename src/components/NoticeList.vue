<template>
	<div class="container notice">
		<shop-title title="公告"></shop-title>
		<ul class="notice-list" v-if="noticeList.length>0">
			<li v-for="notice in noticeList" :key="notice.id">
				<router-link :to="{path:`/noticeDetail/${notice.id}`}" :title="notice.informsName" class="title">{{notice.informsName}}<i class="new" v-if="!notice.isRead"></i>
				</router-link>
				<span class="time">{{notice.createTime|time('yyyy-MM-dd hh:ss:mm')}}</span>
			</li>
		</ul>
		<ul class="notice-list" v-if="noticeList.length===0">
			<li style="justify-content: center">暂未公告</li>
		</ul>
		<el-pagination background layout="prev, pager, next" @current-change="getList" :total="totalPage" :page-size="pageSize" v-if="totalPage/pageSize>1" prev-text="上一页" next-text="下一页">
</el-pagination>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle'
	import {$httpSign} from 'common/js/httpAll'

	export default {
		data(){
			return {
				pageSize:16,
				totalPage:0,
				noticeList:[]
			}
		},
		mounted(){
      this.getList(1)
    },
    methods:{
    	getList(a){
        $httpSign({
    			url:'/informs/infromsType',
    			params:{
    				from:(a-1)*this.pageSize,
    				limit:this.pageSize,
    				informsType:2
    			},
    			success:function(data){
    				this.noticeList=data.informsList
    				this.totalPage=data.page.totalCount
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
	.notice{
		padding:40px 0 60px
		.notice-list{
			li{
				display:flex
				line-height:60px
				justify-content:space-between
				border-bottom:1px solid $border-color
			}
			.title{
				font-size:$font-s
				color:$size-color
				max-width:640px
				ellipsis-simple()
				&:hover{
					color:$hover-color
				}
			}
			.new{
				display:inline-block
				width:36px
				height:12px
				background:url('~images/new.png') no-repeat right center
			}
			.time{
				width:180px
				font-size:$font-x
				color:$size-color3
				text-align:right
			}
		}
	}
</style>
