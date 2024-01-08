<template>
  <div id="QuestionSolutionView">
    <a-comment
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
      class="list-demo-action-layout"
      :bordered="false"
      :data="dataList"
      :pagination-props="paginationProps"
    >
      <template #item="{ item, index }">
        <a-list-item
          :key="index"
          class="list-demo-item"
          action-layout="vertical"
        >
          <template #actions>
            <span><icon-heart />83</span>
            <span><icon-star />1000</span>
          </template>
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
              <a-avatar shape="square" style="margin-top: 0">
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
              <span
                style="
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
                >{{ item.solution }}</span
              >
            </template>
          </a-list-item-meta>
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
            :model-value="form.title"
          >
            <template #prefix>
              <icon-h1 />
            </template>
          </a-input>
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
import { reactive, ref, toRefs, defineProps, onMounted } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionSolutionControllerService } from "../../../generated/services/QuestionSolutionControllerService";
import { Message } from "@arco-design/web-vue";
import { QuestionSolutionVO } from "../../../generated/models/QuestionSolutionVO";
import { QuestionSubmitQueryRequest } from "../../../generated";
import { QuestionSolutionQueryRequest } from "../../../generated/models/QuestionSolutionQueryRequest";
import moment from "moment";

const form = reactive({
  solution: "",
  questionId: "",
  title: "",
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
  defaultPageSize: searchParams.value.current,
  total: "",
});
const names = ["Socrates", "Balzac", "Plato"];
const avatarSrc = [
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp",
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp",
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/9eeb1800d9b78349b24682c3518ac4a3.png~tplv-uwbnlip3yd-webp.webp",
];
const imageSrc = [
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/29c1f9d7d17c503c5d7bf4e538cb7c4f.png~tplv-uwbnlip3yd-webp.webp",
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/04d7bc31dd67dcdf380bc3f6aa07599f.png~tplv-uwbnlip3yd-webp.webp",
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/1f61854a849a076318ed527c8fca1bbf.png~tplv-uwbnlip3yd-webp.webp",
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
  console.log("solution", form.solution);
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
    Message.success("发布成功");
  } else {
    Message.error("发布失败，", res.message);
  }
};
</script>

<style scoped>
#QuestionSolutionView {
  max-width: 1280px;
  margin: 0 auto;
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
</style>
