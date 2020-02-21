<template>
  <div :class="className" :style="{height,width}" />
</template>

<script>
import echarts from 'echarts'
import echartTheme from "@/utils/echart.js";
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "290px"
    },
    itemData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, echartTheme);
      this.chart.setOption({
        title: {
          text: "当日订单状态",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [
            "待称重",
            "待付款",
            "待发货",
            "已发货",
            "已完成",
            "已关闭",
            "已失效"
          ]
        },
        series: [
          {
            name: "订单状态",
            type: "pie",
            radius: [10, 75],
            center: ["58%", "57%"],
            data: this.itemData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    }
  }
};
</script>
