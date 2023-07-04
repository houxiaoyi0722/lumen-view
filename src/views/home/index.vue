<template>
  <el-card class="box-card-process-list" :body-style="{ padding: '10px',height: '100%'}">
    <el-tabs
      v-model="home.activeName"
      class="flowable-tabs"
      @tab-click="tabHandleClick"
    >
      <el-tab-pane label="流程列表" name="process" style="height: 200%">
        <vxe-table
          :show-header="false"
          border
          size="mini"
          :row-config="{ height: 20 }"
          :data="home.processList"
        >
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="name" title="Name" show-overflow></vxe-column>
          <vxe-column field="address" title="Address" width="60"></vxe-column>
        </vxe-table>
        <vxe-pager
          size="mini"
          auto-hidden
          v-model:current-page="home.processPage.currentPage"
          v-model:page-size="home.processPage.pageSize"
          :total="home.processPage.total"
          :layouts="['PrevPage', 'NextPage', 'Total']"
          @page-change="loadProcessList()"
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
import { onMounted, reactive } from "vue";
import type { TabsPaneContext } from "element-plus";
import { obtainProcessList } from "@/api/flowable";

const home = reactive({
  activeName: "todo",
  processList: [],
  processPage: {
    currentPage: 0,
    pageSize: 10,
    total: 0,
  },
  todoList: [],
  handledList: [],
  launchList: [],
});

const tabHandleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

onMounted(() => {
  loadProcessList();
});

const loadProcessList = () => {
  obtainProcessList(home.processPage).then((res: any) => {
    home.processList = res.data;
    home.processPage.total = res.total;
  });
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
