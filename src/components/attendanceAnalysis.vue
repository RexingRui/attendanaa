<template>
  <div class="attendance-analysis">
    分析页面
    <table id="table" data-height="460"></table>
  </div>
</template>
<script>
export default {
  name: "attendanceAnalysis",
  computed: {
    staffDatas() {
      return this.$store.state.staffDatas;
    }
  },
  methods: {
    getTableColumns() {
      let columns = [];
      columns[0] = { field: "attendId", title: "考勤号" };
      columns[1] = { field: "name", title: "姓名" };
      for (let i = 2; i < 5; i++) {
        columns[i] = { field:  i - 1+ "month", title: i - 1 + "月"} ;
      }
      return columns;
    },
    getTableData() {
      let dataAnalysis = [];
      
      this.staffDatas.forEach(staff => {
        let staffDataAna = [];
        staff.attendRecord.forEach(attendanceObj => {
          if (!staffDataAna[attendanceObj.month]) {
            staffDataAna[attendanceObj.month] = [];
          } 
          staffDataAna[attendanceObj.month].push(attendanceObj.attendance.state);
        });
        dataAnalysis.push({name: staff.name, attendId: staff.attendId, staffDataAna: staffDataAna})
      });

      console.log(dataAnalysis);
      let data = [
        {
          attendId: 0,
          name: "wq",
          '1month': 1,
          '2month': 2,
          '3month': 3,
        },
        {
          attendId: 1,
          name: "rjj",
          '1month': 1,
          '2month': 2,
          '3month': 3,
        },
        
      ];
      return data;
    }
  },
  mounted() {
    let $table = $("#table")
    let columns = this.getTableColumns();
    let data = this.getTableData();
    $table.bootstrapTable({
      columns: columns,
      data: data
    });
  }
};
</script>
<style lang="less" scoped>
</style>

