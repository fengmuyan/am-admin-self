<template>
  <div class="app-container">
    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增图标</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-t" @click="handleQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="iconList">
        <el-table-column label="编号" prop="uid" width="130px" />
        <el-table-column label="图标" prop="icon" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="demo-image__preview img-box">
              <el-image
                style="width: 40px; height: 40px"
                :src="scope.row.icon"
                :preview-src-list="[scope.row.icon]"
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="图标名称" prop="subject" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDel(scope.row)"
            >删除</el-button>
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

    <!-- 添加或修改消息对话框 -->
    <el-dialog :title="title" :visible.sync="open" @close="clearValidate" width="600px">
      <el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="110px">
        <el-form-item label="图标上传" prop="icon" ref="uploadElement" v-if="imgShow">
          <upload-img
            @add-item="addItemFir"
            @del-item="delItemFir"
            :file="form.icon?[{uid:0,url:form.icon}]:[null]"
            ref="imgItemOne"
            v-model="form.icon"
          ></upload-img>
        </el-form-item>
        <el-form-item label="图标名称" prop="title">
          <el-input v-model="form.title" style="width:330px" placeholder="请输入图标名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMessageList,
  handleMessageEdit,
  handleMessageDel,
  handleMessagePush
} from "@/api/message";
import UploadImg from "@/components/UploadImg";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  components: {
    UploadImg
  },
  data() {
    return {
      loading: false,
      imgShow: false,
      loadingForm: false,
      iconList: [],
      total: 0,
      title: "新增消息",
      open: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10
      },
      form: {
        icon: null
      },
      rules: {
        icon: [
          { required: true, message: "上传图标不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "图标名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  filters: {
    initLevel(val) {
      const arr = ["普通", "URL"];
      return arr[val];
    },
    initMessageType(val) {
      const arr = ["通知 ", "广告"];
      return arr[val];
    },
    initState(val) {
      const arr = ["未推送", "已推送"];
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
        const {
          code,
          data: { content, totalSize }
        } = await getMessageList(this.queryForm);
        this.loading = false;
        if (code === 200) {
          this.iconList = content;
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
    resetMessageForm() {
      Object.assign(this.form, {
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
      });
    },
    async handleAdd() {
      this.imgShow = false;
      this.resetMessageForm();
      this.title = "新增消息";
      await this.$nextTick();
      this.open = true;
      this.imgShow = true;
    },
    async handleEdit(item) {
      this.imgShow = false;
      this.resetMessageForm();
      this.title = "修改消息";
      Object.assign(this.form, {
        guid: item.guid,
        icon: item.icon,
        subject: item.subject,
        title: item.title,
        url: item.url,
        level: String(item.level),
        actioncode: item.actioncode,
        platform: item.platform,
        messagetype: String(item.messagetype),
        fromtype: String(item.fromtype),
        isdisplay: item.isdisplay,
        content: item.content
      });
      await this.$nextTick();
      this.open = true;
      this.imgShow = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let formData = new FormData();
          if (this.form.guid !== undefined) {
            formData.append("guid", this.form.guid);
          }
          formData.append("icon", this.$refs.imgItemOne.fileList[0]);
          formData.append("subject", this.form.subject);
          formData.append("title", this.form.title);
          formData.append("url", this.form.url);
          formData.append("level", this.form.level);
          formData.append("actioncode", this.form.actioncode);
          formData.append("platform", this.form.platform);
          formData.append("messagetype", this.form.messagetype);
          formData.append("fromtype", this.form.fromtype);
          formData.append("isdisplay", this.form.isdisplay);
          formData.append("content", this.form.content);
          this.subData(formData);
        } else {
          return false;
        }
      });
    },
    async subData(formData) {
      try {
        this.loadingForm = true;
        const { code } = await handleMessageEdit(formData);
        this.loadingForm = false;
        this.open = false;
        if (code === 200) {
          this.msgSuccess("操作成功");
          this.getList();
        }
      } catch (err) {
        this.loadingForm = false;
        console.log(err);
      }
    },
    cancel() {
      this.open = false;
    },
    cancelPush() {
      this.openPush = false;
    },
    clearValidate() {
      this.$refs.form.resetFields();
    },
    clearPushValidate() {
      this.$refs.pushForm.resetFields();
    },
    handleDel(item) {
      this.$confirm("确定要删除吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          try {
            const { code } = await handleMessageDel({ guid: item.guid });
            this.loading = false;
            if (code === 200) {
              this.msgSuccess("删除成功");
              this.getList();
            }
          } catch (err) {
            this.loading = false;
            console.log(err);
          }
        })
        .catch(err => {});
    },
    addItemFir(val) {
      this.form.icon = val[0];
      this.$refs["uploadElement"].clearValidate();
    },
    delItemFir(val) {
      this.form.icon = null;
    },
    handleDetail(item) {
      this.$router.push({
        path: `/message-push/detail/${item.guid}`
      });
    }
  }
};
</script>