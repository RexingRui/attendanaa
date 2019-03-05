<template>
  <div class="read-data">
    <input class="select-input" type="file" :accept="format" @change="handleInputChange" ref="file">
    <slot :user="user"></slot>
    <slot name="hint"></slot>
  </div>
</template>
<script>
export default {
  name: "readData",
  data() {
    return  {
      user: 1
    }
  },
  props: {
    format: {
      type: String,
      default: ".json"
    }
  },
  methods: {
    handleInputChange() {
      let file = this.$refs.file.files[0]
      this.$emit("readdata", file);
    }
  }
};
</script>
<style lang="less" scoped>
  .read-data {
    position: relative;
    background-color: #409eff;
    height: 40px;
    width: 80px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    cursor: pointer;
    color: #e1e1e1;
    .select-input {
      width: 80px;
      height: 40px;
      position: absolute;
      cursor: pointer;
      top: 0;
      left: -10px;
      opacity: 0;
    }
  }
</style>
