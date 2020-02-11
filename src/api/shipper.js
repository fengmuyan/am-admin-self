import request from '@/utils/request'

//货主列表
export function getShipperList(data = {}) {
  return request({
    url: '/patronus/thearch/list',
    method: 'post',
    data
  })
}

//货主编辑
export function handelShipperEdit(data = {}) {
  return request({
    url: '/patronus/thearch/save',
    method: 'post',
    data
  })
}

//货主删除
export function handelShipperDel(data = {}) {
  return request({
    url: '/patronus/thearch/delThearchy',
    method: 'post',
    data
  })
}