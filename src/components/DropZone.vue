<template>
    <div style="display: flex; justify-content: center">
        <div class="file-upload">
            <!-- Upload Box -->
            <div class="upload-box" :class="{ 'error-border': errorMessage }" @dragover.prevent
                @drop.prevent="handleDrop">
                <input type="file" multiple ref="fileInput" @change="handleFileChange" hidden />
                <div>
                    <CloundIcon />
                    <p>Drag and drop files</p>
                    <button class="upload-btn" @click="triggerFileInput">Browse files</button>
                </div>
            </div>

            <!-- File List Component -->
            <FileList :files="visibleFiles" @removeFile="handleRemoveFile" />

            <!-- Navigation -->
            <FileNavigate v-show="files.length > 3 && currentEndIndex < files.length" direction="next"
                svgClass="svg-next" style="top: 270px" @click="nextFiles" />
            <FileNavigate v-show="currentStartIndex > 0" direction="prev" svgClass="svg-back"
                style="top:270px; right: 100%" @click="prevFiles" />

            <!-- Error Message -->
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineProps } from "vue";
import CloundIcon from "./icons/CloundIcon.vue";
import FileList from "./FileList.vue";
import FileNavigate from "./FileNavigate.vue";

const props = defineProps<{
    maxSize: number
    maxLength: number;
}>();

const files = ref<File[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const errorMessage = ref("");
const currentStartIndex = ref(0);

const visibleFiles = computed(() => {
    return files.value.slice(currentStartIndex.value, currentStartIndex.value + 3);
});
const currentEndIndex = computed(() => {
    return currentStartIndex.value + visibleFiles.value.length;
});

onMounted(() => {
    const storedFiles = localStorage.getItem("uploadedFiles");
    if (storedFiles) {
        const parsedFiles = JSON.parse(storedFiles);
        files.value = parsedFiles.map(
            (file: { name: string; size: number; type: string }) => ({
                name: file.name,
                size: file.size,
                type: file.type,
            })
        );
    }
});

const triggerFileInput = () => {
    fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        addFiles(Array.from(target.files));
    }
    target.value = "";
};

const handleDrop = (event: DragEvent) => {
    if (event.dataTransfer?.files) {
        addFiles(Array.from(event.dataTransfer.files));
    }
};

const addFiles = (newFiles: File[]) => {
    errorMessage.value = "";

    if (files.value.length + newFiles.length > props.maxLength) {
        errorMessage.value = `You can only upload up to ${props.maxLength} files.`;
        return;
    }
    const oversizedFiles = newFiles.filter((file) => file.size > props.maxSize);
    if (oversizedFiles.length > 0) {
        errorMessage.value = `The maximum file size is ${Math.round(
            props.maxSize / (1024 * 1024)
        )} MB`;
        return;
    }
    files.value.push(...newFiles);
    saveFilesToLocalStorage();
};

const handleRemoveFile = (index: number) => {
    files.value.splice(currentStartIndex.value + index, 1);
    saveFilesToLocalStorage();
};

const saveFilesToLocalStorage = () => {
    const fileInfo = files.value.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
    }));
    localStorage.setItem("uploadedFiles", JSON.stringify(fileInfo));
};

const nextFiles = () => {
    if (currentStartIndex.value + 3 < files.value.length) {
        currentStartIndex.value++;
    }
};

const prevFiles = () => {
    if (currentStartIndex.value > 0) {
        currentStartIndex.value--;
    }
};
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap');

.file-upload {
    display: flex;
    flex-direction: column;
    font-family: "Noto Sans JP", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    position: relative;
}

.upload-box {
    width: 840px;
    height: 230px;
    border: 1px solid rgba(220, 220, 220, 1);
    border-radius: 7px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-align: center;
    display: flex;
    background-color: rgba(248, 248, 248, 1);

    p {
        font-weight: 700;
        font-size: 18px;
        line-height: 22px;
        margin: 0 !important;
        color: rgba(51, 51, 51, 1);
        margin-top: 15px !important;
    }

    .upload-btn {
        font-size: 18px;
        line-height: 22px;
        font-weight: 400;
        background-color: inherit;
        color: rgba(51, 51, 51, 1);
        border: none;
        text-decoration: underline;
        cursor: pointer;
    }
}

.svg-next {
    cursor: pointer;
    position: absolute;
    left: 100%;
    margin-left: 10px;

    &:hover {
        opacity: 0.8;
    }
}

.svg-back {
    cursor: pointer;
    position: absolute;
    right: 100%;
    margin-right: 10px;

    &:hover {
        opacity: 0.8;
    }
}

.file-icon {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 8px;
}

.file-item img {
    width: 32px;
    height: 32px;
}

.upload-box.error-border {
    border-color: rgba(237, 93, 93, 1);
}

.error-message {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
    color: rgba(237, 93, 93, 1);
    margin-top: 17px;
}
</style>