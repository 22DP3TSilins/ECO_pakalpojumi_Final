<template>
  <div class="calculator-page">
    <div class="calculator-container">

      <!-- Hero Header -->
      <div class="calc-hero">
        <div class="calc-hero-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>
          CO₂
        </div>
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
          <div class="section-title-row">
            <span class="section-step">01</span>
            <h2>{{ t('calculator.transportation') }}</h2>
          </div>
          
          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2l1-7h-8l1 7h2m-7 0h2l1-7H3l1 7h2"/><circle cx="6" cy="17" r="2"/><circle cx="18" cy="17" r="2"/></svg>
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/><circle cx="8" cy="17" r="1.5"/><circle cx="16" cy="17" r="1.5"/></svg>
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
          <div class="section-title-row">
            <span class="section-step">02</span>
            <h2>{{ t('calculator.homeEnergy') }}</h2>
          </div>
          
          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v10M18.5 8a6.5 6.5 0 1 1-13 0"/><path d="M12 12v10"/></svg>
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v6m0 12v2M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M2 12h6m12 0h2M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24"/><circle cx="12" cy="12" r="4"/></svg>
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
          <div class="section-title-row">
            <span class="section-step">03</span>
            <h2>{{ t('calculator.foodDiet') }}</h2>
          </div>
          
          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 11h.01M11 15h.01M16 16a5 5 0 0 0-8-4"/><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 6 20 18 20 19 6 21 6"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
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
          <div class="section-title-row">
            <span class="section-step">04</span>
            <h2>{{ t('calculator.lifestyleShopping') }}</h2>
          </div>
          
          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/></svg>
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/></svg>
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

      <!-- Methodology Section -->
      <div class="methodology-section">
        <button class="methodology-toggle" @click="showMethodology = !showMethodology">
          <div class="methodology-toggle-left">
            <span class="methodology-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            </span>
            <span>{{ t('calculator.methodologyTitle') }}</span>
          </div>
          <svg class="chevron" :class="{ open: showMethodology }" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>

        <div v-show="showMethodology" class="methodology-body">
          <p class="methodology-intro">{{ t('calculator.methodologyDesc') }}</p>
          <div class="methodology-grid">
            <div class="methodology-card">
              <div class="methodology-card-icon"><Icon name="car" :size="32" /></div>
              <h4>{{ t('calculator.methodologyTransportTitle') }}</h4>
              <p>{{ t('calculator.methodologyTransportText') }}</p>
            </div>
            <div class="methodology-card">
              <div class="methodology-card-icon"><Icon name="home" :size="32" /></div>
              <h4>{{ t('calculator.methodologyHomeTitle') }}</h4>
              <p>{{ t('calculator.methodologyHomeText') }}</p>
            </div>
            <div class="methodology-card">
              <div class="methodology-card-icon"><Icon name="leaf" :size="32" /></div>
              <h4>{{ t('calculator.methodologyFoodTitle') }}</h4>
              <p>{{ t('calculator.methodologyFoodText') }}</p>
            </div>
            <div class="methodology-card">
              <div class="methodology-card-icon"><Icon name="bag" :size="32" /></div>
              <h4>{{ t('calculator.methodologyLifestyleTitle') }}</h4>
              <p>{{ t('calculator.methodologyLifestyleText') }}</p>
            </div>
          </div>
          <p class="methodology-sources">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            {{ t('calculator.methodologySources') }}
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import Icon from './common/Icon.vue'

export default {
  name: 'CarbonCalculator',
  components: { Icon },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      activeCategory: 'transport',
      showResults: false,
      showMethodology: false,
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
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>',
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
  padding: 80px 20px 60px;
  background: var(--bg-color);
  animation: pageFadeIn 0.5s ease;
}

@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.calculator-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===== HERO HEADER ===== */
.calc-hero {
  text-align: center;
  padding: 48px 32px 40px;
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.calc-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, var(--primary-subtle) 0%, transparent 65%);
  pointer-events: none;
}

.calc-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--primary-subtle);
  color: var(--primary);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 16px;
  border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
}

