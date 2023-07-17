<template>
  <el-card
    class="box-card-process-list"
    :body-style="{ padding: '10px', height: '100%' }"
  >
    <el-tabs
      v-model="home.activeName"
      class="flowable-tabs"
      @tab-click="tabHandleClick"
    >
      <el-tab-pane label="流程列表" name="process" style="height: 200%">
        <vxe-table
          border
          size="mini"
          :row-config="{ height: 20 }"
          :data="home.processList"
        >
          <vxe-column type="seq" width="30"></vxe-column>
          <vxe-column field="name" title="名称" show-overflow></vxe-column>
          <vxe-column title="创建草稿" width="80" align="center">
            <template #default="{ row }">
              <vxe-button
                type="text"
                icon="vxe-icon-file-txt"
                @click="createDraft(row)"
              ></vxe-button>
            </template>
          </vxe-column>
          <vxe-column title="发起流程" width="80" align="center">
            <template #default="{ row }">
              <vxe-button
                type="text"
                icon="vxe-icon-caret-right"
                @click="startProcess(row)"
              ></vxe-button>
            </template>
          </vxe-column>
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
      <el-tab-pane label="我的待办" name="todo">
        <vxe-table
          border
          size="mini"
          :row-config="{ height: 20 }"
          :data="home.todoList"
        >
          <vxe-column type="seq" width="30"></vxe-column>
          <vxe-column field="name" title="节点名称" show-overflow></vxe-column>
          <vxe-column field="startUserId" title="发起人" width="80" show-overflow></vxe-column>
          <vxe-column field="startTime" title="发起时间" width="140" show-overflow></vxe-column>
          <vxe-column title="操作" width="60">
            <template #default="{ row }">
              <vxe-button
                type="text"
                icon="vxe-icon-edit"
                @click="completeTask(row)"
              ></vxe-button>
            </template>
          </vxe-column>
        </vxe-table>
        <vxe-pager
          size="mini"
          auto-hidden
          v-model:current-page="home.todoPage.currentPage"
          v-model:page-size="home.todoPage.pageSize"
          :total="home.todoPage.total"
          :layouts="['PrevPage', 'NextPage', 'Total']"
          @page-change="loadTodoList()"
        >
        </vxe-pager>
      </el-tab-pane>
      <el-tab-pane label="我处理的" name="handled">Config</el-tab-pane>
      <el-tab-pane label="我发起的" name="launch">Task</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { defineComponent, onMounted, reactive } from "vue";
import { obtainProcessList, obtainTodoList } from "@/api/flowable";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();

    const home = reactive({
      activeName: "todo",
      processList: [],
      processPage: {
        currentPage: 0,
        pageSize: 10,
        total: 0,
      },
      todoPage: {
        currentPage: 0,
        pageSize: 10,
        total: 0,
      },
      todoList: [],
      handledList: [],
      launchList: [],
    });

    const tabHandleClick = (tab, event) => {
      home.activeName = tab.paneName;
      if ("process" === tab.paneName) {
        loadProcessList();
      } else if ("todo" === tab.paneName) {
        loadTodoList();
      } else if ("handled" === tab.paneName) {
        console.log(tab.paneName);
      } else if ("launch" === tab.paneName) {
        console.log(tab.paneName);
      }
    };

    onMounted(() => {
      loadProcessList();
      loadTodoList();
    });

    const loadProcessList = () => {
      obtainProcessList(home.processPage).then((res) => {
        home.processList = res.data;
        home.processPage.total = res.total;
      });
    };

    const loadTodoList = () => {
      obtainTodoList(home.todoPage).then((res) => {
        home.todoList = res.data;
        home.todoPage.total = res.total;
      });
    };

    const startProcess = (row) => {
      router.push({
        path: `${row.processDisposePath}`,
        query: {
          state: "PROCESSING",
          processDefinitionId: row.id,
        },
      });
    };

    const createDraft = (row) => {
      router.push({
        path: `${row.processDisposePath}`,
        query: {
          state: "DRAFT",
          processDefinitionId: row.id,
        },
      });
    };

    const completeTask = (row) => {

    }

    const finishTask = (row) => {
      console.log(row);
    };

    return {
      home,
      tabHandleClick,
      loadProcessList,
      loadTodoList,
      startProcess,
      finishTask,
      createDraft,
      completeTask,
    };
  },
});
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
