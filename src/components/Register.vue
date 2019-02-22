<template>
  <div class="login">
    <div class="login-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="70px">
        <el-form-item label="账号" prop="name">
          <el-input v-model="form.name" size="medium" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" size="medium" clearable placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="form.region" placeholder="请选择级别">
            <el-option label="部门经理" value="manager"></el-option>
            <el-option label="普通员工" value="staff"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">确认</el-button>
          <el-button @click="handleResetRegister('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import WebStorage from "web-storage-cache";

export default {
  name: "register",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: "",
        region: "",
        password: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 2, max: 5, message: "姓名格式错误", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      userStorage: {}
    };
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate(vaild => {
        if (vaild) {
          let userNum = this.$store.state.userNum;
          this.userStorage.set("user" + userNum, {
            name: this.form.name,
            password: this.form.password,
            id: userNum,
            region: this.form.region
          });
          this.userStorage.replace("userNum", userNum + 1);
          this.$store.commit("changeUserNum", { name: userNum + 1 });
          // 弹出消息框
          this.$message({
            showClose: true,
            message: "恭喜你，账号注册成功",
            type: "success",
            duration: 1000
          });
          // 延时1.2s自动切换到登陆页面
          setTimeout(() => {
            this.$emit("change", "login");
          }, 1200);
        } else {
          return false;
        }
      });
    },
    handleResetRegister(form) {
      this.$refs[form].resetFields();
    },
    /**
     * 添加表单验证规则
     */
    addRules() {
      // 读取所有的帐号名
      let userNum = this.$store.state.userNum;
      let userNames = [];
      for (let i = 0; i < userNum; i++) {
        userNames.push(this.userStorage.get("user" + i).name);
      }
      // 账号名重复验证规则
      this.rules.name.push({
        validator(rule, value, callback) {
          let errors = [];
          let userNameError = userNames.find(item => {
            return item == value;
          });
          if (userNameError) {
            errors.push("该账号已存在");
          }
          callback(errors);
        },
        trigger: "blur"
      });
    }
  },
  mounted() {
    // 从localStorage中获取用户数据
    this.userStorage = new WebStorage();
    this.addRules();
  }
};
</script>
<style lang="less" scoped>
  .login {
    .login-wrap {
      padding-top: 0.48rem;
      box-sizing: border-box;
      width: 8rem;
      height: 6.8rem;
      background-color: #24a5b167;
      border-radius: 0.32rem;
      /deep/ input {
        width: 6rem;
      }
      .el-icon-view {
        color: #161414;
        cursor: pointer;
        margin-left: 0.05rem;
      }
    }
  }
</style>
