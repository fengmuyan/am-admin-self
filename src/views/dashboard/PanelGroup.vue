<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('topFir')">
        <div class="card-panel-description">
          <div class="card-panel-text">今日新订单</div>
          <count-to :start-val="0" :end-val="itemData[0]" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel card-panel02" @click="handleSetLineChartData('topSec')">
        <div class="card-panel-description">
          <div class="card-panel-text">付款订单数</div>
          <count-to :start-val="0" :end-val="itemData[1]" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel card-panel03" @click="handleSetLineChartData('topThi')">
        <div class="card-panel-description">
          <div class="card-panel-text">信用额度付款</div>
          <count-to :start-val="0" :end-val="itemData[2]" :decimals="2" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel card-panel04" @click="handleSetLineChartData('topLast')">
        <div class="card-panel-description">
          <div class="card-panel-text">资金付款</div>
          <el-popover popper-class="popover-p" placement="bottom-start" width="200" trigger="hover">
            <div class="popover-content">
              <p>订单付款金额：<span>{{itemData[4]}}</span></p>
              <p>还款金额：<span>{{itemData[5]}}</span></p>
              <p class="total">合计：<span>{{itemData[3]}}</span></p>
            </div>
            <count-to
              slot="reference"
              :start-val="0"
              :end-val="itemData[3]"
              :decimals="2"
              :duration="2000"
              class="card-panel-num"
            />
          </el-popover>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo
  },
  props: {
    itemData: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    }
  }
};
</script>
