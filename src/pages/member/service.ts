import request from '@/services/request';

/**
*  会员信息
*/
export const getUser = () =>
    request({
        url: 'v1/community/user',
        method: "GET"
    })
