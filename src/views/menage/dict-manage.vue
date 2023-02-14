<template>
  <vxe-form :data="dictManage.formData" @submit="findPage">
    <vxe-form-item title="名称" field="groupName" :item-render="{}">
      <template #default="{ data }">
        <vxe-input
          v-model="data.groupName"
          placeholder="请输入名称"
        ></vxe-input>
      </template>
    </vxe-form-item>
    <vxe-form-item title="代码" field="groupId" :item-render="{}">
      <template #default="{ data }">
        <vxe-input v-model="data.groupId" placeholder="请输入代码"></vxe-input>
      </template>
    </vxe-form-item>
    <vxe-form-item>
      <template #default>
        <vxe-button type="submit" status="primary">查询</vxe-button>
        <vxe-button type="reset">重置</vxe-button>
      </template>
    </vxe-form-item>
  </vxe-form>
  <vxe-toolbar perfect>
    <template #buttons>
      <vxe-button status="perfect">新增</vxe-button>
      <vxe-button status="perfect">删除</vxe-button>
      <vxe-button status="perfect">保存</vxe-button>
    </template>
  </vxe-toolbar>
  <vxe-table
    ref="xTable"
    border
    auto-resize
    :data="dictManage.tableData"
    :edit-config="{ trigger: 'click', mode: 'cell' }"
    @toggle-row-expand="toggleExpandChangeEvent"
  >
    <vxe-column type="checkbox" width="60"></vxe-column>
    <vxe-column type="seq" width="60"></vxe-column>
    <vxe-column type="expand" width="80">
      <template #content="{ row }">
        <div class="expand-wrapper">
          <vxe-toolbar perfect>
            <template #buttons>
              <vxe-input
                v-model="dictManage.filterName"
                type="search"
                placeholder="全表搜索"
                @keyup="searchEvent(row)"
              ></vxe-input>
              <vxe-button status="perfect" @click="itemAdd(row)"
                >新增</vxe-button
              >
              <vxe-button status="perfect" @click="itemDel(row)"
                >删除</vxe-button
              >
              <vxe-button status="perfect" @click="itemSave(row)"
                >保存</vxe-button
              >
            </template>
          </vxe-toolbar>
          <vxe-table
            :ref="
              (el) => {
                pushRef(el, row);
              }
            "
            border
            max-height="500"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
            :data="dictManage.otherData[row.id]"
          >
            <vxe-column type="checkbox" width="60"></vxe-column>
            <vxe-column field="itemKey" title="KEY" :edit-render="{}">
              <template #default="{ row }">
                <span>{{ row.itemKey }}</span>
              </template>
              <template #edit="{ row }">
                <vxe-input
                  v-model="row.itemKey"
                  type="text"
                  placeholder="KEY"
                ></vxe-input>
              </template>
            </vxe-column>
            <vxe-column field="itemValue" title="VALUE" :edit-render="{}">
              <template #default="{ row }">
                <span>{{ row.itemValue }}</span>
              </template>
              <template #edit="{ row }">
                <vxe-input
                  v-model="row.itemValue"
                  type="text"
                  placeholder="KEY"
                ></vxe-input>
              </template>
            </vxe-column>
            <vxe-column field="comment" title="备注" :edit-render="{}">
              <template #default="{ row }">
                <span>{{ row.comment }}</span>
              </template>
              <template #edit="{ row }">
                <vxe-input
                  v-model="row.comment"
                  type="text"
                  placeholder="备注"
                ></vxe-input>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </template>
    </vxe-column>
    <vxe-column field="groupId" title="字典组" :edit-render="{}">
      <template #default="{ row }">
        <span>{{ row.groupId }}</span>
      </template>
      <template #edit="{ row }">
        <vxe-input
          v-model="row.groupId"
          type="text"
          placeholder="字典组"
        ></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="groupName" title="组名称" :edit-render="{}">
      <template #default="{ row }">
        <span>{{ row.groupName }}</span>
      </template>
      <template #edit="{ row }">
        <vxe-input
          v-model="row.groupName"
          type="text"
          placeholder="组名称"
        ></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="comment" title="备注" :edit-render="{}">
      <template #default="{ row }">
        <span>{{ row.comment }}</span>
      </template>
      <template #edit="{ row }">
        <vxe-input
          v-model="row.comment"
          type="text"
          placeholder="备注"
        ></vxe-input>
      </template>
    </vxe-column>
  </vxe-table>
  <vxe-pager
    align="right"
    size="small"
    v-model:current-page="dictManage.page.pageNumber"
    v-model:page-size="dictManage.page.pageSize"
    :total="dictManage.page.total"
    @page-change="findPage"
  >
  </vxe-pager>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import type { VxeTableInstance, VxeTableEvents } from "vxe-table";
import { dictPage, findOne } from "@/api/dict";
import { commonAlert } from "@/components/hooks/common-hooks";
import XEUtils from "xe-utils";

export default defineComponent({
  setup() {
    const xTable = ref<VxeTableInstance>();

    const dictManage = reactive({
      filterName: "",
      formData: {
        groupId: null,
        groupName: null,
      },
      tableData: [],
      otherData: [] as any[],
      page: {
        pageNumber: 1,
        pageSize: 10,
        total: 0,
      },
      cTableRefs: {} as any,
      filterList: [] as any[],
    });

    const pushRef = (el: any, row: any) => {
      dictManage.cTableRefs[row.id] = el;
    };

    const findPage = () => {
      dictPage({
        ...dictManage.formData,
        pageNumber: dictManage.page.pageNumber - 1,
        pageSize: dictManage.page.pageSize,
      }).then((res: any) => {
        if (commonAlert(res, "")) {
          dictManage.tableData = res.data;
          dictManage.page.total = res.total;
        }
      });
    };

    const toggleExpandChangeEvent: VxeTableEvents.ToggleRowExpand = ({
      expanded,
      row,
      rowIndex,
    }) => {
      if (expanded) {
        findOne(row.id).then((res: any) => {
          if (commonAlert(res, "")) {
            dictManage.otherData[row.id] = res.data;
          }
          return [];
        });
      }
    };

    const searchEvent = (row: any) => {
      const filterName = XEUtils.toValueString(dictManage.filterName).trim().toLowerCase();
      const $cTable = dictManage.cTableRefs[row.id];

      if (filterName) {
        const searchProps = ["itemKey", "itemValue", "comment"];
        const rest = dictManage.otherData[row.id].filter((item: any) =>
          searchProps.some(
            (key) =>
              XEUtils.toValueString(item[key])
                .toLowerCase()
                .indexOf(filterName) > -1
          )
        );
        $cTable.reloadData(rest);
      } else {
        $cTable.reloadData(dictManage.otherData[row.id]);
      }
    };

    const itemAdd = (row: any) => {
      const $cTable = dictManage.cTableRefs[row.id];
      $cTable?.insertAt(
        {
          dictionary: {
            id: row.id,
          },
          itemKey: `${row.groupId}-`,
          itemValue: "",
          comment: row.groupName,
        },
        -1
      );
    };

    const itemDel = async (row: any) => {
      const $cTable = dictManage.cTableRefs[row.id];
      const checkboxRecords = $cTable.getCheckboxRecords(true);
      for (const item of checkboxRecords) {
        await $cTable!.remove(item);
      }
    };

    const itemSave = (row: any) => {};

    findPage();

    return {
      dictManage,
      findPage,
      pushRef,
      itemAdd,
      itemDel,
      itemSave,
      searchEvent,
      toggleExpandChangeEvent,
    };
  },
});
</script>

<style scoped>
.expand-wrapper {
  padding: 20px;
}
</style>
