<template>
  <Viewer :value="value" :plugins="plugins" />
</template>

<script setup lang="ts">
import { Viewer } from "@bytemd/vue-next";
import { withDefaults, defineProps } from "vue";
import highlight from "@bytemd/plugin-highlight";
import gfm from "@bytemd/plugin-gfm";
import breaks from "@bytemd/plugin-breaks";
import frontmatter from "@bytemd/plugin-frontmatter";
import gemoji from "@bytemd/plugin-gemoji";
import math from "@bytemd/plugin-math";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "@bytemd/plugin-mermaid";

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: () => "",
});

const plugins = [
  gfm(),
  highlight(),
  breaks(),
  frontmatter(),
  gemoji(),
  math(),
  mediumZoom(),
  mermaid(),
];
</script>

<style>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
