import request from '@/services/request';

/**
*  获取
*/
export const getUserGrade = () =>
    request({
        url: 'v3/user_grade',
        method: "GET",
    })

export const getExamine = () =>
    request({
        url: 'v1/community/examine',
        method: "GET",
    })

