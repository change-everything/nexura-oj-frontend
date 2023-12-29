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
          <a-tab-pane key="comment" title="评论"> 评论区 </a-tab-pane>
          <a-tab-pane key="answer" title="题解"> 暂时无法查看答案 </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <CodeEditor />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, withDefaults, ref, defineProps } from "vue";
import { QuestionControllerService, QuestionVO } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRoute } from "vue-router";
import CodeEditor from "@/components/CodeEditor.vue";
import MdView from "@/components/MdViewer.vue";
import MdViewer from "@/components/MdViewer.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const route = useRoute();

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
  } else {
    Message.error("加载失败, " + res.message);
  }
};

onMounted(() => {
  console.log(123);
  loadData();
});

const handleSubmit = async () => {
  console.log(111);
};

const onContentChange = (value: string) => {
  console.log(value);
};

const onAnswerChange = (value: string) => {
  console.log(value);
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