.calc-hero h1 {
  font-size: 2.2rem;
  color: var(--text-color);
  margin: 0 0 10px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.calc-hero p {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ===== CALCULATOR CONTENT ===== */
.calculator-content {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 28px;
  padding: 5px;
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 14px;
  border: none;
  background: transparent;
  border-radius: calc(var(--radius-lg) - 3px);
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
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  color: white;
  box-shadow: 0 2px 8px rgba(46, 204, 113, 0.25);
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Section Title Row */
.section-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-step {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--primary);
  background: var(--primary-subtle);
  padding: 4px 8px;
  border-radius: 6px;
}

.section-title-row h2 {
  color: var(--text-color);
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Category Section animation */
.category-section {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Input Cards */
.input-card {
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 14px;
  border: 1px solid var(--border-color);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.input-card:last-of-type {
  margin-bottom: 0;
}

.input-card:hover {
  box-shadow: 0 4px 16px rgba(46, 204, 113, 0.07);
  border-color: color-mix(in srgb, var(--primary) 25%, var(--border-color));
}

.input-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
}

.input-icon {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-subtle);
  border-radius: var(--radius-md);
  color: var(--primary);
}

.input-header h3 {
  margin: 0 0 3px;
  color: var(--text-color);
  font-size: 0.93rem;
  font-weight: 600;
}

.input-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.4;
}

/* Range + value row */
.input-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.input-row input[type="range"] {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--border-color);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.input-row input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 3px var(--primary), 0 2px 6px rgba(0,0,0,0.12);
  border: none;
  margin-top: -6px;
  transition: transform 0.15s, box-shadow 0.15s;
}

.input-row input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.input-row input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 3px var(--primary), 0 2px 6px rgba(0,0,0,0.12);
  border: none;
}

.input-row input[type="range"]::-moz-range-progress {
  background: var(--primary);
  height: 6px;
  border-radius: 3px;
}

.input-value {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 110px;
  color: var(--text-secondary);
  font-size: 0.82rem;
  white-space: nowrap;
}

.input-value input {
  width: 54px;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
}

.input-value input:focus {
  outline: none;
  border-color: var(--primary);
}

/* Sub options */
.sub-options {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sub-options label {
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.sub-options select {
  padding: 7px 28px 7px 11px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.84rem;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%232ecc71' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.sub-options select:focus {
  outline: none;
  border-color: var(--primary);
}

/* Flight & Meat Inputs */
.flight-inputs, .meat-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
}

.flight-type, .meat-type {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.flight-type label, .meat-type label {
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 500;
}

.flight-type input, .meat-type input {
  padding: 9px 10px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  transition: border-color 0.2s;
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
  font-size: 0.84rem;
}

.radio-option:hover {
  border-color: var(--primary);
  background: var(--primary-subtle);
}

.radio-option input {
  accent-color: var(--primary);
}

.radio-option input:checked + span {
  color: var(--primary);
  font-weight: 600;
}

/* Calculate Button */
.calculate-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  margin-top: 28px;
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.97rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.01em;
}

.calculate-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
  transform: skewX(-25deg);
  transition: left 0.5s ease;
}

.calculate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(46, 204, 113, 0.35);
}

.calculate-btn:hover::after {
  left: 100%;
}

/* ===== RESULTS SECTION ===== */
.results-section {
  animation: fadeIn 0.35s ease;
}

.results-header {
  text-align: center;
  margin-bottom: 20px;
}

.results-header h2 {
  color: var(--text-color);
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.total-footprint {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 32px;
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  margin-bottom: 20px;
}

.footprint-circle {
  width: 160px;
  height: 160px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  color: white;
  box-shadow: 0 8px 32px rgba(46, 204, 113, 0.3);
}

.footprint-circle.medium {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.3);
}

.footprint-circle.high {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
}

.footprint-circle.very-high {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.3);
}

.footprint-value {
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1;
}

.footprint-unit {
  font-size: 0.75rem;
  opacity: 0.88;
  margin-top: 5px;
  text-align: center;
  padding: 0 8px;
}

.footprint-comparison {
  flex: 1;
}

