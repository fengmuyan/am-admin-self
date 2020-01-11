<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow">
        <el-form :model="queryForm" ref="queryForm" :inline="true">
          <el-form-item label="商品名称" prop="mercode">
            <el-input
              v-model="queryForm.mercode"
              placeholder="请输入商品名称"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="商品分类" prop="state">
            <el-select
              v-model="queryForm.state"
              placeholder="请选择分类"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="热带水果" value="0" />
              <el-option label="多汁水果" value="1" />
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

    <div class="table-p">
       <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addPro">新增商品</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-f" @click="formShow = !formShow">
            <i class="el-icon-zoom-in"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="icon-box icon-box-t" @click="handleQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="proList">
        <el-table-column label="商品编号" prop="aa" />
        <el-table-column label="商品名称" prop="bb" />
        <el-table-column label="商品分类" prop="cc" />
        <el-table-column label="商品位置" prop="dd" />
        <el-table-column label="是否有效" prop="ee" />
        <el-table-column label="创建时间" prop="ff" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
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
export default {
  data() {
    return {
      loading: false,
      formShow: true,
      proList: [
        {
          aa: "526225262001",
          bb: "香蕉",
          cc: "热带水果",
          dd: "app",
          ee: "有效",
          ff: "2020-02-23 16:20:23"
        },
        {
          aa: "526225262013",
          bb: "苹果",
          cc: "热带水果",
          dd: "app",
          ee: "有效",
          ff: "2020-01-23 16:20:23"
        },
        {
          aa: "526225262023",
          bb: "橘子",
          cc: "多汁水果",
          dd: "app",
          ee: "有效",
          ff: "2020-01-23 16:20:23"
        }
      ],
      total: 10,
      dateRange: [],
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        state: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    addPro(){
    this.$router.push({
      path:'/product/product-add'
    })
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
    handleEdit(item) {},
    _initParams(obj) {
      const dateRange = this.dateRange;
      Object.assign(obj, {
        beginTime: dateRange.length > 0 ? dateRange[0] : null,
        endTime: dateRange.length > 0 ? dateRange[1] : null
      });
      return obj;
    }
  }
};
</script>