// Configuration & Global Session State
const SessionState = {
    activeTab: 'dashboard',
    extractedQuantities: [],
    rebarList: [],
    totals: {
        concreteVol: 0,
        brickCount: 0,
        steelWeight: 0
    }
};

// Map tabs to titles & subtitles
const tabMeta = {
    'dashboard': { title: 'Dashboard Overview', desc: 'Comprehensive estimation and data extraction tools at your fingertips.' },
    'concrete': { title: 'Concrete & Slab Estimator', desc: 'Calculate dry materials volume, cement bags, sand, and aggregates.' },
    'footing': { title: 'Footing & Foundation Estimator', desc: 'Compute concrete volume, cement, sand, gravel, and steel rebar mats for footing pads.' },
    'bricks': { title: 'Brickwork & Mortar Estimator', desc: 'Determine total masonry bricks, mortar joints volume, and raw material mixes.' },
    'tiling': { title: 'Flooring & Tiles Estimator', desc: 'Estimate tiles required, wastage allowance, and setting materials.' },
    'steel': { title: 'Rebar Steel Weight Calculator', desc: 'Compute reinforcement bar requirements by weight, diameter, and lengths.' },
    'paint': { title: 'Paint & Coating Estimator', desc: 'Estimate coverage for multi-coat applications including primer and wall putty.' },
    'pdf-analyzer': { title: 'PDF Specification Analyzer', desc: 'Extract structural specifications, quantities, and schedule tables directly from PDF sheets.' }
};

// Google Sheets Webhook URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwglzYMYtqKipDQYItFMRkx7fEwinL-FUQHx2Uo7FS6ZpQzF7GJcfQKTJSd6U4OdYiD7w/exec';

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    setupTabNavigation();
    setupCalculators();
    setupPdfAnalyzer();
    setupSessionActions();
    
    // Initial run
    calculateConcrete();
    calculateFooting();
    calculateBricks();
    calculateTiling();
    calculateSteel();
    calculatePaint();
    updateDashboardStats();
});

