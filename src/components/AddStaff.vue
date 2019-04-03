<template>
  <div class="add-staff">
    <el-dialog title="新人员信息" :visible.sync="dialogFormVisible" @open="handleOpenDialog">
      <el-form :model="form" size="mini" :rules="rules" ref="form" @submit.prevent>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号" :label-width="formLabelWidth" prop="attendId">
          <el-input v-model="form.attendId" clearable></el-input>
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
    },
    staffInfo: {
      type: Object,
      default: {}
    },
    openMode: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      form: {
        name: "",
        date: "",
        gender: "",
        email: "",
        phone: "",
        attendId: ""
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
        attendId: {
          required: true,
          message: "请输入考勤账号",
          trigger: "blur"
        },
        phone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            validator (rule, value, callback) {
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
      dialogFormVisible: false,
      formLabelWidth: "1rem",
      enterDate: ""
    };
  },
  computed: {
    staffNum () {
      return this.$store.state.staffNum;
    }
  },
  watch: {
    value (val) {
      this.dialogFormVisible = val;
    },
    dialogFormVisible (val) {
      this.$emit("input", val);
    }
  },
  methods: {
    handleCancleDialog () {
      this.dialogFormVisible = false;
    },
    handleSureDialog () {
      this.$refs["form"].validate(vaild => {
        if (vaild) {
          // 数据验证成功，判断时增加员工信息还是修改员工信息
          if (this.openMode == 'edit') {
            // 修改员工信息
            this.$store.dispatch("changeStaffData", {
              staffData: {
                id: this.staffInfo.id,
                name: this.form.name,
                phone: this.form.phone,
                email: this.form.email,
                gender: this.form.gender,
                attendId: this.form.attendId,
                date: this.form.date.toLocaleDateString(),
                select: false,
                attendRecord: this.staffInfo.attendRecord
              }, flag: 'change'
            });
            // 修改成功消息提示框
            this.$message({
              type: "success",
              message: "成功修改信息",
              showClose: true,
              duration: 1000
            });
          } else {
            // 新增员工信息
            // 获取员工数量
            let myStorage = new WebStorage();
            let deleteNum = myStorage.get('deleteNum') ? myStorage.get('deleteNum') : 0;
            let staffNum = this.staffNum + deleteNum;
            // 添加员工信息
            this.$store.dispatch("changeStaffData", {
              staffData: {
                id: staffNum,
                name: this.form.name,
                gender: this.form.gender,
                phone: this.form.phone,
                attendId: this.form.attendId,
                email: this.form.email,
                date: this.form.date.toLocaleDateString(),
                select: false,
                attendRecord: []
              }, flag: 'add'
            });
            // 分发员工信息
            this.$store.dispatch("changeStaffNum", { staffNum: this.staffNum + 1 });
            // 注册成功消息提示框
            this.$message({
              type: "success",
              message: "成功注册信息",
              showClose: true,
              duration: 1000
            });
          }
          // 关闭注册框
          this.dialogFormVisible = false;
          this.$emit("record");
          return false;
        }
      });
    },
    handleOpenDialog () {
      // 判断是新增还是修改   
      if (this.openMode == 'add') {
        this.form.name = '';
        this.form.email = '';
        this.form.date = '';
        this.form.phone = '';
        this.form.gender = 'm'
      } else {
        this.form.name = this.staffInfo.name;
        this.form.email = this.staffInfo.email;
        this.form.phone = this.staffInfo.phone;
        this.form.gender = this.staffInfo.gender;
        this.form.attendId = this.staffInfo.attendId;
        this.form.date = new Date(this.staffInfo.date);
      }
    }
  },
  mounted () {
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

