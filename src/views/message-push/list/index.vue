<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="75px">
          <el-form-item label="消息标题" prop="title">
            <el-input
              v-model="queryForm.title"
              placeholder="请输入消息标题"
              clearable
              size="small"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="消息类型" prop="messagetype">
            <el-select
              v-model="queryForm.messagetype"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 180px"
            >
              <el-option label="通告" value="0" />
              <el-option label="广告" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="正文类型" prop="level">
            <el-select
              v-model="queryForm.level"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 180px"
            >
              <el-option label="普通" value="0" />
              <el-option label="URL" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="推送状态" prop="ispushed">
            <el-select
              v-model="queryForm.ispushed"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 180px"
            >
              <el-option label="未推送" value="0" />
              <el-option label="已推送" value="1" />
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
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增消息</el-button>
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
      <el-table style="width: 100%" v-loading="loading" :data="messageList">
        <el-table-column label="分类标题" prop="subject" width="130px" show-overflow-tooltip />
        <el-table-column label="icon" prop="icon" width="80px" show-overflow-tooltip>
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
        <el-table-column label="消息标题" prop="title" show-overflow-tooltip />
        <el-table-column label="正文类型" prop="level" width="80px">
          <template slot-scope="scope">{{scope.row.level | initLevel }}</template>
        </el-table-column>
        <el-table-column label="消息类型" prop="messagetype" width="80px">
          <template slot-scope="scope">{{scope.row.messagetype | initMessageType }}</template>
        </el-table-column>
        <el-table-column label="开始推送时间" prop="pushtime" width="150px" />
        <el-table-column label="推送状态" prop="state" width="80px">
          <template slot-scope="scope">{{scope.row.ispushed | initState }}</template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-chat-line-square"
              @click="handleDetail(scope.row)"
            >详情</el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-position"
              @click="handlePush(scope.row)"
            >推送</el-button>
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
    <el-dialog :title="title" :visible.sync="open" @close="clearValidate" width="780px">
      <div v-loading="loadingEditShow" style="min-height:528px">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          :inline="true"
          label-width="110px"
          v-if="isMessageShow"
        >
          <el-form-item label="图标上传" prop="icon">
            <el-select v-model="form.icon" placeholder="请选择图标名称">
              <el-option
                v-for="(item,index) in iconList"
                :key="index"
                :label="item.iconname"
                :value="item.url"
              >
                <span style="float: left">{{ item.iconname }}</span>
                <img style="float: right;height:30px" :src="item.url" />
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类主题" prop="subject">
            <el-input v-model="form.subject" style="width:573px" placeholder="请输入分类主题"></el-input>
          </el-form-item>
          <el-form-item label="消息标题" prop="title">
            <el-input v-model="form.title" style="width:573px" placeholder="请输入消息标题"></el-input>
          </el-form-item>
          <el-form-item
            label="外链URL"
            prop="url"
            :rules="{
            required: this.form.level==='1', message: '外链URL不能为空', trigger: 'blur'
          }"
          >
            <el-input v-model="form.url" style="width:573px" placeholder="请输入外链URL"></el-input>
          </el-form-item>
          <el-form-item label="正文类型" prop="level">
            <el-select v-model="form.level" placeholder="请选择正文类型">
              <el-option label="普通" value="0" />
              <el-option label="URL" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="接口名称"
            prop="actioncode"
            :rules="{
            required: this.form.level==='0', message: '接口名称不能为空', trigger: 'change'
          }"
          >
            <el-select v-model="form.actioncode" placeholder="请选择接口名称">
              <el-option label="消息详情" value="100701" />
            </el-select>
          </el-form-item>
          <el-form-item label="推送平台" prop="platform">
            <el-select v-model="form.platform" placeholder="请选择推送平台">
              <el-option label="全部" value="all" />
              <el-option label="android" value="android" />
              <el-option label="ios" value="ios" />
            </el-select>
          </el-form-item>
          <el-form-item label="消息类型" prop="messagetype">
            <el-select v-model="form.messagetype" placeholder="请选择消息类型">
              <el-option label="通知" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="消息来源" prop="fromtype">
            <el-select v-model="form.fromtype" placeholder="请选择消息来源">
              <el-option label="平台" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否列表展示" prop="isdisplay">
            <el-select v-model="form.isdisplay" placeholder="请选择是否列表展示">
              <el-option label="展示" value="Y" />
              <el-option label="不展示" value="N" />
            </el-select>
          </el-form-item>
          <el-form-item label="消息内容" prop="content">
            <el-input
              type="textarea"
              v-model="form.content"
              placeholder="请输入消息内容"
              maxlength="150"
              show-word-limit
              style="width:573px"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="消息推送" :visible.sync="openPush" @close="clearPushValidate" width="600px">
      <el-form
        ref="pushForm"
        :model="pushForm"
        :rules="rulesPush"
        :inline="true"
        label-width="110px"
      >
        <el-form-item label="推送类型" prop="isAllPush">
          <el-radio-group v-model="pushForm.isAllPush">
            <el-radio :label="0">全部推送</el-radio>
            <el-radio :label="1">部分推送</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="pushForm.isAllPush === 1">
          <div class="table-p table-push" style="min-height:400px">
            <el-table style="width: 100%" :data="userList">
              <el-table-column label="标识" prop="id" show-overflow-tooltip />
              <el-table-column label="用户手机号" prop="phone" show-overflow-tooltip />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelUser(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form-item label="推送用户" prop="pushUsers">
            <el-input
              v-model="pushForm.pushUsers"
              placeholder="请输入用户手机号"
              clearable
              size="small"
              maxlength="11"
              style="width: 220px"
            />
            <el-button
              style="margin-left:5px"
              type="primary"
              size="mini"
              @click="addUser('pushForm')"
            >添加用户</el-button>
            <el-button style="margin-left:15px" type="primary" size="mini">导入用户</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelPush">取 消</el-button>
        <el-button :loading="loadingPushForm" type="primary" @click="submitPushForm">推 送</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMessageList,
  handleMessageEdit,
  handleMessageDel,
  handleMessagePush,
  getMessageIconList,
  getMessageIconAddList
} from "@/api/message";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    const validateTel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户手机号"));
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
      loadingPushForm: false,
      loadingEditShow: false,
      isMessageShow: false,
      messageList: [],
      userOptions: [],
      userList: [],
      iconList: [],
      total: 0,
      dateRange: [],
      title: "新增消息",
      open: false,
      openPush: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        messagetype: undefined,
        level: undefined,
        ispushed: undefined
      },
      form: {
        guid: undefined,
        icon: undefined,
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
        icon: [{ required: true, message: "图标不能为空", trigger: "blur" }],
        subject: [
          { required: true, message: "请输入分类主题", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入消息标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入消息内容", trigger: "blur" }
        ],
        level: [
          { required: true, message: "请选择正文类型", trigger: "change" }
        ],
        platform: [
          { required: true, message: "请选择推送平台", trigger: "change" }
        ],
        messagetype: [
          { required: true, message: "请选择消息类型", trigger: "change" }
        ],
        fromtype: [
          { required: true, message: "请选择正文类型", trigger: "change" }
        ],
        isdisplay: [
          { required: true, message: "请选择是否列表展示", trigger: "change" }
        ]
      },
      pushForm: {
        guid: undefined,
        isAllPush: 0,
        pushUsers: []
      },
      rulesPush: {
        pushUsers: [
          { validator: validateTel, required: true, trigger: "blur" }
        ],
        isAllPush: [
          { required: true, message: "请选择推送类型", trigger: "change" }
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
        const { _initParams, queryForm } = this;
        const {
          code,
          data: { content, totalSize }
        } = await getMessageList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.messageList = content;
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
        icon: undefined,
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
      this.resetMessageForm();
      this.title = "新增消息";
      this.open = true;
      try {
        this.loadingEditShow = true;
        const { code, data } = await getMessageIconAddList();
        this.loadingEditShow = false;
        if (code === 200) {
          this.iconList = data;
          this.isMessageShow = true;
        }
      } catch (err) {
        this.loadingEditShow = false;
        console.log(err);
      }
    },
    async handleEdit(item) {
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
      this.open = true;
      try {
        this.loadingEditShow = true;
        const { code, data } = await getMessageIconAddList();
        this.loadingEditShow = false;
        if (code === 200) {
          this.iconList = data;
          this.isMessageShow = true;
        }
      } catch (err) {
        this.loadingEditShow = false;
        console.log(err);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loadingForm = true;
            const { code } = await handleMessageEdit(this.form);
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
    handleDetail(item) {
      this.$router.push({
        path: `/message-push/detail/${item.guid}`
      });
    },
    resetPushForm() {
      this.pushForm.pushUsers = [];
    },
    handlePush(item) {
      this.pushForm.guid = item.guid;
      this.openPush = true;
    },
    submitPushForm() {
      const { guid, isAllPush } = this.pushForm;
      if (isAllPush === 0) {
        this.$confirm("确定要给全部用户推送吗？", "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "el-message-box-wran"
        })
          .then(async () => {
            this.submitPushFormAc({ guid, isAllPush });
          })
          .catch(err => {});
      } else if (isAllPush === 1) {
        if (this.userList.length === 0) {
          this.$confirm("推送用户不能为空", "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "el-message-box-wran"
          })
            .then(async () => {})
            .catch(err => {});
        } else {
          this.$confirm("确定要给这些用户推送吗？", "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "el-message-box-wran"
          })
            .then(async () => {
              this.submitPushFormAc({
                guid,
                isAllPush,
                pushUsers: this.userList.map(item => item.phone).join(",")
              });
            })
            .catch(err => {});
        }
      }
    },
    async submitPushFormAc(data) {
      try {
        const { code } = await handleMessagePush(data);
        this.loading = false;
        if (code === 200) {
          this.msgSuccess("推送成功");
          this.openPush = false;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    addUser(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.userList.unshift({
            id: Math.random()
              .toString(36)
              .substr(2),
            phone: this.pushForm.pushUsers
          });
          this.pushForm.pushUsers = "";
        } else {
          return false;
        }
      });
    },
    handleDelUser(data) {
      const idx = this.userList.findIndex(item => item.id === data.id);
      this.userList.splice(idx, 1);
    },
    _initParams(obj) {
      const dateRange = this.dateRange || [];
      Object.assign(obj, {
        beginPushtime: dateRange.length > 0 ? dateRange[0] : undefined,
        endPushtime: dateRange.length > 0 ? dateRange[1] : undefined
      });
      return obj;
    }
  }
};
</script>