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
    height="90%"
    :row-config="{ keyField: 'id' }"
    :column-config="{ resizable: true }"
    :loading="routerMng.loading"
    :tree-config="routerMng.treeConfig"
    :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
    :edit-rules="validRules"
    :data="routerMng.tableData"
  >
    <vxe-column type="checkbox" width="40"></vxe-column>
    <vxe-column type="seq" width="100" tree-node></vxe-column>

    <vxe-column field="name" title="路由名称" :edit-render="{}">
      <template #edit="scope">
        <vxe-input
          v-model="scope.row.name"
          type="text"
          @change="$refs.xTable.updateStatus(scope)"
        ></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="path" title="访问路径" :edit-render="{}">
      <template #default="{ row }">
        {{ concatPath(row) }}
      </template>
      <template #edit="scope">
        <vxe-input
          v-model="scope.row.path"
          type="text"
          @change="$refs.xTable.updateStatus(scope)"
        ></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="component" title="component" :edit-render="{}">
      <template #edit="scope">
        <vxe-select
          v-model="scope.row.component"
          placeholder="可搜索"
          :options="routerMng.moduleList"
          @change="$refs.xTable.updateStatus(scope)"
          filterable
        ></vxe-select>
      </template>
    </vxe-column>
    <vxe-column field="mate" title="元数据" width="200px" :edit-render="{}">
      <template #default="{ row }">
        {{ row.mate }}
      </template>
      <template #edit="scope">
        <div style="width: 100%; float: left">
          <v-ace-editor
            v-model:value="scope.row.mate"
            @change="$refs.xTable.updateStatus(scope)"
            lang="json"
            :theme="'chrome'"
            :readonly="false"
            style="height: 100px"
            class="ace-editor"
          />
        </div>
      </template>
    </vxe-column>
    <vxe-column field="redirect" title="跳转路径" :edit-render="{}">
      <template #edit="scope">
        <vxe-input
          v-model="scope.row.redirect"
          type="text"
          @change="$refs.xTable.updateStatus(scope)"
        ></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="description" title="描述" :edit-render="{}">
      <template #edit="scope">
        <vxe-input
          v-model="scope.row.description"
          type="text"
          @change="$refs.xTable.updateStatus(scope)"
        ></vxe-input>
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
      <template #edit="scope">
        <vxe-input
          v-model="scope.row.orderBy"
          type="integer"
          @change="$refs.xTable.updateStatus(scope)"
        ></vxe-input>
      </template>
    </vxe-column>
    <vxe-column
      field="roles"
      title="权限管理"
      min-width="100"
      :edit-render="{}"
    >
      <template #default="{ row }">
        {{ transLabels(row.roles, routerMng.roleList).join(",") }}
      </template>
      <template #edit="{ row }">
        <el-tree-select
          v-model="row.roles"
          :teleported="false"
          :data="routerMng.roleList"
          multiple
          collapse-tags
          collapse-tags-tooltip
          filterable
          check-strictly
        />
      </template>
    </vxe-column>
    <vxe-column title="操作" min-width="100" fixed="right">
      <template #default="{ row }">
        <vxe-button type="text" status="primary" @click="insertRow(row)"
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
import { defineComponent, nextTick, onBeforeMount, reactive, ref } from "vue";
import type {
  VxeTableInstance,
  VxeTablePropTypes,
  VxeToolbarInstance,
} from "vxe-table";
import { getAllRouters, routerUpdate } from "@/api/routers";
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/mode-json.js";
import "ace-builds/src-noconflict/theme-chrome.js";
import { validNull } from "@/utils/validate";
import { clone } from "xe-utils";
import { modules } from "@/stores/modules/route";
import { transLabels } from "@/components/hooks/common-hooks";
import { roleStore } from "@/stores/modules/roles";
import VXETable from "vxe-table";

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
      moduleList: [] as any[],
      roleList: [] as any[],
    });
    const validRules = ref({
      name: [
        { required: true, message: "名称不能为空" },
        { max: 100, message: "名称长度应小于100" },
      ],
      path: [
        { required: true, message: "path不能为空" },
        { max: 200, message: "path长度应小于200" },
      ],
      component: [{ required: true, message: "组件不能为空,请选择" }],
      mate: [
        { required: true, message: "元数据必须填写" },
        {
          validator({ cellValue }) {
            if (typeof cellValue == "string") {
              try {
                const obj = JSON.parse(cellValue);
                if (!(typeof obj == "object" && obj)) {
                  return new Error("格式不正确");
                }
              } catch (e) {
                return new Error("格式不正确");
              }
            }
          },
        },
      ],
      redirect: [{ max: 200, message: "重定向地址长度应小于200" }],
      description: [{ max: 300, message: "描述长度应小于300" }],
      orderBy: [
        { required: true, message: "排序不能为空" },
        {
          validator({ cellValue }) {
            if (cellValue < 0 || cellValue > 10000) {
              return new Error("排序应在0-10000之间");
            }
          },
        },
      ],
    } as VxeTablePropTypes.EditRules);

    onBeforeMount(() => {
      // 初始化组件下拉列表
      routerMng.moduleList.push({
        value: "Layout",
        label: "Layout",
      });
      for (const modulesKey in modules) {
        const key = modulesKey.replace("/src/views/", "").replace(".vue", "");
        routerMng.moduleList.push({ value: key, label: key });
      }
      roleStore()
        .getRolesKVTree()
        .then((res) => {
          routerMng.roleList = res;
        });
    });

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
        row.roles = row.roles.map((item: any) => item.id);
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
      const bottomRecord = clone({
        parentId: undefined,
        name: "",
        path: "",
        component: "Layout",
        mate: "{\n" + '  "title": "example",\n' + '  "icon": "Sunset"\n' + "}",
        description: "",
        hidden: false,
        alwaysShow: true,
        orderBy: 0,
      });
      bottomRecord.parentId = currRow.id;
      const { row: newRow } = await $table!.insertAt(bottomRecord, -1);
      await $table!.setTreeExpand(currRow, true); // 将父节点展开
      await $table!.setEditRow(newRow); // 插入子节点
    };

    const removeRow = async (row: any) => {
      if (validNull(row.children)) {
        const $table = xTable.value;
        await $table!.remove(row);
      } else {
        VXETable.modal.message({
          status: "error",
          content: "存在子节点,无法删除",
        });
      }
    };

    const insertEvent = async () => {
      const $table = xTable.value;
      const { row: newRow } = await $table!.insertAt(
        {
          parentId: undefined,
          name: "",
          path: "",
          component: "Layout",
          mate:
            "{\n" + '  "title": "example",\n' + '  "icon": "Sunset"\n' + "}",
          description: "",
          hidden: false,
          alwaysShow: true,
          orderBy: 0,
        },
        -1
      );
      await $table!.setEditRow(newRow);
    };

    const concatPath = (row: any): any => {
      if (!validNull(row)) {
        if (!validNull(row.parentId)) {
          const parent = routerMng.tableData.filter(
            (item) => item.id === row.parentId
          );
          return concatPath(parent[0]) + "/" + row.path;
        } else {
          return row.path;
        }
      }
    };

    const validAllEvent = async () => {
      const $table = xTable.value;
      const errMap = await $table!.validate(true);
      if (errMap) {
        VXETable.modal.message({ status: "error", content: "校验不通过！" });
        return false;
      }
      return true;
    };

    function formatDateList(routes: any) {
      for (const route of routes) {
        route.mate = JSON.parse(route.mate);
        if (!validNull(route.roles)) {
          route.roles = route.roles.map((item: string) => {
            return { id: item };
          });
        }
        route.parentId = {
          id: route.parentId,
        };
      }
      return routes;
    }

    const saveEvent = () => {
      validAllEvent().then((res) => {
        if (res) {
          const $table = xTable.value;

          const insertRecords = clone($table!.getInsertRecords(), true);
          const updateRecords = clone($table!.getUpdateRecords(), true);
          const removeRecords = clone($table!.getRemoveRecords(), true);

          insertRecords.forEach((item) => (item.id = null));

          routerUpdate({
            insertList: formatDateList(insertRecords),
            updateList: formatDateList(updateRecords),
            removeList: formatDateList(removeRecords),
          }).then((res: any) => {
            if (res.code === 200) {
              VXETable.modal.message({
                status: "success",
                content: "保存成功",
              });
              findList();
            }
          });
        }
      });
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
      validRules,
      insertEvent,
      saveEvent,
      searchMethod,
      removeRow,
      insertRow,
      concatPath,
      transLabels,
    };
  },
});
</script>

<style scoped></style>
