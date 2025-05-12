<template>
  <div class="blog-create-page card">
    <el-form ref="formRef" :model="state.form" :rules="state.rules" label-width="auto">
      <el-form-item class="blog-create-btn">
        <el-button type="primary" :loading="loading" @click="handleSubmit">发布</el-button>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="state.form.title" placeholder="请输入文章标题" />
      </el-form-item>
      <el-form-item label="Slug" prop="slug">
        <el-input v-model="state.form.slug" placeholder="请输入文章Slug" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="state.form.description" placeholder="请输入文章描述" />
      </el-form-item>
      <el-form-item label="封面链接" prop="coverLink">
        <el-input v-model="state.form.coverLink" placeholder="请输入封面链接" />
      </el-form-item>
      <el-form-item label="是否发布" prop="published">
        <el-switch v-model="state.form.published" />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select-v2 v-model="state.form.tags" placeholder="请选择文章标签" :options="tagList" multiple />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <WangEditor v-model:value="state.form.content" height="400px" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { addBlog, getBlogDetail, getTagList, updateBlog } from "@/api/modules/blog";
import { useUserStore } from "@/stores/modules/user";
import { useRoute, useRouter } from "vue-router";
import { isEmpty } from "lodash";
import WangEditor from "@/components/WangEditor/index.vue";

const router = useRouter();
const currentRoute = useRoute();

const userStore = useUserStore();
const userId = computed(() => userStore.userInfo.id);

interface blogForm {
  title: string;
  slug: string;
  description: string;
  coverLink?: string;
  published: boolean;
  tags: number[];
  content: string;
}

interface FromModel {
  form: blogForm;
  rules: FormRules<blogForm>;
}

const state = reactive<FromModel>({
  form: {
    title: "",
    slug: "",
    description: "",
    coverLink: "",
    published: true,
    tags: [],
    content: ""
  },
  rules: {
    title: [{ required: true, message: "请输入文章标题" }],
    slug: [
      { required: true, message: "请输入Slug" },
      { pattern: /^[a-zA-Z0-9-]+$/, message: "只允许输入数字、字母和-连词符" }
    ],
    description: [{ required: true, message: "请输入文章描述" }],
    tags: [{ required: true, message: "请选择文章标签" }],
    content: [{ required: true, message: "请输入文章内容" }]
  }
});
const formRef = ref<FormInstance>();
const tagList = ref([]);
const loading = ref(false);

const isEdit = computed(() => {
  return !isEmpty(currentRoute.query.id);
});

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

const queryBlogDetail = async () => {
  try {
    const { code, data, message }: any = await getBlogDetail(+(currentRoute.query.id as string));
    if (code === 200) {
      const detail = data || {};
      state.form.content = detail.content || "";
      state.form.title = detail.title || "";
      state.form.slug = detail.slug || "";
      state.form.description = detail.description || "";
      state.form.coverLink = detail.coverLink || "";
      state.form.published = detail.published || true;
      state.form.tags = detail.tags?.map((item: { id: number }) => item.id) || [];
    } else {
      ElMessage.error(message || "获取文章详情失败");
    }
  } catch (error) {
    console.error(error);
  } finally {
  }
};

const handleSubmit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    try {
      loading.value = true;
      if (isEdit.value) {
        const { code, message }: any = await updateBlog(+(currentRoute.query.id as string), {
          ...state.form,
          userId: userId.value
        });
        if (code === 200) {
          router.replace("/blog/index");
          ElMessage.success(message || "提交成功");
        }
      } else {
        const { code, message }: any = await addBlog({
          ...state.form,
          userId: userId.value
        });
        if (code === 200) {
          router.replace("/blog/index");
          ElMessage.success(message || "提交成功");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  });
};

onMounted(() => {
  getTagData();
  if (isEdit.value) {
    queryBlogDetail();
  }
});
</script>
<style lang="scss" scoped>
.blog-create-page {
  position: relative;
  min-height: 550px;
  .el-form {
    margin-top: 55px;
    .blog-create-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      :deep(.el-form-item__content) {
        button {
          width: 100px;
        }
      }
    }
  }
}
</style>
