<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<style></style>
<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { useRouter } from "vue-router";
import store from "@/store";
import { onMounted } from "vue";

const router = useRouter();
/**
 * 全局初始化函数，有全局单次调用的代码，都可以写到这里
 */
const doInit = () => {
  console.log("hello world");
};

onMounted(() => {
  doInit();
});

router.beforeEach((to, from, next) => {
  if (to.meta?.access === "admin") {
    if (store.state.user.loginUser?.userRole !== "admin") {
      next("/404");
      return;
    }
  }
  next();
});
</script>
