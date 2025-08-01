#!/usr/bin/env node

/**
 * PetPal Tabbar 图标生成脚本
 * 
 * 使用说明:
 * 1. 确保已安装Node.js
 * 2. 运行: node generate-icons.js
 * 3. 图标将保存到 uni-preset-vue-vite/src/static/images/tabbar/ 目录
 */

const fs = require('fs');
const path = require('path');

// 目标目录
const targetDir = path.join(__dirname, 'uni-preset-vue-vite', 'src', 'static', 'images', 'tabbar');

// 创建简单的PNG图标数据 (使用base64编码的最小PNG)
const iconData = {
    // 首页图标 - 普通状态 (简化的房子图标)
    'home.png': createSimpleIcon([
        '    ████    ',
        '   ██████   ',
        '  ████████  ',
        ' ██████████ ',
        '████████████',
        '██        ██',
        '██ ██████ ██',
        '██ ██████ ██',
        '██ ██████ ██',
        '██ ██████ ██',
        '██ ██████ ██',
        '████████████'
    ], '#999999'),

    // 首页图标 - 选中状态
    'home-active.png': createSimpleIcon([
        '    ████    ',
        '   ██████   ',
        '  ████████  ',
        ' ██████████ ',
        '████████████',
        '██        ██',
        '██ ██████ ██',
        '██ ██████ ██',
        '██ ██████ ██',
        '██ ██████ ██',
        '██ ██████ ██',
        '████████████'
    ], '#6F87FF'),

    // 我的图标 - 普通状态 (简化的用户图标)
    'profile.png': createSimpleIcon([
        '            ',
        '   ██████   ',
        '  ████████  ',
        '  ████████  ',
        '   ██████   ',
        '            ',
        ' ██████████ ',
        '████████████',
        '████████████',
        '████████████',
        '████████████',
        '            '
    ], '#999999'),

    // 我的图标 - 选中状态
    'profile-active.png': createSimpleIcon([
        '            ',
        '   ██████   ',
        '  ████████  ',
        '  ████████  ',
        '   ██████   ',
        '            ',
        ' ██████████ ',
        '████████████',
        '████████████',
        '████████████',
        '████████████',
        '            '
    ], '#6F87FF')
};

function createSimpleIcon(pattern, color) {
    // 这是一个简化的实现，实际应该生成真正的PNG数据
    // 这里返回一个标识字符串，实际使用时需要PNG编码库
    return {
        pattern: pattern,
        color: color,
        size: 24
    };
}

// 生成SVG格式的图标 (更实用的方案)
function generateSVGIcon(type, isActive) {
    const color = isActive ? '#6F87FF' : '#999999';
    const size = 48; // 适合tabbar的尺寸
    
    let svgContent = '';
    
    if (type === 'home') {
        if (isActive) {
            svgContent = `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" fill="white"/>
    <path d="M12 3L4 9V21H8V15H16V21H20V9L12 3Z" fill="${color}" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M9 21V13H15V21" fill="white" stroke="${color}" stroke-width="1.5"/>
</svg>`;
        } else {
            svgContent = `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" fill="white"/>
    <path d="M12 3L4 9V21H8V15H16V21H20V9L12 3Z" stroke="${color}" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
    <path d="M9 21V13H15V21" stroke="${color}" stroke-width="1.5" fill="none"/>
</svg>`;
        }
    } else if (type === 'profile') {
        if (isActive) {
            svgContent = `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" fill="white"/>
    <circle cx="12" cy="8" r="4" fill="${color}" stroke="${color}" stroke-width="1.5"/>
    <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;
        } else {
            svgContent = `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" fill="white"/>
    <circle cx="12" cy="8" r="4" stroke="${color}" stroke-width="1.5" fill="none"/>
    <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>`;
        }
    }
    
    return svgContent.trim();
}

// 确保目标目录存在
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ 创建目录: ${dir}`);
    }
}

// 主函数
function generateIcons() {
    console.log('🎨 开始生成 PetPal Tabbar 图标...\n');
    
    // 确保目录存在
    ensureDir(targetDir);
    
    // 生成SVG图标（推荐方案）
    const icons = [
        { name: 'home.svg', type: 'home', active: false },
        { name: 'home-active.svg', type: 'home', active: true },
        { name: 'profile.svg', type: 'profile', active: false },
        { name: 'profile-active.svg', type: 'profile', active: true }
    ];
    
    icons.forEach(icon => {
        const svgContent = generateSVGIcon(icon.type, icon.active);
        const filePath = path.join(targetDir, icon.name);
        
        fs.writeFileSync(filePath, svgContent);
        console.log(`✅ 已生成: ${icon.name}`);
    });
    
    console.log('\n🎉 图标生成完成！');
    console.log('\n📋 后续步骤:');
    console.log('1. 查看生成的SVG图标文件');
    console.log('2. 使用在线工具或设计软件将SVG转换为PNG：');
    console.log('   - https://cloudconvert.com/svg-to-png');
    console.log('   - https://convertio.co/svg-png/');
    console.log('3. 将PNG文件重命名并替换原有的图标文件');
    console.log('\n🎯 或者使用我们提供的 icon-converter.html 工具页面');
}

// 运行生成器
if (require.main === module) {
    generateIcons();
}

module.exports = { generateIcons, generateSVGIcon }; 