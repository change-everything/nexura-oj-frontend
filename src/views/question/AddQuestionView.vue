<template>
  <div id="addQuestionView">
    <h2>{{ route.name }}</h2>
    <a-form
      :model="form"
      :style="{ width: '1000px' }"
      @submit="handleSubmit"
      label-align="left"
    >
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag v-model="form.tags" allow-clear placeholder="请选择标签" />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor
          :value="form.content"
          :handle-change="onContentChange"
          style="min-width: 800px"
        />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MdEditor
          :value="form.answer"
          :handle-change="onAnswerChange"
          style="min-width: 800px"
        />
      </a-form-item>
      <a-form-item label="题目配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" fill>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              mode="button"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item
        label="测试用例配置"
        :content-flex="false"
        :merge-props="false"
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :key="index"
          no-style
        >
          <a-space direction="vertical" style="min-width: 480px">
            <a-form-item
              :field="`form.judgeCase[${index}].input`"
              :label="`输入用例-${index}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="请输入测试输入用例"
              />
            </a-form-item>
            <a-form-item
              :field="`form.judgeCase[${index}].output`"
              :label="`输出用例-${index}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="请输入测试输出用例"
              />
            </a-form-item>
            <a-button status="danger" @click="handleDelete(index)"
              >删除用例</a-button
            >
          </a-space>
        </a-form-item>
        <div style="margin-top: 32px">
          <a-button type="outline" status="success" @click="handleAdd"
            >新增用例</a-button
          >
        </div>
      </a-form-item>

      <a-form-item>
        <a-button html-type="submit" type="primary">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRoute } from "vue-router";

const route = useRoute();
const updatePage = route.path.includes("update");

const form = reactive({
  answer: "",
  content: "",
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  tags: [],
  title: "",
});

/**
 * 根据题目id获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    Object.assign(form, res.data);
    form.judgeCase = JSON.parse(res.data.judgeCase);
    form.judgeConfig = JSON.parse(res.data.judgeConfig);
    form.tags = JSON.parse(res.data.tags);
  } else {
    Message.error("加载失败, " + res.message);
  }
};

onMounted(() => {
  loadData();
});

const handleSubmit = async () => {
  // 区分更新或者创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(form);
    console.log(res);
    if (res.code === 0) {
      Message.success("更新成功");
    } else {
      Message.error("更新失败, " + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(form);
    console.log(res);
    if (res.code === 0) {
      Message.success("创建成功");
    } else {
      Message.error("创建失败, " + res.message);
    }
  }
};

/**
 * 新增测试用例
 */
const handleAdd = () => {
  form.judgeCase.push({
    output: "",
    input: "",
  });
};
/**
 * 删除测试用例
 * @param index
 */
const handleDelete = (index: number) => {
  form.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.content = value;
};

const onAnswerChange = (value: string) => {
  form.answer = value;
};
</script>

<style scoped>
#addQuestionView {
}
</style>
