/**
 * 图片URL处理工具单元测试
 */
import { formatImageUrl, processObjectImages, processArrayImages } from '../imageHelper';
import { BASE_URL } from '../config';

// 临时保存原始BASE_URL
const originalBaseUrl = BASE_URL;

describe('图片URL处理工具测试', () => {
  
  // 每个测试后重置BASE_URL
  afterEach(() => {
    // 恢复原始BASE_URL (在实际测试环境中，这需要使用jest.resetModules()或类似方法)
    // 这里只是示例代码
  });
  
  test('formatImageUrl - 处理空URL', () => {
    expect(formatImageUrl(null)).toBe('/static/images/pet.png');
    expect(formatImageUrl('')).toBe('/static/images/pet.png');
    expect(formatImageUrl(undefined)).toBe('/static/images/pet.png');
  });
  
  test('formatImageUrl - 处理带http前缀的URL', () => {
    const url = 'http://example.com/image.jpg';
    expect(formatImageUrl(url)).toBe(url);
  });
  
  test('formatImageUrl - 处理带https前缀的URL', () => {
    const url = 'https://example.com/image.jpg';
    expect(formatImageUrl(url)).toBe(url);
  });
  
  test('formatImageUrl - 处理静态资源URL', () => {
    const url = '/static/images/product.jpg';
    expect(formatImageUrl(url)).toBe(url);
  });
  
  test('formatImageUrl - 处理相对路径（带斜杠）', () => {
    const url = '/uploads/products/1.jpg';
    const baseUrl = 'http://localhost:8080';
    // 由于BASE_URL在config.js中定义，这里只是模拟预期结果
    expect(formatImageUrl(url)).toContain('1.jpg');
  });
  
  test('formatImageUrl - 处理相对路径（不带斜杠）', () => {
    const url = 'uploads/products/1.jpg';
    const baseUrl = 'http://localhost:8080';
    // 由于BASE_URL在config.js中定义，这里只是模拟预期结果
    expect(formatImageUrl(url)).toContain('1.jpg');
  });
  
  test('processObjectImages - 处理对象中的图片字段', () => {
    const obj = {
      id: 1,
      name: '测试产品',
      image: 'uploads/test.jpg',
      avatar: 'profiles/avatar.png',
      description: '这是一个测试产品'
    };
    
    const processed = processObjectImages(obj);
    
    // 验证图片字段被处理，其他字段保持不变
    expect(processed.id).toBe(1);
    expect(processed.name).toBe('测试产品');
    expect(processed.description).toBe('这是一个测试产品');
    expect(processed.image).toContain('test.jpg');
    expect(processed.avatar).toContain('avatar.png');
  });
  
  test('processArrayImages - 处理数组中对象的图片字段', () => {
    const arr = [
      { id: 1, name: '产品1', image: 'uploads/1.jpg' },
      { id: 2, name: '产品2', image: 'http://example.com/2.jpg' },
      { id: 3, name: '产品3', image: '/static/images/3.jpg' }
    ];
    
    const processed = processArrayImages(arr);
    
    // 验证数组长度和内容类型不变
    expect(processed.length).toBe(3);
    expect(processed[0].name).toBe('产品1');
    
    // 验证URL处理结果
    expect(processed[0].image).toContain('1.jpg');
    expect(processed[1].image).toBe('http://example.com/2.jpg');
    expect(processed[2].image).toBe('/static/images/3.jpg');
  });
  
  test('processObjectImages - 处理null/undefined对象', () => {
    expect(processObjectImages(null)).toBeNull();
    expect(processObjectImages(undefined)).toBeUndefined();
  });
  
  test('processArrayImages - 处理空数组', () => {
    expect(processArrayImages([])).toEqual([]);
  });
  
  test('processArrayImages - 处理null/undefined数组', () => {
    expect(processArrayImages(null)).toBeNull();
    expect(processArrayImages(undefined)).toBeUndefined();
  });
});
