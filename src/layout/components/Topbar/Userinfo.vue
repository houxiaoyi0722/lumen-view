<template>
  <el-dropdown trigger="click">
    <div class="userinfo">
      <template v-if="!userinfo">
        <el-icon> <User/> </el-icon>
        admin
      </template>
      <template v-else>
        <img class="avatar" v-if="userinfo.userExt && userinfo.userExt.avatar && userinfo.userExt.avatar.downLoadUrl" :src="userinfo.userExt.avatar.downLoadUrl" />
        {{ userinfo.name }}
      </template>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>个人中心</el-dropdown-item>
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script>
import { defineComponent } from "vue";
import { appStore } from "../../../stores/modules/app";
import { useRouter } from "vue-router";
import { useUserinfo } from "/src/components/Avatar/hooks/useUserinfo";
import {accountStore} from "@/stores/modules/account";

export default defineComponent({
  setup() {
    const router = useRouter();
    const account_store = accountStore();

    const { userinfo } = useUserinfo();

    // 退出
    const logout = () => {
      // 清除token
      account_store.clearToken();
      account_store.clearUserinfo();
      router.push("/login");
    };

    return {
      userinfo,
      logout,
    };
  },
});
</script>

<style lang="scss" scoped>
.userinfo {
  padding: 0 16px;
  line-height: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background: #f5f5f5;
  }
  .el-icon-user {
    font-size: 20px;
    margin-right: 8px;
  }
  .avatar {
    margin-right: 8px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
}
</style>
