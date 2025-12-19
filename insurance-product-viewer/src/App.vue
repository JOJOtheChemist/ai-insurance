<template>
  <div id="app">
    <nav class="app-nav">
      <div class="nav-container">
        <h1 class="nav-title">🛡️ AI保典</h1>
        <div class="nav-links">
          <button 
            @click="currentView = 'products'" 
            :class="['nav-link', { active: currentView === 'products' }]"
          >
            📋 产品列表
          </button>
          <button 
            @click="currentView = 'calculator'" 
            :class="['nav-link', { active: currentView === 'calculator' }]"
          >
            💰 费率计算器
          </button>
        </div>
      </div>
    </nav>
    
    <div class="app-content">
      <ProductViewer v-if="currentView === 'products'" />
      <RateCalculator v-if="currentView === 'calculator'" />
    </div>
  </div>
</template>

<script>
import ProductViewer from './ProductViewer.vue'
import RateCalculator from './RateCalculator.vue'

export default {
  name: 'App',
  components: {
    ProductViewer,
    RateCalculator
  },
  data() {
    return {
      currentView: 'products'
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f7fa;
}

#app {
  min-height: 100vh;
}

.app-nav {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-title {
  font-size: 24px;
  color: #1a1a1a;
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 10px;
}

.nav-link {
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
}

.nav-link:hover {
  background: #f5f5f5;
  color: #1a1a1a;
}

.nav-link.active {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.app-content {
  padding: 20px 0;
}
</style>
