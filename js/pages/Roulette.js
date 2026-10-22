import { store } from '../main.js';
import Btn from '../components/Btn.js';

export default {
    components: { Btn },
    template: `
        <main class="page-login" style="display: flex !important; justify-content: center; align-items: center; width: 100%; min-height: 100%; padding: 2rem 0; box-sizing: border-box;">
            <div class="login-card" style="background-color: var(--color-background); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.75rem; padding: 2.5rem; width: 100%; max-width: 24rem; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);">
                <div v-if="!store.user" style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <div>
                        <h1 style="margin: 0 0 0.5rem 0; font-size: 1.75rem;">Sign In</h1>
                        <p class="type-label-md" style="color: #888; margin: 0;">Log into your list profile</p>
                    </div>

                    <form @submit.prevent="login" style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <label for="username" class="type-label-md" style="color: #aaa;">Username</label>
                            <input
                                id="username"
                                type="text"
                                v-model="username"
                                placeholder="Enter username"
                                required
                                style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid rgba(255, 255, 255, 0.15); background: rgba(0, 0, 0, 0.2); color: inherit; font-size: 1rem; outline: none;"
                            />
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <label for="password" class="type-label-md" style="color: #aaa;">Password</label>
                            <input
                                id="password"
                                type="password"
                                v-model="password"
                                placeholder="••••••••"
                                required
                                style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid rgba(255, 255, 255, 0.15); background: rgba(0, 0, 0, 0.2); color: inherit; font-size: 1rem; outline: none;"
                            />
                        </div>

                        <p v-if="error" style="color: var(--color-error); margin: 0; font-size: 0.9rem;">{{ error }}</p>

                        <Btn type="submit" style="margin-top: 0.5rem; width: 100%;">Sign In</Btn>
                    </form>
                </div>

                <div v-else style="display: flex; flex-direction: column; gap: 1.5rem; text-align: center;">
                    <div>
                        <h2 style="margin: 0 0 0.5rem 0;">Logged in as {{ store.user }}</h2>
                        <p class="type-label-md" style="color: #888; margin: 0;">Profile session active</p>
                    </div>
                    <Btn @click.native.prevent="logout" style="background-color: var(--color-error); width: 100%;">Sign Out</Btn>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        username: '',
        password: '',
        error: '',
        store,
    }),
    methods: {
        login() {
            this.error = '';

            if (!this.username.trim() || !this.password.trim()) {
                this.error = 'Please fill out both fields.';
                return;
            }

            store.setUser(this.username.trim());
            this.username = '';
            this.password = '';
        },
        logout() {
            store.setUser(null);
        },
    },
};