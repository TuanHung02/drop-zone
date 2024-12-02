<template>
    <svg @click="onClick" :width="32" :height="32" viewBox="0 0 32 32" :class="svgClass">
        <g opacity="0.4">
            <circle cx="16" cy="16" r="16" fill="#627D98" />
            <path :d="direction === 'next' ? 'M13 9L18 16L13 23' : 'M18 9L13 16L18 23'" stroke="white"
                stroke-linecap="round" stroke-linejoin="round" />
        </g>
    </svg>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps({
    direction: {
        type: String,
        required: true,
        validator: (value: string) => ["next", "prev"].includes(value),
    },
    svgClass: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["click"]);

const onClick = () => {
    emit("click");
};
</script>

<style scoped>
svg {
    cursor: pointer;
    position: absolute;

    &:hover {
        opacity: 0.8;
    }
}
</style>
