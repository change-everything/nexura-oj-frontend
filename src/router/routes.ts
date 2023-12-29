import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import accessEnum from "@/access/accessEnum";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
      },
    ],
    meta: {
      hidden: true,
    },
  },
  {
    path: "/",
    name: "首页",
    component: HomeView,
  },
  {
    path: "/question/add",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      // access: accessEnum.ADMIN,
      hidden: true,
    },
  },
  {
    path: "/question/update",
    name: "修改题目",
    component: AddQuestionView,
    meta: {
      // access: accessEnum.ADMIN,
      hidden: true,
    },
  },
  {
    path: "/question/manage",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      // access: accessEnum.ADMIN,
    },
  },
  {
    path: "/admin",
    name: "管理员",
    component: AdminView,
    meta: {
      access: accessEnum.ADMIN,
    },
  },
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuthView,
    meta: {
      hidden: true,
    },
  },
  {
    path: "/about",
    name: "关于",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];
