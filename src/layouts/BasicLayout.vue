<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="http://www.nexura.site">nexura by peiYP</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style>
#basicLayout .header {
  margin-bottom: 16px;
  box-shadow: 1px 1px 5px;
}
#basicLayout .content {
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 16px;
  padding: 20px;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 999;
}
</style>
<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>
