<template>
  <div>
    <page-header name="休假申请"></page-header>
    <vxe-form
      title-colon
      ref="formRef"
      title-align="right"
      title-width="100"
      :data="formData"
      :rules="formRules"
      :loading="loading"
      @submit="submitEvent"
      @reset="resetEvent"
    >
      <vxe-form-gather span="18">
        <vxe-form-item title="申请人" field="name" span="24">
          <template #default="{ data }">
            <vxe-input
              v-model="data.name"
              type="text"
            ></vxe-input>
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
          <template #default>
            <vxe-button
              type="submit"
              status="primary"
              content="提交"
            ></vxe-button>
          </template>
        </vxe-form-item>
      </vxe-form-gather>
    </vxe-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  VXETable,
  VxeFormInstance,
  VxeFormPropTypes,
  VxeFormEvents,
} from "vxe-table";
import PageHeader from "@/components/page-header/index.vue";

const formRef = ref<VxeFormInstance>();

const loading = ref(false);

const formData = ref<any>({
  name: "test1",
  startTime: "",
  endTime: "",
  reason: "",
});

const formRules = ref<VxeFormPropTypes.Rules>({
  name: [
    { required: true, message: "请输入名称" },
    { min: 3, max: 5, message: "长度在 3 到 5 个字符" },
  ],
  sex: [{ required: true, message: "请选择性别" }],
  age: [
    { required: true, message: "请输入年龄" },
    {
      validator({ itemValue }) {
        // 自定义校验
        if (Number(itemValue) > 35 || Number(itemValue) < 18) {
          return new Error("年龄在 18 ~ 35 之间");
        }
      },
    },
  ],
  date: [{ required: true, message: "必填校验" }],
});

const changeEvent = (params: any) => {
  const $form = formRef.value;
  if ($form) {
    $form.updateStatus(params);
  }
};

const submitEvent: VxeFormEvents.Submit = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    VXETable.modal.message({ content: "保存成功", status: "success" });
  }, 1000);
};

const resetEvent: VxeFormEvents.Reset = () => {
  VXETable.modal.message({ content: "重置事件", status: "info" });
};
</script>

<style scoped></style>
