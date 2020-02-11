<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="75px">
          <el-form-item label="货主名称" prop="thearchyname">
            <el-input
              v-model="queryForm.thearchyname"
              placeholder="请输入货主名称"
              clearable
              size="small"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增货主</el-button>
        </el-col>
      </el-row>
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
      <el-table style="width: 100%" v-loading="loading" :data="shipperList">
        <el-table-column label="货主编号" prop="uid" width="100px" show-overflow-tooltip />
        <el-table-column label="货主名称" prop="thearchyname" show-overflow-tooltip />
        <el-table-column label="货主账号" prop="userName" show-overflow-tooltip />
        <el-table-column label="手机号" prop="phonenumber" show-overflow-tooltip />
        <el-table-column label="Email" prop="email" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createtime" width="150px" />
        <el-table-column label="操作" width="200px">
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
    <el-dialog :title="title" :visible.sync="open" @close="clearValidate" width="550px">
      <el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="110px">
        <el-form-item label="货主名称" prop="thearchyname">
          <el-input v-model="form.thearchyname" style="width:320px" placeholder="请输入货主名称"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="userAccount">
          <el-input v-model="form.userAccount" style="width:320px" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" style="width:320px" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" style="width:320px" placeholder="请输入Email"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            placeholder="请输入备注"
            maxlength="255"
            show-word-limit
            style="width:320px"
          ></el-input>
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
  getShipperList,
  handelShipperEdit,
  handelShipperDel
} from "@/api/shipper";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    const validateTel = (rule, value, callback) => {
      console.log(value);
      if (value === "" || value === undefined) {
        callback();
      } else {
        if (!/^1[345678]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        }
        callback();
      }
    };
    return {
      loading: false,
      formShow: true,
      loadingForm: false,
      shipperList: [],
      total: 0,
      title: "新增消息",
      open: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        thearchyname: undefined
      },
      form: {
        guid: undefined,
        thearchyname: undefined,
        userAccount: undefined,
        phone: undefined,
        email: undefined,
        remark: undefined
      },
      rules: {
        userAccount: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        thearchyname: [
          { required: true, message: "请输入货主名称", trigger: "blur" }
        ],
        phone: [{ validator: validateTel, trigger: "blur" }],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
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
        } = await getShipperList(this.queryForm);
        this.loading = false;
        if (code === 200) {
          this.shipperList = content;
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    resetShipperForm() {
      Object.assign(this.form, {
        guid: undefined,
        thearchyname: undefined,
        userAccount: undefined,
        phone: undefined,
        email: undefined,
        remark: undefined
      });
    },
    async handleAdd() {
      this.resetShipperForm();
      this.title = "新增货主";
      await this.$nextTick();
      this.open = true;
    },
    async handleEdit(item) {
      this.resetShipperForm();
      this.title = "修改货主";
      Object.assign(this.form, {
        guid: item.guid,
        thearchyname: item.thearchyname,
        userAccount: item.userName,
        phone: item.phonenumber,
        email: item.email,
        remark: item.remark
      });
      await this.$nextTick();
      this.open = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loadingForm = true;
            const { code } = await handelShipperEdit(this.form);
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
        } else {
          return false;
        }
      });
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
            const { code } = await handelShipperDel({ guid: item.guid });
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
    }
  }
};
</script>