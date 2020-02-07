<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="75px">
          <el-form-item label="消息标题" prop="title">
            <el-select
              v-model="queryForm.isread"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 180px"
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
        <el-table-column label="用户编号" prop="usercode" show-overflow-tooltip />
        <el-table-column label="扩展字段" prop="extras" show-overflow-tooltip />
        <el-table-column label="手机号" prop="phone" width="120px" />
        <el-table-column label="是否已读" prop="isread" width="70px">
          <template slot-scope="scope">{{scope.row.isread | initIsread}}</template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createtime" width="150px" />
        <el-table-column label="最后读取时间" prop="readtime" width="150px" />
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
        isread: "N"
      },
      form: {
        guid: undefined,
        icon: null,
        subject: undefined,
        title: undefined,
        url: "",
        level: "0",
        actioncode: "100701",
        platform: "all",
        messagetype: "0",
        fromtype: "1",
        isdisplay: "Y",
        content: undefined
      },
      rules: {
        icon: [
          { required: true, message: "上传图标不能为空", trigger: "blur" }
        ],
        subject: [
          { required: true, message: "请输入分类主题", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入消息标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入消息内容", trigger: "blur" }
        ],
        level: [
          { required: true, message: "请选择消息级别", trigger: "change" }
        ],
        platform: [
          { required: true, message: "请选择推送平台", trigger: "change" }
        ],
        messagetype: [
          { required: true, message: "请选择消息类型", trigger: "change" }
        ],
        fromtype: [
          { required: true, message: "请选择消息来源", trigger: "change" }
        ],
        isdisplay: [
          { required: true, message: "请选择是否列表展示", trigger: "change" }
        ]
      }
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
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>