<template>
  <div class="change-password">
    <el-dialog title="修改账号密码" :visible.sync="dialogFormVisible" @open="handleOpenDialog">
      <el-form :model="form" size="mini" :rules="rules" ref="form" @submit.prevent>
        <el-form-item label :label-width="formLabelWidth" prop="newPassword">
          <el-input v-model="form.newPassword" clearable></el-input>
        </el-form-item>
        <el-form-item label :label-width="formLabelWidth" prop="sureInput">
          <el-input v-model="form.sureInput" clearable></el-input>
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
  name: 'changePassword',
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: '.75rem',
      form: {
        newPassword: '',
        sureInput: ''
      },
      rules: ""
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
      this.dialogFormVisible = val;
    },
    dialogFormVisible(val) {
      this.$emit('input', val)
    }
  },
  
}
</script>
<style lang="less" scoped>
</style>


