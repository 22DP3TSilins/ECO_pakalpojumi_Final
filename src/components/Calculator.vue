<template>
  <div class="calculator-page">
    <div class="calculator-container">
      <div class="calculator-header">
        <h1>{{ t('calculator.title') }}</h1>
        <p>{{ t('calculator.subtitle') }}</p>
      </div>

      <div class="calculator-content">
        <!-- Category Tabs -->
        <div class="category-tabs">
          <button 
            v-for="(cat, key) in categories" 
            :key="key"
            :class="['tab-btn', { active: activeCategory === key }]"
            @click="activeCategory = key"
          >
            <span class="tab-icon" v-html="cat.icon"></span>
            <span class="tab-label">{{ cat.label }}</span>
          </button>
        </div>

        <!-- Transportation Section -->
        <div v-show="activeCategory === 'transport'" class="category-section">
          <h2>{{ t('calculator.transportation') }}</h2>
          
          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2l1-7h-8l1 7h2m-7 0h2l1-7H3l1 7h2"/><circle cx="6" cy="17" r="2"/><circle cx="18" cy="17" r="2"/></svg>
              </span>
              <div>
                <h3>{{ t('calculator.carTravel') }}</h3>
                <p>{{ t('calculator.carTravelDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.carKm" min="0" max="1000" step="10">
              <div class="input-value">
                <input type="number" v-model.number="inputs.carKm" min="0"> {{ t('calculator.kmWeek') }}
              </div>
            </div>
            <div class="sub-options">
              <label>{{ t('calculator.vehicleType') }}</label>
              <select v-model="inputs.carType">
                <option value="petrol">{{ t('calculator.petrolCar') }}</option>
                <option value="diesel">{{ t('calculator.dieselCar') }}</option>
                <option value="hybrid">{{ t('calculator.hybrid') }}</option>
                <option value="electric">{{ t('calculator.electricCar') }}</option>
              </select>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
              </span>
              <div>
                <h3>{{ t('calculator.airTravel') }}</h3>
                <p>{{ t('calculator.airTravelDesc') }}</p>
              </div>
            </div>
            <div class="flight-inputs">
              <div class="flight-type">
                <label>{{ t('calculator.shortHaul') }}</label>
                <input type="number" v-model.number="inputs.shortFlights" min="0" placeholder="0">
              </div>
              <div class="flight-type">
                <label>{{ t('calculator.mediumHaul') }}</label>
                <input type="number" v-model.number="inputs.mediumFlights" min="0" placeholder="0">
              </div>
              <div class="flight-type">
                <label>{{ t('calculator.longHaul') }}</label>
                <input type="number" v-model.number="inputs.longFlights" min="0" placeholder="0">
              </div>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/><circle cx="8" cy="17" r="1.5"/><circle cx="16" cy="17" r="1.5"/></svg>
              </span>
              <div>
                <h3>{{ t('calculator.publicTransport') }}</h3>
                <p>{{ t('calculator.publicTransportDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.publicTransport" min="0" max="40" step="1">
              <div class="input-value">
                <input type="number" v-model.number="inputs.publicTransport" min="0"> {{ t('calculator.hrsWeek') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Home Energy Section -->
        <div v-show="activeCategory === 'home'" class="category-section">
          <h2>{{ t('calculator.homeEnergy') }}</h2>
          
          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </span>
              <div>
                <h3>{{ t('calculator.electricity') }}</h3>
                <p>{{ t('calculator.electricityDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.electricity" min="0" max="1000" step="10">
              <div class="input-value">
                <input type="number" v-model.number="inputs.electricity" min="0"> {{ t('calculator.kwhMonth') }}
              </div>
            </div>
            <div class="sub-options">
              <label>{{ t('calculator.energySource') }}</label>
              <select v-model="inputs.energySource">
                <option value="mixed">{{ t('calculator.mixedGrid') }}</option>
                <option value="renewable">{{ t('calculator.renewableEnergy') }}</option>
                <option value="coal">{{ t('calculator.coalHeavy') }}</option>
              </select>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v10M18.5 8a6.5 6.5 0 1 1-13 0"/><path d="M12 12v10"/></svg>
              </span>
              <div>
                <h3>{{ t('calculator.heating') }}</h3>
                <p>{{ t('calculator.heatingDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.heating" min="0" max="500" step="10">
              <div class="input-value">
                <input type="number" v-model.number="inputs.heating" min="0"> {{ t('calculator.m3Month') }}
              </div>
            </div>
            <div class="sub-options">
              <label>{{ t('calculator.heatingType') }}</label>
              <select v-model="inputs.heatingType">
                <option value="gas">{{ t('calculator.naturalGas') }}</option>
                <option value="oil">{{ t('calculator.heatingOil') }}</option>
                <option value="electric">{{ t('calculator.electric') }}</option>
                <option value="heatpump">{{ t('calculator.heatPump') }}</option>
                <option value="wood">{{ t('calculator.woodBiomass') }}</option>
              </select>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v6m0 12v2M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M2 12h6m12 0h2M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24"/><circle cx="12" cy="12" r="4"/></svg>
              </span>
              <div>
                <h3>{{ t('calculator.waterUsage') }}</h3>
                <p>{{ t('calculator.waterUsageDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.water" min="0" max="500" step="10">
              <div class="input-value">
                <input type="number" v-model.number="inputs.water" min="0"> {{ t('calculator.lDay') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Food Section -->
        <div v-show="activeCategory === 'food'" class="category-section">
          <h2>{{ t('calculator.foodDiet') }}</h2>
          
          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 11h.01M11 15h.01M16 16a5 5 0 0 0-8-4"/><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
              </span>
              <div>
                <h3>{{ t('calculator.meatConsumption') }}</h3>
                <p>{{ t('calculator.meatConsumptionDesc') }}</p>
              </div>
            </div>
            <div class="meat-types">
              <div class="meat-type">
                <label>{{ t('calculator.beef') }}</label>
                <input type="number" v-model.number="inputs.beef" min="0" max="21" placeholder="0">
              </div>
              <div class="meat-type">
                <label>{{ t('calculator.pork') }}</label>
                <input type="number" v-model.number="inputs.pork" min="0" max="21" placeholder="0">
              </div>
              <div class="meat-type">
                <label>{{ t('calculator.poultry') }}</label>
                <input type="number" v-model.number="inputs.poultry" min="0" max="21" placeholder="0">
              </div>
              <div class="meat-type">
                <label>{{ t('calculator.fish') }}</label>
                <input type="number" v-model.number="inputs.fish" min="0" max="21" placeholder="0">
              </div>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
              </span>
              <div>
                <h3>{{ t('calculator.dairyProducts') }}</h3>
                <p>{{ t('calculator.dairyProductsDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.dairy" min="0" max="10" step="1">
              <div class="input-value">
                <input type="number" v-model.number="inputs.dairy" min="0"> {{ t('calculator.servingsDay') }}
              </div>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 6 20 18 20 19 6 21 6"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              </span>
              <div>
                <h3>{{ t('calculator.foodWaste') }}</h3>
                <p>{{ t('calculator.foodWasteDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.foodWaste" min="0" max="50" step="5">
              <div class="input-value">
                <input type="number" v-model.number="inputs.foodWaste" min="0" max="100">%
              </div>
            </div>
          </div>
        </div>

        <!-- Lifestyle Section -->
        <div v-show="activeCategory === 'lifestyle'" class="category-section">
          <h2>{{ t('calculator.lifestyleShopping') }}</h2>
          
          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
              </span>
              <div>
                <h3>{{ t('calculator.clothing') }}</h3>
                <p>{{ t('calculator.clothingDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.clothing" min="0" max="20" step="1">
              <div class="input-value">
                <input type="number" v-model.number="inputs.clothing" min="0"> {{ t('calculator.itemsMonth') }}
              </div>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              </span>
              <div>
                <h3>{{ t('calculator.onlineShopping') }}</h3>
                <p>{{ t('calculator.onlineShoppingDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.packages" min="0" max="30" step="1">
              <div class="input-value">
                <input type="number" v-model.number="inputs.packages" min="0"> {{ t('calculator.packagesMonth') }}
              </div>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/></svg>
              </span>
              <div>
                <h3>{{ t('calculator.recyclingHabits') }}</h3>
                <p>{{ t('calculator.recyclingHabitsDesc') }}</p>
              </div>
            </div>
            <div class="radio-options">
              <label class="radio-option">
                <input type="radio" v-model="inputs.recycling" value="none">
                <span>{{ t('calculator.none') }}</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="inputs.recycling" value="some">
                <span>{{ t('calculator.someItems') }}</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="inputs.recycling" value="most">
                <span>{{ t('calculator.mostItems') }}</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="inputs.recycling" value="all">
                <span>{{ t('calculator.everythingPossible') }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Calculate Button -->
        <button class="calculate-btn" @click="calculateFootprint">
          {{ t('calculator.calculateBtn') }}
        </button>
      </div>

      <!-- Results Section -->
      <div v-if="showResults" class="results-section">
        <div class="results-header">
          <h2>{{ t('calculator.resultsTitle') }}</h2>
        </div>

        <div class="total-footprint">
          <div class="footprint-circle" :class="footprintLevel">
            <span class="footprint-value">{{ totalFootprint.toFixed(1) }}</span>
            <span class="footprint-unit">{{ t('calculator.tonnesCo2Year') }}</span>
          </div>
          <div class="footprint-comparison">
            <p>{{ footprintMessage }}</p>
            <div class="comparison-bar">
              <div class="bar-fill" :style="{ width: Math.min(totalFootprint / 16 * 100, 100) + '%' }"></div>
              <div class="bar-markers">
                <span class="marker" style="left: 12.5%">2t</span>
                <span class="marker" style="left: 37.5%">6t</span>
                <span class="marker" style="left: 62.5%">10t</span>
                <span class="marker" style="left: 87.5%">14t</span>
              </div>
            </div>
            <div class="bar-labels">
              <span class="label-low">{{ t('calculator.low') }}</span>
              <span class="label-avg">{{ t('calculator.average2') }}</span>
              <span class="label-high">{{ t('calculator.high') }}</span>
            </div>
          </div>
        </div>

        <div class="breakdown-section">
          <h3>{{ t('calculator.breakdownByCategory') }}</h3>
          <div class="breakdown-grid">
            <div class="breakdown-card">
              <div class="breakdown-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2l1-7h-8l1 7h2m-7 0h2l1-7H3l1 7h2"/><circle cx="6" cy="17" r="2"/><circle cx="18" cy="17" r="2"/></svg>
              </div>
              <div class="breakdown-details">
                <span class="breakdown-label">{{ t('calculator.transport') }}</span>
                <span class="breakdown-value">{{ breakdown.transport.toFixed(1) }}t</span>
              </div>
              <div class="breakdown-bar">
                <div class="bar" :style="{ width: (breakdown.transport / totalFootprint * 100) + '%' }"></div>
              </div>
            </div>
            <div class="breakdown-card">
              <div class="breakdown-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div class="breakdown-details">
                <span class="breakdown-label">{{ t('calculator.homeEnergy') }}</span>
                <span class="breakdown-value">{{ breakdown.home.toFixed(1) }}t</span>
              </div>
              <div class="breakdown-bar">
                <div class="bar" :style="{ width: (breakdown.home / totalFootprint * 100) + '%' }"></div>
              </div>
            </div>
            <div class="breakdown-card">
              <div class="breakdown-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
              </div>
              <div class="breakdown-details">
                <span class="breakdown-label">{{ t('calculator.food') }}</span>
                <span class="breakdown-value">{{ breakdown.food.toFixed(1) }}t</span>
              </div>
              <div class="breakdown-bar">
                <div class="bar" :style="{ width: (breakdown.food / totalFootprint * 100) + '%' }"></div>
              </div>
            </div>
            <div class="breakdown-card">
              <div class="breakdown-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              </div>
              <div class="breakdown-details">
                <span class="breakdown-label">{{ t('calculator.lifestyle') }}</span>
                <span class="breakdown-value">{{ breakdown.lifestyle.toFixed(1) }}t</span>
              </div>
              <div class="breakdown-bar">
                <div class="bar" :style="{ width: (breakdown.lifestyle / totalFootprint * 100) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="tips-section">
          <h3>{{ t('calculator.personalizedTips') }}</h3>
          <div class="tips-grid">
            <div v-for="(tip, index) in personalizedTips" :key="index" class="tip-card">
              <span class="tip-icon" v-html="tip.icon"></span>
              <div class="tip-content">
                <h4>{{ tip.title }}</h4>
                <p>{{ tip.description }}</p>
                <span class="tip-savings">{{ t('calculator.saveUpTo') }} {{ tip.savings }}</span>
              </div>
            </div>
          </div>
        </div>

        <button class="recalculate-btn" @click="showResults = false">
          {{ t('calculator.recalculate') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'CarbonCalculator',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      activeCategory: 'transport',
      showResults: false,
      inputs: {
        // Transport
        carKm: 100,
        carType: 'petrol',
        shortFlights: 2,
        mediumFlights: 1,
        longFlights: 0,
        publicTransport: 5,
        // Home
        electricity: 300,
        energySource: 'mixed',
        heating: 100,
        heatingType: 'gas',
        water: 150,
        // Food
        beef: 2,
        pork: 2,
        poultry: 3,
        fish: 1,
        dairy: 3,
        foodWaste: 15,
        // Lifestyle
        clothing: 3,
        packages: 5,
        recycling: 'some'
      },
      totalFootprint: 0,
      breakdown: {
        transport: 0,
        home: 0,
        food: 0,
        lifestyle: 0
      },
      personalizedTips: []
    }
  },
  computed: {
    categories() {
      return {
        transport: { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2l1-7h-8l1 7h2m-7 0h2l1-7H3l1 7h2"/><circle cx="6" cy="17" r="2"/><circle cx="18" cy="17" r="2"/></svg>', label: this.t('calculator.transport') },
        home: { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', label: this.t('calculator.home') },
        food: { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>', label: this.t('calculator.food') },
        lifestyle: { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>', label: this.t('calculator.lifestyle') }
      }
    },
    footprintLevel() {
      if (this.totalFootprint < 4) return 'low';
      if (this.totalFootprint < 8) return 'medium';
      if (this.totalFootprint < 12) return 'high';
      return 'very-high';
    },
    footprintMessage() {
      const avg = 8; // Average EU footprint
      const diff = this.totalFootprint - avg;
      if (diff < -4) return this.t('calculator.msgExcellent');
      if (diff < -2) return this.t('calculator.msgGreat');
      if (diff < 2) return this.t('calculator.msgAverage');
      if (diff < 4) return this.t('calculator.msgAbove');
      return this.t('calculator.msgHigh');
    }
  },
  methods: {
    calculateFootprint() {
      // Transport calculations (tonnes CO2/year)
      const carEmissions = {
        petrol: 0.21, diesel: 0.18, hybrid: 0.12, electric: 0.05
      };
      const carCO2 = (this.inputs.carKm * 52 * carEmissions[this.inputs.carType]) / 1000;
      const flightCO2 = (
        this.inputs.shortFlights * 0.255 +
        this.inputs.mediumFlights * 0.5 +
        this.inputs.longFlights * 1.5
      );
      const publicCO2 = (this.inputs.publicTransport * 52 * 0.089) / 1000;
      this.breakdown.transport = carCO2 + flightCO2 + publicCO2;

      // Home energy calculations
      const electricityMultiplier = {
        mixed: 0.42, renewable: 0.05, coal: 0.82
      };
      const electricityCO2 = (this.inputs.electricity * 12 * electricityMultiplier[this.inputs.energySource]) / 1000;
      
      const heatingMultiplier = {
        gas: 2.0, oil: 2.5, electric: 0.5, heatpump: 0.3, wood: 0.4
      };
      const heatingCO2 = (this.inputs.heating * 12 * heatingMultiplier[this.inputs.heatingType]) / 1000;
      const waterCO2 = (this.inputs.water * 365 * 0.001) / 1000;
      this.breakdown.home = electricityCO2 + heatingCO2 + waterCO2;

      // Food calculations
      const beefCO2 = this.inputs.beef * 52 * 0.027; // 27kg CO2 per kg beef
      const porkCO2 = this.inputs.pork * 52 * 0.012;
      const poultryCO2 = this.inputs.poultry * 52 * 0.007;
      const fishCO2 = this.inputs.fish * 52 * 0.006;
      const dairyCO2 = this.inputs.dairy * 365 * 0.003;
      const wasteFactor = 1 + (this.inputs.foodWaste / 100);
      this.breakdown.food = (beefCO2 + porkCO2 + poultryCO2 + fishCO2 + dairyCO2) * wasteFactor;

      // Lifestyle calculations
      const clothingCO2 = this.inputs.clothing * 12 * 0.025;
      const packagesCO2 = this.inputs.packages * 12 * 0.005;
      const recyclingFactor = {
        none: 1.3, some: 1.1, most: 0.95, all: 0.8
      };
      this.breakdown.lifestyle = (clothingCO2 + packagesCO2) * recyclingFactor[this.inputs.recycling];

      // Total
      this.totalFootprint = this.breakdown.transport + this.breakdown.home + 
                            this.breakdown.food + this.breakdown.lifestyle;

      // Generate personalized tips
      this.generateTips();
      this.showResults = true;
    },
    generateTips() {
      this.personalizedTips = [];
      
      // Transport tips
      if (this.inputs.carType === 'petrol' || this.inputs.carType === 'diesel') {
        if (this.inputs.carKm > 200) {
          this.personalizedTips.push({
            icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2l1-7h-8l1 7h2m-7 0h2l1-7H3l1 7h2"/><circle cx="6" cy="17" r="2"/><circle cx="18" cy="17" r="2"/></svg>',
            title: this.t('calculator.tipCarpool'),
            description: this.t('calculator.tipCarpoolDesc'),
            savings: '2+ ' + this.t('calculator.tonnesYear')
          });
        }
      }
      
      if (this.inputs.longFlights > 1) {
        this.personalizedTips.push({
          icon: '✈️',
          title: this.t('calculator.tipFlights'),
          description: this.t('calculator.tipFlightsDesc'),
          savings: '1.5 ' + this.t('calculator.tonnesPerFlight')
        });
      }

      // Home tips
      if (this.inputs.energySource === 'mixed' || this.inputs.energySource === 'coal') {
        this.personalizedTips.push({
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
          title: this.t('calculator.switchToRenewable'),
          description: this.t('calculator.switchToRenewableDesc'),
          savings: '1-2 ' + this.t('calculator.tonnesYear')
        });
      }

      // Food tips
      if (this.inputs.beef > 3) {
        this.personalizedTips.push({
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"/><path d="m13 12 4-4"/></svg>',
          title: this.t('calculator.tipBeef'),
          description: this.t('calculator.tipBeefDesc'),
          savings: '0.5 ' + this.t('calculator.tonnesYear')
        });
      }

      if (this.inputs.foodWaste > 20) {
        this.personalizedTips.push({
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 6 20 18 20 19 6 21 6"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
          title: this.t('calculator.tipFoodWaste'),
          description: this.t('calculator.tipFoodWasteDesc'),
          savings: '0.3 ' + this.t('calculator.tonnesYear')
        });
      }

      // Lifestyle tips
      if (this.inputs.clothing > 5) {
        this.personalizedTips.push({
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
          title: this.t('calculator.tipClothing'),
          description: this.t('calculator.tipClothingDesc'),
          savings: '0.2 ' + this.t('calculator.tonnesYear')
        });
      }

      if (this.inputs.recycling === 'none' || this.inputs.recycling === 'some') {
        this.personalizedTips.push({
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/></svg>',
          title: this.t('calculator.improveRecycling'),
          description: this.t('calculator.improveRecyclingDesc'),
          savings: '0.3 ' + this.t('calculator.tonnesYear')
        });
      }

      // Always add some general tips if we have few
      if (this.personalizedTips.length < 3) {
        this.personalizedTips.push({
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
          title: this.t('calculator.useLed'),
          description: this.t('calculator.useLedDesc'),
          savings: '0.1 ' + this.t('calculator.tonnesYear')
        });
      }
    }
  }
}
</script>

<style scoped>
.calculator-page {
  min-height: 100vh;
  padding: 100px 20px 60px;
  background: var(--bg-color);
}

.calculator-container {
  max-width: 880px;
  margin: 0 auto;
}

.calculator-header {
  text-align: center;
  margin-bottom: 32px;
}

.calculator-header h1 {
  font-size: 2rem;
  color: var(--text-color);
  margin: 0 0 8px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.calculator-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.calculator-content {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 28px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  padding: 6px;
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.tab-btn:hover {
  background: var(--primary-subtle);
  color: var(--primary);
}

.tab-btn.active {
  background: var(--primary);
  color: white;
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon svg {
  width: 18px;
  height: 18px;
}

/* Category Sections */
.category-section {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.category-section h2 {
  color: var(--text-color);
  margin: 0 0 16px;
  font-size: 1.125rem;
  font-weight: 600;
}

/* Input Cards */
.input-card {
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  padding: 18px;
  margin-bottom: 12px;
  border: 1px solid var(--border-color);
}

.input-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.input-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-subtle);
  border-radius: var(--radius-md);
  color: var(--primary);
}

.input-icon svg {
  width: 22px;
  height: 22px;
}

.input-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 0.95rem;
  font-weight: 500;
}

.input-header p {
  margin: 3px 0 0;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-row input[type="range"] {
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--border-color);
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  position: relative;
}

.input-row input[type="range"]::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 4px;
  background: var(--border-color);
}

.input-row input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 4px var(--primary), 0 2px 6px rgba(0, 0, 0, 0.15);
  border: none;
  margin-top: -5px;
  transition: transform 0.15s, box-shadow 0.15s;
}

.input-row input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 5px var(--primary), 0 3px 8px rgba(0, 0, 0, 0.2);
}

.input-row input[type="range"]::-moz-range-track {
  height: 8px;
  border-radius: 4px;
  background: var(--border-color);
}

.input-row input[type="range"]::-moz-range-progress {
  background: var(--primary);
  height: 8px;
  border-radius: 4px;
}

.input-row input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 4px var(--primary), 0 2px 6px rgba(0, 0, 0, 0.15);
  border: none;
}

.input-value {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 110px;
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.875rem;
}

.input-value input {
  width: 55px;
  padding: 7px 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

.input-value input:focus {
  outline: none;
  border-color: var(--primary);
}

.sub-options {
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.sub-options label {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.sub-options select {
  padding: 7px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.85rem;
  cursor: pointer;
}

.sub-options select:focus {
  outline: none;
  border-color: var(--primary);
}

/* Flight & Meat Inputs */
.flight-inputs, .meat-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.flight-type, .meat-type {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.flight-type label, .meat-type label {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.flight-type input, .meat-type input {
  padding: 9px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.875rem;
  text-align: center;
}

.flight-type input:focus, .meat-type input:focus {
  outline: none;
  border-color: var(--primary);
}

/* Radio Options */
.radio-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-color);
  font-size: 0.85rem;
}

.radio-option:hover {
  border-color: var(--primary);
}

.radio-option input {
  accent-color: var(--primary);
}

.radio-option input:checked + span {
  color: var(--primary);
  font-weight: 500;
}

/* Calculate Button */
.calculate-btn {
  width: 100%;
  padding: 14px;
  margin-top: 24px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.calculate-btn:hover {
  background: var(--primary-dark);
}

/* Results Section */
.results-section {
  margin-top: 32px;
  animation: fadeIn 0.3s ease;
}

.results-header {
  text-align: center;
  margin-bottom: 24px;
}

.results-header h2 {
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 600;
}

.total-footprint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px;
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  margin-bottom: 24px;
}

.footprint-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: white;
}

.footprint-circle.low {
  background: var(--primary);
}

.footprint-circle.medium {
  background: #f59e0b;
}

.footprint-circle.high {
  background: #ef4444;
}

.footprint-circle.very-high {
  background: #7c3aed;
}

.footprint-value {
  font-size: 3rem;
  font-weight: 600;
  line-height: 1;
}

.footprint-unit {
  font-size: 0.85rem;
  opacity: 0.85;
  margin-top: 4px;
}

.footprint-comparison {
  width: 100%;
  max-width: 480px;
  text-align: center;
}

.footprint-comparison p {
  color: var(--text-color);
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.comparison-bar {
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  position: relative;
  overflow: visible;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #f59e0b, #ef4444);
  border-radius: 4px;
  transition: width 0.8s ease;
}

.bar-markers {
  position: absolute;
  top: -22px;
  left: 0;
  right: 0;
}

.marker {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.bar-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.label-low { color: var(--primary); }
.label-avg { color: #f59e0b; }
.label-high { color: #ef4444; }

/* Breakdown Section */
.breakdown-section {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  margin-bottom: 24px;
}

.breakdown-section h3 {
  color: var(--text-color);
  margin: 0 0 16px;
  font-size: 1.125rem;
  font-weight: 600;
}

.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.breakdown-card {
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  padding: 14px;
  border: 1px solid var(--border-color);
}

.breakdown-icon {
  margin-bottom: 8px;
  color: var(--primary);
  display: flex;
  align-items: center;
}

.breakdown-icon svg {
  width: 20px;
  height: 20px;
}

.breakdown-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.breakdown-label {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.breakdown-value {
  color: var(--text-color);
  font-weight: 600;
  font-size: 0.9rem;
}

.breakdown-bar {
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.breakdown-bar .bar {
  height: 100%;
  background: var(--primary);
  border-radius: 3px;
  transition: width 0.8s ease;
}

/* Tips Section */
.tips-section {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  margin-bottom: 24px;
}

.tips-section h3 {
  color: var(--text-color);
  margin: 0 0 16px;
  font-size: 1.125rem;
  font-weight: 600;
}

.tips-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-card {
  display: flex;
  gap: 14px;
  padding: 16px;
  background: var(--primary-subtle);
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
}

.tip-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  flex-shrink: 0;
  color: var(--primary);
}

.tip-content h4 {
  margin: 0 0 4px;
  color: var(--text-color);
  font-size: 0.9rem;
  font-weight: 500;
}

.tip-content p {
  margin: 0 0 8px;
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.4;
}

.tip-savings {
  display: inline-block;
  padding: 3px 8px;
  background: var(--primary);
  color: white;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.recalculate-btn {
  display: block;
  width: 180px;
  margin: 0 auto;
  padding: 12px;
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.recalculate-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Responsive */
@media (max-width: 768px) {
  .calculator-header h1 {
    font-size: 1.5rem;
  }
  
  .category-tabs {
    flex-wrap: wrap;
  }
  
  .tab-btn {
    flex: 1 1 45%;
  }
  
  .tab-label {
    display: none;
  }
  
  .input-row {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .radio-options {
    grid-template-columns: 1fr;
  }
  
  .footprint-circle {
    width: 150px;
    height: 150px;
  }
  
  .footprint-value {
    font-size: 2.25rem;
  }
}
</style>
