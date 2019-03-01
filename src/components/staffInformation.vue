<template>
  <div class="staff-infomation">
    <vuetable
      ref="vuetable"
      :fields="fields"
      :api-mode="false"
      :data="localData"
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
            </th>
          </tr>
        </template>
        <vuetable-row-header></vuetable-row-header>
      </template>
    </vuetable>
    <add-staff v-model="addStaffVisible"></add-staff>
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
          name: "name",
          title: '<i class="fa fa-user-circle fa-lg"></i> 姓名',
          titleClass: "center",
          width: "2.4rem"
        },
        {
          name: "gender",
          title: '<i class="fa fa-intersex fa-lg"></i> 性别',
          formatter: value => (value === "M" ? "Male" : "Female"),
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
      localData: []
    };
  },
  methods: {
    handleClickAddStaff() {
      this.addStaffVisible = true;
    },
    handleClickRemoveStaff() {
      let deleteIndex = [];
      this.localData.forEach((value, index, array) => {
        if (value.select == true) {
          this.localData = this.localData.filter(item => {
            return item.id != value.id;
          });
          deleteIndex.push(value.id);
        }
      });
      let myStorage = new WebStorage();
      let deleteNum = myStorage.get("deleteNum")
        ? myStorage.get("deleteNum")
        : 0;
      myStorage.set(
        "deleteNum",
        deleteIndex.length + myStorage.get("deleteNum")
      );
      let currentStaffNum = this.$store.state.staffNum - deleteIndex.length;
      console.log(currentStaffNum);
      this.$store.dispatch("changeStaffNum", { staffNum: currentStaffNum });
      this.$store.dispatch("initialStaffData", {
        staffDatas: this.localData,
        deleteIndex: deleteIndex
      });
    },
    handleTableClick(item) {
      if (item.field.name == "select") {
        item.data.select = !item.data.select;
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.localData = this.$store.state.staffDatas;
    }, 100);
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
    }
  }
</style>