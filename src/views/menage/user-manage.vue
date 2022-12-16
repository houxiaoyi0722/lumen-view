<template>
  <vxe-grid
    ref="xGrid"
    v-bind="gridOptions"
    v-on="gridEvents"
    @cell-menu="cellContextMenuEvent"
    @menu-click="contextMenuClickEvent"
  >
    <template #name_item="{ data }">
      <vxe-input
        v-model="data.name"
        type="text"
        placeholder="请输入名称"
      ></vxe-input>
    </template>
    <template #username_item="{ data }">
      <vxe-input
        v-model="data.username"
        type="text"
        placeholder="请输入账号"
      ></vxe-input>
    </template>
    <template #enable_item="{ data }">
      <el-select v-model="data.enable" clearable placeholder="请选择是否启用">
        <el-option
          v-for="item in userManage.enableList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </template>
    <template #roles_item="{ data }">
      <el-tree-select
        v-model="data.roles"
        :teleported="false"
        placeholder="请选择角色"
        :data="userManage.roleList"
        clearable
        collapse-tags
        collapse-tags-tooltip
        filterable
        check-strictly
      />
    </template>
    <template #userGroup_item="{ data }">
      <el-tree-select
        v-model="data.userGroup"
        :teleported="false"
        placeholder="请选择用户组"
        :data="userManage.userGroupList"
        clearable
        filterable
        check-strictly
      />
    </template>
    <template #operate_item>
      <vxe-button
        type="submit"
        status="primary"
        content="查询"
        @click="findList()"
      ></vxe-button>
      <vxe-button type="reset" content="重置" @click="reset()"></vxe-button>
      <!--      <p style="color: red; margin-right: 20px">*右键呼出管理菜单*</p>-->
    </template>

    <template #name_edit="{ row }">
      <vxe-input v-model="row.name"></vxe-input>
    </template>
    <template #username_edit="{ row }">
      <vxe-input v-model="row.username"></vxe-input>
    </template>
    <template #enabled_default="{ row }">
      <vxe-switch
        v-model="row.enabled"
        open-label="是"
        close-label="否"
      ></vxe-switch>
    </template>
    <template #enabled_edit="{ row }">
      <vxe-switch
        v-model="row.enabled"
        open-label="是"
        close-label="否"
      ></vxe-switch>
    </template>
    <template #roles_default="{ row }">
      {{ transLabels(row.roles, userManage.roleList).join(",") }}
    </template>
    <template #roles_edit="{ row }">
      <el-tree-select
        v-model="row.roles"
        :teleported="false"
        :data="userManage.roleList"
        multiple
        collapse-tags
        collapse-tags-tooltip
        filterable
        check-strictly
      />
    </template>

    <template #userGroup_default="{ row }">
      {{ transLabels([row.userGroup], userManage.userGroupList).join(",") }}
    </template>
    <template #userGroup_edit="{ row }">
      <el-tree-select
        v-model="row.userGroup"
        :teleported="false"
        :data="userManage.userGroupList"
        filterable
        check-strictly
      />
    </template>

    <template #operate="{ row }">
      <vxe-button
        title="保存"
        content="保存"
        @click="saveRowEvent(row)"
      ></vxe-button>
    </template>
  </vxe-grid>

  <vxe-modal
    v-model="userManage.showExData"
    id="myModal6"
    width="800"
    height="500"
    min-width="460"
    min-height="320"
    show-zoom
    resize
    remember
    storage
    transfer
  >
    <template #title>
      <span style="color: #606266">用户信息</span>
    </template>
    <template #corner>
      <vxe-icon
        name="refresh"
        @click="refreshUserEx(userManage.userExData.user)"
      ></vxe-icon>
    </template>
    <template #default>
      <vxe-form
        title-colon
        ref="xForm"
        title-align="right"
        title-width="100"
        :data="userManage.userExData"
        :rules="userManage.userExDataRules"
        :loading="userManage.loading"
        @submit="userExSubmitEvent"
      >
        <vxe-form-gather span="12">
          <vxe-form-item title="名称" span="24">
            <template #default="{ data }">
              <span>{{ data.user.name }}</span>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="性别"
            field="sex"
            span="24"
            :item-render="{}"
            title-overflow
          >
            <template #default="{ data }">
              <vxe-select
                v-model="data.gender"
                :options="userManage.genderList"
              ></vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="出生日期"
            field="birthday"
            span="24"
            :item-render="{}"
            title-overflow="ellipsis"
          >
            <template #default="{ data }">
              <vxe-input
                v-model="data.birthday"
                type="date"
                placeholder="请选择日期"
                clearable
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="手机号"
            field="mobilePhone"
            span="24"
            :item-render="{}"
            title-overflow="ellipsis"
          >
            <template #default="{ data }">
              <vxe-input v-model="data.mobilePhone" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="座机号(其他联系电话)"
            field="phone"
            span="24"
            :item-render="{}"
            title-overflow="ellipsis"
          >
            <template #default="{ data }">
              <vxe-input v-model="data.phone" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="邮件地址"
            field="email"
            span="24"
            :item-render="{}"
            title-overflow="ellipsis"
          >
            <template #default="{ data }">
              <vxe-input v-model="data.email" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="地址"
            field="address"
            span="24"
            :item-render="{}"
          >
            <template #default="{ data }">
              <vxe-textarea
                v-model="data.address"
                placeholder="请输入地址"
                :autosize="{ minRows: 3, maxRows: 10 }"
                clearable
              ></vxe-textarea>
            </template>
          </vxe-form-item>
        </vxe-form-gather>

        <vxe-form-gather span="12">
          <vxe-form-item
            title="头像"
            field="avatar"
            span="24"
            :item-render="{}"
            title-overflow
          >
            <template #default="{ data }">
              <el-upload
                class="avatar-uploader"
                :action="userManage.uploadAction"
                :headers="userManage.uploadHeader"
                :data="userManage.uploadData"
                method="put"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="data.avatar && data.avatar.downLoadUrl"
                  :src="data.avatar.downLoadUrl"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </template>
          </vxe-form-item>
          <vxe-form-item title="简介" field="intro" span="24" :item-render="{}">
            <template #default="{ data }">
              <vxe-textarea
                v-model="data.intro"
                :autosize="{ minRows: 7, maxRows: 10 }"
                clearable
              ></vxe-textarea>
            </template>
          </vxe-form-item>
        </vxe-form-gather>
        <vxe-form-item align="center" span="24">
          <template #default>
            <vxe-button
              type="submit"
              status="primary"
              content="保存"
            ></vxe-button>
          </template>
        </vxe-form-item>
      </vxe-form>
    </template>
  </vxe-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import type { VxeFormEvents, VxeGridEvents } from "vxe-table";
