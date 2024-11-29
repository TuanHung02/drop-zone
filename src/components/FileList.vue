<template>
    <div class="file-list">
        <div v-for="(file, index) in files" :key="index" class="file-item">
            <div class="file-icon">
                <img :src="getFileIcon(file)" alt="file-icon" />
                <div class="file-name">
                    <p>{{ file.name }}</p>
                    <label>{{ formatSize(file.size) }}</label>
                </div>
            </div>
            <svg @click="removeFile(index)" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                viewBox="0 0 24 24" class="svg-delete">
                <g>
                    <path
                        d="M15.854 8.854 12.708 12l3.146 3.146a.5.5 0 0 1-.708.707L12 12.707l-3.146 3.146a.498.498 0 0 1-.708 0 .5.5 0 0 1 0-.707L11.292 12 8.146 8.854a.5.5 0 0 1 .707-.707l3.146 3.146 3.146-3.146a.5.5 0 0 1 .707.707ZM24 12c0 6.617-5.383 12-12 12S0 18.617 0 12 5.383 0 12 0s12 5.383 12 12Zm-1 0c0-6.065-4.935-11-11-11S1 5.935 1 12s4.935 11 11 11 11-4.935 11-11Z"
                        fill="#666666"></path>
                </g>
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import fileIcon from "../assets/icon/file.png";
import { defineProps, defineEmits } from "vue";

defineProps({
    files: Array,
});

const emits = defineEmits(["removeFile"]);
const getFileIcon = (file: File) => {
    const fileType = file?.name?.split(".").pop();
    if (!fileType) {
        return "https://static.thenounproject.com/png/643663-200.png";
    }

    switch (fileType.toLowerCase()) {
        case "pdf":
            return "https://cdn2.iconfinder.com/data/icons/file-8/128/file-expand_Pdf-512.png";
        case "doc":
        case "docx":
            return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp9uU1BPDla8o1MGci_5tlBqbXhptNAegclQ&s";
        case "xls":
        case "xlsx":
            return "https://cdn.iconscout.com/icon/free/png-256/free-file-document-excel-spreadsheet-table-xls-44509.png";
        default:
            return fileIcon;
    }
};

const formatSize = (size: number) => {
    const kb = size / 1024;
    return `${kb.toFixed(2)}kB`;
};

const removeFile = (index: number) => {
    emits("removeFile", index);
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap');

.file-list {
    display: flex;
    gap: 10px;
    width: 842px;
    flex-wrap: nowrap;
    position: relative;
    align-items: center;
    margin-top: 33px;

}

.file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid rgba(220, 220, 220, 1);
    padding: 8px;
    width: 244px;
    border-radius: 3px;
    box-sizing: border-box;
    height: 48px;

    .file-name {
        display: flex;
        flex-direction: column;
    }

    p {
        margin: 0 !important;
        font-size: 12px;
        font-weight: 700;
        line-height: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 140px;
        color: rgba(51, 51, 51, 1);
        padding: 0 !important;

    }

    label {
        font-size: 10px;
        font-weight: 400;
        line-height: 14px;
        text-align: left;
        color: rgba(102, 102, 102, 1);
        margin: 0 !important;
        padding: 0 !important;
    }

    .svg-delete {
        cursor: pointer;

        &:hover {
            opacity: 0.8;
        }
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
</style>