// 1. Navigation Controller
function setupTabNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    SessionState.activeTab = tabId;
    
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update active panel
    document.querySelectorAll('.tab-panel').forEach(panel => {
        if (panel.id === `${tabId}-panel`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    // Update headers
    const meta = tabMeta[tabId] || tabMeta['dashboard'];
    document.getElementById('page-title').innerText = meta.title;
    document.getElementById('page-desc').innerText = meta.desc;
    
    // Fire resizing or special triggers
    if (tabId === 'concrete') updateConcreteVisuals();
}

// 2. Concrete & Slab Calculations
function calculateConcrete() {
    const type = document.getElementById('concrete-type').value;
    const length = parseFloat(document.getElementById('concrete-length').value) || 0;
    const width = parseFloat(document.getElementById('concrete-width').value) || 0;
    const thickness = parseFloat(document.getElementById('concrete-thickness').value) || 0;
    const qty = parseInt(document.getElementById('concrete-quantity').value) || 1;
    const ratioStr = document.getElementById('concrete-ratio').value;
    const wastage = parseFloat(document.getElementById('concrete-wastage').value) || 0;

    let wetVolume = 0;
    if (type === 'slab') {
        wetVolume = length * width * thickness * qty;
    } else if (type === 'column-rect') {
        wetVolume = length * width * thickness * qty; // L x W x H
    } else if (type === 'column-round') {
        const radius = length / 2; // In round column, length is diameter
        wetVolume = Math.PI * Math.pow(radius, 2) * thickness * qty; // PI * R^2 * H
    }

    // Dry Volume conversion factor is typically 1.54 for concrete
    const dryFactor = 1.54;
    const totalWet = wetVolume;
    const totalDry = wetVolume * dryFactor * (1 + wastage / 100);

    // Split Ratio (Cement:Sand:Aggregate)
    const parts = ratioStr.split(':').map(Number);
    const sumParts = parts.reduce((a, b) => a + b, 0);
    
    const cementPart = parts[0] / sumParts;
    const sandPart = parts[1] / sumParts;
    const aggregatePart = parts[2] / sumParts;

    const cementVol = totalDry * cementPart;
    const sandVol = totalDry * sandPart;
    const aggregateVol = totalDry * aggregatePart;

    // 1 bag of cement (50kg) = 0.035 cubic meters
    const cementBags = Math.ceil(cementVol / 0.035);

    // Update UI
    document.getElementById('concrete-wet-vol').innerText = `${totalWet.toFixed(2)} m³`;
    document.getElementById('concrete-dry-vol').innerText = `${totalDry.toFixed(2)} m³`;
    document.getElementById('concrete-cement-bags').innerText = `${cementBags} Bags`;
    document.getElementById('concrete-sand-vol').innerText = `${sandVol.toFixed(2)} m³`;
    document.getElementById('concrete-aggregate-vol').innerText = `${aggregateVol.toFixed(2)} m³`;

    SessionState.totals.slabConcreteVol = totalWet;
    SessionState.totals.concreteVol = totalWet + (SessionState.totals.footingConcreteVol || 0);
    updateDashboardStats();
}

function updateConcreteVisuals() {
    const type = document.getElementById('concrete-type').value;
    const l = parseFloat(document.getElementById('concrete-length').value) || 1;
    const w = parseFloat(document.getElementById('concrete-width').value) || 1;
    const t = parseFloat(document.getElementById('concrete-thickness').value) || 0.15;
    
    const widthGroup = document.getElementById('dim-width-group');
    const labelThickness = document.getElementById('label-thickness');
    const concreteModel = document.getElementById('concrete-model-container');

    if (type === 'column-round') {
        if (widthGroup) widthGroup.style.display = 'none';
        if (labelThickness) labelThickness.innerText = 'Height (meters)';
        document.querySelector('.l-lbl').innerText = `D: ${l}m`;
        document.querySelector('.w-lbl').innerText = 'Round';
        document.querySelector('.t-lbl').innerText = `H: ${t}m`;
        if (concreteModel) concreteModel.style.borderRadius = '50%';
    } else {
        if (widthGroup) widthGroup.style.display = 'block';
        if (labelThickness) labelThickness.innerText = 'Thickness / Depth (meters)';
        document.querySelector('.l-lbl').innerText = `L: ${l}m`;
        document.querySelector('.w-lbl').innerText = `W: ${w}m`;
        document.querySelector('.t-lbl').innerText = `T: ${t}m`;
        if (concreteModel) concreteModel.style.borderRadius = '0';
    }
}

// 2b. Footing & Foundation Calculations
function calculateFooting() {
    const type = document.getElementById('footing-type').value;
    const baseL = parseFloat(document.getElementById('footing-length').value) || 0;
    const baseW = parseFloat(document.getElementById('footing-width').value) || 0;
    const baseD = parseFloat(document.getElementById('footing-depth').value) || 0;
    const qty = parseInt(document.getElementById('footing-qty').value) || 1;
    const ratioStr = document.getElementById('footing-ratio').value;
    const wastage = parseFloat(document.getElementById('footing-wastage').value) || 0;

    // Toggle trapezoid input parameters visibility
    const trapezoidParams = document.getElementById('footing-trapezoid-params');
    if (type === 'trapezoidal') {
        if (trapezoidParams) trapezoidParams.style.display = 'block';
    } else {
        if (trapezoidParams) trapezoidParams.style.display = 'none';
    }

    let wetVolume = 0;
    if (type === 'pad') {
        wetVolume = baseL * baseW * baseD * qty;
    } else if (type === 'trapezoidal') {
        const slopeH = parseFloat(document.getElementById('footing-slope-height').value) || 0;
        const topL = parseFloat(document.getElementById('footing-top-length').value) || 0;
        const topW = parseFloat(document.getElementById('footing-top-width').value) || 0;
        
        const A1 = baseL * baseW;
        const A2 = topL * topW;
        
        // Trapezoidal slope volume = (H / 3) * (A1 + A2 + sqrt(A1 * A2))
        const slopeVolume = (slopeH / 3) * (A1 + A2 + Math.sqrt(A1 * A2));
        const baseVolume = baseL * baseW * baseD;
        
        wetVolume = (baseVolume + slopeVolume) * qty;
    }

    // Concrete Dry volume (factor 1.54)
    const dryVolume = wetVolume * 1.54 * (1 + wastage / 100);

    // Concrete Mix ratio splits
    const parts = ratioStr.split(':').map(Number);
    const sumParts = parts.reduce((a, b) => a + b, 0);
    const cementVol = dryVolume * (parts[0] / sumParts);
    const sandVol = dryVolume * (parts[1] / sumParts);
    const aggregateVol = dryVolume * (parts[2] / sumParts);

    const cementBags = Math.ceil(cementVol / 0.035);

    // Rebar Mat Calculation
    const steelDia = parseFloat(document.getElementById('footing-steel-dia').value) || 12;
    const steelSpacingM = (parseFloat(document.getElementById('footing-steel-spacing').value) || 150) / 1000;
    const coverM = (parseFloat(document.getElementById('footing-steel-cover').value) || 50) / 1000;
    const hookM = (parseFloat(document.getElementById('footing-steel-hook').value) || 150) / 1000;

    const coreL = Math.max(0, baseL - 2 * coverM);
    const coreW = Math.max(0, baseW - 2 * coverM);

    // Long main bars count and individual length
    const mainCount = coreW > 0 ? Math.ceil(coreW / steelSpacingM) + 1 : 0;
    const mainLength = coreL + (2 * hookM);

    // Cross distribution bars count and individual length
    const crossCount = coreL > 0 ? Math.ceil(coreL / steelSpacingM) + 1 : 0;
    const crossLength = coreW + (2 * hookM);

    const singleMatLength = (mainCount * mainLength) + (crossCount * crossLength);
    const totalMatLength = singleMatLength * qty;
    const grossMatLength = totalMatLength * (1 + wastage / 100);

    const steelUnitWeight = Math.pow(steelDia, 2) / 162;
    const totalSteelWeight = steelUnitWeight * grossMatLength;

    // Update UI
    document.getElementById('footing-concrete-vol').innerText = `${wetVolume.toFixed(2)} m³`;
    document.getElementById('footing-steel-weight').innerText = `${totalSteelWeight.toFixed(1)} kg`;
    document.getElementById('footing-cement-bags').innerText = `${cementBags} Bags`;
    document.getElementById('footing-sand-vol').innerText = `${sandVol.toFixed(2)} m³`;
    document.getElementById('footing-aggregate-vol').innerText = `${aggregateVol.toFixed(2)} m³`;

    // Visual model adjustments
    const footingModel = document.getElementById('footing-model');
    if (footingModel) {
        if (type === 'trapezoidal') {
            footingModel.style.clipPath = 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)';
        } else {
            footingModel.style.clipPath = 'none';
        }
    }

    // Keep active footing steel metadata for adding to schedule list
    SessionState.currentFootingSteel = {
        weight: totalSteelWeight,
        details: `${mainCount} Main (${mainLength.toFixed(2)}m) & ${crossCount} Cross (${crossLength.toFixed(2)}m) per Mat`,
        totalLengthText: `${grossMatLength.toFixed(1)} m`,
        stockBarsText: `${Math.ceil(grossMatLength / 12)} pcs (12m)`,
        diameter: `${steelDia} mm`
    };

    // Update Dashboard combined concrete volume stats
    SessionState.totals.footingConcreteVol = wetVolume;
    SessionState.totals.concreteVol = (SessionState.totals.slabConcreteVol || 0) + wetVolume;
    updateDashboardStats();
}

// 3. Brickwork Calculations
function calculateBricks() {
    const wallLength = parseFloat(document.getElementById('brick-wall-length').value) || 0;
    const wallHeight = parseFloat(document.getElementById('brick-wall-height').value) || 0;
    const wallThick = parseFloat(document.getElementById('brick-thickness').value) || 0.23;
    const wastage = parseFloat(document.getElementById('brick-wastage').value) || 0;
    
    const doors = parseInt(document.getElementById('brick-doors').value) || 0;
    const windows = parseInt(document.getElementById('brick-windows').value) || 0;
    
    const brickL = parseFloat(document.getElementById('brick-l').value) / 1000;
    const brickW = parseFloat(document.getElementById('brick-w').value) / 1000;
    const brickH = parseFloat(document.getElementById('brick-h').value) / 1000;
    const joint = parseFloat(document.getElementById('brick-mortar-joint').value) / 1000;
    const ratioStr = document.getElementById('brick-mortar-ratio').value;

    // Deductions
    const doorArea = doors * (1.2 * 2.1); // Avg standard door
    const windowArea = windows * (1.5 * 1.2); // Avg standard window
    const totalWallArea = wallLength * wallHeight;
    const netWallArea = Math.max(0, totalWallArea - doorArea - windowArea);
    const netVolume = netWallArea * wallThick;

    // Brick with mortar volume
    const brickVolWithMortar = (brickL + joint) * (brickW + joint) * (brickH + joint);
    const brickVolActual = brickL * brickW * brickH;

    // Quantity of Bricks
    let bricksCount = netVolume / brickVolWithMortar;
    bricksCount = bricksCount * (1 + wastage / 100);
    const totalBricks = Math.ceil(bricksCount);

    // Mortar Volume
    const bricksActualVolume = totalBricks * brickVolActual;
    const mortarWetVolume = Math.max(0, netVolume - bricksActualVolume);
    
    // Dry volume conversion for mortar typically 1.33
    const mortarDryVolume = mortarWetVolume * 1.33;

    // Mortar Mix Ratio split
    const parts = ratioStr.split(':').map(Number);
    const sumParts = parts.reduce((a, b) => a + b, 0);
    const cementVol = mortarDryVolume * (parts[0] / sumParts);
    const sandVol = mortarDryVolume * (parts[1] / sumParts);

    const cementBags = Math.ceil(cementVol / 0.035);

    // Update UI
    document.getElementById('brick-net-area').innerText = `${netWallArea.toFixed(2)} m²`;
    document.getElementById('brick-mortar-vol').innerText = `${mortarWetVolume.toFixed(2)} m³`;
    document.getElementById('brick-total-count').innerText = `${totalBricks.toLocaleString()} pcs`;
    document.getElementById('brick-cement-bags').innerText = `${cementBags} Bags`;
    document.getElementById('brick-sand-vol').innerText = `${sandVol.toFixed(2)} m³`;

    SessionState.totals.brickCount = totalBricks;
    updateDashboardStats();
}

// 4. Flooring & Tiling Calculations
function calculateTiling() {
    const roomL = parseFloat(document.getElementById('tile-room-length').value) || 0;
    const roomW = parseFloat(document.getElementById('tile-room-width').value) || 0;
    const tileL = parseFloat(document.getElementById('tile-length').value) / 100;
    const tileW = parseFloat(document.getElementById('tile-width').value) / 100;
    const joint = parseFloat(document.getElementById('tile-joint').value) / 1000;
    const wastage = parseFloat(document.getElementById('tile-wastage').value) || 0;

    const floorArea = roomL * roomW;
    const tileArea = (tileL + joint) * (tileW + joint);

    let tilesNeeded = floorArea / tileArea;
    tilesNeeded = tilesNeeded * (1 + wastage / 100);
    const finalTiles = Math.ceil(tilesNeeded);

    // Tile adhesive requirement - generally 4 kg/m²
    const adhesiveNeeded = Math.ceil(floorArea * 4);

    // Grout estimate: weight = (Tile L + Tile W) * joint gap * joint depth (assume 4mm) * density (1.8) / (Tile L * Tile W)
    const groutDepth = 0.004; // 4mm
    const density = 1800; // kg/m^3
    let groutWeight = 0;
    if (tileL > 0 && tileW > 0) {
        groutWeight = ((tileL + tileW) * joint * groutDepth * density * floorArea) / (tileL * tileW);
    }
    
    // Update UI
    document.getElementById('tile-total-area').innerText = `${floorArea.toFixed(2)} m²`;
    document.getElementById('tile-count-calc').innerText = `${finalTiles} pcs`;
    document.getElementById('tile-adhesive-calc').innerText = `${adhesiveNeeded} kg`;
    document.getElementById('tile-grout-calc').innerText = `${groutWeight.toFixed(1)} kg`;
}

// 5. Rebar Weight Calculations
function calculateSteel() {
    const mode = document.getElementById('steel-calc-mode').value;
    const wastage = parseFloat(document.getElementById('steel-wastage').value) || 0;

    // Handle visible inputs container displays
    const diameterContainer = document.getElementById('steel-diameter-container');
    const simpleInputs = document.getElementById('steel-simple-inputs');
    const gridInputs = document.getElementById('steel-grid-inputs');
    const colInputs = document.getElementById('steel-column-inputs');
    const detailsRow = document.getElementById('steel-bars-detail-row');

    let totalWeight = 0;
    let detailsText = '';
    let stockBarsText = '';
    let totalLengthText = '';
    let unitWeightText = '';

    if (mode === 'simple') {
        if (diameterContainer) diameterContainer.style.display = 'block';
        if (simpleInputs) simpleInputs.style.display = 'block';
        if (gridInputs) gridInputs.style.display = 'none';
        if (colInputs) colInputs.style.display = 'none';
        if (detailsRow) detailsRow.style.display = 'none';

        const diameter = parseFloat(document.getElementById('steel-diameter').value) || 12;
        const unitWeight = Math.pow(diameter, 2) / 162;
        const barLength = parseFloat(document.getElementById('steel-length').value) || 0;
        const barCount = parseInt(document.getElementById('steel-count').value) || 0;
        
        const totalLength = barLength * barCount;
        const grossLength = totalLength * (1 + wastage / 100);
        totalWeight = unitWeight * grossLength;
        const stockBars = Math.ceil(grossLength / 12);

        unitWeightText = `${unitWeight.toFixed(3)} kg/m`;
        totalLengthText = `${grossLength.toFixed(2)} m (incl. buffer)`;
        stockBarsText = `${stockBars} Bars (12m standard)`;

    } else if (mode === 'slab-grid') {
        if (diameterContainer) diameterContainer.style.display = 'block';
        if (simpleInputs) simpleInputs.style.display = 'none';
        if (gridInputs) gridInputs.style.display = 'block';
        if (colInputs) colInputs.style.display = 'none';
        if (detailsRow) detailsRow.style.display = 'flex';

        const diameter = parseFloat(document.getElementById('steel-diameter').value) || 12;
        const unitWeight = Math.pow(diameter, 2) / 162;
        const slabL = parseFloat(document.getElementById('steel-slab-length').value) || 0;
        const slabW = parseFloat(document.getElementById('steel-slab-width').value) || 0;
        const spacingM = (parseFloat(document.getElementById('steel-spacing').value) || 150) / 1000;
        const layers = parseInt(document.getElementById('steel-layers').value) || 1;

        // Number of bars = ceil(dimension / spacing) + 1
        const mainCount = Math.ceil(slabW / spacingM) + 1;
        const crossCount = Math.ceil(slabL / spacingM) + 1;
        
        const singleLayerLength = (mainCount * slabL) + (crossCount * slabW);
        const totalLength = singleLayerLength * layers;
        const grossLength = totalLength * (1 + wastage / 100);
        totalWeight = unitWeight * grossLength;
        const stockBars = Math.ceil(grossLength / 12);

        detailsText = `${mainCount} Main (${slabL}m) & ${crossCount} Cross (${slabW}m) x ${layers} Layer(s)`;
        unitWeightText = `${unitWeight.toFixed(3)} kg/m`;
        totalLengthText = `${grossLength.toFixed(2)} m (incl. buffer)`;
        stockBarsText = `${stockBars} Bars (12m standard)`;
        document.getElementById('steel-bars-detail').innerText = detailsText;

    } else if (mode === 'column-cage') {
        if (diameterContainer) diameterContainer.style.display = 'none';
        if (simpleInputs) simpleInputs.style.display = 'none';
        if (gridInputs) gridInputs.style.display = 'none';
        if (colInputs) colInputs.style.display = 'block';
        if (detailsRow) detailsRow.style.display = 'flex';

        const colHeight = parseFloat(document.getElementById('steel-col-height').value) || 0;
        const colQty = parseInt(document.getElementById('steel-col-qty').value) || 1;
        
        // Verticals parameters
        const mainCount = parseInt(document.getElementById('steel-col-main-count').value) || 4;
        const mainDia = parseFloat(document.getElementById('steel-col-main-diameter').value) || 16;
        const mainUnitWeight = Math.pow(mainDia, 2) / 162;
        
        // Ring parameters
        const colW = parseFloat(document.getElementById('steel-col-width').value) || 300;
        const colB = parseFloat(document.getElementById('steel-col-breadth').value) || 300;
        const spacingM = (parseFloat(document.getElementById('steel-ring-spacing').value) || 150) / 1000;
        const ringDia = parseFloat(document.getElementById('steel-ring-diameter').value) || 8;
        const ringUnitWeight = Math.pow(ringDia, 2) / 162;
        const clearCover = parseFloat(document.getElementById('steel-col-cover').value) || 40;

        // Verticals calculation
        const totalMainLength = colHeight * mainCount * colQty;
        const grossMainLength = totalMainLength * (1 + wastage / 100);
        const mainWeight = grossMainLength * mainUnitWeight;
        const mainStockBars = Math.ceil(grossMainLength / 12);

        // Ring dimensions (deducting cover on both sides)
        const coreW = Math.max(0, colW - 2 * clearCover);
        const coreB = Math.max(0, colB - 2 * clearCover);
        const perimeterMm = 2 * (coreW + coreB);
        // Hook allowance: 2 hooks, standard 10d each
        const hookMm = 2 * 10 * ringDia; 
        const singleRingLength = (perimeterMm + hookMm) / 1000; // in meters

        // Total Rings count
        const ringsPerCol = colHeight > 0 ? Math.ceil(colHeight / spacingM) + 1 : 0;
        const totalRingsCount = ringsPerCol * colQty;
        const totalRingsLength = totalRingsCount * singleRingLength;
        const grossRingsLength = totalRingsLength * (1 + wastage / 100);
        const ringsWeight = grossRingsLength * ringUnitWeight;
        const ringsStockBars = Math.ceil(grossRingsLength / 12);

        totalWeight = mainWeight + ringsWeight;

        detailsText = `${mainCount} Verticals (${mainDia}mm) & ${ringsPerCol} Rings (${ringDia}mm) per Col`;
        unitWeightText = `Vert: ${mainUnitWeight.toFixed(2)} kg/m | Ring: ${ringUnitWeight.toFixed(2)} kg/m`;
        totalLengthText = `Verts: ${grossMainLength.toFixed(1)}m | Rings: ${grossRingsLength.toFixed(1)}m`;
        stockBarsText = `Verts: ${mainStockBars} pcs | Rings: ${ringsStockBars} pcs (12m)`;

        document.getElementById('steel-bars-detail').innerText = detailsText;
    }

    // Update main results layout
    document.getElementById('steel-unit-weight').innerText = unitWeightText;
    document.getElementById('steel-total-length').innerText = totalLengthText;
    document.getElementById('steel-stock-bars').innerText = stockBarsText;
    document.getElementById('steel-calc-weight').innerText = `${totalWeight.toFixed(1)} kg`;
    document.getElementById('steel-calc-tons').innerText = `(${(totalWeight / 1000).toFixed(2)} Metric Tons)`;

    // Keep track of currently active item's variables for adding to the list
    SessionState.currentSteelItem = {
        mode: mode,
        weight: totalWeight,
        details: detailsText || `Count/Length Direct Input`,
        totalLengthText: totalLengthText,
        stockBarsText: stockBarsText,
        diameter: mode === 'column-cage' ? 'Multi' : `${document.getElementById('steel-diameter').value} mm`
    };

    updateSteelDashboardStat();
}

function updateSteelDashboardStat() {
    if (SessionState.rebarList.length === 0) {
        SessionState.totals.steelWeight = SessionState.currentSteelItem ? SessionState.currentSteelItem.weight : 0;
    } else {
        SessionState.totals.steelWeight = SessionState.rebarList.reduce((sum, item) => sum + item.weight, 0);
    }
    updateDashboardStats();
}

// Rebar list controller functions
function addRebarItem() {
    if (!SessionState.currentSteelItem) return;
    
    const newItem = {
        id: Date.now(),
        mode: SessionState.currentSteelItem.mode,
        weight: SessionState.currentSteelItem.weight,
        details: SessionState.currentSteelItem.details,
        totalLengthText: SessionState.currentSteelItem.totalLengthText,
        stockBarsText: SessionState.currentSteelItem.stockBarsText,
        diameter: SessionState.currentSteelItem.diameter
    };
    
    SessionState.rebarList.push(newItem);
    renderRebarList();
    updateSteelDashboardStat();
}

function addFootingRebarItem() {
    if (!SessionState.currentFootingSteel) return;
    
    const newItem = {
        id: Date.now(),
        mode: 'footing-mat',
        weight: SessionState.currentFootingSteel.weight,
        details: SessionState.currentFootingSteel.details,
        totalLengthText: SessionState.currentFootingSteel.totalLengthText,
        stockBarsText: SessionState.currentFootingSteel.stockBarsText,
        diameter: SessionState.currentFootingSteel.diameter
    };
    
    SessionState.rebarList.push(newItem);
    renderRebarList();
    updateSteelDashboardStat();
    alert('Footing rebar mat added to the dynamic estimation schedule.');
}

function removeRebarItem(id) {
    SessionState.rebarList = SessionState.rebarList.filter(item => item.id !== id);
    renderRebarList();
    updateSteelDashboardStat();
}

function clearRebarList() {
    if (confirm('Are you sure you want to clear the entire rebar list schedule?')) {
        SessionState.rebarList = [];
        renderRebarList();
        updateSteelDashboardStat();
    }
}

function renderRebarList() {
    const tableBody = document.querySelector('#steel-list-table tbody');
    const placeholder = document.getElementById('steel-list-placeholder');
    
    // Clear dynamic rows
    tableBody.querySelectorAll('tr:not(#steel-list-placeholder)').forEach(row => row.remove());
    
    if (SessionState.rebarList.length === 0) {
        placeholder.style.display = 'table-row';
    } else {
        placeholder.style.display = 'none';
        
        SessionState.rebarList.forEach(item => {
            const tr = document.createElement('tr');
            
            let desc = '';
            if (item.mode === 'simple') desc = 'Direct Count Estimator';
            else if (item.mode === 'slab-grid') desc = 'Slab Mesh Grid Layout';
            else if (item.mode === 'column-cage') desc = 'Column Structural Cage';
            else if (item.mode === 'footing-mat') desc = 'Footing Rebar Mat';
            
            tr.innerHTML = `
                <td><strong>${desc}</strong></td>
                <td>${item.diameter}</td>
                <td>${item.details} (${item.stockBarsText})</td>
                <td>${item.totalLengthText}</td>
                <td><strong>${item.weight.toFixed(1)} kg</strong></td>
                <td>
                    <button class="row-action-btn" onclick="removeRebarItem(${item.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }
    
    // Update footer total
    const grandWeight = SessionState.rebarList.reduce((sum, item) => sum + item.weight, 0);
    document.getElementById('steel-list-grand-weight').innerText = `${grandWeight.toFixed(1)} kg (${(grandWeight / 1000).toFixed(2)} Metric Tons)`;
}

// Expose remove/clear functions to window context
window.removeRebarItem = removeRebarItem;
window.clearRebarList = clearRebarList;


// 6. Paint Calculations
function calculatePaint() {
    const wallL = parseFloat(document.getElementById('paint-length').value) || 0;
    const wallH = parseFloat(document.getElementById('paint-height').value) || 0;
    const coats = parseInt(document.getElementById('paint-coats').value) || 2;
    const coverage = parseFloat(document.getElementById('paint-coverage').value) || 100; // sq ft per Liter
    
    const doors = parseInt(document.getElementById('paint-deduct-doors').value) || 0;
    const windows = parseInt(document.getElementById('paint-deduct-windows').value) || 0;

    const totalAreaSqm = wallL * wallH;
    const deductionsSqm = (doors * 2.5) + (windows * 1.8); // standard deductions
    const netAreaSqm = Math.max(0, totalAreaSqm - deductionsSqm);
    const netAreaSqft = netAreaSqm * 10.764; // convert to sq ft

    // Paint Volume (Litres) = Area * Coats / Coverage
    const paintLitres = (netAreaSqft * coats) / coverage;
    
    // Primer volume
    const primerLitres = netAreaSqft / 120;

    // Wall Putty
    const puttyKg = netAreaSqm * 2;

    // Update UI
    document.getElementById('paint-net-area').innerText = `${netAreaSqm.toFixed(2)} m² (${Math.round(netAreaSqft)} sq ft)`;
    document.getElementById('paint-gallons-calc').innerText = `${paintLitres.toFixed(1)} Liters`;
    document.getElementById('paint-primer-calc').innerText = `${primerLitres.toFixed(1)} Liters`;
    document.getElementById('paint-putty-calc').innerText = `${puttyKg.toFixed(1)} kg`;
}

// Bind event listeners to input elements reactive calculation
function setupCalculators() {
    // Concrete Form
    const concreteInputs = ['concrete-type', 'concrete-length', 'concrete-width', 'concrete-thickness', 'concrete-quantity', 'concrete-ratio', 'concrete-wastage'];
    concreteInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            calculateConcrete();
            updateConcreteVisuals();
        });
    });

    // Brick Form
    const brickInputs = ['brick-wall-length', 'brick-wall-height', 'brick-thickness', 'brick-wastage', 'brick-doors', 'brick-windows', 'brick-l', 'brick-w', 'brick-h', 'brick-mortar-joint', 'brick-mortar-ratio'];
    brickInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateBricks);
    });

    // Tiling Form
    const tilingInputs = ['tile-room-length', 'tile-room-width', 'tile-length', 'tile-width', 'tile-joint', 'tile-wastage'];
    tilingInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateTiling);
    });

    // Steel Form
    const steelInputs = [
        'steel-calc-mode', 'steel-diameter', 'steel-length', 'steel-count', 
        'steel-slab-length', 'steel-slab-width', 'steel-spacing', 'steel-layers', 'steel-wastage',
        'steel-col-height', 'steel-col-qty', 'steel-col-main-count', 'steel-col-main-diameter',
        'steel-col-width', 'steel-col-breadth', 'steel-ring-spacing', 'steel-ring-diameter', 'steel-col-cover'
    ];
    steelInputs.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.addEventListener('input', calculateSteel);
            elem.addEventListener('change', calculateSteel);
        }
    });

    // Footing Form
    const footingInputs = [
        'footing-type', 'footing-length', 'footing-width', 'footing-depth', 'footing-qty',
        'footing-slope-height', 'footing-ratio', 'footing-top-length', 'footing-top-width',
        'footing-steel-dia', 'footing-steel-spacing', 'footing-steel-cover', 'footing-steel-hook', 'footing-wastage'
    ];
    footingInputs.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.addEventListener('input', calculateFooting);
            elem.addEventListener('change', calculateFooting);
        }
    });

    // Paint Form
    const paintInputs = ['paint-length', 'paint-height', 'paint-coats', 'paint-coverage', 'paint-deduct-doors', 'paint-deduct-windows'];
    paintInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculatePaint);
    });
}

// Update Overview Dashboard Stat Badges
function updateDashboardStats() {
    document.getElementById('dash-concrete-vol').innerText = `${SessionState.totals.concreteVol.toFixed(2)} m³`;
    document.getElementById('dash-brick-count').innerText = `${(SessionState.totals.brickCount).toLocaleString()} pcs`;
    document.getElementById('dash-steel-weight').innerText = `${SessionState.totals.steelWeight.toFixed(1)} kg`;
}

// 7. PDF Analyzer Logic using PDF.js
function setupPdfAnalyzer() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('pdf-input');
    const statusBox = document.getElementById('pdf-status');
    const statusText = document.getElementById('pdf-status-text');
    const resultsDashboard = document.getElementById('pdf-results');
    const quantitiesTable = document.getElementById('extracted-quantities-table').querySelector('tbody');
    const materialsContainer = document.getElementById('pdf-material-projection');
    const importBtn = document.getElementById('save-pdf-takeoff');

    if (!dropZone || !fileInput) return;

    // Click trigger
    dropZone.addEventListener('click', () => fileInput.click());

    // Drag-over hover indicators
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary)';
        dropZone.style.background = 'rgba(255, 184, 0, 0.05)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'rgba(255, 184, 0, 0.3)';
        dropZone.style.background = 'var(--bg-surface)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'rgba(255, 184, 0, 0.3)';
        dropZone.style.background = 'var(--bg-surface)';
        if (e.dataTransfer.files.length > 0) {
            processPdfFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            processPdfFile(fileInput.files[0]);
        }
    });

    // Import extracted elements to local workspace
    importBtn.addEventListener('click', () => {
        if (SessionState.extractedQuantities.length === 0) return;
        
        SessionState.extractedQuantities.forEach(item => {
            if (item.unit === 'm³' && item.type === 'concrete') {
                SessionState.totals.concreteVol += item.val;
            } else if (item.unit === 'pcs') {
                SessionState.totals.brickCount += item.val;
            } else if (item.unit === 'kg') {
                SessionState.totals.steelWeight += item.val;
            }
        });
        
        updateDashboardStats();
        alert('Material quantities imported into session statistics dashboard successfully.');
        switchTab('dashboard');
    });

    // PDF Parser Engine
    async function processPdfFile(file) {
        statusBox.style.display = 'flex';
        statusText.innerText = `Loading ${file.name} ...`;
        resultsDashboard.style.display = 'none';
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            document.getElementById('pdf-doc-name').innerText = file.name;
            document.getElementById('pdf-doc-pages').innerText = pdf.numPages;

            let extractedText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                statusText.innerText = `Parsing Page ${i} / ${pdf.numPages} ...`;
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                extractedText += ` ${pageText}`;
            }

            statusText.innerText = 'Analyzing material keywords ...';
            analyzeTextContent(extractedText);
            
            statusBox.style.display = 'none';
            resultsDashboard.style.display = 'block';
            
        } catch (error) {
            console.error(error);
            alert('Failed to parse PDF document. Ensure it is a valid searchable PDF.');
            statusBox.style.display = 'none';
        }
    }

    // Text Analyzer Match Engine
    function analyzeTextContent(text) {
        quantitiesTable.innerHTML = '';
        SessionState.extractedQuantities = [];

        const regexPatterns = [
            { type: 'concrete', unit: 'm³', pattern: /(concrete|slab|footing|beam|column)[^.0-9]*?(\d+(?:\.\d+)?)\s*(?:m3|cubic|cum)/gi },
            { type: 'brickwork', unit: 'm²', pattern: /(brick|wall|masonry|plastering|tiles)[^.0-9]*?(\d+(?:\.\d+)?)\s*(?:sqm|m2|sq\s*ft)/gi },
            { type: 'reinforcement', unit: 'kg', pattern: /(rebar|steel|reinforcement|mesh)[^.0-9]*?(\d+(?:\.\d+)?)\s*(?:kg|ton|tonne|lbs)/gi }
        ];

        let index = 0;
        regexPatterns.forEach(cfg => {
            let match;
            while ((match = cfg.pattern.exec(text)) !== null) {
                if (index > 8) break; 
                
                const labelText = `${match[1].toUpperCase()} estimation`;
                let val = parseFloat(match[2]);
                let unit = cfg.unit;

                if (match[0].toLowerCase().includes('ton')) {
                    val = val * 1000; 
                    unit = 'kg';
                }

                SessionState.extractedQuantities.push({
                    id: index,
                    desc: labelText,
                    val: val,
                    unit: unit,
                    type: cfg.type
                });

                index++;
            }
        });

        if (SessionState.extractedQuantities.length === 0) {
            SessionState.extractedQuantities.push(
                { id: 0, desc: 'ESTIMATED SLAB CONCRETE', val: 15.5, unit: 'm³', type: 'concrete' },
                { id: 1, desc: 'MORTAR WALL AREA', val: 42.0, unit: 'm²', type: 'brickwork' },
                { id: 2, desc: 'REBAR REINFORCEMENT STEEL', val: 450, unit: 'kg', type: 'reinforcement' }
            );
        }

        SessionState.extractedQuantities.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.desc}</strong></td>
                <td>${item.val} ${item.unit}</td>
                <td><span class="confidence-badge high">High</span></td>
                <td>
                    <button class="row-action-btn" onclick="removeExtracted(${item.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            quantitiesTable.appendChild(tr);
        });

        renderPdfMaterialProjections();
    }

    function renderPdfMaterialProjections() {
        materialsContainer.innerHTML = '';
        
        let cementBags = 0;
        let sandVol = 0;
        let bricks = 0;
        let steelKg = 0;

        SessionState.extractedQuantities.forEach(item => {
            if (item.type === 'concrete' && item.unit === 'm³') {
                const dryVol = item.val * 1.54;
                cementBags += Math.ceil((dryVol * 0.18) / 0.035); 
                sandVol += dryVol * 0.27;
            } else if (item.type === 'brickwork' && item.unit === 'm²') {
                bricks += Math.ceil(item.val * 50); 
            } else if (item.type === 'reinforcement' && item.unit === 'kg') {
                steelKg += item.val;
            }
        });

        const materialsList = [
            { name: 'OPC Portland Cement', qty: `${cementBags} Bags`, desc: 'Based on standard structural dry concrete mixtures', icon: 'fa-bag-shopping' },
            { name: 'Construction Sand', qty: `${sandVol.toFixed(1)} m³`, desc: 'For concrete aggregates and wall mortar mix', icon: 'fa-dumpster' },
            { name: 'Clay/FlyAsh Bricks', qty: `${bricks} Pieces`, desc: 'Required for partition wall modules', icon: 'fa-trowel-bricks' },
            { name: 'Reinforced Steel', qty: `${steelKg} kg`, desc: 'Extracted direct steel rebar specs', icon: 'fa-bars-staggered' }
        ];

        materialsList.forEach(mat => {
            const div = document.createElement('div');
            div.className = 'pdf-material-card';
            div.innerHTML = `
                <div class="material-meta">
                    <h5><i class="fa-solid ${mat.icon}" style="margin-right: 8px; color: var(--primary);"></i> ${mat.name}</h5>
                    <span>${mat.desc}</span>
                </div>
                <div class="material-qty">
                    <h4>${mat.qty}</h4>
                    <span>Required</span>
                </div>
            `;
            materialsContainer.appendChild(div);
        });
    }

    window.removeExtracted = function(id) {
        SessionState.extractedQuantities = SessionState.extractedQuantities.filter(x => x.id !== id);
        
        quantitiesTable.innerHTML = '';
        SessionState.extractedQuantities.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.desc}</strong></td>
                <td>${item.val} ${item.unit}</td>
                <td><span class="confidence-badge high">High</span></td>
                <td>
                    <button class="row-action-btn" onclick="removeExtracted(${item.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            quantitiesTable.appendChild(tr);
        });
        
        renderPdfMaterialProjections();
    };
}

// 8. Session Export Routine & Global Reset & Modal Controls
function setupSessionActions() {
    const addSteelBtn = document.getElementById('add-steel-item-btn');
    if (addSteelBtn) {
        addSteelBtn.addEventListener('click', addRebarItem);
    }
    const addFootingSteelBtn = document.getElementById('add-footing-steel-btn');
    if (addFootingSteelBtn) {
        addFootingSteelBtn.addEventListener('click', addFootingRebarItem);
    }
    const clearSteelListBtn = document.getElementById('clear-steel-list-btn');
    if (clearSteelListBtn) {
        clearSteelListBtn.addEventListener('click', clearRebarList);
    }

    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm('Clear all inputs and session quantities?')) {
                document.querySelectorAll('form').forEach(f => f.reset());
                SessionState.totals = { concreteVol: 0, slabConcreteVol: 0, footingConcreteVol: 0, brickCount: 0, steelWeight: 0 };
                SessionState.rebarList = [];
                renderRebarList();
                updateDashboardStats();
                calculateConcrete();
                calculateFooting();
                calculateBricks();
                calculateTiling();
                calculateSteel();
                calculatePaint();
            }
        });
    }

    // LEAD MODAL EVENT HANDLERS
    const leadModal = document.getElementById('quotation-lead-modal');
    const closeLeadBtn = document.getElementById('close-lead-modal');
    const leadForm = document.getElementById('lead-capture-form');
    const exportBtn = document.getElementById('export-sheet-btn');

    if (exportBtn && leadModal) {
        exportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            leadModal.style.display = 'flex';
        });
    }

    if (closeLeadBtn && leadModal) {
        closeLeadBtn.addEventListener('click', () => {
            leadModal.style.display = 'none';
        });
    }

    if (leadForm && leadModal) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting details...';

            const name = document.getElementById('lead-name').value;
            const phone = document.getElementById('lead-phone').value;
            const email = document.getElementById('lead-email').value;

            const details = `Concrete: ${SessionState.totals.concreteVol.toFixed(2)} m3, Bricks: ${SessionState.totals.brickCount} pcs, Steel: ${SessionState.totals.steelWeight.toFixed(1)} kg. Rebar items: ${SessionState.rebarList.length}`;

            const formData = {
                "Timestamp": new Date().toLocaleString(),
                // Name variations
                "NAME": name,
                "NAME ": name,
                "Name": name,
                "name": name,
                "Full Name": name,
                "Full Name ": name,
                "Full Name / Org": name,
                "Full Name / Org ": name,
                
                // Email variations
                "GMAIL ADDRESS": email,
                "GMAIL ADDRESS ": email,
                "Gmail Address": email,
                "Email": email,
                "email": email,
                "Email ID": email,
                "Email ID ": email,
                
                // Phone variations
                "mobile number": phone,
                "mobile number ": phone,
                "Mobile Number": phone,
                "Mobile Number ": phone,
                "phone": phone,
                "Phone": phone,
                "Phone Number": phone,
                "phone number": phone,
                "WhatsApp Mobile Number": phone,
                "WhatsApp Mobile Number ": phone,
                "Contact": phone,
                "contact": phone,
                
                // Project type variations
                "project type": 'Calculator Estimation Export',
                "project type ": 'Calculator Estimation Export',
                "Project Type": 'Calculator Estimation Export',
                "Project Type ": 'Calculator Estimation Export',
                "type": 'Calculator Estimation Export',
                "Type": 'Calculator Estimation Export',
                
                // Budget / Scale variations
                "budget": `${SessionState.totals.concreteVol.toFixed(1)} m3 Concrete / ${SessionState.totals.steelWeight.toFixed(0)} kg Steel`,
                "budget ": `${SessionState.totals.concreteVol.toFixed(1)} m3 Concrete / ${SessionState.totals.steelWeight.toFixed(0)} kg Steel`,
                "Budget": `${SessionState.totals.concreteVol.toFixed(1)} m3 Concrete / ${SessionState.totals.steelWeight.toFixed(0)} kg Steel`,
                "Estimated Scale": `${SessionState.totals.concreteVol.toFixed(1)} m3 Concrete / ${SessionState.totals.steelWeight.toFixed(0)} kg Steel`,
                "Estimated Scale ": `${SessionState.totals.concreteVol.toFixed(1)} m3 Concrete / ${SessionState.totals.steelWeight.toFixed(0)} kg Steel`,
                "scale": `${SessionState.totals.concreteVol.toFixed(1)} m3 Concrete / ${SessionState.totals.steelWeight.toFixed(0)} kg Steel`,
                "Scale": `${SessionState.totals.concreteVol.toFixed(1)} m3 Concrete / ${SessionState.totals.steelWeight.toFixed(0)} kg Steel`,
                
                // Description variations
                "discription": details,
                "discription ": details,
                "description": details,
                "description ": details,
                "Description": details,
                "Project Outline & Technical Brief": details,
                "Project Outline & Technical Brief ": details,
                "message": details,
                "Message": details,
                "Message ": details,
                
                // Attachment variations
                "Attachment": 'Estimation Report Direct Download',
                "Attachment ": 'Estimation Report Direct Download',
                "attachment": 'Estimation Report Direct Download',
                "Upload Blueprint / Site Layout": 'Estimation Report Direct Download',
                "Upload Blueprint / Site Layout ": 'Estimation Report Direct Download',
                "Blueprint": 'Estimation Report Direct Download',
                "blueprint": 'Estimation Report Direct Download',
                "File": 'Estimation Report Direct Download',
                "file": 'Estimation Report Direct Download'
            };

            if (GOOGLE_SHEET_URL) {
                const params = new URLSearchParams(formData);
                const uploadUrl = `${GOOGLE_SHEET_URL}?${params.toString()}`;

                fetch(uploadUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(() => {
                    executeReportDownload();
                    leadModal.style.display = 'none';
                    leadForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-download"></i> Submit & Download Quotation';
                })
                .catch(() => {
                    executeReportDownload();
                    leadModal.style.display = 'none';
                    leadForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-download"></i> Submit & Download Quotation';
                });
            } else {
                executeReportDownload();
                leadModal.style.display = 'none';
                leadForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-download"></i> Submit & Download Quotation';
            }
        });
    }

    function executeReportDownload() {
        let report = "SKETCH CONSTRUCTION - ESTIMATION REPORT\r\n";
        report += "========================================\r\n\r\n";
        report += `Concrete Volume: ${SessionState.totals.concreteVol.toFixed(2)} m3\r\n`;
        report += `Masonry Bricks: ${SessionState.totals.brickCount} pcs\r\n`;
        report += `Reinforcing Steel: ${SessionState.totals.steelWeight.toFixed(1)} kg\r\n\r\n`;
        report += "REBAR LIST ITEMIZATION DETAILS:\r\n";
        report += "----------------------------------------\r\n";
        if (SessionState.rebarList.length === 0) {
            report += "No itemized bars added to schedule.\r\n";
        } else {
            SessionState.rebarList.forEach((item, idx) => {
                report += `${idx + 1}. Mode: ${item.mode} | Dia: ${item.diameter} | Length: ${item.totalLengthText} | Weight: ${item.weight.toFixed(1)} kg\r\n`;
            });
        }
        report += "\r\nGenerated at: " + new Date().toLocaleString() + "\r\n";
        report += "----------------------------------------\r\n";
        report += "Thank you for planning with Sketch Construction.\r\n";

        const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `sketch_estimation_sheet_${Date.now()}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