import type {
  VxeGridInstance,
  VxeGridListeners,
  VxeGridProps,
} from "vxe-table";
import {
  getUserExData,
  insert,
  remove,
  resetUserPassword,
  saveUserExt,
  update,
  userPage,
} from "@/api/user";
import { enableList, sexList } from "@/stores/dictionaries";
import {
  commonAlert,
  transIdObjs,
  transLabels,
  transObj,
} from "@/components/hooks/common-hooks";
import { roleStore } from "@/stores/modules/roles";
import { userGroupStore } from "@/stores/modules/user-group";
import { validNull } from "@/utils/validate";
import { clone } from "xe-utils";
import type { UploadProps } from "element-plus";
import { getItem } from "@/utils/storage";
import VXETable from "vxe-table";
import type { UserExData, UserVo } from "@/types/ManageType";

export default defineComponent({
  name: "userManage",
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
          username: "",
          enable: undefined,
          roles: "",
          userGroup: "",
        },
        items: [
          { field: "name", title: "姓名", slots: { default: "name_item" } },
          {
            field: "username",
            title: "用户名",
            slots: { default: "username_item" },
          },
          {
            field: "enable",
            title: "是否启用",
            slots: { default: "enable_item" },
          },
          { field: "roles", title: "角色", slots: { default: "roles_item" } },
          {
            field: "userGroup",
            title: "用户组",
            slots: { default: "userGroup_item" },
          },
          { slots: { default: "operate_item" } },
        ],
      },
      editConfig: {
        trigger: "click",
        mode: "cell",
        showStatus: true,
      },
      menuConfig: {
        body: {
          options: [
            [
              {
                code: "create",
                name: "新增",
                visible: true,
                disabled: false,
              },
              {
                code: "save",
                name: "保存",
                visible: true,
                disabled: false,
              },
              {
                code: "delete",
                name: "删除",
                visible: true,
                disabled: false,
              },
            ],
            [
              {
                code: "exData",
                name: "扩展信息",
                visible: true,
                disabled: false,
              },
              {
                code: "resetPassword",
                name: "重置密码",
                visible: true,
                disabled: false,
              },
            ],
          ],
        },
      },
      columns: [
        { type: "seq", width: 60 },
        {
          field: "name",
          title: "姓名",
          editRender: { autofocus: ".vxe-input--inner" },
          slots: { edit: "name_edit" },
        },
        {
          field: "username",
          title: "用户名",
          editRender: { autofocus: ".vxe-input--inner" },
          slots: { edit: "username_edit" },
        },
        {
          width: 100,
          align: "center",
          field: "enabled",
          title: "是否启用",
          editRender: {},
          slots: { edit: "enabled_edit", default: "enabled_default" },
        },
        {
          field: "roles",
          title: "角色",
          editRender: {},
          slots: { edit: "roles_edit", default: "roles_default" },
        },
        {
          field: "userGroup",
          title: "用户组",
          showOverflow: true,
          editRender: {},
          slots: { edit: "userGroup_edit", default: "userGroup_default" },
        },
        {
          title: "操作",
          width: 80,
          fixed: "right",
          slots: { default: "operate" },
        },
      ],
      editRules: {
        name: [
          { required: true, message: "姓名" },
          { min: 6, max: 100, message: "姓名长度在 6 到 100 个字符" },
        ],
        username: [
          { required: true, message: "姓名" },
          { min: 6, max: 100, message: "名称长度在 6 到 100 个字符" },
        ],
      },
      data: [],
    });

    const cellContextMenuEvent: VxeGridEvents.CellMenu = ({ row }) => {
      const $grid = xGrid.value;
      $grid!.setCurrentRow(row);
    };

    const contextMenuClickEvent: VxeGridEvents.MenuClick = ({
      menu,
      row,
      column,
    }) => {
      const $grid = xGrid.value;
      switch (menu.code) {
        case "create":
          createUser();
          break;
        case "save":
          saveRowEvent(row);
          break;
        case "delete":
          removeRowEvent(row);
          break;
        case "exData":
          showExData(row);
          break;
        case "resetPassword":
          resetPassword(row);
          break;
      }
    };

    const userManage = reactive({
      enableList,
      userExData: {} as UserExData,
      uploadAction: import.meta.env.VITE_APP_BASE_URL + "/lumen/oss/upload",
      uploadHeader: { Authorization: `Bearer ${getItem("TOKEN").token}` },
      uploadData: {
        businessCode: "",
        businessType: "Avatar",
      },
      userExDataRules: {} as any,
      showExData: false,
      loading: false,
      roleList: [] as any[],
      userGroupList: [] as any[],
      genderList: [] as any,
    });

    onMounted(() => {
      roleStore()
        .getRolesKVTree()
        .then((res) => {
          userManage.roleList = res;
        });
      userGroupStore()
        .getUserGroupKVTree()
        .then((res) => {
          userManage.userGroupList = res;
        });
      userManage.genderList = sexList;
    });

    const findList = () => {
      gridOptions.loading = true;
      const formConfig: any = gridOptions.formConfig;
      const pagerConfig: any = gridOptions.pagerConfig;
      userPage({
        ...formConfig.data,
        pageNumber: pagerConfig.currentPage - 1,
        pageSize: pagerConfig.pageSize,
      })
        .then((res: any) => {
          gridOptions.loading = false;
          if (gridOptions.pagerConfig) {
            gridOptions.pagerConfig.total = res.total;
          }

          for (const row of res.data) {
            row.roles = row.roles.map((item: any) => item.id);
          }
          gridOptions.data = res.data;
        })
        .catch(() => {
          gridOptions.loading = false;
        });
    };

    const showExData = (row: any) => {
      if (row.id) {
        getUserExData(row.id).then((res: any) => {
          if (commonAlert(res, "")) {
            userManage.userExData = res.data ? res.data : {};
            userManage.userExData.user = row;
            userManage.showExData = true;
          }
        });
      } else {
        userManage.userExData.user = row;
        userManage.showExData = true;
      }
      userManage.uploadData.businessCode = row.username;
    };

    const refreshUserEx = (row: any) => {
      userManage.loading = true;
      getUserExData(row.id)
        .then((res: any) => {
          if (commonAlert(res, "")) {
            userManage.userExData = res.data;
            userManage.userExData.user = row;
            userManage.showExData = true;
          }
          userManage.loading = false;
        })
        .catch(() => {
          userManage.loading = false;
        });
    };

    const gridEvents: VxeGridListeners = {
      pageChange({ currentPage, pageSize }) {
        if (gridOptions.pagerConfig) {
          gridOptions.pagerConfig.currentPage = currentPage;
          gridOptions.pagerConfig.pageSize = pageSize;
        }
        findList();
      },
    };

    const userExSubmitEvent: VxeFormEvents.Submit = () => {
      userManage.loading = true;
      const data: any = clone(userManage.userExData, true);
      data.user = { id: data.user.id };
      saveUserExt(data).then((res: any) => {
        userManage.loading = false;
        commonAlert(res, "保存成功");
      });
    };

    const reset = () => {
      gridOptions.formConfig!.data.name = "";
      gridOptions.formConfig!.data.username = "";
      gridOptions.formConfig!.data.enable = undefined;
      gridOptions.formConfig!.data.roles = "";
      gridOptions.formConfig!.data.userGroup = "";
    };

    const saveRowEvent = async (user: UserVo) => {
      const $grid = xGrid.value;
      $grid!.validate(user).then((res) => {
        if (res) {
          VXETable.modal.message({ status: "error", content: "校验不通过！" });
        } else {
          gridOptions.loading = true;

          user.roles = transIdObjs(user.roles, "id");
          user.userGroup = transObj(user.userGroup, "id");

          saveOrUpdate(user)
            .then((res: any) => {
              gridOptions.loading = false;
              if (commonAlert(res, "保存成功")) {
                findList();
              }
            })
            .catch(() => {
              gridOptions.loading = false;
            });
        }
      });
    };

    const saveOrUpdate = (user: UserVo) => {
      return validNull(user.id) ? insert(user) : update(user);
    };

    const createUser = async () => {
      const $grid = xGrid.value;
      await $grid!.insertAt(
        {
          id: undefined,
          name: "",
          username: "",
          enable: undefined,
          roles: [],
          userGroup: "",
        },
        -1
      );
    };

    const removeRowEvent = async (row: any) => {
      const type = await VXETable.modal.confirm(`您确定要删除用户${row.name}?`);
      const $grid = xGrid.value;
      if ($grid) {
        if (type === "confirm") {
          remove(transObj(row.id, "id")).then(async (res: any) => {
            if (commonAlert(res, "删除成功")) {
              await $grid.remove(row);
            }
          });
        }
      }
    };

    const resetPassword = async (row: any) => {
      const type = await VXETable.modal.confirm(
        `确定要重置用户${row.name}密码?`
      );

      const $grid = xGrid.value;
      if ($grid) {
        if (type === "confirm") {
          resetUserPassword({ id: row.id }).then((res: any) => {
            commonAlert(res, "重置成功");
          });
        }
      }
    };

    const handleAvatarSuccess: UploadProps["onSuccess"] = (
      response,
      uploadFile
    ) => {
      if (commonAlert(response, "上传成功")) {
        userManage.userExData.avatar = response.data;
      }
    };

    const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
      const types = ["image/png", "image/jpeg"];
      if (!types.find((item) => item === rawFile.type)) {
        VXETable.modal.message({
          status: "error",
          content: "Avatar picture must be JPG/png format!",
        });

        return false;
      } else if (rawFile.size / 1024 / 1024 > 2) {
        VXETable.modal.message({
          status: "error",
          content: "Avatar picture size can not exceed 2MB!",
        });
        return false;
      }
      return true;
    };

    // 初次加载
    findList();

    return {
      xGrid,
      gridOptions,
      gridEvents,
      userManage,
      createUser,
      reset,
      transLabels,
      findList,
      saveRowEvent,
      removeRowEvent,
      resetPassword,
      refreshUserEx,
      userExSubmitEvent,
      cellContextMenuEvent,
      contextMenuClickEvent,
      handleAvatarSuccess,
      beforeAvatarUpload,
    };
  },
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
