import userRequest from '@/services/userRequest';
import request from '@/services/request';

/**
*  获取粉丝
*/
export const getRelationChain = (data: object) =>
    userRequest({
        url: 'v2/relation/relation_chain',
        method: "GET",
        data
    })

/**
*  获取店铺
*/
export const getStoreList = (data: object) =>
    request({
        url: 'v3/user/president_supplier',
        method: "GET",
        data
    })


