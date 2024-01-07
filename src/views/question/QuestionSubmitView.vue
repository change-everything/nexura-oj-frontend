<template>
  <div id="QuestionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="language" label="编程语言" style="min-width: 280px">
        <a-select v-model="searchParams.language" placeholder="请选择编程语言">
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSearch">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        pageNum: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeInfo="{ record }">
        <a-tag v-if="record.judgeInfo.message === 'Accepted'" color="green">{{
          record.judgeInfo.message
        }}</a-tag>
        <a-tag v-else color="red">{{ record.judgeInfo.message }}</a-tag>
      </template>

      <template #statusStr="{ record }">
        {{ record.statusStr }}
      </template>

      <template #questionVO="{ record }">
        <a-link :href="'/view/question/' + record.questionVO?.id">
          {{ record.questionVO?.title }}</a-link
        >
      </template>

      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment";

const dataList = ref([]);
const tableRef = ref();
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  pageSize: 10,
  current: 1,
  language: "",
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
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

const columns = [
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题状态",
    slotName: "statusStr",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "题目",
    slotName: "questionVO",
  },
  {
    title: "提交者",
    dataIndex: "userName",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
];

const router = useRouter();

const doQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
const doSearch = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#QuestionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
