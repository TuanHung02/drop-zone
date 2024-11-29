<template>
    <div v-if="message" class="error-message">{{ message }}</div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
    message: string;
}>();
</script>

<style scoped>
.error-message {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
    color: rgba(237, 93, 93, 1);
    margin-top: 17px;
}
</style>
