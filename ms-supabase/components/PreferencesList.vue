<template>
  <div class="preferences-section">
    <h2 class="section-title">Preferenze Aziendali</h2>
    <p class="section-description">
      Queste sono le competenze ricercate dall'azienda per categorizzare le skill dei candidati.
    </p>

    <div class="preferences-list">
      <div 
        v-for="(preference, index) in store.preferences" 
        :key="index"
        class="preference-category"
        :class="getCategoryClass(preference.category)"
      >
        <div class="category-header">
          <div class="category-icon">
            <i :class="getCategoryIcon(preference.category)"></i>
          </div>
          <div class="category-info">
            <h3 class="category-title">{{ preference.category }}</h3>
            <p class="category-subtitle">{{ preference.sub_category }}</p>
          </div>
        </div>
        <ul class="category-items">
          <li v-for="(item, itemIndex) in preference.items" :key="itemIndex">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnalyzerStore } from '~/stores/analyzer';

const store = useAnalyzerStore();

function getCategoryClass(category: string): string {
  const categoryMap: Record<string, string> = {
    'Essenziali': 'essential',
    'Avanzate': 'advanced',
    'Trasversali': 'transversal',
    'Emergenti': 'emerging'
  };
  
  return categoryMap[category] || '';
}

function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    'Essenziali': 'fas fa-star',
    'Avanzate': 'fas fa-award',
    'Trasversali': 'fas fa-users',
    'Emergenti': 'fas fa-rocket'
  };
  
  return iconMap[category] || 'fas fa-list';
}
</script>

<style scoped>
.preferences-section {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.section-title {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 12px;
  font-size: 1.5rem;
}

.section-description {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.preferences-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preference-category {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.category-header {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: white;
}

.essential .category-header {
  background-color: #4a90e2;
}

.advanced .category-header {
  background-color: #9b59b6;
}

.transversal .category-header {
  background-color: #2ecc71;
}

.emerging .category-header {
  background-color: #f39c12;
}

.category-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.category-info {
  flex-grow: 1;
}

.category-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.category-subtitle {
  font-size: 0.8rem;
  margin: 0;
  opacity: 0.9;
}

.category-items {
  list-style-type: none;
  padding: 12px 15px;
  margin: 0;
}

.category-items li {
  padding: 6px 0;
  font-size: 0.9rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}

.category-items li:last-child {
  border-bottom: none;
}

.category-items li::before {
  content: "•";
  color: #999;
  margin-right: 8px;
}

@media (max-width: 768px) {
  .preferences-section {
    margin-bottom: 20px;
  }
}
</style> 