<template>
  <div class="read-data">
    <input class="select-input" type="file" :accept="format" @change="handleInputChange($event)" ref="file">
    <slot></slot>
    <slot name="hint"></slot>
  </div>
</template>
<script>
export default {
  name: "readData",
  props: {
    format: {
      type: String,
      default: ".json"
    }
  },
  methods: {
    handleInputChange(event) {
      let file = this.$refs.file.files[0]
      this.$emit("readdata", file);
      event.target.value = '';
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
    color: #f0e5e5;
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
