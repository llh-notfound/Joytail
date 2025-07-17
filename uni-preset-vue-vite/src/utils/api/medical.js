import { get, post } from '../request'

/**
 * 医院模块API
 * 根据后端API文档规范实现
 */

// 获取医院列表
export const getHospitals = (params) => {
  return get('/medical/hospitals', params)
}

// 获取医院详情
export const getHospitalDetail = (hospitalId) => {
  return get(`/medical/hospitals/${hospitalId}`)
}

// 记录医院点击（可选功能）
export const recordHospitalClick = (hospitalId, source = 'list') => {
  return post(`/medical/hospitals/${hospitalId}/click`, { source })
}

// 默认导出对象，保持与其他API文件的一致性
export default {
  getHospitals,
  getHospitalDetail,
  recordHospitalClick
}