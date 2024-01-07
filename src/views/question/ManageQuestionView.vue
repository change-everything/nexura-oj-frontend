<template>
  <div id="manageQuestionView">
    <h2>题目管理</h2>
    <a-space direction="vertical" fill>
      <a-button @click="doCreate" type="primary" status="success"
        >新建</a-button
      >
      <a-table
        :columns="columns"
        :data="dataList"
        :pagination="{
          showTotal: true,
          pageSize: searchParams.pageSize,
          pageNum: searchParams.current,
          total,
        }"
        @page-change="onPageChange"
        :scroll="scroll"
      >
        <template #tags="{ record }">
          <a-space wrap>
            <a-tag
              v-for="(tag, index) of JSON.parse(record.tags)"
              :key="index"
              color="green"
              >{{ tag }}</a-tag
            >
          </a-space>
        </template>

        <template #createTime="{ record }">
          {{ moment(record.createTime).format("YYYY-MM-DD") }}
        </template>

        <template #optional="{ record }">
          <a-space>
            <a-button @click="doUpdate(record)" type="primary">修改</a-button>
            <a-button @click="doDelete(record)" status="danger">删除</a-button>
          </a-space>
        </template>
      </a-table>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment/moment";

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    Message.error("加载失败, " + res.message);
  }
};

watchEffect(() => {
  loadData();
});

onMounted(() => {
  loadData();
});

const scroll = {
  x: 2000,
};

const columns = [
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "内容",
    dataIndex: "content",
    ellipsis: true,
    tooltip: "content",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "答案",
    dataIndex: "answer",
    ellipsis: true,
    tooltip: "answer",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
    ellipsis: true,
    tooltip: "judgeConfig",
  },
  {
    title: "判题用例",
    dataIndex: "judgeCase",
    ellipsis: true,
    tooltip: "judgeCase",
  },
  {
    title: "创建用户",
    dataIndex: "userName",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
    fixed: "right",
  },
];

const doDelete = async (question: Question) => {
  console.log(question);
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    Message.success("删除成功");
    loadData();
  } else {
    Message.error("删除失败, " + res.message);
  }
};

const router = useRouter();
const doUpdate = (question: Question) => {
  router.push({
    path: "/question/update",
    query: {
      id: question.id,
    },
  });
};

const doCreate = () => {
  router.push({
    path: "/question/add",
  });
};

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
</script>

<style scoped>
#manageQuestionView {
}
</style>
