<template>
  <div class="app-container user-info">
    <div class="base-info block" v-loading="loading" v-if="baseForm">
      <div>
        <h4>
          用户信息
          <el-button
            v-if="Number(baseForm.state)===1"
            size="mini"
            class="auth-btn f-r"
            type="success"
            @click="authSuccess"
          >认证成功</el-button>
          <el-button
            v-if="Number(baseForm.state)===1"
            size="mini"
            class="auth-btn f-r"
            type="primary"
            @click="authFailed"
          >认证失败</el-button>
        </h4>
        <el-form :model="baseForm" ref="baseForm" label-width="110px">
          <el-form-item label="认证状态" prop="state">
            <span :class="{status:true,'warn-color':baseForm.state===2,'suc-color':baseForm.state===3}">{{baseForm.state|initState}}</span>
          </el-form-item>
          <el-form-item label="用户类型" prop="quality" class="radio-item">
            <el-radio-group v-model="baseForm.registertype" style="width:400px" disabled>
              <el-radio :label="0">个人</el-radio>
              <el-radio :label="1">企业</el-radio>
              <el-radio :label="2">个体工商户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="企业名称" prop="company">
            <el-input v-model="baseForm.company" style="width:400px" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="contactsPhone">
            <el-input v-model="baseForm.contactsPhone" style="width:400px" disabled></el-input>
          </el-form-item>
          <el-form-item label="企业地址" prop="contactsAddress">
            <el-input v-model="baseForm.contactsAddress" style="width:400px" disabled></el-input>
          </el-form-item>
          <el-form-item label="企业信用代码" prop="companyNo">
            <el-input v-model="baseForm.companyNo" style="width:400px" disabled></el-input>
          </el-form-item>
          <el-form-item label="企业营业执照" class="img-box">
            <div class="avatar">
              <div class="demo-image__preview">
                <el-image
                  style="width: 118px; height: 100px"
                  :src="baseForm.businessLicense"
                  :preview-src-list="[baseForm.businessLicense,baseForm.frCertZm,baseForm.frCertfm]"
                ></el-image>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="法人姓名" prop="corporation">
            <el-input v-model="baseForm.corporation" style="width:400px" disabled></el-input>
          </el-form-item>
          <el-form-item label="法人证件类型" prop="idtype">
            <el-radio-group v-model="baseForm.idtype" disabled>
              <el-radio :label="0">身份证</el-radio>
              <el-radio :label="1">护照</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="法人证件号码" prop="corporationidno">
            <el-input v-model="baseForm.corporationidno" style="width:400px" disabled></el-input>
          </el-form-item>
          <el-form-item label="法人证件照片" class="img-box">
            <div class="avatar">
              <div class="demo-image__preview">
                <el-image
                  style="width: 118px; height: 90px"
                  :src="baseForm.frCertZm"
                  :preview-src-list="[baseForm.frCertZm,baseForm.frCertfm,baseForm.businessLicense]"
                ></el-image>
              </div>
              <span>证件照片正面</span>
            </div>
            <div class="avatar">
              <div class="demo-image__preview">
                <el-image
                  style="width: 118px; height: 90px"
                  :src="baseForm.frCertfm"
                  :preview-src-list="[baseForm.frCertfm,baseForm.frCertZm,baseForm.businessLicense]"
                ></el-image>
              </div>
              <span>证件照片反面</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { userExamineDetail, userExamine } from "@/api/examine";
export default {
  data() {
    return {
      loading: true,
      baseForm: null
    };
  },
  filters: {
    initState(val) {
      const arr = ["待认证", "认证中", "认证失败", "认证成功"];
      return arr[val];
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      try {
        this.loading = true;
        const useraccount = this.$route.params.code;
        const { code, data } = await userExamineDetail({ useraccount });
        this.loading = false;
        if (code === 200) {
          this.baseForm = data;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    authSuccess() {
      this.$confirm("确定要认证成功吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      }).then(async () => {
        try {
          const useraccount = this.baseForm.useraccount;
          this.loading = true;
          const { code } = await userExamine({
            useraccount,
            remark: "",
            state: 3
          });
          this.loading = false;
          if (code === 200) {
            this.msgSuccess("操作成功");
            this.$router.push({
              path: "/examine/list"
            });
          }
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      });
    },
    authFailed() {
      this.$prompt("请输入失败原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(async ({ value }) => {
        try {
          const useraccount = this.baseForm.useraccount;
          this.loading = true;
          const { code } = await userExamine({
            useraccount,
            remark: value,
            state: 2
          });
          this.loading = false;
          if (code === 200) {
            this.msgSuccess("操作成功");
            this.$router.push({
              path: "/examine/list"
            });
          }
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      });
    }
  }
};
</script>