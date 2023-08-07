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
          :loading="home.loading"
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
      <el-tab-pane label="待办" name="todo">
        <vxe-table
          border
          :loading="home.loading"
          max-height="230px"
          size="mini"
          :row-config="{ height: 20 }"
          :data="home.todoList"
        >
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column
            field="processDefinitionName"
            title="流程名称"
            show-overflow
          ></vxe-column>
          <vxe-column field="name" title="节点名称" show-overflow></vxe-column>
          <vxe-column
            field="businessStatus"
            title="状态"
            show-overflow
          ></vxe-column>
          <vxe-column
            field="startUserName"
            title="发起人"
            width="80"
            show-overflow
          ></vxe-column>
          <vxe-column
            field="startTime"
            title="发起时间"
            width="140"
            show-overflow
          ></vxe-column>
          <vxe-column title="操作" width="90">
            <template #default="{ row }">
              <vxe-button
                type="text"
                icon="vxe-icon-flow-branch"
                @click="showProcessModel(row)"
              ></vxe-button>
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
      <el-tab-pane label="已处理" name="handled">
        <vxe-table
          border
          :loading="home.loading"
          max-height="230px"
          size="mini"
          :row-config="{ height: 20 }"
          :data="home.handledList"
        >
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column
            field="processDefinitionName"
            title="流程名称"
            show-overflow
          ></vxe-column>
          <vxe-column field="name" title="节点名称" show-overflow></vxe-column>
          <vxe-column
            field="businessStatus"
            title="状态"
            show-overflow
          ></vxe-column>
          <vxe-column
            field="startUserName"
            title="发起人"
            width="80"
            show-overflow
          ></vxe-column>
          <vxe-column
            field="endTime"
            title="处理时间"
            width="140"
            show-overflow
          ></vxe-column>
          <vxe-column
            field="deleteReason"
            title="删除原因"
            width="80"
            show-overflow
          ></vxe-column>
          <vxe-column title="操作" width="90">
            <template #default="{ row }">
              <vxe-button
                type="text"
                icon="vxe-icon-flow-branch"
                @click="showProcessModel(row)"
              ></vxe-button>
              <vxe-button type="text" icon="vxe-icon-eye-fill"></vxe-button>
            </template>
          </vxe-column>
        </vxe-table>
        <vxe-pager
          size="mini"
          auto-hidden
          v-model:current-page="home.handledPage.currentPage"
          v-model:page-size="home.handledPage.pageSize"
          :total="home.handledPage.total"
          :layouts="['PrevPage', 'NextPage', 'Total']"
          @page-change="loadHandledList()"
        >
        </vxe-pager>
      </el-tab-pane>
      <el-tab-pane label="已发起" name="launch">
        <vxe-table
          border
          :loading="home.loading"
          max-height="230px"
          size="mini"
          :row-config="{ height: 20 }"
          :data="home.LaunchList"
        >
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column
            field="processDefinitionName"
            title="流程名称"
            show-overflow
          ></vxe-column>
          <vxe-column
            field="businessStatus"
            title="状态"
            show-overflow
          ></vxe-column>
          <vxe-column title="操作" width="90">
            <template #default="{ row }">
              <vxe-button
                type="text"
                icon="vxe-icon-flow-branch"
                @click="showProcessModel(row)"
              ></vxe-button>
              <vxe-button type="text" icon="vxe-icon-eye-fill"></vxe-button>
            </template>
          </vxe-column>
        </vxe-table>
        <vxe-pager
          size="mini"
          auto-hidden
          v-model:current-page="home.launchPage.currentPage"
          v-model:page-size="home.launchPage.pageSize"
          :total="home.launchPage.total"
          :layouts="['PrevPage', 'NextPage', 'Total']"
          @page-change="loadLaunchList()"
        >
        </vxe-pager>
      </el-tab-pane>
    </el-tabs>
  </el-card>

  <vxe-modal
    v-model="home.isShowProcessModel"
    id="myModal7"
    width="1500"
    height="700"
    size="small"
    transfer
    resize
    destroy-on-close
    :loading="home.modalLoading"
  >
    <process-instance-model
      :process-instance-id="home.processInstanceId"
      :history="home.history"
      @close-modal-loading="closeModalLoading()"
    />
    <vxe-table
      border
      :loading="home.hisToryLoading"
      max-height="230px"
      size="mini"
      :row-config="{ height: 20 }"
      :data="home.processHistoryList"
    >
      <vxe-column type="seq" width="40"></vxe-column>
      <vxe-column field="activityName" title="节点名称" show-overflow></vxe-column>
      <vxe-column field="action" title="动作" show-overflow></vxe-column>
      <vxe-column field="actionReason" title="变更原因" show-overflow></vxe-column>
      <vxe-column
        field="assignee"
        title="处理人"
        width="80"
        show-overflow
      ></vxe-column>
      <vxe-column
        field="endTime"
        title="处理时间"
        width="140"
        show-overflow
      ></vxe-column>
      <vxe-column
        field="deleteReason"
        title="节点处理"
        show-overflow
      ></vxe-column>
    </vxe-table>
  </vxe-modal>
