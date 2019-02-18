<template>
  <div class="login">
    <transition name="fade">
      <div class="login-wrap" v-if="showLogin">
        <el-form ref="form" :model="form" :rules="rules" label-width="70px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" size="medium" clearable="true" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" size="medium" clearable="true" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="级别">
            <el-select v-model="form.region" placeholder="请选择级别">
              <el-option label="部门经理" value="manager"></el-option>
              <el-option label="普通员工" value="staff"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox label="记住我的登陆" v-model="form.loginState"></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">登陆</el-button>
            <el-button>注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      form: {
        name: "",
        region: "",
        loginState: false,
        password: ""
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '姓名格式错误', trigger: 'blur' }
        ],
        password: [
          { type: "string",required: true, message: '请输入密码', trigger: 'blur' },
          { type:"string", message: '密码格式错误', trigger: 'blur' }
        ]
      },
      showLogin: false
    };
  },
  methods: {
    onSubmit() {
      alert("submit!");
    }
  },
  mounted() {
    this.showLogin = true;
  }
};
</script>
<style lang="less" scoped>
  .login {
    width: 100%;
    height: 100vh;
    background-color: rgba(61, 85, 100, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 1.8s;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
    .login-wrap {
      padding-top: 0.48rem;
      box-sizing: border-box;
      width: 8rem;
      height: 6.8rem;
      background-color: #ebe6e6;
      border-radius: 0.32rem;
      /deep/ input {
        width: 6rem;
      }
    }
  }
</style>
