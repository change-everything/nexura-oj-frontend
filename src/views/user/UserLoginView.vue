<template>
  <div class="body">
    <a-card :style="{ width: '480px', margin: '40px auto' }">
      <h2>欢迎登录</h2>
      <a-form
        style="max-width: 480px; margin: 0 auto"
        label-align="left"
        auto-label-width
        :model="form"
        @submit="handleSubmit"
      >
        <a-form-item field="userAccount" label="账号">
          <a-input v-model="form.userAccount" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item
          field="userPassword"
          tooltip="密码不少于 8 位"
          label="密码"
        >
          <a-input-password
            v-model="form.userPassword"
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          style="width: 120px; margin: 0 auto"
          >登录</a-button
        >
        <div class="register">
          没有账号？<a-link href="/user/register" class="register"
            >去注册</a-link
          >
        </div>
      </a-form>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  console.log(res);
  if (res.code === 0) {
    Message.success("登录成功");
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    Message.error("登录失败," + res.message);
  }
};
</script>

<style scoped>
.register {
  font-size: 11px;
}
.register:first-line {
  color: rgb(128, 128, 128);
}
</style>
