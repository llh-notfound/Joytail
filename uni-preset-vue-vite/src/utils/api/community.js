import { get, post, put, del } from '../request';
import { DEFAULT_PAGE_SIZE } from '../config';

/**
 * 获取社区动态列表
 * @param {string} type - 内容类型：recommend-推荐，latest-最新
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise} 请求结果
 */
export const getCommunityPosts = (type = 'recommend', page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  return get('/community/posts', { type, page, pageSize }, true);
};

/**
 * 发布社区动态
 * @param {object} data - 动态数据
 * @param {string} data.content - 动态内容
 * @param {Array<string>} data.images - 图片URL数组
 * @returns {Promise} 请求结果
 */
export const publishPost = (data) => {
  return post('/community/posts', data, true);
};

/**
 * 获取动态详情
 * @param {string} postId - 动态ID
 * @returns {Promise} 请求结果
 */
export const getPostDetail = (postId) => {
  return get(`/community/posts/${postId}`, {}, true);
};

/**
 * 点赞/取消点赞动态
 * @param {string} postId - 动态ID
 * @returns {Promise} 请求结果
 */
export const togglePostLike = (postId) => {
  return post(`/community/posts/${postId}/like`, {}, true);
};

/**
 * 收藏/取消收藏动态
 * @param {string} postId - 动态ID
 * @returns {Promise} 请求结果
 */
export const togglePostCollect = (postId) => {
  return post(`/community/posts/${postId}/collect`, {}, true);
};

/**
 * 获取动态评论列表
 * @param {string} postId - 动态ID
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise} 请求结果
 */
export const getPostComments = (postId, page = 1, pageSize = 20) => {
  return get(`/community/posts/${postId}/comments`, { page, pageSize }, true);
};

/**
 * 发表动态评论
 * @param {string} postId - 动态ID
 * @param {string} content - 评论内容
 * @returns {Promise} 请求结果
 */
export const addPostComment = (postId, content) => {
  return post(`/community/posts/${postId}/comments`, { content }, true);
};

/**
 * 删除动态评论
 * @param {string} commentId - 评论ID
 * @returns {Promise} 请求结果
 */
export const deleteComment = (commentId) => {
  return del(`/community/comments/${commentId}`, {}, true);
};

/**
 * 获取我的社区内容
 * @param {string} type - 内容类型：posts-我的发布，likes-我的点赞，collects-我的收藏，comments-我的评论
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise} 请求结果
 */
export const getMyCommunityContent = (type, page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  return get('/community/my', { type, page, pageSize }, true);
};

/**
 * 删除我的动态
 * @param {string} postId - 动态ID
 * @returns {Promise} 请求结果
 */
export const deletePost = (postId) => {
  return del(`/community/posts/${postId}`, {}, true);
};

/**
 * 编辑我的动态
 * @param {string} postId - 动态ID
 * @param {object} data - 更新的动态数据
 * @returns {Promise} 请求结果
 */
export const updatePost = (postId, data) => {
  return put(`/community/posts/${postId}`, data, true);
};

/**
 * 删除我的社区互动记录
 * @param {string} type - 互动类型（likes/collects/comments）
 * @param {string} recordId - 记录ID
 * @returns {Promise} 请求结果
 */
export const deleteCommunityRecord = (type, recordId) => {
  return del(`/community/my/${type}/${recordId}`, {}, true);
};

export default {
  getCommunityPosts,
  publishPost,
  getPostDetail,
  togglePostLike,
  togglePostCollect,
  getPostComments,
  addPostComment,
  deleteComment,
  getMyCommunityContent,
  deletePost,
  updatePost,
  deleteCommunityRecord
};
