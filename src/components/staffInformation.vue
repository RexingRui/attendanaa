<template>
  <div class="staff-infomation">
    <vuetable
      ref="vuetable"
      :fields="fields"
      :api-mode="false"
      :data="tableData"
      :css="css.table"
      @vuetable:cell-clicked="handleTableClick"
    >
      <template slot="tableHeader">
        <template>
          <tr>
            <th colspan="7" class="table-header-title-one">人员信息</th>
          </tr>
          <tr>
            <th colspan="7" class="table-header-title-two">
              <span @click="handleClickAddStaff">
                <i class="fa fa-plus-circle fa-lg"></i> 新增
              </span>
              <span @click="handleClickRemoveStaff">
                <i class="fa fa-minus-circle fa-lg"></i> 删除
              </span>
              <span @click="handleClickEditStaff">
                <i class="fa fa-pencil" fa-lg></i> 修改
              </span>
              <div class="input-search">
                <el-input
                  placeholder="请输入姓名"
                  v-model="searchValue"
                  class="input-with-select"
                  size="small"
                >
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
              </div>
            </th>
          </tr>
        </template>
        <vuetable-row-header></vuetable-row-header>
      </template>
    </vuetable>
    <add-staff
      v-model="addStaffVisible"
      @record="handleRecordStaff"
      :staffInfo="currentStaffInfo"
      :openMode="openMode"
    ></add-staff>
  </div>
</template>
<script>
import Vuetable from "vuetable-2";
import VuetableCss from "@/assets/styles/vuetablecss.js";
import VuetableRowHeader from "vuetable-2/src/components/VuetableRowHeader.vue";
import AddStaff from "@/components/AddStaff.vue";
import WebStorage from "web-storage-cache";

export default {
  name: "staffInformation",
  components: {
    Vuetable,
    VuetableRowHeader,
    AddStaff
  },
  data() {
    return {
      fields: [
        {
          name: "id",
          title: "",
          width: "1rem"
        },
        {
          name: "select",
          title: '<input type="checkbox" > 全选',
          width: "2.4rem",
          formatter: value =>
            value == false
              ? '<input type="checkbox" v-model="checked">'
              : '<input type="checkbox" checked=true v-model="checked">'
        },
        {
          name: "attendId",
          title: '<i class="fa fa-address-book-o fa-lg"></i> 考勤号',
          titleClass: "center",
          width: "2.5rem"
        },
        {
          name: "name",
          title: '<i class="fa fa-user-circle fa-lg"></i> 姓名',
          titleClass: "center",
          width: "2.4rem"
        },
        {
          name: "gender",
          title: '<i class="fa fa-intersex fa-lg"></i> 性别',
          formatter: value => (value === "m" ? "Male" : "Female"),
          width: "2.6rem"
        },
        {
          name: "phone",
          title: '<i class="fa fa-mobile fa-lg"></i> 电话',
          width: "3.4rem"
        },
        {
          name: "email",
          title: '<i class="fa fa-at fa-lg"></i> 邮箱'
        },
        {
          name: "date",
          title: '<i class="fa fa-calendar fa-lg"></i> 入职日期',
          sortField: "classes",
          width: "3.3rem"
        }
      ],
      css: VuetableCss,
      addStaffVisible: false,
      checked: [],
      searchValue: "",
      selectStaffIndex: [],
      currentStaffInfo: {},
      openMode: "add",
      tableData: [],
      debounceSearchStaff: null
    };
  },
  watch: {
    searchValue(val) {
      this.debounceSearchStaff();
    }
  },
  methods: {
    /**
     * 获取所选择的staff
     * @param [string] message 执行什么操作删除还是修改
     */
    getSelectStaff(message) {
      let deleteIndex = [];
      this.tableData.forEach((value, index, array) => {
        if (value.select == true) {
          deleteIndex.push(value.id);
        }
      });
      this.selectStaffIndex = deleteIndex;
      // 如果没有选择用户，或者在修改的情况下多选,弹出提示
      if (deleteIndex.length == 0) {
        this.$alert(`请勾选需要${message}员工`, "提示", {
          confirmButtonText: "ok"
        });
      } else if (deleteIndex.length > 1 && message == "修改") {
        this.$alert(`单次只能修改一个员工数据`, "提示", {
          confirmButtonText: "ok"
        });
      }
    },
    handleClickEditStaff() {
      this.getSelectStaff("修改");
      // 选择一个的状态下可修改
      if (this.selectStaffIndex.length == 1) {
        // 打开对话框为修改模式
        this.openMode = "edit";
        this.addStaffVisible = true;
      }
    },
    handleClickAddStaff() {
      // 打开对话框为修改模式
      this.openMode = "add";
      this.addStaffVisible = true;
    },
    handleClickRemoveStaff() {
      this.getSelectStaff();
      let myStorage = new WebStorage();
      let deleteNum = myStorage.get("deleteNum")
        ? myStorage.get("deleteNum")
        : 0;
      myStorage.set(
        "deleteNum",
        this.selectStaffIndex.length + myStorage.get("deleteNum")
      );
      let currentStaffNum =
        this.$store.state.staffNum - this.selectStaffIndex.length;
      // 修改员工数量
      this.$store.dispatch("changeStaffNum", { staffNum: currentStaffNum });
      // 删除选择的员工信息
      this.$store.dispatch("changeStaffData", {
        deleteIndex: this.selectStaffIndex,
        flag: "remove"
      });
      setTimeout(x => {
        this.tableData = this.localData;
      }, 100);
    },
    handleTableClick(item) {
      this.currentStaffInfo = item.data;
      console.log(item.data);
      // 处理是否选中复选框
      if (item.field.name == "select") {
        item.data.select = !item.data.select;
      }
    },
    handleRecordStaff() {
      // 对话框确认添加/修改回调
      this.tableData = this.localData;
    },
    /**
     * 在输入框搜索员工时，处理方法
     * @param [string] staffName 输入的搜索框的姓名
     */
    handleSearchStaff() {
      let searchData = this.tableData.filter(value => {
        return value.name.indexOf(this.searchValue.trim()) > -1;
      });
      this.tableData = searchData ? searchData : this.localData;
      if (this.searchValue == "") {
        this.tableData = this.localData;
      }
    }
  },
  computed: {
    localData() {
      return this.$store.state.staffDatas;
    }
  },
  mounted() {
    this.tableData = this.localData;
  },
  created() {
    // 创建函数去抖
    this.debounceSearchStaff = _.debounce(this.handleSearchStaff, 200);
  }
};
</script>
<style lang="less" scoped>
.staff-infomation {
  background-color: #f1f1f1;
  /deep/ th,
  /deep/ td {
    padding: 0.18rem 0.5rem;
  }
  .table-header-title-one {
    border-bottom: none;
  }
  .table-header-title-two {
    span {
      margin-right: 0.2rem;
      cursor: pointer;
      user-select: none;
    }
    .input-search {
      display: inline-block;
    }
  }
}
</style>