import http from "@/api/http"
/*
 请求个人中心我的活动 - 拼团活动
*/
export const getGroupList = () =>
  http({
    url: "api/wap/user/getMeGroupList",
    method: "GET"
  })
