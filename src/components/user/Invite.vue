<template>
	<div class="user-cont">
		<shop-title title="邀请提成"></shop-title>
		<ul class="invite-info">
			<li>您的邀请者：<strong>{{0 || this.codeInfo.code}}</strong></li>
			<li>您累计邀请：<em>{{0 || this.codeInfo.invitionNumber}}</em>名一级好友</li>
			<li>您累计获得的提成：<i>{{0 || this.codeInfo.actualAmountAll}}</i>元</li>
		</ul>
		<div class="invite-code">
			<ul class="code-info">
				<li>
					<p class="title">我的邀请码</p>
					<p class="code">{{0 || this.codeInfo.myCode}}<el-button type="primary" size="mini" plain class="btn" data-clipboard-text="18817320709">复制给好友</el-button></p>
				</li>
				<li>
					<p class="title">兆云微商城公众号</p>
					<p class="ercode">
						<img src="~images/ercode.png" alt="兆云微商城公众号" width="60" height="60">
						<a :href="ercode" class="el-button el-button--primary el-button--mini is-plain" download>分享给好友</a>
					</p>
				</li>
			</ul>
			<p class="code-tip"><i class="el-icon-warning"></i>请将您的邀请码复制发给好友，当好友在商城进行充值时，您即可得到丰厚提成。另，让好友关注微信公众号，更多福利等着你们哦～</p>
		</div>
		<div class="invite-search">
			<el-date-picker v-model="month" type="month" placeholder="选择月" value-format="yyyyMM" @change="selectMonth" :clearable="false" size="medium"></el-date-picker>
			<el-button type="primary" size="medium">查询</el-button>
		</div>
		<div v-if="relationList.length > 0">
      <table class="table invite-table" v-if="!showList">
        <thead>
        <tr class="table-th">
          <th>邀请人</th>
          <th>等级</th>
          <th>提成</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr class="invite-table-td" v-for="item in relationList" :key="item.id">
          <td>{{item.phone}}</td>
          <td>{{item.levelString}}</td>
          <td class="c_ef3838">{{item.actualAmountAll || 0}}</td>
          <td><a v-if="item.levelString == '一级' && item.actualAmountAll" href="javascript:;" class="c_868686" @click="toDetailBefore(item.userId)">查看</a></td>
        </tr>
        <!--<tr class="invite-table-info">-->
          <!--<td colspan="4">以下是一级好友邀请的好友</td>-->
        <!--</tr>-->
        </tbody>
      </table>
      <el-pagination v-if="!showList" background layout="prev, pager, next" :current-page="pageNoList" @current-change="getRelationList" :total="listTotal" :page-size="pageSize" prev-text="上一页" next-text="下一页"></el-pagination>
    </div>
		<div class="invite-detail" v-if="showList">
			<div class="invite-detail-info">
				<span>账号：{{this.detailList.phone}}</span>
				<span>等级：{{this.detailList.level}}</span>
				<span>上级：{{this.detailList.parentPhone}}</span>
				<a href="javascript:;" class="return_btn" @click="showList=false">返回</a>
			</div>
			<table class="invite-table invite-detail-table">
				<tbody>
					<tr class="invite-table-td">
						<td colspan="2">累计贡献提成</td>
						<td><em>{{this.detailList.actualAmountAll || 0}}</em>元</td>
					</tr>
					<tr class="invite-table-td" v-for="item in detailList.list" :key="item.id">
						<td class="c_868686">{{item.createTime|time('yyyy-MM-dd hh:ss:mm')}}</td>
						<td class="c_868686">{{item.typeStr}}</td>
						<td class="c_ef3838">{{item.actualAmount}}</td>
					</tr>
				</tbody>
			</table>
      <el-pagination background layout="prev, pager, next" :current-page="pageNoDetail" @current-change="toDetail" :total="detailTotal" :page-size="pageSize" prev-text="上一页" next-text="下一页"></el-pagination>
    </div>
	</div>
</template>

