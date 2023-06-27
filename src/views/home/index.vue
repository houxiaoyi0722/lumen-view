<template>
  <el-card class="box-card-process-list" :body-style="{ padding: '10px' }">
    <el-tabs
      v-model="home.activeName"
      class="demo-tabs"
      @tab-click="tabHandleClick"
    >
      <el-tab-pane label="流程列表" name="process">
        <vxe-table
          :show-header="false"
          :row-config="{ height: 30 }"
          :data="tableData"
        >
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="name" title="Name"></vxe-column>
          <vxe-column field="sex" title="Sex"></vxe-column>
          <vxe-column field="age" title="Age"></vxe-column>
          <vxe-column
            field="address"
            title="Address"
            show-overflow
          ></vxe-column>
        </vxe-table>
        <vxe-pager
          perfect
          v-model:current-page="demo1.tablePage.currentPage"
          v-model:page-size="demo1.tablePage.pageSize"
          :total="demo1.tablePage.total"
          :layouts="['NextPage', 'NextJump', 'Total']"
        >
        </vxe-pager>
      </el-tab-pane>
      <el-tab-pane label="我的待办" name="todo">User</el-tab-pane>
      <el-tab-pane label="我处理的" name="handled">Config</el-tab-pane>
      <el-tab-pane label="我发起的" name="launch">Task</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import type { TabsPaneContext } from "element-plus";

const home = reactive({
  activeName: "todo",
  processList: [],
  todoList: [],
  handledList: [],
  launchList: [],
});

const tabHandleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
</script>

<style lang="scss" scoped>
.home {
  color: $mainColor;
}
.box-card-process-list {
  position: relative;
  left: 0;
  top: 1%;
  width: 40%;
  height: 40%;
}
</style>
