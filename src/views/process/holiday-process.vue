<template>
  <div>
    <page-header name="休假申请"></page-header>
    <vxe-form
      title-colon
      ref="formRef"
      title-align="right"
      title-width="100"
      :data="formData"
      :loading="loading"
    >
      <vxe-form-gather span="18">
        <vxe-form-item title="申请人" field="name" span="24">
          <template #default="{ data }">
            <vxe-input v-model="data.name" type="text"></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="天数" field="day" span="24">
          <template #default="{ data }">
            <vxe-input v-model="data.day" type="text"></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item
          title="开始时间"
          field="startTime"
          span="24"
          :item-render="{}"
        >
          <template #default="{ data }">
            <vxe-input
              v-model="data.startTime"
              type="datetime"
              placeholder="请选择日期"
              clearable
            ></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item
          title="结束时间"
          field="endTime"
          span="24"
          :item-render="{}"
        >
          <template #default="{ data }">
            <vxe-input
              v-model="data.endTime"
              type="datetime"
              placeholder="请选择日期"
              clearable
            ></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item
          title="申请内容"
          field="reason"
          span="24"
          :item-render="{}"
        >
          <template #default="{ data }">
            <vxe-textarea
              v-model="data.reason"
              placeholder="请输入原因"
              :autosize="{ minRows: 6, maxRows: 10 }"
              clearable
            ></vxe-textarea>
          </template>
        </vxe-form-item>
        <vxe-form-item
          title="处理\拒绝\退回 理由"
          field="actionReason"
          span="24"
          :item-render="{}"
        >
          <template #default="{ data }">
            <vxe-textarea
              v-model="data.actionReason"
              placeholder="请输入原因"
              :autosize="{ minRows: 6, maxRows: 10 }"
              clearable
            ></vxe-textarea>
          </template>
        </vxe-form-item>
        <vxe-form-item align="center" span="24">
          <template #default>
            <vxe-button
              status="primary"
              content="提交"
              @click="startLeaveProcess()"
            ></vxe-button>
            <vxe-button
              status="primary"
              content="审批通过"
              @click="completeThisTask(ACTION_APPROVED)"
            ></vxe-button>
            <vxe-button
              status="primary"
              content="审批驳回"
              @click="moveThisActivity(ACTION_REJECT)"
            ></vxe-button>
            <vxe-button
              status="primary"
              content="审批退回"
              @click="moveThisActivity(ACTION_RETREAT)"
            ></vxe-button>
            <vxe-button
              status="primary"
              content="删除"
              @click="deleteLeaveProcessInstance()"
            ></vxe-button>
            <vxe-button
              status="primary"
              content="保存草稿"
              @click="createDraft()"
            ></vxe-button>
          </template>
        </vxe-form-item>
      </vxe-form-gather>
    </vxe-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { VxeFormInstance } from "vxe-table";
import PageHeader from "@/components/page-header/index.vue";
import { useRoute, useRouter } from "vue-router";
import {
  completeTask,
  deleteLeaveProcess,
  leaveProcessById,
  moveActivity,
  saveDraft,
  startProcess,
} from "@/api/leave-process";
import { validNull } from "@/utils/validate";
import { commonAlert } from "@/components/hooks/common-hooks";
import {
  APPROVAL,
  DRAFT,
  PENDING,
  ACTION_APPROVED,
  ACTION_REJECT,
  ACTION_RETREAT,
} from "@/const/StringConst";

const formRef = ref<VxeFormInstance>();

const loading = ref(false);

const route = useRoute();
const router = useRouter();

const formData = reactive<any>({
  id: null,
  name: "",
  action: "",
  startTime: "",
  endTime: "",
  day: "",
  reason: "",
  actionReason: "删除",
  status: "",
  processDefinitionId: "",
  processKey: "",
  processInstanceId: "",
  taskId: "",
  taskDefinitionKey: "",
  executionId: "",
  comment: "",
});

onMounted(() => {
  formData.status = route.query.status;
  formData.id = route.query.id;
  formData.processDefinitionId = route.query.processDefinitionId;
  formData.taskId = route.query.taskId;
  formData.taskDefinitionKey = route.query.taskDefinitionKey;
  formData.executionId = route.query.executionId;
  if (!validNull(formData.id)) {
    leaveProcessById(formData.id).then((res: any) => {
      formData.name = res.data.name;
      formData.startTime = res.data.startTime;
      formData.endTime = res.data.endTime;
      formData.reason = res.data.reason;
      formData.status = res.data.status;
      formData.day = res.data.day;
      formData.processInstanceId = res.data.processInstanceId;
    });
  }
});

const startLeaveProcess = () => {
  loading.value = true;
  startProcess(formData).then((res: any) => {
    if (commonAlert(res, "保存成功")) {
      router.back();
    }
    loading.value = false;
  });
};

const createDraft = () => {
  loading.value = true;
  saveDraft(formData).then((res: any) => {
    commonAlert(res, "保存成功");
    loading.value = false;
  });
};

const completeThisTask = (action: string) => {
  loading.value = true;
  formData.action = action;
  completeTask(formData).then((res: any) => {
    if (commonAlert(res, "审批成功")) {
      router.back();
    }
    loading.value = false;
  });
};

const moveThisActivity = (action: string) => {
  formData.action = action;
  loading.value = true;

  moveActivity(formData)
    .then((res: any) => {
      if (commonAlert(res, "处理成功")) {
        router.back();
      }
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};

const deleteLeaveProcessInstance = () => {
  loading.value = true;
  deleteLeaveProcess(formData).then((res: any) => {
    if (commonAlert(res, "删除成功")) {
      router.back();
    }
    loading.value = false;
  });
};
</script>

<style scoped></style>
