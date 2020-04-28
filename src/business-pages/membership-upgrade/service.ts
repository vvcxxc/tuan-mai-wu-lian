import request from '@/services/request';

/**
*  获取
*/
export const getUserInfo = () =>
    request({
        url: 'v1/community/examine',
        method: "GET",
    })

/**
*  提交
*/
export const loadImg = (data: object) =>
    request({
        url: 'v1/community/examine',
        method: "POST",
        data
    })
/**
*  审核成功通知
*/
export const examineSuccess = (id: any) =>
    request({
        url: 'v1/community/examine/' + id,
        method: "PUT",
    })
