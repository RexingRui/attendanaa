<template>
  <div class="staff-infomation">
    <vuetable ref="vuetable" :fields="fields" :api-mode="false" :data="localData" :css="css.table">
      <template slot="tableHeader">
        <template>
          <tr>
            <th colspan="5" class="table-header-title">人员信息</th>
          </tr>
        </template>
        <vuetable-row-header></vuetable-row-header>
      </template>
    </vuetable>
  </div>
</template>
<script>
import Vuetable from "vuetable-2";
import VuetableCss from "@/assets/styles/vuetablecss.js";
import VuetableRowHeader from "vuetable-2/src/components/VuetableRowHeader.vue";

export default {
  name: "staffInformation",
  components: {
    Vuetable,
    VuetableRowHeader
  },
  data() {
    return {
      fields: [
        {
          name: "name",
          title: '<i class="fa fa-user-circle fa-lg"></i> 姓名',
          titleClass: "center",
          width: "2.8rem"
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
          width: "4.8rem"
        },
        {
          name: "email",
          title: '<i class="fa fa-at fa-lg"></i> 邮箱'
        },
        {
          name: "rank",
          title: '<i class="fa fa-thumbs-up fa-lg"></i> 级别',
          sortField: "classes",
          width: "2.4rem"
        }
      ],
      localData: [
        {
          id: 1,
          name: "wq",
          gender: "W",
          phone: "12345497653",
          email: "sdi@dfd.com",
          rank: 1
        },
        {
          id: 2,
          name: "rjj",
          gender: "M",
          phone: "32145497653",
          email: "sdi@dfd.com",
          rank: 2
        },
        {
          id: 1,
          name: "wq",
          gender: "W",
          phone: "12345497653",
          email: "sdi@dfd.com",
          rank: 3
        },
        {
          id: 2,
          name: "rjj",
          gender: "M",
          phone: "32145497653",
          email: "sdi@dfd.com",
          rank: 4
        },
        {
          id: 1,
          name: "wq",
          gender: "W",
          phone: "12345497653",
          email: "sdi@dfd.com",
          rank: 5
        },
        {
          id: 2,
          name: "rjj",
          gender: "M",
          phone: "32145497653",
          email: "sdi@dfd.com",
          rank: 6
        }
      ],
      css: VuetableCss
    };
  }
};
</script>
<style lang="less" scoped>
  .staff-infomation {
    /deep/ th,
    /deep/ td {
      padding: 0.18rem 0.5rem;
    }
    .table-header-title {
      border-bottom: none;
    }
  }
</style>

