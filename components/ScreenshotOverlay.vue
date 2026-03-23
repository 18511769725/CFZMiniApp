<template>
  <view v-if="screenshotState.show" class="screenshot-cover"></view>
</template>

<script setup>
import { screenshotState } from "../store/screenshotState";
</script>

<style>
.screenshot-cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 99999;
  pointer-events: none;
}
</style>
