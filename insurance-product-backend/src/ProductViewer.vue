<template>
  <div class="product-viewer">
    <!-- 导航区域 -->
    <div class="nav-wrapper">
      <!-- 一级分类导航 -->
      <div class="category-nav">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="['cat-btn', { active: currentCategory === cat }]"
          @click="currentCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
      
      <!-- 二级产品导航 -->
      <div class="mock-nav">
        <button
          v-for="(product, index) in filteredProducts"
          :key="product.id"
          :class="['nav-btn', { active: currentProduct?.id === product.id }]"
          @click="selectProduct(product)"
        >
          {{ simplifyName(product.product_name) }}
        </button>
      </div>
    </div>

    <!-- 产品详情 -->
    <div v-if="currentProduct">
      <!-- 头部 -->
      <header class="header" :style="{ background: headerGradient }">
        <div class="tag">{{ currentProduct.product_type }}</div>
        <h1 class="product-title">{{ currentProduct.product_name }}</h1>
        <div class="company-name">🛡️ {{ currentProduct.company_name }}</div>
        <p class="product-desc">{{ currentProduct.description }}</p>

        <!-- 关键指标 -->
        <div class="metrics-container">
          <div
            v-for="(h, index) in extendInfo.highlights"
            :key="index"
            class="metric-card"
          >
            <div class="metric-value">{{ h.value }}</div>
            <div class="metric-label">{{ h.label }}</div>
          </div>
        </div>
      </header>

      <div class="container">
        <!-- 产品标签 -->
        <div class="section has-data">
          <div class="tags-list">
            <span v-for="tag in parsedTags" :key="tag" class="info-tag">
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- 投保规则 -->
        <div class="section has-data">
          <h3 class="section-title">投保规则</h3>
          <div class="rules-grid">
            <div class="rule-item">
              <h4>投保年龄</h4>
              <p>{{ currentProduct.age_range }}</p>
            </div>
            <div class="rule-item">
              <h4>保障期限</h4>
              <p>{{ formatInsurancePeriod(currentProduct.insurance_period) }}</p>
            </div>
            <div class="rule-item">
              <h4>缴费年限 <span class="tooltip">?<span class="tooltip-text">需要连续交纳保费的年数</span></span></h4>
              <p>{{ currentProduct.payment_period }}</p>
            </div>
            <div class="rule-item">
              <h4>等待期 <span class="tooltip">?<span class="tooltip-text">投保后需要等待一段时间，保障才正式生效</span></span></h4>
              <p>{{ currentProduct.waiting_period }}</p>
            </div>
          </div>
        </div>

        <!-- 核心保障权益 -->
        <div v-if="hasStructuredFeatures || hasCoverageList" class="section has-data">
          <h3 class="section-title">核心保障权益</h3>
          
          <!-- 结构化参数展示 -->
          <div v-if="extendInfo.medical_features" v-html="renderStructuredFeatures(extendInfo.medical_features, 'medical')"></div>
          <div v-else-if="extendInfo.illness_features" v-html="renderStructuredFeatures(extendInfo.illness_features, 'illness')"></div>
          <div v-else-if="extendInfo.pension_features" v-html="renderStructuredFeatures(extendInfo.pension_features, 'pension')"></div>
          <div v-else-if="extendInfo.life_features" v-html="renderStructuredFeatures(extendInfo.life_features, 'life')"></div>
          <div v-else-if="extendInfo.accident_features" v-html="renderStructuredFeatures(extendInfo.accident_features, 'accident')"></div>

          <!-- 详细权益列表 (可展开表格) -->
          <div v-if="hasCoverageList" class="coverage-details" style="margin-top: 20px; border-top: 1px dashed #eee; pt-4">
            <div 
              class="subtitle-row" 
              @click="isCoverageExpanded = !isCoverageExpanded"
              style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 10px 0;"
            >
              <h4 style="font-size: 15px; font-weight: 700; color: #333; margin: 0;">📋 保障权益解读</h4>
              <span style="font-size: 12px; color: #999;">{{ isCoverageExpanded ? '收起' : '展开' }} <i :class="isCoverageExpanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i></span>
            </div>
            
            <div v-show="isCoverageExpanded" style="background: #F9FAFB; border-radius: 8px; overflow: hidden; margin-top: 10px;">
              <table class="dynamic-table" style="font-size: 13px;">
                <thead>
                  <tr style="background: #f0f0f0;">
                    <th style="padding: 10px; text-align: left; width: 25%;">权益项目</th>
                    <th style="padding: 10px; text-align: left;">具体解读</th>
                    <th style="padding: 10px; text-align: center; width: 50px;">包含</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in extendInfo.coverage_list" :key="index" style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px; font-weight: 600; color: #333;">
                      <span style="margin-right: 5px;">{{ item.icon }}</span>{{ item.title }}
                    </td>
                    <td style="padding: 10px; color: #666; line-height: 1.5; position: relative;">
                      <div style="display: inline;">
                        {{ item.desc.length > 50 ? item.desc.substring(0, 50) + '...' : item.desc }}
                        <button 
                          v-if="item.desc.length > 50" 
                          @click="showDescModal(item.desc)"
                          style="color: #1890ff; background: none; border: none; cursor: pointer; padding: 0; margin-left: 5px; font-size: 12px; text-decoration: underline;"
                        >
                          查看全部
                        </button>
                      </div>
                    </td>
                    <td style="padding: 10px; text-align: center;">
                      <span :style="{ color: item.value === '可选' ? '#999' : themeColor, fontWeight: 'bold' }">
                        {{ item.value === '✅' ? '✔' : item.value }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- 疾病列表弹窗 -->
            <div v-if="illnessListModal" @click="illnessListModal = false" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
              <div @click.stop style="background: white; border-radius: 12px; padding: 24px; max-width: 600px; width: 90%; max-height: 70vh; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <h3 style="margin: 0; font-size: 16px; color: #333;">📋 {{ illnessListTitle }}</h3>
                  <button @click="illnessListModal = false" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999; line-height: 1;">&times;</button>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  <span v-for="(item, idx) in illnessListContent" :key="idx" style="background: #F3F4F6; color: #333; padding: 6px 12px; border-radius: 4px; font-size: 13px;">
                    {{ idx + 1 }}. {{ item }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 描述弹窗 -->
            <div v-if="expandedDescModal" @click="expandedDescModal = false" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
              <div @click.stop style="background: white; border-radius: 12px; padding: 24px; max-width: 600px; width: 90%; max-height: 70vh; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <h3 style="margin: 0; font-size: 16px; color: #333;">📋 详细内容</h3>
                  <button @click="expandedDescModal = false" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999; line-height: 1;">&times;</button>
                </div>
                <div style="color: #666; line-height: 1.8; font-size: 14px; word-break: break-all;">
                  {{ selectedDesc }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 费率/利益演示 -->
        <div v-if="extendInfo.table_data" class="section has-data">
          <h3 class="section-title">{{ extendInfo.table_data.title }}</h3>
          <div style="background: #F9FAFB; border-radius: 8px; overflow: hidden;">
            <table class="dynamic-table">
              <thead>
                <tr>
                  <th v-for="(header, index) in extendInfo.table_data.headers" :key="index">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in extendInfo.table_data.rows" :key="index">
                  <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 责任免除 -->
        <div class="section has-data">
          <h3 class="section-title">重要提示</h3>
          <div class="exclusion-box">
            <strong>⚠️ 责任免除 / 特别约定</strong>
            <ul>
              <li v-for="(item, index) in parsedExclusions" :key="index">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 底部导航 -->
      <nav class="bottom-nav">
        <button class="btn btn-outline">🤖 AI 顾问</button>
        <button class="btn btn-outline" @click="viewPDF">📖 查看条款</button>
        <button class="btn btn-primary">📄 生成计划书</button>
      </nav>
    </div>
  </div>
</template>

<script>
import { MEDICAL_LABELS, ILLNESS_LABELS, PENSION_LABELS, LIFE_LABELS, ACCIDENT_LABELS } from './config/labels'

export default {
  name: 'ProductViewer',
  data() {
    return {
      products: [],
      loading: true,
      error: null,
      isCoverageExpanded: true,
      currentCategory: '',
      currentProduct: null,
      expandedDescModal: false,
      illnessListModal: false,
      illnessListTitle: '',
      illnessListContent: [],
      selectedDesc: null,
      TYPE_MAPPING: {
        '意外险': '意外保障',
        '年金险': '养老/年金',
        '养老年金保险': '养老/年金',
        '医疗险': '医疗/癌症',
        '护理险': '医疗/癌症',
        '高端医疗': '医疗/癌症',
        '两全保险': '人寿保障',
        '终身寿险': '人寿保障',
        '定期寿险': '人寿保障',
        '重疾险': '重疾保障',
        '疾病保险': '重疾保障'
      }
    }
  },
  computed: {
    categories() {
      const cats = new Set()
      this.products.forEach(p => cats.add(this.getCategory(p)))
      const ORDER = ['医疗/癌症', '重疾保障', '养老/年金', '人寿保障', '意外保障', '其他']
      return Array.from(cats).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b))
    },
    filteredProducts() {
      return this.products.filter(p => this.getCategory(p) === this.currentCategory)
    },
    extendInfo() {
      return this.currentProduct?.extend_info || {}
    },
    themeColor() {
      return this.extendInfo.theme_color || '#D31145'
    },
    headerGradient() {
      return `linear-gradient(135deg, #1A1A1A 0%, #2c2c2c 100%)`
    },
    parsedTags() {
      const tags = this.currentProduct?.tags
      if (!tags) return []
      if (typeof tags === 'string') {
        if (tags.startsWith('[')) {
          try {
            return JSON.parse(tags.replace(/'/g, '"'))
          } catch {
            const matches = tags.match(/'([^']+)'/g)
            return matches ? matches.map(s => s.slice(1, -1)) : []
          }
        }
        return tags.split(/,|，| /).filter(t => t.trim())
      }
      return Array.isArray(tags) ? tags : []
    },
    parsedExclusions() {
      const exclusions = this.currentProduct?.exclusions
      if (!exclusions) return []
      if (typeof exclusions === 'string') {
        if (exclusions.startsWith('[')) {
          try {
            return JSON.parse(exclusions.replace(/'/g, '"'))
          } catch {
            const matches = exclusions.match(/'([^']+)'/g)
            return matches ? matches.map(s => s.slice(1, -1).replace(/^[•·\s]+/, '')) : []
          }
        }
        return exclusions.split(/;|；/).filter(e => e.trim())
      }
      return Array.isArray(exclusions) ? exclusions.map(e => e.replace(/^[•·\s]+/, '')) : []
    },
    hasStructuredFeatures() {
      return this.extendInfo.medical_features || 
             this.extendInfo.illness_features || 
             this.extendInfo.pension_features || 
             this.extendInfo.life_features || 
             this.extendInfo.accident_features
    },
    hasCoverageList() {
      return this.extendInfo.coverage_list && this.extendInfo.coverage_list.length > 0
    }
  },
  async mounted() {
    // Expose method to global scope for HTML string onclick
    window.showIllnessList = (title, listJson) => {
      // Decode HTML entities if necessary
      const decodedJson = listJson.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      this.showIllnessList(title, decodedJson);
    };

    await this.loadProducts()
    
    this.currentCategory = this.categories[0]
    if (this.filteredProducts.length > 0) {
      this.selectProduct(this.filteredProducts[0])
    }
  },
  watch: {
    currentCategory() {
      if (this.filteredProducts.length > 0) {
        this.selectProduct(this.filteredProducts[0])
      }
    },
    themeColor(newColor) {
      document.documentElement.style.setProperty('--primary-color', newColor)
    }
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        const response = await fetch('http://localhost:8000/api/products')
        if (!response.ok) {
          throw new Error('加载产品列表失败')
        }
        this.products = await response.json()
      } catch (err) {
        this.error = '加载产品失败: ' + err.message
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    getCategory(item) {
      const type = item?.product_type || ''
      return this.TYPE_MAPPING[type] || '其他'
    },
    selectProduct(product) {
      this.currentProduct = product
    },
    simplifyName(name) {
      return name.replace('友邦', '').replace('保险', '')
    },
    formatInsurancePeriod(text) {
      if (!text) return '--'
      let newText = text.replace(/(\d+)[、，,\s]+(\d+)[、，,\s]+[\d、，,\s]*(\d+)/g, (match) => {
        const nums = match.match(/\d+/g).map(Number)
        if (nums.length > 2) {
          nums.sort((a, b) => a - b)
          return `${nums[0]}-${nums[nums.length - 1]}`
        }
        return match
      })
      return newText.replace(/共\s*\d+\s*种/, '')
    },
    hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r},${g},${b},${alpha})`
    },
    escapeHtml(text) {
      return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    renderStructuredFeatures(features, type) {
      let labelsConfig
      if (type === 'medical') {
        labelsConfig = MEDICAL_LABELS
      } else if (type === 'illness') {
        labelsConfig = ILLNESS_LABELS
      } else if (type === 'pension') {
        labelsConfig = PENSION_LABELS
      } else if (type === 'life') {
        labelsConfig = LIFE_LABELS
      } else if (type === 'accident') {
        labelsConfig = ACCIDENT_LABELS
      } else {
        return ''
      }
      let html = ''
      
      for (const key in labelsConfig) {
        const config = labelsConfig[key]
        const data = features[key]
        
        if (!data) continue
        
        html += `<div style="margin-bottom: 20px;">`
        html += `<h4 style="font-size: 15px; font-weight: 700; color: #333; margin-bottom: 10px; border-left: 3px solid #D31145; padding-left: 8px;">${config.title}</h4>`
        
        if (config.is_list) {
          if (Array.isArray(data) && data.length > 0) {
            html += `<div style="display: flex; gap: 8px; flex-wrap: wrap;">`
            html += data.map(item => `<span style="background: #FFF5F7; color: #D31145; padding: 4px 10px; border-radius: 4px; font-size: 13px;">${item}</span>`).join('')
            html += `</div>`
          }
        } else {
          html += `<table class="dynamic-table" style="font-size: 13px;"><tbody>`
          for (const fieldKey in config.fields) {
            if (data[fieldKey]) {
              let value = data[fieldKey];
              let isClickable = false;
              let listData = [];

              if (fieldKey === 'disease_count' && data.disease_list) {
                isClickable = true;
                listData = data.disease_list;
              } else if (fieldKey === 'medium_count' && data.medium_list) {
                isClickable = true;
                listData = data.medium_list;
              } else if (fieldKey === 'light_count' && data.light_list) {
                isClickable = true;
                listData = data.light_list;
              }

              html += `<tr>
                <td style="width: 40%; color: #666; background: #FAFAFA;">${config.fields[fieldKey]}</td>
                <td style="font-weight: 600;">
                  ${value}
                  ${isClickable ? `<button onclick="window.showIllnessList('${config.fields[fieldKey]}', '${this.escapeHtml(JSON.stringify(listData))}')" style="margin-left: 5px; color: #1890ff; border: none; background: none; cursor: pointer; text-decoration: underline; font-size: 12px;">查看列表</button>` : ''}
                </td>
              </tr>`
            }
          }
          html += `</tbody></table>`
        }
        
        html += `</div>`
      }
      return html
    },
    showIllnessList(title, listJson) {
      try {
        this.illnessListTitle = title;
        this.illnessListContent = JSON.parse(listJson);
        this.illnessListModal = true;
      } catch (e) {
        console.error('Error parsing illness list', e);
      }
    },
    viewPDF() {
      const pdfUrl = this.extendInfo.pdf_url
      if (!pdfUrl || pdfUrl === '#') {
        alert('暂无条款文件预览')
      } else {
        window.open(pdfUrl, '_blank')
      }
    },
    showDescModal(desc) {
      this.selectedDesc = desc
      this.expandedDescModal = true
    }
  }
}
</script>

<style scoped>
/* 引入你原来的 CSS 样式,这里省略... */
/* 建议把样式单独放到一个 .css 文件中导入 */
</style>
