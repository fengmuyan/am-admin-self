<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="75px">
          <el-form-item label="消息标题" prop="title">
            <el-select
              v-model="queryForm.isread"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 220px"
            >
              <el-option label="已读" value="Y" />
              <el-option label="未读" value="N" />
            </el-select>
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
      <el-table style="width: 100%" v-loading="loading" :data="messageDetailList">
        <el-table-column label="推送消息编号" prop="detailid" show-overflow-tooltip />
        <el-table-column label="手机号" prop="phone" />
        <el-table-column label="是否已读" prop="isread" >
          <template slot-scope="scope">{{scope.row.isread | initIsread}}</template>
        </el-table-column>
        <el-table-column label="读取次数" prop="readtimes" />
        <el-table-column label="创建时间" prop="createtime" />
        <el-table-column label="最后读取时间" prop="readtime" />
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
import { getMessageDetail } from "@/api/message";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      formShow: true,
      messageDetailList: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        isread: ""
      },
    };
  },
  filters: {
    initIsread(val) {
      if (val === "Y") {
        return "已读";
      } else if (val === "N") {
        return "未读";
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
        const {
          code,
          data: {
            messgeDetails: { content, totalSize }
          }
        } = await getMessageDetail(
          Object.assign(this.queryForm, {
            guid: this.$route.params.code
          })
        );
        this.loading = false;
        if (code === 200) {
          this.messageDetailList = content;
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
      this.queryForm.isread = "";
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>