import request from '@/services/request'

export const getCityName = (data: object) =>
  request({
    url: 'v3/city_name',
    data
  })

