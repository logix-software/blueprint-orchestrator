<template>
  <div class="preferences-container">
    <div class="preferences-header">
      <h2 class="preferences-title">Preferenze Aziendali</h2>
      <p class="preferences-subtitle">Categorie utilizzate per classificare le competenze</p>
    </div>

    <div class="preferences-list">
      <div 
        v-for="(preference, index) in store.preferences" 
        :key="index"
        class="preference-card"
        :class="getCategoryClass(preference.category)"
      >
        <div class="preference-header">
          <div class="preference-icon">
            <i :class="getCategoryIcon(preference.category)"></i>
          </div>
          <div class="preference-info">
            <h3>{{ preference.category }}</h3>
            <p>{{ preference.sub_category }}</p>
          </div>
        </div>
        
        <ul class="preference-items">
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
.preferences-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preferences-header {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.preferences-title {
  margin: 0 0 var(--spacing-xs);
  color: var(--text-color);
  font-size: 20px;
}

.preferences-subtitle {
  margin: 0;
  color: var(--text-color-light);
  font-size: 14px;
}

.preferences-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex-grow: 1;
  overflow-y: auto;
}

.preference-card {
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.preference-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--box-shadow-elevated);
}

.preference-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.preference-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: var(--spacing-md);
  font-size: 16px;
}

.essential .preference-icon {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
}

.advanced .preference-icon {
  background-color: rgba(155, 89, 182, 0.1);
  color: #9b59b6;
}

.transversal .preference-icon {
  background-color: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.emerging .preference-icon {
  background-color: rgba(243, 156, 18, 0.1);
  color: #f39c12;
}

.preference-info {
  flex-grow: 1;
}

.preference-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.preference-info p {
  margin: 0;
  font-size: 12px;
  color: var(--text-color-light);
}

.preference-items {
  list-style: none;
  padding: var(--spacing-sm) var(--spacing-md);
  margin: 0;
}

.preference-items li {
  padding: var(--spacing-xs) 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: var(--text-color);
}

.preference-items li::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: var(--spacing-sm);
}

.essential .preference-items li::before {
  background-color: var(--primary-color);
}

.advanced .preference-items li::before {
  background-color: #9b59b6;
}

.transversal .preference-items li::before {
  background-color: #2ecc71;
}

.emerging .preference-items li::before {
  background-color: #f39c12;
}

@media (max-width: 768px) {
  .preferences-container {
    margin-bottom: var(--spacing-lg);
  }
}
</style> 