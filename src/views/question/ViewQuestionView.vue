<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="描述">
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 3, lg: 4 }"
              >
                <a-descriptions-item label="时间限制">
                  <a-tag>{{ question.judgeConfig.timeLimit }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  <a-tag>{{ question.judgeConfig.memoryLimit }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  <a-tag>{{ question.judgeConfig.stackLimit }}</a-tag>
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content || ''" />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}</a-tag
                  >
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="题解">暂时无法查看答案 </a-tab-pane>
          <a-tab-pane key="answer" title="提交记录">
            <MyQuestionSubmitView />
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-space direction="vertical" fill>
          <a-space>
            <a-button type="primary" @click="doRunCode"> 运行 </a-button>
            <a-button type="primary" status="success" @click="doSubmit">
              提交
            </a-button>
          </a-space>
          <a-form :model="form" layout="inline">
            <a-form-item
              field="language"
              label="编程语言"
              style="min-width: 280px"
            >
              <a-select
                v-model="form.language"
                placeholder="请选择编程语言"
                @change="languageChange"
              >
                <a-option>java</a-option>
                <a-option>cpp</a-option>
                <a-option>go</a-option>
              </a-select>
            </a-form-item>
          </a-form>
          <CodeEditor
            :value="form.code"
            :language="form.language"
            :handle-change="onCodeChange"
          />
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, withDefaults, ref, defineProps } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import store from "@/store";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";
import MyQuestionSubmitView from "@/views/question/MyQuestionSubmitView.vue";

interface Props {
  id: string;
  language: string;
}

const form = ref({
  language: "java",
  code: "",
  questionId: "",
});

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
  language: () => "",
});

const question = ref<QuestionVO>();

/**
 * 根据题目id获取老的数据
 */
const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
    getCodeTemplate(question.value?.title as string);
  } else {
    Message.error("加载失败, " + res.message);
  }
};

const getCodeTemplate = async (value: string) => {
  console.log("2222", question.value);
  const codeRes = await QuestionControllerService.getCodeTemplate({
    title: question.value?.title as any,
    language: value as any,
  });
  if (codeRes.code === 0) {
    onCodeChange(codeRes.data);
  }
};

onMounted(() => {
  console.log(123);
  loadData();
});

const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value?.id,
  });
  if (res.code === 0) {
    Message.success("提交成功");
  } else {
    Message.error("提交失败, " + res.message);
  }
};

const doRunCode = async () => {
  console.log(222);
};

const onCodeChange = (value: string) => {
  form.value.code = value;
  console.log("value--->", form.value.code);
};

const languageChange = async (value: string) => {
  getCodeTemplate(value);
};
</script>

<style>
#viewQuestionView {
  max-width: 1400px;
  margin: 0 auto;
}
#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
