<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img src="../assets/logo.svg" class="logo" />
            <div class="title">nexura OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in filterRouter" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="200px">
      <div
        class="username"
        v-if="store.state.user?.loginUser?.userName === '未登录'"
      >
        欢迎使用nexura, <a-link href="/user/login">请登录</a-link>
      </div>
      <a-dropdown v-else @select="handleSelect">
        <div class="username">
          {{ store.state.user?.loginUser?.userName }}
        </div>
        <template #content>
          <a-doption v-if="!store.state.user?.loginUser.userRole"
            >登录</a-doption
          >
          <a-doption v-else>退出登录</a-doption>
        </template>
      </a-dropdown>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import accessEnum from "@/access/accessEnum";
import { UserControllerService } from "../../generated";
import { Message } from "@arco-design/web-vue";

const router = useRouter();

const store = useStore();

// 默认主页 高亮
const selectedKeys = ref(["/"]);

const handleSelect = async (v: string) => {
  if ("退出登录" === v) {
    const res = await UserControllerService.userLogoutUsingPost();
    if (res.code === 0) {
      store.state.user.loginUser = { userName: "未登录" };
      router.push("/user/login");
      Message.success("注销成功");
    } else {
      Message.error("注销失败，" + res.data);
    }
  }
};

// 路由跳转时，定义选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

// 切换路由
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

const filterRouter = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hidden) {
      return false;
    }
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}
.logo {
  height: 40px;
}
.title {
  color: #444;
  margin-left: 16px;
  font-weight: bolder;
}
.username {
  color: #444;
  font-weight: bolder;
  cursor: pointer;
  float: right;
  margin-right: 16px;
}
</style>
