<template>
  <el-dialog v-model="dialogVisible" :title="title" width="750" destroy-on-close>
    <el-form class="mt25" ref="formRef" :model="state.form" :rules="state.rules" label-width="auto">
      <el-form-item label="标签名" prop="name">
        <el-input v-model="state.form.name" placeholder="请输入标签名" />
      </el-form-item>
      <el-form-item label="标签类型" prop="typeId">
        <el-select v-model="state.form.typeId" placeholder="请选择标签类型" clearable style="width: 100%">
          <el-option v-for="item in tagList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { addTag, getTagTypeList, updateTag } from "@/api/modules/blog";
import { ElMessage } from "element-plus";
import { reactive, ref, computed } from "vue";

const props = defineProps({
  edit: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["refresh"]);

const state = reactive<{ form: any; rules: any }>({
  form: {
    id: "",
    name: "",
    typeId: ""
  },
  rules: {
    name: [
      { required: true, message: "请输入标签名称", trigger: "blur" },
      { min: 2, max: 10, message: "长度在 2 到 10 个字符之间", trigger: "blur" }
    ],
    typeId: [{ required: true, message: "请选择标签类型", trigger: "change" }]
  }
});
const formRef = ref();
const loading = ref(false);
const dialogVisible = ref(false);
const tagList = ref<any[]>([]);

const title = computed(() => {
  return props.edit ? "编辑标签" : "新增标签";
});

const closeDialog = () => {
  formRef.value?.resetFields();
  dialogVisible.value = false;
};

const openDialog = (props: { id: string; name?: string; typeId?: number }) => {
  state.form.id = props?.id || "";
  state.form.name = props?.name || "";
  state.form.typeId = props?.typeId ?? "";
  dialogVisible.value = true;
  getTagTypeData();
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

const handleSubmit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    try {
      loading.value = true;
      const { id, name, typeId } = state.form;
      if (props.edit) {
        const { code }: any = await updateTag(id, { name, typeId: +typeId });
        if (code === 200) {
          ElMessage({
            message: "编辑成功",
            type: "success"
          });
        }
      } else {
        const { code }: any = await addTag({ name, typeId: +typeId });
        if (code === 200) {
          ElMessage({
            message: "添加成功",
            type: "success"
          });
        }
      }
      emit("refresh");
      closeDialog();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  });
};

defineExpose({
  openDialog
});
</script>
