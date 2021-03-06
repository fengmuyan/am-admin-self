<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true">
          <el-form-item label="用户类型" prop="usertype">
            <el-select
              v-model="queryForm.usertype"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="供应商" value="1" />
              <el-option label="经销商" value="2" />
              <el-option label="个人" value="0" />
              <el-option label="平台用户" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="认证状态" prop="state">
            <el-select
              v-model="queryForm.state"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="认证中" value="1" />
              <el-option label="认证失败" value="2" />
              <el-option label="认证成功" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 260px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
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
      <el-table style="width: 100%" v-loading="loading" :data="userList">
        <el-table-column label="用户编号" prop="usercode" width="150" />
        <el-table-column label="用户账号" prop="useraccount" />
        <el-table-column label="注册类型" sortable prop="voRegistertype" />
        <el-table-column label="用户类型" sortable prop="voUsertype" width="100px" />
        <el-table-column label="手机号" prop="phone" />
        <el-table-column label="店铺名称" prop="shopname" width="120" />
        <el-table-column label="收款账户" sortable prop="merstate" width="120">
          <template slot-scope="scope">
            <span
              :class="{'warn-color':scope.row.merstate===2,'suc-color':scope.row.merstate===1}"
            >{{scope.row.merstate | initAccountState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" sortable prop="state" width="100px">
          <template slot-scope="scope">
            <span
              :class="{'warn-color':scope.row.state===2,'suc-color':scope.row.state===3}"
            >{{scope.row.state | initState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" sortable prop="voCreatetime" width="150px" />
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">查看</el-button>
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
import { getExamineList } from "@/api/examine";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      formShow: true,
      userList: [],
      total: 0,
      dateRange: [],
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        state: undefined,
        usertype: undefined
      }
    };
  },
  filters: {
    initState(val) {
      const arr = ["待认证", "认证中", "认证失败", "认证成功"];
      return arr[val];
    },
    initAccountState(val) {
      if (val === null || val === undefined || val === "") {
        return "-";
      } else {
        return ["审核中", "审核通过", "审核未通过", "待验证", "解约", "已关闭"][
          val
        ];
      }
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
        } = await getExamineList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.userList = content;
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
      const { useraccount, registertype } = item;
      let path;
      if (Number(registertype) === 0) {
        path = `/examine/personal-detail/${useraccount}`;
      } else if (Number(registertype) === 1 || Number(registertype) === 2) {
        path = `/examine/business-detail/${useraccount}`;
      }
      this.$router.push({ path });
    },
    _initParams(obj) {
      const dateRange = this.dateRange || [];
      Object.assign(obj, {
        beginTime: dateRange.length > 0 ? dateRange[0] : undefined,
        endTime: dateRange.length > 0 ? dateRange[1] : undefined
      });
      return obj;
    }
  }
};
</script>