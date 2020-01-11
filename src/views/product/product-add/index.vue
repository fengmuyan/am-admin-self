<template>
  <div class="app-container user-info">
    <div class="base-info block" v-loading="loading">
      <div>
        <h4>
          商品信息
          <el-button size="mini" class="auth-btn f-r" type="primary" @click="submit">保存提交</el-button>
        </h4>
        <el-form :model="baseForm" :rules="baseFormRules" ref="baseForm" label-width="110px">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="baseForm.name" style="width:400px" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="所属分类" prop="type">
            <el-select v-model="baseForm.type" placeholder="请选择分类" clearable style="width:400px">
              <el-option label="热带水果" value="shanghai"></el-option>
              <el-option label="多汁水果" value="beijing"></el-option>
              <el-option label="时令水果" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      baseForm: {
        name: "",
        type: ""
      },
      baseFormRules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        type: [{ required: true, message: "分类不能为空", trigger: "change" }]
      }
    };
  },
  created() {},
  methods: {
    submit() {}
  }
};
</script>