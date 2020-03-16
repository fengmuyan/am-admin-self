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
        <el-table-column label="图标" prop="url" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="demo-image__preview img-box">
              <el-image
                style="width: 40px; height: 40px"
                :src="scope.row.url"
                :preview-src-list="[scope.row.url]"
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="图标名称" prop="iconname" />
        <el-table-column label="创建时间" prop="createtime" />
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
        <el-form-item label="图标名称" prop="iconname">
          <el-input v-model="form.iconname" style="width:330px" placeholder="请输入图标名称"></el-input>
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
  getMessageIconList,
  handleMessageIconEdit,
  handleMessageIconDel
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
        uid: undefined,
        icon: null,
        iconname: undefined
      },
      rules: {
        icon: [
          { required: true, message: "上传图标不能为空", trigger: "blur" }
        ],
        iconname: [
          { required: true, message: "图标名称不能为空", trigger: "blur" }
        ]
      }
    };
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
        } = await getMessageIconList(this.queryForm);
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
    resetMessageIconForm() {
      Object.assign(this.form, {
        uid: undefined,
        iconname: undefined,
        icon: null
      });
    },
    async handleAdd() {
      this.imgShow = false;
      this.resetMessageIconForm();
      this.title = "新增图标";
      await this.$nextTick();
      this.open = true;
      this.imgShow = true;
    },
    async handleEdit(item) {
      this.imgShow = false;
      this.resetMessageIconForm();
      this.title = "修改图标";
      Object.assign(this.form, {
        uid: item.uid,
        icon: item.url,
        iconname: item.iconname
      });
      await this.$nextTick();
      this.open = true;
      this.imgShow = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let formData = new FormData();
          if (this.form.uid !== undefined) {
            formData.append("uid", this.form.uid);
          }
          formData.append("icon", this.$refs.imgItemOne.fileList[0]);
          formData.append("iconname", this.form.iconname);
          this.subData(formData);
        } else {
          return false;
        }
      });
    },
    async subData(formData) {
      try {
        this.loadingForm = true;
        const { code } = await handleMessageIconEdit(formData);
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
    clearValidate() {
      this.$refs.form.resetFields();
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
            const { code } = await handleMessageIconDel({ uid: item.uid });
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
    }
  }
};
</script>