import routes from './routes.js';

export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    user: localStorage.getItem('list_user') || null,

    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },
    setUser(username) {
        this.user = username;
        if (username) {
            localStorage.setItem('list_user', username);
        } else {
            localStorage.removeItem('list_user');
        }
    },
});

const app = Vue.createApp({
    data: () => ({ store }),
});

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

app.use(router);

app.mount('#app');