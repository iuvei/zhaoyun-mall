<template>
	<div class="chart">
		<h3 class="chart-title">近七日彩云钱包走势图</h3>
		<div id="c1"></div>
	</div>
</template>

<script>
	import G2 from '@antv/g2'

	export default {
		data() {
		  return {
		    chart: null
		  };
		},
		props:{
			data:Number,
			width:Number,
			height:Number
		},
		mounted: function () {
			var data=[
				{'strftime': "01-11", 'value': 1},
        {'strftime': "01-12", 'value': 1},
        {'strftime': "01-13", 'value': 1},
        {'strftime': "01-14", 'value': 1},
        {'strftime': "01-15", 'value': 1},
        {'strftime': "01-16", 'value': 1},
        {'strftime': "01-17", 'value': 1},
        {'strftime': "01-18", 'value': 1},
        {'strftime': "01-19", 'value': 1},
        {'strftime': "01-20", 'value': 1},
        {'strftime': "01-21", 'value': 1},
        {'strftime': "01-22", 'value': 1},
        {'strftime': "01-23", 'value': 1},
        {'strftime': "01-24", 'value': 1},
        {'strftime': "01-25", 'value': 1},
      ]
      this.drawChart(data)
    },
    methods: {
      drawChart: function (datas) {
        // 如果图形存在则删除再创建，这个地方感觉稍微有点坑
        // 具体的G2 api函数说明请看上面提供的官网地址，此处不再逐一说明
        this.chart && this.chart.destroy();
        let data = datas;
        if(this.data===7){
        	data=data.slice(data.length-7)
        }
        this.chart = new G2.Chart({
          id: 'c1',
          width:this.width,
          height: this.height,
          padding:[30,20,40,20]
        });
        this.chart.source(data, {
          strftime: {
            alias: '日期',
            type: 'cat',
            range: [0, 1]
          }
        })
        this.chart.tooltip({
          showTitle: false,
          itemTpl: '<li>1人民币≈<b style="color:{color};"> {value} </b>VIP价</li>'
        })
        this.chart.line().position('strftime*value').size(3).color('#af7b7a').shape('smooth')
        
        this.chart.render();
      }
    }
  }
</script>

<style scoped lang="stylus">
	@import "~common/stylus/variable.styl"
	.chart{
		position:relative
		.chart{
			&-title{
				position:absolute
				top:0
				right:0
				margin-right:20px
				font-size:$font-x
				color:$size-color3
				font-weight:normal
			}
		}
	}
</style>