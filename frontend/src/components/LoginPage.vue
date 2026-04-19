<template>
  <div class="login-page">
    <div class="auth-card">
      <div class="tabs">
        <button :class="{ active: mode === 'login' }" @click="mode = 'login'">Sign In</button>
        <button :class="{ active: mode === 'register' }" @click="mode = 'register'">Create Account</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="error" class="error-msg">{{ error }}</div>
        <div v-if="success" class="success-msg">{{ success }}</div>

        <label v-if="mode === 'register'">
          Name
          <input v-model="name" type="text" autocomplete="name" required />
        </label>

        <label>
          Email
          <input v-model="email" type="email" autocomplete="email" required />
        </label>

        <label>
          Password
          <input v-model="password" type="password" autocomplete="current-password" required />
        </label>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Please wait…' : (mode === 'login' ? 'Sign In' : 'Create Account') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      mode: 'login',
      email: '',
      password: '',
      name: '',
      error: null,
      success: null,
      loading: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.error = null;
      this.success = null;
      this.loading = true;
      try {
        const endpoint = this.mode === 'login' ? '/api/auth/login' : '/api/auth/register';
        const body = this.mode === 'login'
          ? { email: this.email, password: this.password }
          : { email: this.email, password: this.password, name: this.name };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        });
        const data = await response.json();

        if (!response.ok) {
          this.error = data.error || data.errors?.[0]?.msg || 'Something went wrong.';
          return;
        }

        if (this.mode === 'register') {
          this.success = 'Account created! You can now sign in.';
          this.mode = 'login';
          this.password = '';
          return;
        }

        this.$store.commit('SET_LOGIN_STATUS', true);
        this.$router.push('/my-account');
      } catch (err) {
        this.error = 'Network error. Please try again.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem;
}

.auth-card {
  background: #ECF0F3;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 6px 6px 14px #c8ccd0, -6px -6px 14px #ffffff;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tabs button {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #d9dde1;
  color: #555;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.tabs button.active {
  background: #4a4a6a;
  color: #fff;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.9rem;
  color: #444;
}

input {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #4a4a6a;
}

form > button[type="submit"] {
  padding: 0.75rem;
  background: #4a4a6a;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

form > button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: default;
}

.error-msg {
  color: #c0392b;
  font-size: 0.9rem;
}

.success-msg {
  color: #27ae60;
  font-size: 0.9rem;
}
</style>
