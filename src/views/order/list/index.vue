<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="70px">
          <el-form-item label="供应商" prop="mername">
            <el-input
              v-model="queryForm.mername"
              placeholder="请输入供应商名称"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="采购商" prop="username">
            <el-input
              v-model="queryForm.username"
              placeholder="请输入采购商名称"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="订单号" prop="orderno">
            <el-input
              v-model="queryForm.orderno"
              placeholder="请输入订单号"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="订单来源" prop="ordersource">
            <el-select
              v-model="queryForm.ordersource"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="PC" value="0" />
              <el-option label="Android" value="1" />
              <el-option label="ios" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="订单状态" prop="orderstate">
            <el-select
              v-model="queryForm.orderstate"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="正常" value="Y" />
              <el-option label="删除" value="N" />
            </el-select>
          </el-form-item>
          <el-form-item label="支付类型" prop="paytype">
            <el-select
              v-model="queryForm.paytype"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="货币支付" value="0" />
              <el-option label="信用额度支付" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="支付状态" prop="paystate">
            <el-select
              v-model="queryForm.paystate"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="支付未完成" value="0" />
              <el-option label="支付完成" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 380px"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部订单" name="-1"></el-tab-pane>
        <el-tab-pane label="待称重" name="10"></el-tab-pane>
        <el-tab-pane label="待付款" name="0"></el-tab-pane>
        <el-tab-pane label="待发货" name="1"></el-tab-pane>
        <el-tab-pane label="已发货" name="2"></el-tab-pane>
        <el-tab-pane label="已完成" name="4"></el-tab-pane>
        <el-tab-pane label="已关闭" name="5"></el-tab-pane>
        <el-tab-pane label="已失效" name="6"></el-tab-pane>
      </el-tabs>
      <el-row :gutter="10" class="export-btn icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-f" @click="formShow = !formShow">
            <i class="el-icon-zoom-in" v-show="!formShow"></i>
            <i class="el-icon-zoom-out" v-if="formShow"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="icon-box icon-box-t" @click="handleQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          style="margin-left:10px"
        >导出数据</el-button>
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="orderList">
        <el-table-column label="订单号" prop="orderno" width="150" show-overflow-tooltip />
        <el-table-column label="创建时间" sortable prop="createtime" width="150" />
        <el-table-column label="订单金额" sortable prop="orderamount" width="130" />
        <el-table-column label="供应商" prop="mername" show-overflow-tooltip />
        <el-table-column label="采购商" prop="username" show-overflow-tooltip />
        <el-table-column label="数量" prop="cmdtcount" width="60" />
        <el-table-column label="应收款" prop="needprice" width="70" />
        <el-table-column label="实收款" prop="realprice" width="70" />
        <el-table-column label="发货类型" prop="delivertype" width="70">
          <template slot-scope="scope">{{scope.row.delivertype | inDelivertype }}</template>
        </el-table-column>
        <el-table-column label="发票类型" prop="invocetype" width="70">
          <template slot-scope="scope">{{scope.row.invocetype | initInvocetype }}</template>
        </el-table-column>
        <el-table-column label="订单状态" prop="orderstate" width="80">
          <template slot-scope="scope">{{scope.row.orderstate | initOrderstate }}</template>
        </el-table-column>
        <el-table-column label="支付类型" prop="paystate" width="90">
          <template slot-scope="scope">{{scope.row.paystate | initPaystate }}</template>
        </el-table-column>
        <el-table-column label="交易状态" prop="tradestate" width="120">
          <template slot-scope="scope">{{scope.row.tradestate | initTradestate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleDetail(scope.row)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryForm.pageNum"
        :limit.sync="queryForm.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import { getOrderList, orderExport, orderToSent } from "@/api/order";
import minHeightMix from '@/mixins/minHeight'
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      formShow: true,
      exportLoading: false,
      activeName: "-1",
      orderList: [],
      total: 0,
      dateRange: [],
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        mername: undefined,
        username: undefined,
        tradestate: undefined,
        orderno: undefined,
        paytype: undefined,
        ordersource: undefined,
        paystate: undefined,
        orderstate: undefined
      }
    };
  },
  filters: {
    initTradestate(val) {
      const arr = [
        "待付款",
        "待发货",
        "已发货",
        "物流派件中",
        "已完成",
        "已关闭",
        "已失效",
        "",
        "",
        "",
        "待称重",
        "已称重，待付款"
      ];
      return arr[val];
    },
    initPaystate(val) {
      const arr = ["支付未完成", "支付完成"];
      return arr[val];
    },
    initOrderstate(val) {
      if (val === "Y") {
        return "正常";
      } else if (val === "N") {
        return "删除";
      }
    },
    inDelivertype(val) {
      const arr = ["自提", "代发"];
      return arr[val];
    },
    initInvocetype(val) {
      const arr = ["不开发票", "开发票"];
      return arr[val];
    }
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { _initParams, queryForm } = this;
        const {
          code,
          data: {
            pageResult: { content, totalSize }
          }
        } = await getOrderList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.orderList = content;
          this.total = totalSize;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    handleQuery() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleDetail(item) {
      this.$router.push({
        path: `/order-detail/detail/${item.orderno}`
      });
    },
    handleClick() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    handleExport() {
      const { _initParams, queryForm } = this;
      this.$confirm("是否确认导出所有订单数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          this.exportLoading = true;
          const { msg, code } = await orderExport(_initParams(queryForm));
          if (code === 200) {
            this.download(msg);
            this.msgSuccess("导出成功");
            this.exportLoading = false;
          } else {
            this.exportLoading = false;
          }
        })
        .catch(function() {});
    },
    _initParams(obj) {
      const activeName = this.activeName;
      const dateRange = this.dateRange || [];
      Object.assign(obj, {
        tradestate: activeName === "-1" ? null : activeName,
        beginTime: dateRange.length > 0 ? dateRange[0] : null,
        endTime: dateRange.length > 0 ? dateRange[1] : null
      });
      return obj;
    }
  }
};
</script>
