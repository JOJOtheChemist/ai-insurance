<template>
  <div class="rate-calculator">
    <div class="calculator-header">
      <h2>💰 保险费率计算器</h2>
      <p class="subtitle">选择产品和参数，实时计算保费</p>
    </div>

    <div class="calculator-container">
      <!-- 左侧：产品选择和参数输入 -->
      <div class="input-section">
        <div class="card">
          <h3>📋 产品选择</h3>
          
          <!-- 产品选择 -->
          <div class="form-group">
            <label>选择产品</label>
            <select v-model="selectedProduct" @change="onProductChange" class="form-control">
              <option value="">-- 请选择产品 --</option>
              <option v-for="product in products" :key="product.product_name" :value="product.product_name">
                {{ product.product_name }}
              </option>
            </select>
            <div v-if="selectedProduct && productOptions" class="product-info">
              <span class="badge">年龄范围: {{ productOptions.ages ? productOptions.ages[0] : 0 }}-{{ productOptions.ages ? productOptions.ages[productOptions.ages.length - 1] : 0 }}岁</span>
            </div>
          </div>
        </div>

        <div class="card" v-if="selectedProduct && productOptions">
          <h3>👤 投保信息</h3>
          
          <!-- 年龄选择 -->
          <div class="form-group">
            <label>年龄</label>
            <select v-model.number="formData.age" class="form-control">
              <option value="">-- 请选择年龄 --</option>
              <option v-for="age in productOptions.ages" :key="age" :value="age">
                {{ age }}岁
              </option>
            </select>
          </div>

          <!-- 性别选择 -->
          <div class="form-group">
            <label>性别</label>
            <div class="radio-group">
              <label v-for="gender in productOptions.genders" :key="gender" class="radio-label">
                <input type="radio" v-model="formData.gender" :value="gender" />
                {{ gender }}
              </label>
            </div>
          </div>

          <!-- 缴费期限 -->
          <div class="form-group">
            <label>缴费期限</label>
            <select v-model.number="formData.premium_term" class="form-control">
              <option value="">-- 请选择缴费期限 --</option>
              <option v-for="term in productOptions.premium_terms" :key="term" :value="term">
                {{ term }}年
              </option>
            </select>
          </div>

          <!-- 健康状况 -->
          <div class="form-group" v-if="productOptions.health_statuses && productOptions.health_statuses.length > 1">
            <label>健康状况</label>
            <select v-model="formData.health_status" class="form-control">
              <option v-for="status in productOptions.health_statuses" :key="status" :value="status">
                {{ status === 'standard' ? '标准体' : '非标准体' }}
              </option>
            </select>
          </div>

          <!-- 计划类型 -->
          <div class="form-group" v-if="productOptions.plans && productOptions.plans.length > 0">
            <label>计划类型</label>
            <select v-model="formData.plan" class="form-control">
              <option value="">-- 请选择计划 --</option>
              <option v-for="plan in productOptions.plans" :key="plan" :value="plan">
                计划{{ plan }}
              </option>
            </select>
          </div>

          <!-- 保额输入 -->
          <div class="form-group">
            <label>保险金额（元）</label>
            <input 
              type="number" 
              v-model.number="formData.coverage_amount" 
              class="form-control"
              placeholder="请输入保险金额"
              step="10000"
              min="10000"
            />
            <div class="amount-suggestions">
              <button 
                v-for="amount in suggestedAmounts" 
                :key="amount"
                @click="formData.coverage_amount = amount"
                class="suggestion-btn"
              >
                {{ formatAmount(amount) }}
              </button>
            </div>
          </div>

          <!-- 计算按钮 -->
          <button 
            @click="calculatePremium" 
            class="btn-calculate"
            :disabled="!canCalculate || loading"
          >
            {{ loading ? '计算中...' : '💰 计算保费' }}
          </button>
        </div>
      </div>

      <!-- 右侧：计算结果 -->
      <div class="result-section">
        <div class="card result-card" v-if="calculationResult">
          <h3>📊 保费计算结果</h3>
          
          <div class="result-summary">
            <div class="result-item highlight">
              <div class="result-label">年缴保费</div>
              <div class="result-value">¥{{ formatNumber(calculationResult.annual_premium) }}</div>
            </div>
            <div class="result-item">
              <div class="result-label">总保费</div>
              <div class="result-value">¥{{ formatNumber(calculationResult.total_premium) }}</div>
            </div>
            <div class="result-item">
              <div class="result-label">保险金额</div>
              <div class="result-value">¥{{ formatAmount(calculationResult.coverage_amount) }}</div>
            </div>
          </div>

          <div class="result-details">
            <h4>详细信息</h4>
            <div class="detail-row">
              <span class="detail-label">产品名称：</span>
              <span class="detail-value">{{ calculationResult.product_name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">投保年龄：</span>
              <span class="detail-value">{{ calculationResult.age }}岁</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">性别：</span>
              <span class="detail-value">{{ calculationResult.gender }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">缴费期限：</span>
              <span class="detail-value">{{ calculationResult.premium_term }}年</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">健康状况：</span>
              <span class="detail-value">{{ calculationResult.health_status === 'standard' ? '标准体' : '非标准体' }}</span>
            </div>
            <div class="detail-row" v-if="calculationResult.plan">
              <span class="detail-label">计划类型：</span>
              <span class="detail-value">计划{{ calculationResult.plan }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">费率：</span>
              <span class="detail-value">{{ calculationResult.premium_rate }}</span>
            </div>
          </div>

          <div class="result-chart">
            <h4>缴费时间表</h4>
            <div class="timeline">
              <div 
                v-for="year in Math.min(calculationResult.premium_term, 10)" 
                :key="year"
                class="timeline-item"
              >
                <div class="timeline-year">第{{ year }}年</div>
                <div class="timeline-amount">¥{{ formatNumber(calculationResult.annual_premium) }}</div>
              </div>
              <div v-if="calculationResult.premium_term > 10" class="timeline-item">
                <div class="timeline-year">...</div>
                <div class="timeline-amount">共{{ calculationResult.premium_term }}年</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card placeholder-card" v-else>
          <div class="placeholder-content">
            <div class="placeholder-icon">📊</div>
            <p>请在左侧选择产品并填写投保信息</p>
            <p class="placeholder-hint">计算结果将在这里显示</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      ⚠️ {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'RateCalculator',
  data() {
    return {
      products: [],
      selectedProduct: '',
      productOptions: null,
      formData: {
        age: '',
        gender: '',
        premium_term: '',
        health_status: 'standard',
        plan: '',
        coverage_amount: 500000
      },
      calculationResult: null,
      loading: false,
      error: null,
      suggestedAmounts: [100000, 300000, 500000, 1000000]
    }
  },
  computed: {
    canCalculate() {
      return this.selectedProduct && 
             this.formData.age && 
             this.formData.gender && 
             this.formData.premium_term && 
             this.formData.coverage_amount > 0
    }
  },
  mounted() {
    this.loadProducts()
  },
  methods: {
    async loadProducts() {
      try {
        const response = await fetch('http://localhost:8000/api/rates/products')
        const data = await response.json()
        this.products = data.products
      } catch (err) {
        this.error = '加载产品列表失败: ' + err.message
      }
    },
    async onProductChange() {
      if (!this.selectedProduct) {
        this.productOptions = null
        return
      }
      
      try {
        this.loading = true
        this.error = null
        const response = await fetch(
          `http://localhost:8000/api/rates/${encodeURIComponent(this.selectedProduct)}/options`
        )
        const data = await response.json()
        this.productOptions = data
        
        // 重置表单
        this.formData = {
          age: '',
          gender: data.genders && data.genders.length > 0 ? data.genders[0] : '',
          premium_term: '',
          health_status: 'standard',
          plan: data.plans && data.plans.length > 0 ? data.plans[0] : '',
          coverage_amount: 500000
        }
        this.calculationResult = null
      } catch (err) {
        this.error = '加载产品选项失败: ' + err.message
      } finally {
        this.loading = false
      }
    },
    async calculatePremium() {
      if (!this.canCalculate) return
      
      try {
        this.loading = true
        this.error = null
        
        const requestData = {
          product_name: this.selectedProduct,
          age: this.formData.age,
          gender: this.formData.gender,
          premium_term: this.formData.premium_term,
          health_status: this.formData.health_status,
          plan: this.formData.plan || null,
          coverage_amount: this.formData.coverage_amount
        }
        
        const response = await fetch('http://localhost:8000/api/rates/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || '计算失败')
        }
        
        this.calculationResult = await response.json()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    formatAmount(amount) {
      if (amount >= 10000) {
        return (amount / 10000) + '万'
      }
      return amount.toString()
    },
    formatNumber(num) {
      return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }
}
</script>

<style scoped>
.rate-calculator {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.calculator-header {
  text-align: center;
  margin-bottom: 30px;
}

.calculator-header h2 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #1a1a1a;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.calculator-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.card h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #1a1a1a;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 10px;
}

.card h4 {
  font-size: 16px;
  margin: 20px 0 10px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #4CAF50;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.radio-label input[type="radio"] {
  cursor: pointer;
}

.product-info {
  margin-top: 8px;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 12px;
  font-size: 12px;
}

.amount-suggestions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.suggestion-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.suggestion-btn:hover {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.btn-calculate {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-calculate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn-calculate:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.result-card {
  position: sticky;
  top: 20px;
}

.result-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.result-item {
  text-align: center;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.result-item.highlight {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.result-label {
  font-size: 13px;
  margin-bottom: 8px;
  opacity: 0.9;
}

.result-value {
  font-size: 24px;
  font-weight: 700;
}

.result-details {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.detail-label {
  color: #666;
}

.detail-value {
  font-weight: 600;
  color: #1a1a1a;
}

.timeline {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding: 10px 0;
}

.timeline-item {
  flex-shrink: 0;
  text-align: center;
  padding: 10px 15px;
  background: #f9f9f9;
  border-radius: 6px;
  min-width: 100px;
}

.timeline-year {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.timeline-amount {
  font-size: 14px;
  font-weight: 600;
  color: #4CAF50;
}

.placeholder-card {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  color: #999;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.placeholder-hint {
  font-size: 14px;
  margin-top: 8px;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  background: #ffebee;
  color: #c62828;
  border-radius: 8px;
  border-left: 4px solid #c62828;
}

@media (max-width: 968px) {
  .calculator-container {
    grid-template-columns: 1fr;
  }
  
  .result-summary {
    grid-template-columns: 1fr;
  }
}
</style>
