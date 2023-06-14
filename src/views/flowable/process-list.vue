<template>
  <vxe-grid ref="xGrid" v-bind="gridOptions" v-on="gridEvents">
    <template #name_item="{ data }">
      <vxe-input
        v-model="data.name"
        type="text"
        placeholder="请输入名称"
      ></vxe-input>
    </template>
    <template #active_item="{ data }">
      <vxe-input
        v-model="data.active"
        type="text"
        placeholder="请输入名称"
      ></vxe-input>
    </template>
    <template #operate_item>
      <vxe-button
        type="submit"
        status="primary"
        content="查询"
        @click="findList()"
      ></vxe-button>
      <vxe-button type="reset" content="重置" @click="reset()"></vxe-button>
    </template>
  </vxe-grid>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import type {
  VxeGridInstance,
  VxeGridProps,
  VxeGridListeners,
} from "vxe-table";
import { processDefinitionPage } from "@/api/flowable";

export default defineComponent({
  name: "process-list",
  setup() {
    const xGrid = ref<VxeGridInstance>();

    const gridOptions = reactive<VxeGridProps>({
      border: true,
      keepSource: true,
      showOverflow: true,
      height: 530,
      loading: false,
      columnConfig: {
        resizable: true,
      },
      pagerConfig: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 200, 500],
      },
      formConfig: {
        data: {
          name: "",
          active: undefined,
        },
        items: [
          { field: "name", title: "流程名称", slots: { default: "name_item" } },
          {
            field: "active",
            title: "活动中",
            slots: { default: "active_item" },
          },
          { slots: { default: "operate_item" } },
        ],
      },
      columns: [
        { type: "seq", width: 60 },
        {
          field: "id",
          title: "流程定义id",
        },
        {
          field: "name",
          title: "流程名称",
        },
        {
          field: "key",
          title: "流程key",
        },
        {
          field: "version",
          title: "版本",
        },
        {
          field: "deploymentId",
          title: "部署id",
        },
        {
          width: 100,
          align: "center",
          field: "suspensionState",
          title: "挂起/激活",
          slots: { default: "enabled_default" },
        },
        {
          title: "操作",
          width: 80,
          fixed: "right",
          slots: { default: "operate" },
        },
      ],
      data: [],
    });

    const gridEvents: VxeGridListeners = {
      pageChange({ currentPage, pageSize }) {
        if (gridOptions.pagerConfig) {
          gridOptions.pagerConfig.currentPage = currentPage;
          gridOptions.pagerConfig.pageSize = pageSize;
        }
        findList();
      },
    };

    const findList = () => {
      gridOptions.loading = true;

      const pagerConfig: any = gridOptions.pagerConfig;

      processDefinitionPage({
        name: gridOptions.formConfig?.data.name,
        active: gridOptions.formConfig?.data.active,
        pageNumber: pagerConfig.currentPage,
        pageSize: pagerConfig.pageSize,
      })
        .then((res: any) => {
          gridOptions.loading = false;

          if (gridOptions.pagerConfig) {
            gridOptions.pagerConfig.total = res.total;
          }
          gridOptions.data = res.data;
        })
        .catch(() => {
          gridOptions.loading = false;
        });
    };

    const reset = () => {
      gridOptions.formConfig!.data.name = "";
      gridOptions.formConfig!.data.active = null;
    };

    findList();

    return {
      xGrid,
      gridOptions,
      gridEvents,
      findList,
      reset,
    };
  },
});
</script>

<style scoped></style>