<script>
	import ShopTitle from 'base/Shop/ShopTitle';
	import {$httpSign} from "../../common/js/httpAll";
  import Clipboard from 'clipboard';

	export default {
		data(){
			return {
				showList:false,  // 查看详情
        codeInfo:{},
        relationList:[],
        listTotal:0,
        pageNoList:1,
        pageSize:8,
        pageNoDetail:1,
        detailList:{},
        detailTotal:0,
        createTimeStr:"",
				month:'',
				activeTab:0,
				ercode:require('images/ercode.png'),
			}
		},
		mounted(){
      this.$store.commit('updateActiveTab','2');
      this.getInfo();
      this.getRelationList(1);
      const clipboard = new Clipboard('.btn');
      clipboard.on('success', function(e) {
        this.$message({
          message: '复制成功',
          type: 'success'
        });
        e.clearSelection();
      }.bind(this))
    },
		components:{
			ShopTitle
		},
		methods:{
      getInfo(){
        $httpSign({
          url:'/invition/index',
          success:function(data){
            this.codeInfo = data;
          }.bind(this)
        })
      },
      getRelationList(num){
        this.pageNoList = num;
        $httpSign({
          url:'/invition/relationList',
          method:'post',
          data:{
            pageNo:num,
            pageSize:this.pageSize,
            createTimeStr:this.createTimeStr
          },
          success:function(data){
            this.relationList = data.list;
            this.listTotal = data.count;
          }.bind(this)
        })
      },
			// 根据时间获取提成
			selectMonth(e){
        this.createTimeStr = e;
        this.getRelationList(1);
			},
			//
			toDetailBefore(userId){
				this.showList=true;
				this.userIds = userId;
				this.toDetail(1);
			},
      toDetail(num){
        this.pageNoDetail = num;
        $httpSign({
          url:'/invition/incomeDetail',
          method:'post',
          data:{
            userId:this.userIds,
            pageNo:num,
            pageSize:this.pageSize,
          },
          success:function(data){
            this.detailTotal = data.count;
            this.detailList = data;
          }.bind(this)
        })
      }
		}
	}
</script>

<style lang="stylus" scoped>
	@import '~common/stylus/variable.styl'
	@import '~common/stylus/table.styl'
	.rec{
		&-tab{
			display:flex
			width:400px
			height:30px
			margin:42px auto 0
			line-height:26px
			font-size:$font-x
			border:2px solid $border-color
			background-color:#f7f7f7
			a{
				flex:1
				text-align:center
				color:$size-color2
				&+a{
					border-left:2px solid $border-color
				}
				&.on{
					background-color:#fff
					color:$main-color
				}
			}
		}
	}
  .el-pagination{text-align:center;}
	.invite{
		&-info{
			padding:20px 10px 10px 16px
			font-size:$font-s
			color:$size-color2
			line-height:30px
			display:flex
			flex-wrap:wrap
			li{
				width:50%
			}
			strong{
				color:$size-color
			}
			em{
				font-style:normal
				font-weight:bold
				color:$main-color
				margin:0 4px
			}
			i{
				font-style:normal
				font-weight:bold
				color:$num-color
				margin:0 4px
			}
		}
		&-code{
			border:5px solid #dadada
			padding-top:24px
			.code-info{
				display:flex
				li{
					padding:0 28px
					width:50%
					text-align:center
					&:first-child{
						border-right:2px solid #dadada
					}
					button{
						margin-left:10px
					}
				}
				.title{
					font-size:$font-s
					color:$size-color2
					text-align:left
					margin-bottom:5px
				}
				.code{
					line-height:28px
					padding:16px
					font-size:22px
					font-weight:bold
					color:$size-color
					button{
						vertical-align:top
					}
				}
				.ercode{
					img{
						vertical-align:middle
					}
				}
			}
			.code-tip{
				padding:12px 28px
				line-height:20px
				color:$size-color3
				font-size:$font-x
				.el-icon-warning{
					font-size:$font-m
					margin-right:5px
				}
			}
		}
		&-search{
			text-align:right
			margin-top:30px
		}
		&-table{
			margin-top:10px
			&-td{
				font-size:$font-x
				color:$size-color2
				text-align:center
				td{
					height:60px
					line-height:20px
					border-bottom:1px solid $border-color
				}
			}
			&-info{
				td{
					color:$size-color3
					font-size:$font-x
					height:32px
					padding-left:20px
					border-bottom:1px solid $border-color
					background-color:#f8f8f8
				}
			}
			.c_868686{
				color:$size-color3
			}
			.c_ef3838{
				color:$num-color
			}
			a.c_868686{
				&:hover{
					color:$hover-color
				}
			}
		}
		&-detail{
			&-info{
				margin-top:10px
				height:44px
				font-size:$font-x
				line-height:44px
				padding:0 28px
				color:$size-color2
				background:url('~images/bg.jpg') repeat-x top left #f7f7f7
				span{
					margin-right:60px
				}
				.return_btn{
					float:right
					color:$main-color
				}
			}
			&-table{
				width:680px
				border:1px solid $border-color
				margin:20px auto 0
				th,td{
					border:1px solid $border-color
				}
				td{
					height:40px
					em{
						color:$num-color
						font-style:normal
						font-weight:bold
						margin:0 4px
					}
				}
			}
		}
	}
</style>
