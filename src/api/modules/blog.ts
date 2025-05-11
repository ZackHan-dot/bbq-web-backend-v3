import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

export function getBlogList(params: any) {
  return http.get(PORT1 + "/blogs", params);
}

export function getTagList(params?: any) {
  return http.get(PORT1 + "/tags", params);
}

export function getTagTypeList() {
  return http.get(PORT1 + "/tags-type");
}

export function deleteTag(params: { id: number }) {
  return http.post(PORT1 + "/tags/delete", params);
}

export function addTag(params: { name: string; typeId: number }) {
  return http.post(PORT1 + "/tags/save", params);
}

export function updateTag(id: string, params: { name: string; typeId: number }) {
  return http.put(PORT1 + `/tags/update/${id}`, params);
}

/** 更新规则 PUT /api/blogs/update/:id */
export async function updateBlog(id: number, params: any) {
  return http.put(PORT1 + `/blogs/update/${id}`, params);
}

/** 新建规则 POST /api/blogs/save */
export async function addBlog(params: any) {
  return http.post(PORT1 + "/blogs/save", params);
}

/** 删除规则 DELETE /api/blogs/delete */
export async function removeBlog(params: any) {
  return http.post(PORT1 + "/blogs/delete", params);
}

// 文章详情
export async function getBlogDetail(id: number) {
  return http.get(PORT1 + `/blogs/detail/${id}`);
}
