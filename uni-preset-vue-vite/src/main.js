import {
	createSSRApp
} from "vue";
import App from "./App.vue";

import './static/css/iconfont.css'
import mockUser from './utils/mockUser.js'

export function createApp() {
	const app = createSSRApp(App);
	app.config.globalProperties.$mockUser = mockUser;
	return {
		app,
	};
}
