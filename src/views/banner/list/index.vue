<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true">
          <el-form-item label="banner分类" prop="type">
            <el-select
              v-model="queryForm.type"
              placeholder="请选择分类"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="h5页面" value="1" />
              <el-option label="进入店铺" value="2" />
              <el-option label="进入分类" value="3" />
              <el-option label="进入商品" value="4" />
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
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addBanner">新增</el-button>
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
      <el-table style="width: 100%" v-loading="loading" :data="bannerList">
        <el-table-column label="图片信息" prop="usercode" width="150px">
          <template slot-scope="scope">
            <div class="demo-image__preview img-box">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.imageurl"
                :preview-src-list="[scope.row.imageurl]"
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" width="100px">
          <template slot-scope="scope">{{scope.row.type|initType}}</template>
        </el-table-column>
        <el-table-column label="允许登陆" prop="accept" width="120px">
          <template slot-scope="scope">{{scope.row.accept|initAccept}}</template>
        </el-table-column>
        <el-table-column label="对应编号" prop="data" width="120px"/>
        <el-table-column label="连接地址" prop="hyperlink" />
        <el-table-column label="创建日期" prop="createtime" width="150px"/>
        <el-table-column label="排序" prop="serial" width="80px"/>
        <el-table-column label="操作" width="160px">
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
    <!-- 添加或修改banner对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="mtb-15">
        <el-form-item label="图片上传" prop="imageurl" ref="uploadElement" v-if="imgShow">
          <upload-img
            @add-item="addItemFir"
            @del-item="delItemFir"
            :file="form.imageurl?[{uid:0,url:form.imageurl}]:[null]"
            ref="imgItemOne"
            v-model="form.imageurl"
          ></upload-img>
        </el-form-item>
        <el-form-item label="banner分类" prop="type">
          <el-select v-model="form.type" placeholder="请选择banner分类">
            <el-option label="h5页面" :value="1" />
            <el-option label="进入店铺" :value="2" />
            <el-option label="进入分类" :value="3" />
            <el-option label="进入商品" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="登陆方式" prop="accept">
          <el-radio-group v-model="form.accept">
            <el-radio :label="0">允许匿名登陆</el-radio>
            <el-radio :label="1">登陆后进入</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="form.type === 1">
          <el-form-item label="链接地址" prop="hyperlink">
            <el-input v-model="form.hyperlink" placeholder="请输入连接地址"></el-input>
          </el-form-item>
          <el-form-item label="连接中参数" prop="type">
            <el-radio-group v-model="form.link">
              <el-radio :label="0">无参数</el-radio>
              <el-radio :label="1">有参数</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="渠道号" prop="channel">
            <el-radio-group v-model="form.channel">
              <el-radio :label="0">不传</el-radio>
              <el-radio :label="1">传</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="sid及token" prop="token">
            <el-radio-group v-model="form.token">
              <el-radio :label="0">不传</el-radio>
              <el-radio :label="1">传</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item v-if="form.type !== 1" :label="initCode" prop="data">
          <el-input v-model="form.data" :placeholder="`请输入${initCode}`"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="serial">
          <el-input v-model="form.serial" placeholder="请输入排序序号"></el-input>
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
import { getBannerList, delBanner, saveAdvert } from "@/api/banner";
import UploadImg from "@/components/UploadImg";
import minHeightMix from '@/mixins/minHeight'
export default {
  mixins: [minHeightMix],
  components: {
    UploadImg
  },
  data() {
    const validateSort = (rule, value, callback) => {
      if (value !== "" && !/^(1|([1-9]\d{0,1})|100)$/.test(value)) {
        callback(new Error("请输入0-100之间的整数"));
      }
      callback();
    };
    return {
      loading: false,
      loadingForm: false,
      imgShow: true,
      formShow: true,
      bannerList: [],
      total: 0,
      dateRange: [],
      title: "新增banner",
      open: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        type: undefined
      },
      form: {
        uid: undefined,
        imageurl: null,
        type: 1,
        link: 0,
        channel: 0,
        serial: "",
        token: 0,
        accept: 1,
        hyperlink: "",
        data: "",
        accept: 1
      },
      rules: {
        imageurl: [
          { required: true, message: "上传图片不能为空", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择分类", trigger: "change" }],
        data: [{ required: true, message: "请输入对应编号", trigger: "blur" }],
        link: [{ required: true, message: "请选择", trigger: "change" }],
        channel: [{ required: true, message: "请选择", trigger: "change" }],
        token: [{ required: true, message: "请选择", trigger: "change" }],
        accept: [
          { required: true, message: "请选择登陆方式", trigger: "change" }
        ],
        serial: [{ validator: validateSort, trigger: "blur" }],
        hyperlink: [
          { required: true, message: "请选输入连接地址", trigger: "blur" }
        ]
      }
    };
  },
  filters: {
    initType(val) {
      const arr = ["", "h5页面", "进入店铺", "进入分类", "进入商品"];
      return arr[val];
    },
    initAccept(val) {
      const arr = ["允许匿名进入", "登陆后进入"];
      return arr[val];
    }
  },
  computed: {
    initCode() {
      const type = this.form.type;
      if (type === 2) {
        return "店铺编号";
      } else if (type === 3) {
        return "分类编号";
      } else if (type === 4) {
        return "商品编号";
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
          data: { content, totalSize }
        } = await getBannerList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.bannerList = content;
          this.total = totalSize;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },

    addItemFir(val) {
      this.form.imageurl = val[0];
      this.$refs["uploadElement"].clearValidate();
    },

    delItemFir(val) {
      this.form.imageurl = null;
    },

    resetBannerForm() {
      Object.assign(this.form, {
        uid: undefined,
        imageurl: null,
        type: 1,
        link: 0,
        channel: 0,
        serial: "",
        token: 0,
        accept: 0,
        hyperlink: "",
        data: "",
        accept: 1
      });
    },

    cancel() {
      this.open = false;
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
            const { code } = await delBanner({ uid: item.uid });
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

    async addBanner() {
      this.imgShow = false;
      this.resetBannerForm();
      this.title = "新增banner";
      await this.$nextTick();
      this.open = true;
      this.imgShow = true;
    },

    async handleEdit(item) {
      this.imgShow = false;
      this.resetBannerForm();
      this.title = "修改banner";
      Object.assign(this.form, {
        uid: item.uid,
        imageurl: item.imageurl,
        type: item.type,
        link: item.link,
        channel: item.channel,
        serial: item.serial,
        token: item.token,
        accept: item.accept,
        hyperlink: item.hyperlink,
        data: item.data,
        accept: item.accept
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
          formData.append("imageurl", this.$refs.imgItemOne.fileList[0]);
          formData.append("type", this.form.type);
          if (this.form.type === 1) {
            formData.append("channel", this.form.channel);
            formData.append("token", this.form.token);
            formData.append("link", this.form.link);
          } else {
            formData.append("data", this.form.data);
          }
          formData.append("hyperlink", this.form.hyperlink);
          formData.append("serial", this.form.serial);
          formData.append("accept", this.form.accept);
          this.subData(formData);
        } else {
          return false;
        }
      });
    },

    /* 提交数据接口 */
    async subData(formData) {
      try {
        this.loadingForm = true;
        const { code } = await saveAdvert(formData);
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

    handleQuery() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
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