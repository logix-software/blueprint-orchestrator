<template>
  <div v-if="store.result" class="results">

    <div class="results-container">

      <div class="category-box essential">
        <h3 class="category-title">
          <i class="fas fa-star"></i> Competenze essenziali
        </h3>
        <div class="category-content">
          <template v-if="store.result.categorizedSkills.essenziali.length">
            <ul class="item-list">
              <li v-for="(item, idx) in store.result.categorizedSkills.essenziali" 
                  :key="idx">
                {{ item }}
              </li>
            </ul>
          </template>
          <p v-else class="empty-message">Nessuna competenza essenziale trovata</p>
        </div>
      </div>

      <div class="category-box advanced">
        <h3 class="category-title">
          <i class="fas fa-award"></i> Competenze avanzate
        </h3>
        <div class="category-content">
          <template v-if="store.result.categorizedSkills.avanzate.length">
            <ul class="item-list">
              <li v-for="(item, idx) in store.result.categorizedSkills.avanzate" 
                  :key="idx">
                {{ item }}
              </li>
            </ul>
          </template>
          <p v-else class="empty-message">Nessuna competenza avanzata trovata</p>
        </div>
      </div>

      <div class="category-box transversal">
        <h3 class="category-title">
          <i class="fas fa-users"></i> Competenze trasversali
        </h3>
        <div class="category-content">
          <template v-if="store.result.categorizedSkills.trasversali.length">
            <ul class="item-list">
              <li v-for="(item, idx) in store.result.categorizedSkills.trasversali" 
                  :key="idx">
                {{ item }}
              </li>
            </ul>
          </template>
          <p v-else class="empty-message">Nessuna competenza trasversale trovata</p>
        </div>
      </div>

      <div class="category-box emerging">
        <h3 class="category-title">
          <i class="fas fa-rocket"></i> Competenze emergenti
        </h3>
        <div class="category-content">
          <template v-if="store.result.categorizedSkills.emergenti.length">
            <ul class="item-list">
              <li v-for="(item, idx) in store.result.categorizedSkills.emergenti" 
                  :key="idx">
                {{ item }}
              </li>
            </ul>
          </template>
          <p v-else class="empty-message">Nessuna competenza emergente trovata</p>
        </div>
      </div>
    </div>

    <div class="summary-box">
      <h3 class="summary-title">Riepilogo</h3>
      <div class="stat-row">
        <span class="stat-label">Competenze totali:</span>
        <span class="stat-value">{{ totalSkills }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Essenziali:</span>
        <span class="stat-value">{{ store.result.categorizedSkills.essenziali.length }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Avanzate:</span>
        <span class="stat-value">{{ store.result.categorizedSkills.avanzate.length }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Trasversali:</span>
        <span class="stat-value">{{ store.result.categorizedSkills.trasversali.length }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Emergenti:</span>
        <span class="stat-value">{{ store.result.categorizedSkills.emergenti.length }}</span>
      </div>
    </div>
  </div>

  <div v-else-if="store.isLoading" class="loading-container">
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
.results {
  margin-top: 30px;
}

.results-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.category-box {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.category-title {
  padding: 12px 15px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
}

.category-title i {
  margin-right: 8px;
}

.essential .category-title {
  background-color: #4a90e2;
}

.advanced .category-title {
  background-color: #9b59b6;
}

.transversal .category-title {
  background-color: #2ecc71;
}

.emerging .category-title {
  background-color: #f39c12;
}

.category-content {
  padding: 15px;
  min-height: 100px;
  background-color: #fff;
}

.item-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.item-list li {
  padding: 8px 12px;
  margin-bottom: 6px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
}

.empty-message {
  color: #888;
  font-style: italic;
  margin: 15px 0;
}

.summary-box {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.summary-title {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  font-weight: 500;
}

.stat-value {
  font-weight: 600;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 