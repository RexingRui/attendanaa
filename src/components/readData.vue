<template>
  <div class="read-data">
    <slot></slot>
    <input class="select-input" type="file" :accept="format" @change="handleInputChange($event)" ref="file">
    
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
    },
    readData: {
      type: String,
      default: 'readAttendanceData'
    }
  },
  methods: {
    handleInputChange(event) {
      let file = this.$refs.file.files[0]
      this.$emit(this.readData, file);
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
    width: 90px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    cursor: pointer;
    color: #f0e5e5;
    // padding-left: 2px;
    .select-input {
      width: 80px;
      height: 40px;
      position: absolute;
      cursor: pointer;
      top: 7px;
      left: 10px;
      opacity: 0;
    }
  }
</style>
