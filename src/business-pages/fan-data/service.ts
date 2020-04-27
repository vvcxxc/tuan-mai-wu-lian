import userRequest from '@/services/userRequest';

/**
*  获取粉丝
*/
export const getRelationChain = (data: object) =>
    userRequest({
        url: 'v2/relation/relation_chain',
        method: "GET",
        data
    })
