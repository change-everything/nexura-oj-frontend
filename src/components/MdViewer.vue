<template>
  <Viewer :value="value" :plugins="plugins" />
</template>

<script setup lang="ts">
import { Viewer } from "@bytemd/vue-next";
import { withDefaults, defineProps } from "vue";
import highlight from "@bytemd/plugin-highlight";
import gfm from "@bytemd/plugin-gfm";

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: () => "",
});

const plugins = [gfm(), highlight()];
</script>

<style>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
