<template>
  <div class="add-staff">
    <el-dialog title="新人员信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" size="mini" :rules="rules" ref="form" @submit.prevent>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="男" value="m"></el-option>
            <el-option label="女" value="w"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model.trim="form.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="日期" :label-width="formLabelWidth">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期"></el-date-picker>
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
import WebStorage from "web-storage-cache";

export default {
  name: "addStaff",
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
        date: "",
        gender: "",
        email: "",
        phone: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 2, max: 5, message: "姓名格式错误", trigger: "blur" }
        ],
        gender: {
          required: true,
          message: "请选择性别",
          trigger: "visible-change"
        },
        phone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            validator(rule, value, callback) {
              let errors = [];
              let phoneError = /^1[0-9]{10}$/.test(value);
              if (!phoneError) {
                errors.push("电话号码格式错误");
              }
              callback(errors);
            },
            trigger: "blur"
          }
        ],
        email: { type: "email", message: "邮箱格式错误", trigger: "blur" }
      },
      dialogFormVisible: this.value,
      formLabelWidth: "1rem",
      enterDate: ""
    };
  },
  watch: {
    value(val) {
      this.dialogFormVisible = val;
    },
    dialogFormVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    handleCancleDialog() {
      this.dialogFormVisible = false;
      this.$emit("input", this.dialogFormVisible);
    },
    handleSureDialog() {
      this.$refs["form"].validate(vaild => {
        if (vaild) {
          // 获取员工数量
          let staffNum = this.$store.state.staffNum;
          let myStorage = new WebStorage();
          // 添加员工信息
          myStorage.set("staff" + staffNum, {
            id: staffNum,
            name: this.form.name,
            gender: this.form.gender,
            phone: this.form.phone,
            email: this.form.email,
            date: this.form.date,
            select: false
          }),
            this.$store.commit("changeStaffNum", { userNum: staffNum + 1 });
          myStorage.replace("staffNum", staffNum + 1);
          // 注册成功消息提示框
          this.$message({
            type: "success",
            message: "成功注册信息",
            showClose: true,
            duration: 1000
          });
          // 关闭注册框
          this.dialogFormVisible = false;
          this.$emit("input", this.dialogFormVisible);
          return false;
        }
      });
    }
  },
  mounted() {
    this.form.gender = "男";
  }
};
</script>
<style lang="less" scoped>
  .add-staff {
    /deep/ .el-dialog {
      width: 40%;
      border-radius: 0.2rem;
      .el-form-item {
        height: 0.8rem;
        .el-form-item__error {
          top: 0.75rem;
        }
      }
    }
  }
</style>


