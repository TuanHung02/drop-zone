<script setup lang="ts">
import DropZone from './components/DropZone.vue';
//commit some thing this is main branch
</script>

<template>
  <div>
    <DropZone :maxSize="10 * 1024 * 1024" :maxLength="5" />
  </div>
</template>

<style scoped></style>
