<template>
  <div id="QuestionSubmitView">
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

      <template #time="{ record }"> {{ record.judgeInfo.time }} ms </template>

      <template #memory="{ record }">
        {{
          Number.parseFloat(
            (record.judgeInfo.memory / 1024 / 1024) as string
          ).toFixed(1)
        }}
        MB
      </template>

      <template #statusStr="{ record }">
        {{ record.statusStr }}
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
import { useStore } from "vuex";

const store = useStore();

const dataList = ref([]);
const tableRef = ref();
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  pageSize: 10,
  current: 1,
  userId: store.state.user?.userId,
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
    title: "语言",
    dataIndex: "language",
  },
  {
    title: "判题状态",
    slotName: "statusStr",
  },
  {
    title: "执行用时",
    slotName: "time",
  },
  {
    title: "内存消耗",
    slotName: "memory",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
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
