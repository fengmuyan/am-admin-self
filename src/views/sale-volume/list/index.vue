<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="90px">
          <el-form-item label="商品或店铺" prop="conditionParameter">
            <el-input
              v-model="queryForm.conditionParameter"
              placeholder="请输入货主名称"
              clearable
              size="small"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              :clearable="false"
              style="width: 360px"
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
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
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
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="proList">
        <el-table-column label="商品编码" prop="cmdtcode" width="120" />
        <el-table-column label="商品标题" prop="title" show-overflow-tooltip />
        <el-table-column label="店铺名称" prop="shopname" />
        <el-table-column label="库存" prop="stocknums" />
        <el-table-column label="销量" prop="salenums" />
        <el-table-column label="商品单价" prop="unitprice" />
        <el-table-column label="发布时间" prop="createtime" width="150" />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >修改销量</el-button>
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
import { getProList, handelProEdit } from "@/api/product";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      formShow: true,
      proList: [],
      dateRange: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        conditionParameter: undefined,
        state: undefined
      }
    };
  },
  filters: {
    initPriceType(val) {
      const arr = ["", "按数量", "按重量"];
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
        } = await getProList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.proList = content;
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
    handleEdit(item) {
      this.$prompt("请输入修改后销量", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[+]{0,1}(\d+)$/,
        inputErrorMessage: "销量为正整数且不能为空"
      })
        .then(async ({ value }) => {
          try {
            this.loading = true;
            const { code } = await handelProEdit({
              cmdtcode: item.cmdtcode,
              salenums: value
            });
            this.loading = false;
            if (code === 200) {
              this.msgSuccess("操作成功");
              this.getList();
            }
          } catch (err) {
            this.loading = false;
            console.log(err);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _initParams(obj) {
      const dateRange = this.dateRange || [];
      Object.assign(obj, {
        timestart: dateRange.length > 0 ? dateRange[0] : undefined,
        timeend: dateRange.length > 0 ? dateRange[1] : undefined
      });
      return obj;
    }
  }
};
</script>