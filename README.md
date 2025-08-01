# PetPal Project - Setup and Running Guide

## Overview

PetPal is a comprehensive pet care application built with uni-app and Vue 3. The project includes features such as pet community, medical services, insurance, shopping cart, and user management.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## Project Structure

```
petpal 5/
├── uni-preset-vue-vite/          # Main project directory
│   ├── src/                      # Source code
│   ├── package.json              # Dependencies and scripts
│   ├── vite.config.js           # Vite configuration
│   └── README.md                # This file
└── [Documentation files]         # Various documentation files
```

## Installation and Setup

### Step 1: Navigate to Project Directory

```bash
cd uni-preset-vue-vite
```

**Important**: Make sure you're in the correct directory (`uni-preset-vue-vite`) before running any commands.

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies listed in `package.json`.

### Step 3: Start Development Server

```bash
npm run dev:h5
```

The development server will start and you'll see output similar to:

```
> uni-preset-vue@0.0.0 dev:h5
> uni

请注意运行模式下，因日志输出、sourcemap 以及未压缩源码等原因，性能和包体积，均不及发行模式。
vite是按需编译，运行时点击某个未编译页面会先编译后加载，导致显示较慢，发行后无此问题。
编译器版本：4.45（vue3）
正在编译中...
Re-optimizing dependencies because vite config has changed

  vite v5.2.8 dev server running at:

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/

  ready in 717ms.
```

## Available Scripts

The project includes several npm scripts for different platforms:

### Development Scripts

- `npm run dev:h5` - Start H5 development server
- `npm run dev:mp-weixin` - Start WeChat Mini Program development
- `npm run dev:mp-alipay` - Start Alipay Mini Program development
- `npm run dev:mp-baidu` - Start Baidu Mini Program development
- `npm run dev:mp-qq` - Start QQ Mini Program development
- `npm run dev:mp-toutiao` - Start Toutiao Mini Program development
- `npm run dev:mp-xhs` - Start Xiaohongshu Mini Program development

### Build Scripts

- `npm run build:h5` - Build for H5 production
- `npm run build:mp-weixin` - Build for WeChat Mini Program
- `npm run build:mp-alipay` - Build for Alipay Mini Program
- `npm run build:mp-baidu` - Build for Baidu Mini Program
- `npm run build:mp-qq` - Build for QQ Mini Program
- `npm run build:mp-toutiao` - Build for Toutiao Mini Program
- `npm run build:mp-xhs` - Build for Xiaohongshu Mini Program

## Accessing the Application

Once the development server is running:

- **Local Access**: Open `http://localhost:5173/` in your browser
- **Network Access**: Use `http://192.168.1.100:5173/` to access from other devices on the same network

## Project Features

The PetPal application includes the following main features:

### Core Modules
- **Home Page** (`pages/index/index.vue`) - Main landing page
- **Community** (`pages/community/`) - Pet community with posts and interactions
- **Medical Services** (`pages/medical/`) - Hospital listings and medical information
- **Insurance** (`pages/insurance/`) - Pet insurance policies and claims
- **Shopping** (`pages/goods/`) - Pet products and shopping
- **Cart** (`pages/cart/`) - Shopping cart functionality
- **Orders** (`pages/order/`) - Order management
- **User Profile** (`pages/profile/`) - User account management
- **Account** (`pages/account/`) - Account settings and preferences

### API Integration
- RESTful API integration for all backend services
- Real-time data synchronization
- User authentication and authorization
- File upload and image handling

## Troubleshooting

### Common Issues

#### 1. "Could not read package.json" Error
**Problem**: Running npm commands from the wrong directory
**Solution**: Ensure you're in the `uni-preset-vue-vite` directory:
```bash
cd "petpal 5/uni-preset-vue-vite"
```

#### 2. Port Already in Use
**Problem**: Port 5173 is already occupied
**Solution**: Kill the existing process or use a different port:
```bash
# Find and kill the process using port 5173
lsof -ti:5173 | xargs kill -9
```

#### 3. Dependencies Installation Issues
**Problem**: npm install fails
**Solution**: Clear npm cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 4. Compilation Errors
**Problem**: Build or compilation errors
**Solution**: Check for syntax errors and ensure all dependencies are properly installed:
```bash
npm run build:h5
```

### Development Tips

1. **Hot Reload**: The development server supports hot reload - changes to your code will automatically refresh the browser.

2. **Console Logs**: Check the browser console for any JavaScript errors or warnings.

3. **Network Tab**: Use browser developer tools to monitor API requests and responses.

4. **Mobile Testing**: Use the network URL to test on mobile devices for responsive design validation.

## Stopping the Development Server

To stop the development server, press `Ctrl + C` in the terminal where the server is running.

## Production Deployment

For production deployment, use the build scripts:

```bash
# Build for H5
npm run build:h5

# Build for WeChat Mini Program
npm run build:mp-weixin
```

The built files will be generated in the `dist/` directory.

## Additional Resources

- **uni-app Documentation**: https://uniapp.dcloud.io/
- **Vue 3 Documentation**: https://vuejs.org/
- **Vite Documentation**: https://vitejs.dev/

## Support

If you encounter any issues not covered in this guide, please check the project documentation files in the root directory or contact the development team.

---

**Note**: This project uses uni-app framework which allows for cross-platform development. The same codebase can be compiled for H5, WeChat Mini Program, Alipay Mini Program, and other platforms.
