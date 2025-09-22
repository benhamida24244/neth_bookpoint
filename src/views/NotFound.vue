<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <router-link to="/">Back to Home</router-link>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'NotFound',
  setup() {
    const { t } = useI18n();
    return { t };
  }
};
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #666;
}

router-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

router-link:hover {
  background-color: #45a049;
}
</style>
