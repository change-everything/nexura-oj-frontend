<template>
  <div class="body">
    <a-card :style="{ width: '480px', margin: '40px auto' }">
      <h2>欢迎注册</h2>
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
        <a-form-item field="email" label="邮箱">
          <a-input v-model="form.email" placeholder="请输入邮箱" />
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
        <a-form-item
          field="userPasswordCheck"
          tooltip="密码不少于 8 位"
          label="确认密码"
        >
          <a-input-password
            v-model="form.checkPassword"
            placeholder="请确认密码"
          />
        </a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          style="width: 120px; margin: 0 auto"
          >注册</a-button
        >
      </a-form>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
  email: "",
} as UserRegisterRequest);

const handleSubmit = async () => {
  const res = await UserControllerService.userRegisterUsingPost(form);
  console.log(res);
  if (res.code === 0) {
    Message.success("注册成功");
    router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    Message.error("注册失败," + res.message);
  }
};
</script>

<style scoped></style>
