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
      userNames: []
    };
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate(vaild => {
        if (vaild) {
          let myStorage = new WebStorage();
          let userNum = this.$store.state.userNum;
          myStorage.set("user" + userNum, {
            name: this.form.name,
            password: this.form.password,
            id: userNum,
            region: this.form.region
          });
          this.$store.commit("changeUserNum", { userNum: userNum + 1 });
          alert("注册成功");
          this.$emit("change", "login");
        } else {
          return false;
        }
      });
    },
    handleResetRegister(form) {
      this.$refs[form].resetFields();
    },
    addRules() {
      // 读取所有的帐号名
      let myStorage = new WebStorage();
      console.log(myStorage);
      let userNum = this.$store.state.userNum;
      let userNames = [];
      for (let i = 0; i < userNum; i++) {
        userNames.push(myStorage.get("user" + i).name);
      }
      // 增加账号名是否重复验证
      this.rules.name.push({
        validator(rule, value, callback, source, options) {
          let errors = [];
          let userNameError = userNames.find(item => {
            return item == value;
          });
          console.log(userNameError);
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
