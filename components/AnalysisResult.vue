<template>
  <div v-if="store.result" class="results-container fade-in">
    <div class="results-grid">
      <div class="category-card essential">
        <div class="category-header">
          <i class="fas fa-star"></i>
          <h3>Competenze essenziali</h3>
        </div>
        <div class="category-content">
          <template v-if="store.result.categorizedSkills.essenziali.length">
            <ul class="skill-list">
              <li v-for="(item, idx) in store.result.categorizedSkills.essenziali" 
                  :key="idx" class="skill-item">
                {{ item }}
              </li>
            </ul>
          </template>
          <p v-else class="empty-message">Nessuna competenza essenziale trovata</p>
        </div>
      </div>

      <div class="category-card advanced">
        <div class="category-header">
          <i class="fas fa-award"></i>
          <h3>Competenze avanzate</h3>
        </div>
        <div class="category-content">
          <template v-if="store.result.categorizedSkills.avanzate.length">
            <ul class="skill-list">
              <li v-for="(item, idx) in store.result.categorizedSkills.avanzate" 
                  :key="idx" class="skill-item">
                {{ item }}
              </li>
            </ul>
          </template>
          <p v-else class="empty-message">Nessuna competenza avanzata trovata</p>
        </div>
      </div>

      <div class="category-card transversal">
        <div class="category-header">
          <i class="fas fa-users"></i>
          <h3>Competenze trasversali</h3>
        </div>
        <div class="category-content">
          <template v-if="store.result.categorizedSkills.trasversali.length">
            <ul class="skill-list">
              <li v-for="(item, idx) in store.result.categorizedSkills.trasversali" 
                  :key="idx" class="skill-item">
                {{ item }}
              </li>
            </ul>
          </template>
          <p v-else class="empty-message">Nessuna competenza trasversale trovata</p>
        </div>
      </div>

      <div class="category-card emerging">
        <div class="category-header">
          <i class="fas fa-rocket"></i>
          <h3>Competenze emergenti</h3>
        </div>
        <div class="category-content">
          <template v-if="store.result.categorizedSkills.emergenti.length">
            <ul class="skill-list">
              <li v-for="(item, idx) in store.result.categorizedSkills.emergenti" 
                  :key="idx" class="skill-item">
                {{ item }}
              </li>
            </ul>
          </template>
          <p v-else class="empty-message">Nessuna competenza emergente trovata</p>
        </div>
      </div>
    </div>

    <div class="summary-card">
      <div class="summary-header">
        <i class="fas fa-chart-pie"></i>
        <h3>Riepilogo</h3>
      </div>
      <div class="summary-content">
        <div class="stat-row">
          <span class="stat-label">Competenze totali:</span>
          <span class="stat-value">{{ totalSkills }}</span>
        </div>
        <div class="stat-grid">
          <div class="stat-item essential">
            <div class="stat-number">{{ store.result.categorizedSkills.essenziali.length }}</div>
            <div class="stat-name">Essenziali</div>
          </div>
          <div class="stat-item advanced">
            <div class="stat-number">{{ store.result.categorizedSkills.avanzate.length }}</div>
            <div class="stat-name">Avanzate</div>
          </div>
          <div class="stat-item transversal">
            <div class="stat-number">{{ store.result.categorizedSkills.trasversali.length }}</div>
            <div class="stat-name">Trasversali</div>
          </div>
          <div class="stat-item emerging">
            <div class="stat-number">{{ store.result.categorizedSkills.emergenti.length }}</div>
            <div class="stat-name">Emergenti</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="store.isLoading" class="loading-container fade-in">
    <div class="loader"></div>
    <p>Analisi in corso...</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAnalyzerStore } from '~/stores/analyzer';

const store = useAnalyzerStore();

const totalSkills = computed(() => {
  if (!store.result) return 0;
  
  const categories = store.result.categorizedSkills;
  return categories.essenziali.length + 
         categories.avanzate.length + 
         categories.trasversali.length + 
         categories.emergenti.length;
});
</script>

<style scoped>
.results-container {
  padding: var(--spacing-lg) 0;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.category-card {
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--box-shadow-elevated);
}

.category-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
}

.category-header i {
  font-size: 18px;
  margin-right: var(--spacing-sm);
}

.essential .category-header i {
  color: var(--primary-color);
}

.advanced .category-header i {
  color: #9b59b6;
}

.transversal .category-header i {
  color: #2ecc71;
}

.emerging .category-header i {
  color: #f39c12;
}

.category-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.category-content {
  padding: var(--spacing-md);
  min-height: 180px;
}

.skill-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-item {
  padding: 8px 12px;
  margin-bottom: 6px;
  background-color: var(--secondary-background);
  border-radius: var(--border-radius);
  font-size: 14px;
  transition: background-color var(--transition-fast);
}

.essential .skill-item:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
}

.advanced .skill-item:hover {
  background-color: rgba(155, 89, 182, 0.1);
}

.transversal .skill-item:hover {
  background-color: rgba(46, 204, 113, 0.1);
}

.emerging .skill-item:hover {
  background-color: rgba(243, 156, 18, 0.1);
}

.empty-message {
  color: var(--text-color-light);
  font-style: italic;
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.summary-card {
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow);
}

.summary-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
}

.summary-header i {
  font-size: 18px;
  margin-right: var(--spacing-sm);
  color: var(--primary-color);
}

.summary-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.summary-content {
  padding: var(--spacing-md);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--spacing-md);
}

.stat-label {
  font-weight: 500;
}

.stat-value {
  font-weight: 600;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  text-align: center;
}

.essential.stat-item {
  background-color: rgba(var(--primary-color-rgb), 0.1);
}

.advanced.stat-item {
  background-color: rgba(155, 89, 182, 0.1);
}

.transversal.stat-item {
  background-color: rgba(46, 204, 113, 0.1);
}

.emerging.stat-item {
  background-color: rgba(243, 156, 18, 0.1);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
}

.stat-name {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-color-light);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) 0;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(var(--primary-color-rgb), 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 