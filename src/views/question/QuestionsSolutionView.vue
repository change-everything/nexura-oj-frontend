<template>
  <div id="QuestionSolutionView">
    <a-comment
      style="margin-left: 12px"
      align="right"
      avatar="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
    >
      <template #content>
        <a-input
          :model-value="form.solution"
          @focus="writeSolution"
          placeholder="发布你的题解"
        >
          <template #append>
            <a-button
              type="primary"
              style="width: 100%"
              @click="publishTheSolution"
              >发布</a-button
            >
          </template>
        </a-input>
      </template>
    </a-comment>
    <a-list
      class="solutionList"
      :bordered="false"
      :data="dataList"
      :pagination-props="paginationProps"
      :virtualListProps="{
        height: 560,
      }"
    >
      <template #item="{ item, index }">
        <a-list-item
          :key="index"
          class="list-demo-item"
          action-layout="vertical"
        >
          <div
            @click="solutionDetail(item as QuestionSolutionVO)"
            style="cursor: pointer"
          >
            <a-list-item-meta>
              <template #title>
                <a-space direction="vertical" fill>
                  <a-space>
                    <span style="color: rgb(128, 128, 128)">{{
                      item.userVO?.userName
                    }}</span>
                    <span style="font-size: 10px; color: rgb(128, 128, 128)">{{
                      moment(item.createTime).format("YYYY-MM-DD")
                    }}</span>
                  </a-space>
                  <span
                    style="color: black; font-weight: bolder; font-size: 16px"
                    >{{ item.title }}</span
                  >
                </a-space>
              </template>
              <template #avatar>
                <a-avatar shape="square" style="margin-top: 12px">
                  <img
                    alt="avatar"
                    :src="
                      item.userVO?.userAvatar
                        ? item.userVO?.userAvatar
                        : avatarSrc[0]
                    "
                  />
                </a-avatar>
              </template>

              <template #description>
                <a-space direction="vertical" fill>
                  <span
                    style="
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    "
                    >{{ item.solution }}</span
                  >
                  <a-space wrap>
                    <a-tag
                      v-for="(tag, index) of JSON.parse(item.tags)"
                      :key="index"
                      >{{ tag }}</a-tag
                    >
                  </a-space>
                </a-space>
              </template>
            </a-list-item-meta>
          </div>
        </a-list-item>
      </template>
    </a-list>
    <a-modal
      v-model:visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      draggable
      width="auto"
      :mask-closable="false"
    >
      <template #title> 发布题解 </template>
      <div>
        <a-space direction="vertical" fill>
          <a-input
            :style="{ width: '100vh' }"
            placeholder="请输入标题"
            allow-clear
            v-model="form.title"
          >
            <template #prefix>
              <icon-h1 />
            </template>
          </a-input>
          <a-input-tag
            v-model="form.tags"
            :style="{ width: '100vh' }"
            placeholder="请输入标签"
            allow-clear
          />
          <MdEditor
            :value="form.solution"
            :handle-change="onAnswerChange"
            style="width: 800px"
          />
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  ref,
  toRefs,
  defineProps,
  onMounted,
  defineEmits,
} from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionSolutionControllerService } from "../../../generated/services/QuestionSolutionControllerService";
import { Message } from "@arco-design/web-vue";
import { QuestionSolutionQueryRequest } from "../../../generated/models/QuestionSolutionQueryRequest";
import moment from "moment";
import { QuestionSolutionVO } from "../../../generated/models/QuestionSolutionVO";

const emit = defineEmits(["doAddTab"]);

const form = reactive({
  solution: "",
  questionId: "",
  title: "",
  tags: [],
});

const dataList = ref([]);

const props = defineProps({
  //子组件接收父组件传递过来的值
  questionId: String,
});

const searchParams = ref<QuestionSolutionQueryRequest>({
  pageSize: 10,
  current: 1,
});

const paginationProps = reactive({
  defaultPageSize: 10,
  total: "",
});
const avatarSrc = [
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp",
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/9eeb1800d9b78349b24682c3518ac4a3.png~tplv-uwbnlip3yd-webp.webp",
];

const loadData = async () => {
  const res =
    await QuestionSolutionControllerService.listQuestionSolutionByPageUsingPost(
      {
        ...searchParams.value,
      }
    );
  if (res.code === 0) {
    dataList.value = res.data.records;
    paginationProps.total = res.data.total;
    console.log("datalist--->", dataList.value);
  } else {
    Message.error("系统错误, " + res.message);
  }
};

onMounted(() => {
  loadData();
});

const writeSolution = () => {
  visible.value = true;
};

const visible = ref(false);
const handleOk = () => {
  visible.value = false;
};
const handleCancel = () => {
  form.solution = "";
  visible.value = false;
};

const onAnswerChange = (value: string) => {
  form.solution = value;
};

const publishTheSolution = async () => {
  //使用父组件传递过来的值
  const { questionId } = toRefs(props);
  const res =
    await QuestionSolutionControllerService.doQuestionSolutionAddUsingPost({
      ...form,
      questionId: questionId?.value,
    });
  console.log(res);
  if (res.code === 0) {
    form.solution = "";
    loadData();
    Message.success("发布成功");
  } else {
    Message.error("发布失败，", res.message);
  }
};

const solutionDetail = (item: QuestionSolutionVO) => {
  emit("doAddTab", item);
};
</script>

<style scoped>
#QuestionSolutionView {
  max-width: 1280px;
  margin: 0 auto;
  height: 75vh;
}
.list-demo-action-layout .image-area {
  width: 183px;
  height: 119px;
  border-radius: 2px;
  overflow: hidden;
}

.list-demo-action-layout .list-demo-item {
  padding: 20px 0;
  border-bottom: 1px solid var(--color-fill-3);
}

.list-demo-action-layout .image-area img {
  width: 100%;
}

.list-demo-action-layout .arco-list-item-action .arco-icon {
  margin: 0 4px;
}

.arco-list-item-meta {
  align-items: flex-start !important;
}

.solutionList {
  overflow-y: hidden;
  overflow-x: hidden;
}
</style>
