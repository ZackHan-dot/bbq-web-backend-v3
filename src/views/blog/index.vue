<template>
  <div class="blog_page card">
    <div class="table-search">
      <el-form :inline="true" :model="state.queryForm" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="state.queryForm.title" placeholder="请输入标题" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="state.queryForm.tags" placeholder="请选择标签" clearable multiple style="width: 200px">
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
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column prop="title" label="标题" width="200" show-overflow-tooltip />
      <el-table-column prop="username" label="作者" min-width="120" />
      <el-table-column prop="published" label="是否发布" />
      <el-table-column prop="tags" label="标签" width="200" />
      <el-table-column prop="createdAt" label="创建日期" width="200" />
      <el-table-column prop="updatedAt" label="更新日期" width="200" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="editRow(row)">编辑</el-button>
          <el-button link type="primary" size="small" @click="deleteRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="table-pagination"
      size="small"
      background
      v-model:current-page="state.queryForm.currentPage"
      v-model:page-size="state.queryForm.limit"
      :total="state.queryForm.total"
      @change="handlePageChange"
    />
  </div>
</template>
<script setup lang="ts">
import { getBlogList, getTagList, removeBlog } from "@/api/modules/blog";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const state = reactive({
  tableData: [],
  queryForm: {
    title: "",
    tags: [],
    currentPage: 1,
    limit: 10,
    total: 0,
    sortBy: "createdAt",
    sortOrder: "DESC"
  }
});

const tagList = ref<any[]>([]);

const doReset = () => {
  state.queryForm.title = "";
  state.queryForm.tags = [];
  state.queryForm.currentPage = 1;
  state.queryForm.limit = 10;
  getTableData();
};

const doQuery = () => {
  getTableData();
};

const handlePageChange = (currentPage: number, pageSize: number) => {
  state.queryForm.currentPage = currentPage;
  state.queryForm.limit = pageSize;
  getTableData();
};

const handleBlogAdd = () => {
  router.push("/blog/create/index");
};

const deleteRow = (row: any) => {
  ElMessageBox.confirm(`是否要删除该文章「${row.title}」?`, "删除文章", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      removeBlog({ id: row.id })
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
  router.push({
    path: "/blog/update/index",
    query: {
      id: row.id
    }
  });
};

const getTagData = async () => {
  try {
    const { code, data }: any = await getTagList();
    if (code === 200) {
      tagList.value = data?.map((item: any) => ({ label: item.name, value: item.id })) || [];
    }
  } catch (error) {
    console.error(error);
  }
};

const getTableData = async () => {
  try {
    const params = {
      ...state.queryForm,
      total: undefined
    };
    const { code, data }: any = await getBlogList(params);
    if (code === 200) {
      if (Array.isArray(data?.items)) {
        data.items.forEach((item: any) => {
          item.tags = item.tags.map((tag: any) => tag.name).join(", ");
          item.createdAt = new Date(item.createdAt).toLocaleString();
          item.updatedAt = new Date(item.updatedAt).toLocaleString();
          item.published = item.published ? "是" : "否";
          item.username = item.user?.username || "未知";
        });
      }
      state.tableData = data?.items || [];
      state.queryForm.total = data?.total || 0;
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getTagData();
  getTableData();
});
</script>
<style lang="scss" scoped>
.blog_page {
  width: 100%;
  height: 100%;
}
</style>
