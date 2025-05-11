<template>
  <div class="blog_page card">
    <div class="table-search">
      <el-form :inline="true" :model="state.queryForm" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="state.queryForm.name" placeholder="请输入标签名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="state.queryForm.tagTypeId" placeholder="请选择标签类型" clearable style="width: 200px">
            <el-option v-for="item in tagList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button ghost @click="doReset">重置</el-button>
          <el-button type="primary" @click="doQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-top-operate">
      <el-button type="primary" icon="plus" @click="handleBlogAdd">新增</el-button>
    </div>
    <el-table v-loading="state.loading" :data="state.tableData" style="width: 100%">
      <el-table-column prop="id" label="标签ID" width="100" />
      <el-table-column prop="name" label="标签名称" min-width="120" />
      <el-table-column prop="tagType" label="标签类型" />
      <el-table-column prop="createdAt" label="创建日期" width="200" />
      <el-table-column prop="updatedAt" label="更新日期" width="200" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="editRow(row)">编辑</el-button>
          <el-button link type="primary" size="small" @click="deleteRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <set-tag ref="setTagRef" :edit="isEditTag" @refresh="getTableData" />
  </div>
</template>
<script setup lang="ts">
import { getTagList, getTagTypeList, deleteTag } from "@/api/modules/blog";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import SetTag from "./components/set-tag.vue";

const state = reactive({
  tableData: [],
  queryForm: {
    name: "",
    tagTypeId: []
  },
  loading: false
});

const tagList = ref<any[]>([]);
const setTagRef = ref();
const isEditTag = ref(false);

const doReset = () => {
  state.queryForm.name = "";
  state.queryForm.tagTypeId = [];
  getTableData();
};

const doQuery = () => {
  getTableData();
};

const handleBlogAdd = () => {
  isEditTag.value = false;
  setTagRef.value?.openDialog();
};

const deleteRow = (row: any) => {
  ElMessageBox.confirm(`是否要删除该标签【${row.name}】?`, "删除标签", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteTag({ id: row.id })
        .then((res: any) => {
          if (res.code === 200) {
            ElMessage({
              type: "success",
              message: "删除成功"
            });
            getTableData();
          } else {
            ElMessage({
              type: "error",
              message: res.message
            });
          }
        })
        .catch((err: any) => {
          console.error(err);
        });
    })
    .catch(() => {});
};

const editRow = (row: any) => {
  isEditTag.value = true;
  setTagRef.value?.openDialog({
    id: row.id,
    name: row.name,
    typeId: row.typeId
  });
};

const getTagTypeData = async () => {
  try {
    const { code, data }: any = await getTagTypeList();
    if (code === 200) {
      tagList.value = data?.map((item: any) => ({ label: item.name, value: item.id })) || [];
    }
  } catch (error) {
    console.error(error);
  }
};

const getTableData = async () => {
  state.loading = true;
  try {
    const { code, data }: any = await getTagList(state.queryForm);
    if (code === 200) {
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          item.tagType = item.tagType?.name || "";
          item.createdAt = new Date(item.createdAt).toLocaleString();
          item.updatedAt = new Date(item.updatedAt).toLocaleString();
        });
      }
      state.tableData = data || [];
    }
  } catch (error) {
    console.error(error);
  } finally {
    state.loading = false;
  }
};

onMounted(() => {
  getTagTypeData();
  getTableData();
});
</script>
<style lang="scss" scoped>
.blog_page {
  width: 100%;
  height: 100%;
}
</style>
