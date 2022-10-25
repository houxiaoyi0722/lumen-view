<template>
  <vxe-toolbar ref="xToolbar" :refresh="{ query: searchMethod }" custom>
    <template #buttons>
      <vxe-button @click="insertEvent">新增</vxe-button>
      <vxe-button @click="saveEvent">保存数据</vxe-button>
    </template>
  </vxe-toolbar>

  <vxe-table
    show-overflow
    keep-source
    ref="xTable"
    :row-config="{ keyField: 'id' }"
    :column-config="{ resizable: true }"
    :loading="routerMng.loading"
    :tree-config="routerMng.treeConfig"
    :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
    :data="routerMng.tableData"
  >
    <vxe-column type="checkbox" width="40"></vxe-column>
    <vxe-column type="seq" width="100" tree-node></vxe-column>

    <vxe-column field="name" title="路由名称" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.name" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="path" title="访问路径" :edit-render="{}">
      <template #default="{ row }">
        {{ concatPath(row) }}
      </template>
      <template #edit="{ row }">
        <vxe-input v-model="row.path" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="component" title="component" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.component" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="mate" title="元数据" width="200px" :edit-render="{}">
      <template #default="{ row }">
        {{ row.mate }}
      </template>
      <template #edit="{ row }">
        <div style="width: 100%; float: left">
          <v-ace-editor
            v-model:value="row.mate"
            lang="json"
            :theme="aceConfig.theme"
            :options="aceConfig.options"
            :readonly="aceConfig.readOnly"
            style="height: 100px"
            class="ace-editor"
          />
        </div>
      </template>
    </vxe-column>
    <vxe-column field="redirect" title="跳转路径" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.redirect" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="description" title="描述" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.description" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="hidden" title="是否隐藏" :edit-render="{}">
      <template #default="{ row }">
        <vxe-switch
          v-model="row.hidden"
          open-label="是"
          close-label="否"
        ></vxe-switch>
      </template>
      <template #edit="{ row }">
        <vxe-switch
          v-model="row.hidden"
          open-label="是"
          close-label="否"
        ></vxe-switch>
      </template>
    </vxe-column>
    <vxe-column field="orderBy" title="排序" width="80" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.orderBy" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="roles" title="权限管理" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.roles" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column title="操作" min-width="150">
      <template #default="{ row }">
        <vxe-button
          type="text"
          status="primary"
          @click="insertRow(row)"
          >插入子节点</vxe-button
        >
        <vxe-button type="text" status="primary" @click="removeRow(row)"
          >删除</vxe-button
        >
      </template>
    </vxe-column>
  </vxe-table>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, nextTick } from "vue";
import type { VxeTableInstance, VxeToolbarInstance } from "vxe-table";
import { getAllRouters } from "@/api/routers";
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/mode-json.js";
import "ace-builds/src-noconflict/theme-chrome.js";
import { validNull } from "@/utils/validate";
import { clone } from "xe-utils";

export default defineComponent({
  components: { VAceEditor },
  setup() {
    const routerMng = reactive({
      loading: false,
      tableData: [] as any[],
      treeConfig: {
        transform: true,
        rowField: "id",
        parentField: "parentId",
      },
    });

    const aceConfig = reactive({
      lang: "json", //解析json
      theme: "chrome", //主题
      readOnly: false, //是否只读
      options: {
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        tabSize: 2,
        showPrintMargin: false,
        fontSize: 13,
      },
    });

    const record = {
      parentId: undefined,
      name: "example",
      path: "/example",
      component: "Layout",
      mate: '{ \n  title: "example",\n  icon: "Grid" \n}',
      description: "example",
      hidden: false,
      alwaysShow: true,
      orderBy: 0,
    };

    const childRecord = {
      parentId: undefined,
      name: "",
      path: "",
      component: "",
      mate: '{ \n  title: "example",\n  icon: "Grid" \n}',
      description: "",
      hidden: false,
      alwaysShow: true,
      orderBy: 0,
    };

    const xTable = ref<VxeTableInstance>();
    const xToolbar = ref<VxeToolbarInstance>();

    const findList = () => {
      routerMng.loading = true;

      return new Promise((resolve) => {
        getAllRouters()
          .then((res) => {
            routerMng.tableData = formatJson(res.data);
            routerMng.loading = false;
            resolve(null);
          })
          .catch(() => {
            routerMng.loading = false;
          });
      });
    };

    const formatJson = (data: any) => {
      for (const row of data) {
        if (!validNull(row.children)) {
          formatJson(row.children);
        }
        row.mate = JSON.stringify(row.mate, null, 2);
      }
      return data;
    };

    const searchMethod = () => {
      const $table = xTable.value;
      // 清除所有状态
      return findList();
    };

    const insertRow = async (currRow: any) => {
      const $table = xTable.value;
      // 如果 null 则插入到目标节点顶部
      // 如果 -1 则插入到目标节点底部
      // 如果 row 则有插入到效的目标节点该行的位置
      const bottomRecord = clone(childRecord);
      bottomRecord.parentId = currRow.id;
      const { row: newRow } = await $table!.insertAt(bottomRecord, -1);
      await $table!.setTreeExpand(currRow, true); // 将父节点展开
      await $table!.setEditRow(newRow); // 插入子节点
    };

    const removeRow = async (row: any) => {
      const $table = xTable.value;
      await $table!.remove(row);
    };

    const insertEvent = async () => {
      const $table = xTable.value;
      const { row: newRow } = await $table!.insert(record);
      await $table!.setEditRow(newRow);
    };

    const concatPath = (row:any):string => {
      if (!validNull(row.parentId)) {
        const parent = routerMng.tableData.filter(item => item.id === row.parentId);
        return concatPath(parent) + "/" + row.path;
      } else {
        return row.path;
      }
    };

    const saveEvent = async () => {
      console.log(123);
    };

    nextTick(() => {
      // 将表格和工具栏进行关联
      const $table = xTable.value;
      const $toolbar = xToolbar.value;
      $table!.connect($toolbar!);
      findList();
    });

    return {
      xTable,
      xToolbar,
      routerMng,
      aceConfig,
      insertEvent,
      saveEvent,
      searchMethod,
      removeRow,
      insertRow,
      concatPath,
    };
  },
});
</script>

<style scoped></style>
