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
        <vxe-form-item align="center" span="24">
          <template #default="{ data }">
            <vxe-button
              v-if="data.state === 'PROCESSING'"
              type="submit"
              status="primary"
              content="提交"
              @click="completeThisTask()"
            ></vxe-button>
            <vxe-button
              v-else
              type="submit"
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
import {
  VXETable,
  VxeFormInstance,
  VxeFormPropTypes,
  VxeFormEvents,
} from "vxe-table";
import PageHeader from "@/components/page-header/index.vue";
import { useRoute } from "vue-router";
import {completeTask, saveDraft, startProcess} from "@/api/leave-process";
import {validNull} from "@/utils/validate";
import {commonAlert} from "@/components/hooks/common-hooks";

const formRef = ref<VxeFormInstance>();

const loading = ref(false);

const route = useRoute();

const formData = reactive<any>({
  id: "",
  name: "ceshi",
  startTime: "2023-07-10 10:00:00",
  endTime: "2023-07-11 10:00:00",
  reason: "aaaaa",
  state: "",
  processDefinitionId: "",
  processKey: "",
  processInstanceId: "",
  taskId: "",
  comment: "",
});

onMounted(() => {
  formData.state = route.query.state;
  formData.processDefinitionId = route.query.processDefinitionId;
  if (validNull(formData.id)) {
    // 初次进入时初始化
    startProcess(formData).then((res: any) => {
      console.log(res);
    });
  }
});

const changeEvent = (params: any) => {
  const $form = formRef.value;
  if ($form) {
    $form.updateStatus(params);
  }
};

const createDraft = () => {
  loading.value = true;
  saveDraft(formData).then((res: any) => {
    commonAlert(res, "保存成功");
    loading.value = false;
  });
};

const completeThisTask = () => {
  completeTask(formData).then((res: any) => {
    console.log(res);
  });
};
</script>

<style scoped></style>
