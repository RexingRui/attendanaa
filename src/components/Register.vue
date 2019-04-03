<template>
  <div class="register">
    <div class="register-wrap">
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
  <div class="back-login">
    <el-button type="primary" @click="handleBackLogin">返回登陆</el-button>
  </div>
  </div>
</template>
<script>
import WebStorage from "web-storage-cache";
import { resolve } from "q";

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
          { min: 2, max: 10, message: "姓名格式错误", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate(vaild => {
        if (vaild) {
          // 验证成功，分发数据到vuex
          this.$store.dispatch("changeUser", {
            userNum: this.user.userNum,
            userData: {
              id: this.user.userNum,
              name: this.form.name,
              password: this.form.password,
              region: this.form.region
            }
          });
          // 显示注册成功消息
          this.$message({
            showClose: true,
            message: "恭喜你，账号注册成功",
            type: "success",
            duration: 1000
          });
          //  切换到登陆页面
          setTimeout(() => {
            this.$emit("change", "login");
          }, 1000);
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
      // 账号名重复验证规则
      let _this = this;
      this.rules.name.push({
        validator(rule, value, callback) {
          let errors = [];
          let userNameError = _this.user.userData.some(user => {
            return user.name == value;
          });
          if (userNameError) {
            errors.push("该账号已存在");
          }
          callback(errors);
        },
        trigger: "blur"
      });
    },
    handleBackLogin() {
      this.$emit('login', 'login')
    }
  },
  mounted() {
    // 从localStorage中获取用户数据
    this.addRules();
  }
};
</script>
<style lang="less" scoped>
  .register {
    .register-wrap {
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
    .back-login {
      position: fixed;
      top: 50px;
      right: 50px;
    }
  }
</style>