.footprint-comparison p {
  color: var(--text-color);
  margin: 0 0 18px;
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1.5;
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
  transition: width 0.8s cubic-bezier(.4,0,.2,1);
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

.label-low { color: var(--primary); font-weight: 600; }
.label-avg { color: #f59e0b; font-weight: 600; }
.label-high { color: #ef4444; font-weight: 600; }

/* Breakdown */
.breakdown-section {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 26px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  margin-bottom: 20px;
}

.breakdown-section h3 {
  color: var(--text-color);
  margin: 0 0 18px;
  font-size: 1rem;
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
  padding: 16px;
  border: 1px solid var(--border-color);
  transition: all 0.25s ease;
}

.breakdown-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.1);
}

.breakdown-icon {
  margin-bottom: 10px;
  color: var(--primary);
  display: flex;
}

.breakdown-details {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
  gap: 4px;
}

.breakdown-label {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.breakdown-value {
  color: var(--text-color);
  font-weight: 700;
  font-size: 1rem;
}

.breakdown-bar {
  height: 5px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.breakdown-bar .bar {
  height: 100%;
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(.4,0,.2,1);
}

/* Tips */
.tips-section {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 26px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  margin-bottom: 20px;
}

.tips-section h3 {
  color: var(--text-color);
  margin: 0 0 18px;
  font-size: 1rem;
  font-weight: 600;
}

.tips-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-card {
  display: flex;
  gap: 14px;
  padding: 16px;
  background: var(--primary-subtle);
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in srgb, var(--primary) 15%, transparent);
}

.tip-icon {
  width: 42px;
  height: 42px;
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
  font-weight: 600;
}

.tip-content p {
  margin: 0 0 8px;
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.45;
}

.tip-savings {
  display: inline-block;
  padding: 3px 10px;
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  color: white;
  border-radius: 999px;
  font-size: 0.73rem;
  font-weight: 600;
}

.recalculate-btn {
  display: block;
  width: 180px;
  margin: 0 auto;
  padding: 11px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  cursor: pointer;
  transition: var(--transition);
}

.recalculate-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-subtle);
}

/* ===== METHODOLOGY SECTION ===== */
.methodology-section {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.methodology-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.95rem;
  font-weight: 600;
  transition: background 0.15s;
  text-align: left;
}

.methodology-toggle:hover {
  background: var(--primary-subtle);
}

.methodology-toggle-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.methodology-icon {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-subtle);
  border-radius: var(--radius-md);
  color: var(--primary);
  flex-shrink: 0;
}

.chevron {
  transition: transform 0.25s ease;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.chevron.open {
  transform: rotate(180deg);
}

.methodology-body {
  padding: 0 24px 28px;
  animation: fadeIn 0.2s ease;
}

.methodology-intro {
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0 0 20px;
  padding-top: 4px;
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
}

.methodology-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.methodology-card {
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  padding: 18px;
  border: 1px solid var(--border-color);
}

.methodology-card-icon {
  font-size: 1.6rem;
  margin-bottom: 10px;
  line-height: 1;
}

.methodology-card h4 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 0.88rem;
  font-weight: 600;
}

.methodology-card p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.55;
}

.methodology-sources {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.76rem;
  line-height: 1.5;
  padding: 14px 16px;
  background: var(--bg-color);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.methodology-sources svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--primary);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .calculator-page {
    padding: 72px 16px 48px;
  }

  .calc-hero {
    padding: 36px 20px 28px;
  }

  .calc-hero h1 {
    font-size: 1.7rem;
  }

  .calculator-content {
    padding: 20px 16px;
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

  .total-footprint {
    flex-direction: column;
    align-items: center;
    padding: 24px 20px;
    gap: 24px;
  }

  .footprint-comparison {
    width: 100%;
    text-align: center;
  }

  .input-row {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .input-value {
    justify-content: center;
    min-width: unset;
  }

  .radio-options {
    grid-template-columns: 1fr;
  }

  .methodology-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .calc-hero h1 {
    font-size: 1.4rem;
  }

  .footprint-circle {
    width: 140px;
    height: 140px;
  }

  .footprint-value {
    font-size: 2.2rem;
  }

  .breakdown-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
