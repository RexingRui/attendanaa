<template>
  <div class="change-password">
    <el-dialog title="修改账号密码" :visible.sync="dialogFormVisible" width="25%">
      <el-form :model="form" size="small" :rules="rules" ref="form">
        <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldPassword" size="mini">
          <el-input v-model="form.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
          <el-input v-model="form.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="sureInput">
          <el-input v-model="form.sureInput"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancleDialog">取 消</el-button>
        <el-button type="primary" @click="handleSureDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "changePassword",
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "100px",
      form: {
        oldPassword: "",
        newPassword: "",
        sureInput: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" }
        ],
        newPassword: {
          required: true,
          message: "请输入新密码",
          trigger: "blur"
        },
        sureInput: [
          { required: true, message: "请再次输入密码", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      this.dialogFormVisible = val;
    },
    dialogFormVisible(val) {
      this.$emit("input", val);
    }
  },
  computed: {
    loginUser() {
      return this.$store.state.loginUser;
    }
  },
  methods: {
    handleCancleDialog() {
      this.dialogFormVisible = false;
    },
    handleSureDialog() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$store.dispatch("updateLoginUser", {
            userPassword: this.form.newPassword,
            flag: "password"
          });
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success",
            duration: "1500"
          });
          setTimeout(x => {
            this.dialogFormVisible = false;
          }, 1000);
        }
      });
    },
    addRules() {
      let _this = this;
      // 旧密码核实
      this.rules.oldPassword.push({
        validator(rule, value, callback) {
          let errors = [];
          if (_this.loginUser.password != value) {
            errors.push("旧密码输入错误");
          }
          callback(errors);
        },
        trigger: "blur"
      });
      // 两次输入密码是否一致
      this.rules.sureInput.push({
        validator(rule, value, callback) {
          let errors = [];
          if (_this.form.newPassword != value) {
            errors.push("两次输入的密码不一致");
          }
          callback(errors);
        },
        trigger: "blur"
      });
    }
  },
  mounted() {
    this.addRules();
    this.form.oldPassword = '';
    this.form.newPassword = '';
    this.sureInput = '';
  }
};
</script>
<style lang="less" scoped>
.change-password {
  /deep/ .el-dialog {
    border-radius: 10px;
    .el-dialog__body {
      padding: 30px 20px 30px 0;
      .el-form-item__label {
        margin-bottom: 0;
      }
    }
  }
}
</style>


