import request from '@/services/request';

/**
*  获取
*/
export const getUserInfo = () =>
    request({
        url: 'v1/community/user',
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