</template>

<script>
import { defineComponent, onMounted, reactive } from "vue";
import {
  loadProcessHistoryList,
  obtainHandledList,
  obtainLaunchList,
  obtainProcessList,
  obtainTodoList,
} from "@/api/flowable";
import { useRouter } from "vue-router";
import {
  ACTION_APPROVAL,
  ACTION_DRAFT,
  ACTION_LAUNCH,
  APPROVAL,
  DRAFT,
  PENDING,
} from "@/const/StringConst";
import ProcessInstanceModel from "@/views/flowable/process-instance-model.vue";
import { validNull } from "@/utils/validate";

export default defineComponent({
  components: { ProcessInstanceModel },
  setup() {
    const router = useRouter();

    const home = reactive({
      activeName: "todo",
      finished: false,
      loading: false,
      processList: [],
      todoList: [],
      handledList: [],
      launchList: [],
      processHistoryList: [],
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
      handledPage: {
        currentPage: 0,
        pageSize: 10,
        total: 0,
      },
      launchPage: {
        currentPage: 0,
        pageSize: 10,
        total: 0,
      },
      modalLoading: false,
      hisToryLoading: false,
      isShowProcessModel: false,
      processInstanceId: "",
      processDefinitionId: "",
      history: false,
    });

    const tabHandleClick = (tab, event) => {
      home.activeName = tab.paneName;
      if ("process" === tab.paneName) {
        loadProcessList();
      } else if ("todo" === tab.paneName) {
        loadTodoList();
      } else if ("handled" === tab.paneName) {
        loadHandledList();
      } else if ("launch" === tab.paneName) {
        loadLaunchList();
      }
    };

    onMounted(() => {
      home.loading = true;
      loadTodoList();
    });

    const loadProcessList = () => {
      home.loading = true;
      obtainProcessList(home.processPage)
        .then((res) => {
          home.processList = res.data;
          home.processPage.total = res.total;
          home.loading = false;
        })
        .catch(() => {
          home.loading = false;
        });
    };

    const loadTodoList = () => {
      home.loading = true;
      obtainTodoList(home.todoPage)
        .then((res) => {
          home.todoList = res.data;
          home.todoPage.total = res.total;
          home.loading = false;
        })
        .catch(() => {
          home.loading = false;
        });
    };

    const loadHandledList = () => {
      home.loading = true;
      obtainHandledList(home.handledPage)
        .then((res) => {
          home.handledList = res.data;
          home.handledPage.total = res.total;
          home.loading = false;
        })
        .catch(() => {
          home.loading = false;
        });
    };

    const loadLaunchList = () => {
      home.loading = true;
      obtainLaunchList(home.launchPage, home.finished)
        .then((res) => {
          home.LaunchList = res.data;
          home.launchPage.total = res.total;
          home.loading = false;
        })
        .catch(() => {
          home.loading = false;
        });
    };

    const startProcess = (row) => {
      routerPush(row, ACTION_LAUNCH, null, row.id);
    };

    const createDraft = (row) => {
      routerPush(row, ACTION_DRAFT, null, row.id);
    };

    const completeTask = (row) => {
      routerPush(
        row,
        ACTION_APPROVAL,
        row.id,
        row.processDefinitionId,
        row.taskDefinitionKey,
        row.executionId
      );
    };

    const routerPush = (
      row,
      state,
      taskId,
      processDefinitionId,
      taskDefinitionKey,
      executionId
    ) => {
      router.push({
        path: `${row.processDisposePath}`,
        query: {
          id: row.businessKey,
          status: state,
          taskId: taskId,
          processDefinitionId: processDefinitionId,
          taskDefinitionKey: taskDefinitionKey,
          executionId: executionId,
        },
      });
    };

    const showProcessModel = (row) => {
      home.isShowProcessModel = true;
      home.modalLoading = true;
      home.processInstanceId = row.processInstanceId;
      home.processDefinitionId = row.processDefinitionId;
      home.history = !validNull(row.processEndTime);
    };

    const closeModalLoading = () => {
      home.modalLoading = false;
      loadProcessHistoryList(home).then((res) => {
        home.processHistoryList = res.data;
      });
    };

    return {
      home,
      tabHandleClick,
      loadProcessList,
      loadTodoList,
      loadHandledList,
      loadLaunchList,
      startProcess,
      createDraft,
      completeTask,
      showProcessModel,
      closeModalLoading,
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
