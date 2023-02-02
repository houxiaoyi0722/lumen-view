<template>
  <vxe-toolbar ref="roleXToolbar" :refresh="{ query: searchMethod }" custom>
    <template #buttons>
      <vxe-button @click="insertEvent">新增</vxe-button>
      <vxe-button @click="saveEvent">保存数据</vxe-button>
    </template>
    <template #tools>
      <p style="color: red; margin-right: 20px">*子角色继承父角色权限*</p>
    </template>
  </vxe-toolbar>

  <vxe-table
    show-overflow
    keep-source
    ref="roleXTable"
    height="90%"
    :row-config="{ keyField: 'id' }"
    :column-config="{ resizable: true }"
    :loading="roleMng.loading"
    :tree-config="roleMng.treeConfig"
    :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
    :edit-rules="validRules"
    :data="roleMng.tableData"
  >
    <vxe-column type="checkbox" width="40"></vxe-column>
    <vxe-column type="seq" width="100" tree-node></vxe-column>

    <vxe-column field="roleName" title="角色名称" :edit-render="{}">
      <template #edit="scope">
        <vxe-input
          v-model="scope.row.roleName"
          type="text"
          @change="$refs.roleXTable.updateStatus(scope)"
        ></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="roleCode" title="角色代码" :edit-render="{}">
      <template #edit="scope">
        <vxe-input
          v-model="scope.row.roleCode"
          type="text"
          @change="$refs.roleXTable.updateStatus(scope)"
        ></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="comment" title="备注" :edit-render="{}">
      <template #edit="scope">
        <vxe-input
          v-model="scope.row.comment"
          type="text"
          @change="$refs.roleXTable.updateStatus(scope)"
        ></vxe-input>
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
        <vxe-button type="text" status="primary" @click="permissionMng(row)"
          >权限管理</vxe-button
        >
      </template>
    </vxe-column>
  </vxe-table>

  <el-drawer
    v-model="roleMng.showPermissionMng"
    :with-header="false"
    destroy-on-close
  >
    <role-permission-manage :role="roleMng.role"></role-permission-manage>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent, nextTick, reactive, ref } from "vue";
import type {
  VxeTableInstance,
  VxeTablePropTypes,
  VxeToolbarInstance,
} from "vxe-table";
import { clone } from "xe-utils";
import { validNull } from "@/utils/validate";
import { getRolesTree, roleListUpdate } from "@/api/role";
import RolePermissionManage from "@/views/menage/components/role-permission-manage.vue";
import type { Role } from "@/types/ManageType";
import VXETable from "vxe-table";

export default defineComponent({
  components: { RolePermissionManage },
  setup() {
    const roleMng = reactive({
      loading: false,
      showPermissionMng: false,
      role: {} as Role,
      tableData: [] as Role[],
      treeConfig: {
        transform: true,
        rowField: "id",
        parentField: "parentId",
      },
    });

    const validRules = ref({
      roleName: [
        { required: true, message: "名称不能为空" },
        { max: 20, message: "名称长度应小于20" },
        {
          validator({ cellValue }) {
            if (
              roleMng.tableData.filter((item) => item.roleName === cellValue)
                .length > 1
            ) {
              return new Error("角色名称不能重复");
            }
          },
        },
      ],
      roleCode: [
        { required: true, message: "角色代码不能为空" },
        { max: 20, message: "角色代码长度应小于20" },
        {
          validator({ cellValue }) {
            if (
              roleMng.tableData.filter((item) => item.roleCode === cellValue)
                .length > 1
            ) {
              return new Error("角色代码不能重复");
            }
          },
        },
      ],
      comment: [{ max: 200, message: "备注长度应小于200" }],
    } as VxeTablePropTypes.EditRules);

    const roleXTable = ref<VxeTableInstance>();
    const roleXToolbar = ref<VxeToolbarInstance>();

    const findList = () => {
      roleMng.loading = true;

      return new Promise((resolve) => {
        getRolesTree()
          .then((res) => {
            roleMng.tableData = res.data;
            roleMng.loading = false;
            resolve(null);
          })
          .catch(() => {
            roleMng.loading = false;
          });
      });
    };

    const validAllEvent = async () => {
      const $table = roleXTable.value;
      const errMap = await $table!.validate(true);
      if (errMap) {
        VXETable.modal.message({ status: "error", content: "校验不通过！" });
        return false;
      }
      return true;
    };

    function formatDateList(roles: any) {
      for (const role of roles) {
        role.parentId = {
          id: role.parentId,
        };
      }
      return roles;
    }

    const saveEvent = () => {
      validAllEvent().then((res) => {
        if (res) {
          const $table = roleXTable.value;

          roleListUpdate({
            insertList: formatDateList(
              clone($table!.getInsertRecords(), true).map((item) => {
                item.id = null;
                return item;
              })
            ),
            updateList: formatDateList(clone($table!.getUpdateRecords(), true)),
            removeList: formatDateList(clone($table!.getRemoveRecords(), true)),
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

    const insertRow = async (currRow: any) => {
      const $table = roleXTable.value;
      // 如果 null 则插入到目标节点顶部
      // 如果 -1 则插入到目标节点底部
      // 如果 row 则有插入到效的目标节点该行的位置
      const bottomRecord = clone({
        id: null,
        roleName: "",
        roleCode: "",
        comment: "",
        parentId: undefined,
      });
      bottomRecord.parentId = currRow.id;
      const { row: newRow } = await $table!.insertAt(bottomRecord, -1);
      await $table!.setTreeExpand(currRow, true); // 将父节点展开
      await $table!.setEditRow(newRow); // 插入子节点
    };

    const removeRow = async (row: any) => {
      if (validNull(row.children)) {
        const $table = roleXTable.value;
        await $table!.remove(row);
      } else {
        VXETable.modal.message({
          status: "error",
          content: "存在子节点,无法删除",
        });
      }
    };

    const insertEvent = async () => {
      const $table = roleXTable.value;
      const { row: newRow } = await $table!.insertAt(
        {
          id: null,
          roleName: "",
          roleCode: "",
          comment: "",
          parentId: undefined,
        },
        -1
      );
      await $table!.setEditRow(newRow);
    };

    const searchMethod = () => {
      const $table = roleXTable.value;
      // 清除所有状态
      return findList();
    };

    const permissionMng = (row: Role) => {
      roleMng.showPermissionMng = true;
      roleMng.role = row;
    };

    nextTick(() => {
      // 将表格和工具栏进行关联
      const $table = roleXTable.value;
      const $toolbar = roleXToolbar.value;
      $table!.connect($toolbar!);
      findList();
    });

    return {
      roleXTable,
      roleXToolbar,
      roleMng,
      validRules,
      insertRow,
      removeRow,
      findList,
      insertEvent,
      saveEvent,
      searchMethod,
      permissionMng,
    };
  },
});
</script>

<style scoped></style>
