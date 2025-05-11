import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";
import { getUserInfo } from "@/api/modules/user";

export const useUserStore = defineStore({
  id: "hzycoder-user",
  state: (): UserState => ({
    token: "",
    userInfo: {}
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    },
    async getUserInfo() {
      try {
        const { code, data }: any = await getUserInfo();
        if (code === 200) {
          this.userInfo = data || { username: "robot" };
        }
      } catch (err) {
        console.error(err);
      }
    }
  },
  persist: piniaPersistConfig("hzycoder-user")
});
