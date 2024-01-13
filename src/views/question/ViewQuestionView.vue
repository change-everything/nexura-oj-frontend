<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs
          default-active-key="question"
          v-model:active-key="activeKey"
          lazy-load
          type="card-gutter"
          :editable="true"
          @add="handleAdd"
          @delete="handleDelete"
          auto-switch
          animation
        >
          <a-tab-pane :closable="false" key="question" title="描述">
            <a-card
              v-if="question"
              :title="question.title"
              style="height: 75vh; overflow: auto"
            >
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
          <a-tab-pane :closable="false" key="solution" title="题解">
            <QuestionsSolutionView
              @doAddTab="handleAdd"
              :questionId="props.id"
            />
          </a-tab-pane>
          <a-tab-pane :closable="false" key="record" title="提交记录">
            <MyQuestionSubmitView />
          </a-tab-pane>
          <a-tab-pane
            v-for="(item, index) of data"
            :key="item.key"
            :title="item.title"
            :closable="index !== 2"
          >
            <div style="margin: 12px">
              <div style="height: 72vh; overflow: auto">
                <a-space direction="vertical" fill>
                  <span style="font-size: 16px; font-weight: bold">{{
                    item.title
                  }}</span>
                  <a-space>
                    <a-avatar :imageUrl="item.userVO.userAvatar"> </a-avatar>
                    <a-space direction="vertical" fill>
                      <span style="font-size: 16px">{{
                        item.userVO.userName
                      }}</span>
                      <span style="font-size: 10px; color: rgb(128, 128, 128)">
                        <icon-calendar />&nbsp;&nbsp;{{
                          moment(item.createTime).format("YYYY-MM-DD")
                        }}</span
                      >
                    </a-space>
                  </a-space>
                  <a-space wrap>
                    <a-tag
                      v-for="(tag, index) of JSON.parse(item.tags)"
                      :key="index"
                      >{{ tag }}</a-tag
                    >
                  </a-space>
                </a-space>

                <MdViewer :value="item?.content || ''" />
              </div>
            </div>
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
import QuestionsSolutionView from "@/views/question/QuestionsSolutionView.vue";
import { QuestionSolutionVO } from "../../../generated/models/QuestionSolutionVO";
import moment from "moment/moment";

const data = ref([]);

const activeKey = ref("question");

let count = 5;

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
  const codeRes = await QuestionControllerService.getCodeTemplate({
    title: question.value?.title as any,
    language: value as any,
  });
  if (codeRes.code === 0) {
    onCodeChange(codeRes.data);
  }
};

onMounted(() => {
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
  Message.success("提交成功");
  if (res.code !== 0) {
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

const handleAdd = (questionSolution: QuestionSolutionVO) => {
  if (data.value.includes(questionSolution)) {
    console.log("重复点击");
  } else {
    data.value = data.value.concat({
      key: questionSolution.solutionId,
      title: questionSolution.title,
      content: questionSolution.solution,
      ...questionSolution,
    });
    activeKey.value = questionSolution.solutionId;
  }
};
const handleDelete = (key: number) => {
  data.value = data.value.filter((item) => item.key !== key);
  activeKey.value = "solution";
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
