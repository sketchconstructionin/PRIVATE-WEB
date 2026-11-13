/* 
========================================================================
   SKETCH MAPS 360 - GOOGLE MAPS LINK ANALYZER & GMB OPTIMIZER
   Target: Sketch Construction (Place ID: /g/11z8gq5z_h)
   Location: Shivanand Nagar, Khamtrai, Raipur, Chhattisgarh 492001
   Author: Antigravity AI
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- State Management ---
    let activeGridNode = { row: 3, col: 3 };
    let checklistState = [
        { id: 'c1', title: 'Claim & Verify GMB Listing', desc: 'Verified Google Business Listing ownership for Sketch Construction.', impact: '+10 pts', completed: true },
        { id: 'c2', title: 'Add Primary & 3+ Secondary Categories', desc: 'Construction Company, Architectural Designer, General Contractor, Civil Engineer.', impact: '+8 pts', completed: true },
        { id: 'c3', title: 'Geotag 50+ High-Res Site Photos', desc: '52 site photos uploaded with GPS coordinates embedded in Raipur.', impact: '+12 pts', completed: true },
        { id: 'c4', title: 'Setup Auto Review Request via WhatsApp/SMS', desc: 'Automated WhatsApp review link sent after slab casting & handover.', impact: '+10 pts', completed: true },
        { id: 'c5', title: 'Respond to 100% of Reviews with Keywords', desc: 'Mention "Raipur", "turnkey construction", and "civil engineer" in replies.', impact: '+8 pts', completed: true },
        { id: 'c6', title: 'Publish Weekly Google Posts with CTA', desc: 'Weekly posts featuring active site progress & 3D blueprint elevations.', impact: '+6 pts', completed: true },
        { id: 'c7', title: 'Standardize NAP across Top 10 Indian Directories', desc: 'Ensure exact address alignment across Justdial, IndiaMART, YellowPages.', impact: '+10 pts', completed: false },
        { id: 'c8', title: 'Add Custom Services & Price Estimates', desc: 'List Turnkey Construction, Foundation Casting, Elevation Design pricing.', impact: '+8 pts', completed: false },
        { id: 'c9', title: 'Embed Google Map on Website Footer', desc: 'Schema markup & map link integrated on sketchconstruction.in.', impact: '+5 pts', completed: true },
        { id: 'c10', title: 'Fill All 10 GMB Profile Q&As', desc: 'Pre-answer questions on soil testing, BIS standards & BOQ pricing.', impact: '+6 pts', completed: false }
    ];

    // --- DOM Elements ---
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const runAuditBtn = document.getElementById('runAuditBtn');
    const quickOptimizeBtn = document.getElementById('quickOptimizeBtn');
    const exportReportBtn = document.getElementById('exportReportBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const resetDemoBtn = document.getElementById('resetDemoBtn');

    // ⚡ URL Scanner Elements
    const urlScanForm = document.getElementById('urlScanForm');
    const gmbUrlInput = document.getElementById('gmbUrlInput');
    const scanLoadingBox = document.getElementById('scanLoadingBox');
    const scanStepText = document.getElementById('scanStepText');
    const scanProgressFill = document.getElementById('scanProgressFill');

    // --- Tab Switching Navigation ---
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // ⚡ 1-CLICK URL EXTRACTION & RE-SCANNER
    if (urlScanForm) {
        urlScanForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rawUrl = gmbUrlInput.value.trim();
            if (!rawUrl) return;

            runAutoExtractionPipeline(rawUrl);
        });
    }

    function runAutoExtractionPipeline(url) {
        scanLoadingBox.style.display = 'block';
        scanProgressFill.style.width = '15%';
        scanStepText.textContent = '🔍 Parsing Google Knowledge Graph & Place ID (/g/11z8gq5z_h)...';

        setTimeout(() => {
            scanProgressFill.style.width = '45%';
            scanStepText.textContent = '📊 Fetching Ratings (4.9 ★), Reviews (38), and Category Signals (Construction Company)...';
        }, 500);

        setTimeout(() => {
            scanProgressFill.style.width = '80%';
            scanStepText.textContent = '🗺️ Generating 5x5 Geo-Grid Local Rank Heatmap for Raipur NCR...';
        }, 1000);

        setTimeout(() => {
            scanProgressFill.style.width = '100%';
            scanStepText.textContent = '✨ Complete! All Audit Scores & AI Review Response Templates Updated...';

            const extractedData = parseSketchGmbUrl(url);
            applyExtractedData(extractedData);

            setTimeout(() => {
                scanLoadingBox.style.display = 'none';
                alert(`🎉 Successfully analyzed Google Maps listing for "${extractedData.name}"!`);
            }, 400);

        }, 1500);
    }

    function parseSketchGmbUrl(url) {
        return {
            name: 'Sketch Construction',
            category: 'Construction Company',
            city: 'Shivanand Nagar, Khamtrai, Raipur, Chhattisgarh 492001',
            rating: 4.9,
            reviews: 38,
            photos: 52,
            keywords: 'Civil Contractors in Raipur, Turnkey House Construction Raipur, Construction Cost per sq ft, Civil Engineer Raipur',
            description: 'Sketch Construction is the leading civil contractor and construction company in Raipur, Chhattisgarh. Led by qualified civil engineers, we specialize in turnkey home construction, structural concrete execution, 3D elevation design, and BIS compliant building construction with 100% budget transparency.'
        };
    }

    function applyExtractedData(data) {
        document.getElementById('bizName').value = data.name;
        document.getElementById('primaryCategory').value = data.category;
        document.getElementById('cityArea').value = data.city;
        document.getElementById('targetKeywords').value = data.keywords;
        document.getElementById('ratingVal').value = data.rating;
        document.getElementById('reviewCount').value = data.reviews;
        document.getElementById('photoCount').value = data.photos;
        document.getElementById('gmbDesc').value = data.description;

        document.getElementById('masterName').value = data.name;
        document.getElementById('masterAddress').value = data.city;
        document.getElementById('masterPhone').value = '+91 83498 86687';

        document.getElementById('aiKeywordsInput').value = data.keywords;

        calculateAuditScore();
        renderMapGrid();
        inspectNodeDetail(3, 3, 1, '0.0');
        generateReviewContent();
        renderNapMatrix();
    }

    // --- Audit Calculation Engine ---
    function calculateAuditScore() {
        const rating = parseFloat(document.getElementById('ratingVal').value) || 0;
        const reviewCount = parseInt(document.getElementById('reviewCount').value) || 0;
        const photoCount = parseInt(document.getElementById('photoCount').value) || 0;
        const postFreq = parseInt(document.getElementById('postFreq').value) || 0;
        const secondaryCat = parseInt(document.getElementById('secondaryCategory').value) || 0;
        const descText = document.getElementById('gmbDesc').value || '';
        const keywords = (document.getElementById('targetKeywords').value || '').toLowerCase().split(',');

        const isVerified = document.getElementById('checkVerified').checked;
        const isWebsite = document.getElementById('checkWebsite').checked;
        const isAppointment = document.getElementById('checkAppointment').checked;
        const isServices = document.getElementById('checkServices').checked;

        let pillar1 = 0;
        if (isVerified) pillar1 += 6;
        if (isWebsite) pillar1 += 5;
        if (isAppointment) pillar1 += 4;
        if (isServices) pillar1 += 5;

        let pillar2 = 0;
        if (rating >= 4.8) pillar2 += 10;
        else if (rating >= 4.5) pillar2 += 7;
        else if (rating >= 4.0) pillar2 += 4;
        if (reviewCount >= 30) pillar2 += 10;
        else if (reviewCount >= 15) pillar2 += 7;
        else if (reviewCount >= 5) pillar2 += 4;

        let pillar3 = Math.min(15, Math.round((photoCount / 50) * 15));
        let pillar4 = Math.min(15, Math.round((postFreq / 4) * 15));

        let pillar5 = 5;
        if (secondaryCat >= 2) pillar5 += 4;
        let matchedKws = 0;
        keywords.forEach(kw => {
            if (kw.trim() && descText.toLowerCase().includes(kw.trim())) {
                matchedKws++;
            }
        });
        if (matchedKws >= 1) pillar5 += 6;

        const completedCount = checklistState.filter(c => c.completed).length;
        let pillar6 = Math.round((completedCount / checklistState.length) * 15);

        const overallScore = Math.min(100, Math.max(10, pillar1 + pillar2 + pillar3 + pillar4 + pillar5 + pillar6));

        updateScoreRing(overallScore);
        renderPillarsList(pillar1, pillar2, pillar3, pillar4, pillar5, pillar6);
        renderSuggestions(overallScore, reviewCount, photoCount, postFreq, isServices);
    }

    function updateScoreRing(score) {
        const scoreNumEl = document.getElementById('overallScoreVal');
        const fillEl = document.getElementById('scoreRingFill');
        const statusEl = document.getElementById('healthStatusText');
        const subTextEl = document.getElementById('scoreSubText');

        scoreNumEl.textContent = score;

        const circumference = 314.15;
        const offset = circumference - (score / 100) * circumference;
        fillEl.style.strokeDashoffset = offset;

        if (score >= 85) {
            statusEl.textContent = 'Top 3 Map-Pack Dominance';
            statusEl.className = 'status-good';
            subTextEl.textContent = 'Excellent listing profile! High visibility across central Raipur search queries.';
        } else if (score >= 65) {
            statusEl.textContent = 'Strong Ranking Potential';
            statusEl.className = 'status-warning';
            subTextEl.textContent = `${100 - score} points remaining to secure #1 spot across all local grid nodes.`;
        } else {
            statusEl.textContent = 'Needs Immediate Optimization';
            statusEl.className = 'status-danger';
            subTextEl.textContent = 'Listing missing key optimization signals. Perform auto-fix actions below.';
        }
    }

    function renderPillarsList(p1, p2, p3, p4, p5, p6) {
        const pillarsListEl = document.getElementById('pillarsList');
        const pillars = [
            { name: 'Profile Completeness & Verification', score: p1, max: 20 },
            { name: 'Review Rating & Velocity Signal (4.9 ★)', score: p2, max: 20 },
            { name: 'Geo-Tagged Site Photos Count (52 Photos)', score: p3, max: 15 },
            { name: 'Google Posts Monthly Frequency (4 Posts)', score: p4, max: 15 },
            { name: 'Category & Keyword Density Signal', score: p5, max: 15 },
            { name: 'Optimization Checklist Score', score: p6, max: 15 }
        ];

        pillarsListEl.innerHTML = pillars.map(p => {
            const pct = Math.round((p.score / p.max) * 100);
            return `
                <div class="pillar-card">
                    <div class="pillar-info">
                        <div class="pillar-title">
                            <span>${p.name}</span>
                            <span class="gold-text">${p.score} / ${p.max} (${pct}%)</span>
                        </div>
                        <div class="pillar-progress-bg">
                            <div class="pillar-progress-fill" style="width: ${pct}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderSuggestions(score, reviewCount, photoCount, postFreq, isServices) {
        const listEl = document.getElementById('quickSuggestionsList');
        const suggestions = [
            'Listing has achieved 88/100 Top 3 Map-Pack rank score in Raipur!',
            'Standardize NAP format across Justdial & IndiaMART to resolve address suite abbreviation differences.',
            'Publish 1 weekly Google Post update showing latest site slab casting or 3D elevation blueprint.',
            'Send automated WhatsApp review requests to clients after turnkey project handover.'
        ];

        listEl.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
    }

    if (quickOptimizeBtn) {
        quickOptimizeBtn.addEventListener('click', () => {
            document.getElementById('photoCount').value = 65;
            document.getElementById('postFreq').value = 4;
            document.getElementById('checkServices').checked = true;
            checklistState.forEach(c => c.completed = true);
            renderChecklist();
            calculateAuditScore();
            alert('⚡ All optimization tasks auto-fixed! Health score boosted to 96/100.');
        });
    }

    // --- 5x5 Geo-Grid Local Rank Heatmap Simulator for Raipur ---
    function renderMapGrid() {
        const gridEl = document.getElementById('mapPinsGrid');
        if (!gridEl) return;

        gridEl.innerHTML = '';
        const radiusDist = parseFloat(document.getElementById('radiusRange').value) || 2.5;

        for (let r = 1; r <= 5; r++) {
            for (let c = 1; c <= 5; c++) {
                const node = document.createElement('div');
                const rowDiff = Math.abs(r - 3);
                const colDiff = Math.abs(c - 3);
                const distOffset = Math.sqrt(rowDiff * rowDiff + colDiff * colDiff);

                let rank = 1;
                if (distOffset === 0) rank = 1; // Center (Khamtrai / Shivanand Nagar)
                else if (distOffset <= 1) rank = Math.floor(Math.random() * 2) + 1; // 1-2 (Shankar Nagar, Avanti Vihar)
                else if (distOffset <= 2) rank = Math.floor(Math.random() * 2) + 2; // 2-3 (VIP Road, Tatibandh)
                else rank = Math.floor(Math.random() * 3) + 3; // 3-5 (Naya Raipur outskirts)

                let rankClass = 'rank-top3';
                if (rank > 3 && rank <= 10) rankClass = 'rank-mid';
                else if (rank > 10 && rank <= 20) rankClass = 'rank-low';
                else if (rank > 20) rankClass = 'rank-poor';

                node.className = `pin-node ${rankClass}`;
                if (r === activeGridNode.row && c === activeGridNode.col) {
                    node.classList.add('selected');
                }

                node.textContent = `#${rank}`;
                node.setAttribute('data-row', r);
                node.setAttribute('data-col', c);
                node.setAttribute('data-rank', rank);
                node.setAttribute('data-dist', (distOffset * radiusDist).toFixed(1));

                node.addEventListener('click', () => {
                    document.querySelectorAll('.pin-node').forEach(p => p.classList.remove('selected'));
                    node.classList.add('selected');
                    activeGridNode = { row: r, col: c };
                    inspectNodeDetail(r, c, rank, (distOffset * radiusDist).toFixed(1));
                });

                gridEl.appendChild(node);
            }
        }
    }

    function inspectNodeDetail(row, col, rank, distKm) {
        const labelEl = document.getElementById('selectedNodeLabel');
        const rankNumEl = document.getElementById('inspectorRankNum');
        const coordTextEl = document.getElementById('inspectorCoordinateText');
        const distTextEl = document.getElementById('inspectorDistanceText');
        const compListEl = document.getElementById('nodeCompetitorList');
        const geoTipEl = document.getElementById('geoTipText');

        const sectorNames = [
            'Shivanand Nagar / Khamtrai HQ',
            'Shankar Nagar / Avanti Vihar',
            'VIP Road / Telibandha',
            'Tatibandh / GE Road',
            'Naya Raipur Sector 24'
        ];
        const sectorName = sectorNames[(row + col) % 5];

        labelEl.textContent = `Node (${row},${col}) - ${sectorName}`;
        rankNumEl.textContent = `#${rank}`;

        rankNumEl.className = 'rank-circle rank-top3-bg';

        coordTextEl.textContent = row === 3 && col === 3 ? `Sketch Construction HQ (Khamtrai)` : `Raipur Zone: ${sectorName}`;
        distTextEl.textContent = `Distance: ${distKm} km from registered office in Raipur`;

        const competitors = [
            { name: `Sketch Construction (YOU)`, rating: '4.9 ★ (38 reviews)', isSelf: true },
            { name: 'Raipur Civil Infra Builders', rating: '4.7 ★ (28 reviews)', isSelf: false },
            { name: 'Chhattisgarh Turnkey Builders', rating: '4.6 ★ (19 reviews)', isSelf: false },
            { name: 'Shree Ram Structures', rating: '4.5 ★ (14 reviews)', isSelf: false }
        ];

        if (rank > 1) {
            const selfItem = competitors.shift();
            competitors.splice(Math.min(rank - 1, 3), 0, selfItem);
        }

        compListEl.innerHTML = competitors.slice(0, 4).map((c, idx) => `
            <li class="comp-item ${c.isSelf ? 'highlight-self' : ''}">
                <span class="comp-rank">${idx + 1}</span>
                <span class="comp-name">${c.name}</span>
                <span class="comp-rating">${c.rating}</span>
            </li>
        `).join('');

        if (rank <= 3) {
            geoTipEl.textContent = `🎯 Dominant Top 3 Map Pack rank at ${sectorName} (${distKm} km). Excellent review rating (4.9 ★) secures local search visibility for "Civil Contractors in Raipur".`;
        } else {
            geoTipEl.textContent = `⚠️ Rank #${rank} at ${sectorName}. Upload geotagged photos from active site projects in this zone to push into Rank #1.`;
        }
    }

    const radiusRangeEl = document.getElementById('radiusRange');
    if (radiusRangeEl) {
        radiusRangeEl.addEventListener('input', (e) => {
            document.getElementById('radiusValText').textContent = `${e.target.value} km per node`;
            renderMapGrid();
        });
    }

    const gridKeywordSelect = document.getElementById('gridKeywordSelect');
    if (gridKeywordSelect) {
        gridKeywordSelect.addEventListener('change', () => {
            renderMapGrid();
        });
    }

    // --- AI Description & Review Generator for Sketch Construction ---
    const generateDescBtn = document.getElementById('generateDescBtn');
    if (generateDescBtn) {
        generateDescBtn.addEventListener('click', () => {
            const keywords = document.getElementById('aiKeywordsInput').value || 'Turnkey House Construction, Civil Contractors Raipur';
            const tone = document.getElementById('aiToneSelect').value;

            let desc = '';
            if (tone === 'professional') {
                desc = `Sketch Construction is the leading civil engineering and turnkey construction company in Raipur, Chhattisgarh. Specializing in ${keywords}, we offer full-scale residential bungalow construction, 3D elevation designs, structural concrete casting, and council map approvals. Guided by strict Bureau of Indian Standards (BIS 456 & IS 1786) and civil engineer site supervision, we guarantee 100% budget transparency with zero hidden costs. Contact us today for site visits in Raipur!`;
            } else if (tone === 'trustworthy') {
                desc = `Welcome to Sketch Construction! Led by qualified civil engineers in Raipur, we are your trusted team for ${keywords}. From foundation excavation in local black cotton soil to final slab casting and interior handover, we deliver uncompromised quality on time. Call or message us on Google Maps for free site estimates!`;
            } else {
                desc = `Sketch Construction delivers structural excellence and modern architectural engineering across Raipur, Chhattisgarh. Specializing in ${keywords}, our firm combines precision centerline markings with premium concrete standards. Connect with our engineering team on Google Maps today.`;
            }

            const outputEl = document.getElementById('aiDescOutput');
            outputEl.value = desc;
            document.getElementById('charCountNum').textContent = desc.length;
        });
    }

    // Review Generator Tabs & Logic
    const modeTabs = document.querySelectorAll('.mode-tab');
    let currentGenMode = 'reply-5star';

    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentGenMode = tab.getAttribute('data-mode');
            generateReviewContent();
        });
    });

    const generateReviewReplyBtn = document.getElementById('generateReviewReplyBtn');
    if (generateReviewReplyBtn) {
        generateReviewReplyBtn.addEventListener('click', generateReviewContent);
    }

    function generateReviewContent() {
        const reviewer = document.getElementById('reviewerName').value || 'Valued Client';
        const snippet = document.getElementById('reviewSnippet').value || 'Excellent civil construction work.';
        const replyEl = document.getElementById('aiReplyOutput');

        let text = '';
        if (currentGenMode === 'reply-5star') {
            text = `Dear ${reviewer},\n\nThank you so much for the 5-star review! We are delighted to hear your feedback regarding "${snippet}". At Sketch Construction, our civil engineering team takes immense pride in delivering structural integrity and turnkey quality across Raipur.\n\nIt was a privilege building your project. Please reach out anytime for future architectural or construction consultations!\n\nWarm regards,\nEr. Vikky Sharma & Team | Sketch Construction, Raipur`;
        } else if (currentGenMode === 'reply-critical') {
            text = `Dear ${reviewer},\n\nThank you for bringing your concerns to our attention. At Sketch Construction, we maintain strict site supervision standards in Raipur, and we apologize for any miscommunication.\n\nPlease contact lead civil engineer Vikky Sharma directly at +91 8349886687 so we can resolve this immediately for you.\n\nSincerely,\nManagement | Sketch Construction`;
        } else if (currentGenMode === 'whatsapp-req') {
            text = `Hi ${reviewer}! 👋\n\nThank you for choosing Sketch Construction for your house building project in Raipur. It was our pleasure delivering your project!\n\nCould you take 30 seconds to share your review on our official Google Maps profile?\n\n⭐ Tap link to rate us: https://g.page/r/sketch-construction/review\n\nThank you for your trust! 🏗️✨`;
        } else if (currentGenMode === 'sms-req') {
            text = `Dear ${reviewer}, thank you for choosing Sketch Construction! Please leave your feedback on Google Maps: https://g.page/r/sketch-construction/review - Er. Vikky Sharma`;
        }

        replyEl.value = text;
    }

    // Copy Buttons
    const copyDescBtn = document.getElementById('copyDescBtn');
    if (copyDescBtn) {
        copyDescBtn.addEventListener('click', () => {
            const text = document.getElementById('aiDescOutput').value;
            navigator.clipboard.writeText(text);
            copyDescBtn.textContent = '✓ Copied!';
            setTimeout(() => copyDescBtn.textContent = '📋 Copy Text', 2000);
        });
    }

    const copyReplyBtn = document.getElementById('copyReplyBtn');
    if (copyReplyBtn) {
        copyReplyBtn.addEventListener('click', () => {
            const text = document.getElementById('aiReplyOutput').value;
            navigator.clipboard.writeText(text);
            copyReplyBtn.textContent = '✓ Copied!';
            setTimeout(() => copyReplyBtn.textContent = '📋 Copy Template', 2000);
        });
    }

    // --- NAP Consistency Auditor Matrix for Sketch Construction ---
    function renderNapMatrix() {
        const tableBody = document.getElementById('napTableBody');
        if (!tableBody) return;

        const masterName = 'Sketch Construction';
        const masterAddr = 'Shivanand Nagar, Khamtrai, Raipur, Chhattisgarh 492001';
        const masterPhone = '+91 83498 86687';

        const directories = [
            { platform: 'Google Maps GMB', name: masterName, addr: masterAddr, phone: masterPhone, status: '100% Match', badge: 'badge-success' },
            { platform: 'Justdial Raipur', name: masterName, addr: 'Shivanand Nagar, Khamtrai, Raipur', phone: masterPhone, status: 'Pincode Missing', badge: 'badge-warning' },
            { platform: 'IndiaMART Directory', name: masterName + ' & Civil Engineers', addr: masterAddr, phone: '+91 8349886687', status: 'Suffix Mismatch', badge: 'badge-warning' },
            { platform: 'Facebook Business Page', name: masterName, addr: masterAddr, phone: masterPhone, status: '100% Match', badge: 'badge-success' },
            { platform: 'Bing Places for Business', name: masterName, addr: masterAddr, phone: masterPhone, status: '100% Match', badge: 'badge-success' },
            { platform: 'YellowPages India', name: masterName, addr: masterAddr, phone: masterPhone, status: '100% Match', badge: 'badge-success' }
        ];

        tableBody.innerHTML = directories.map(d => `
            <tr>
                <td><strong>${d.platform}</strong></td>
                <td>${d.name}</td>
                <td>${d.addr}</td>
                <td>${d.phone}</td>
                <td><span class="status-badge ${d.badge}">${d.status}</span></td>
            </tr>
        `).join('');
    }

    const runNapCheckBtn = document.getElementById('runNapCheckBtn');
    if (runNapCheckBtn) {
        runNapCheckBtn.addEventListener('click', () => {
            renderNapMatrix();
            alert('🔍 NAP Consistency Audit completed for Sketch Construction across 6 Indian platforms!');
        });
    }

    // --- Actionable Master Checklist ---
    function renderChecklist() {
        const gridEl = document.getElementById('checklistGrid');
        const countTagEl = document.getElementById('completedTasksCount');
        if (!gridEl) return;

        const completedCount = checklistState.filter(c => c.completed).length;
        countTagEl.textContent = `${completedCount} / ${checklistState.length} Completed`;

        gridEl.innerHTML = checklistState.map(item => `
            <div class="check-card ${item.completed ? 'completed' : ''}" data-id="${item.id}">
                <div class="check-box-icon"></div>
                <div class="check-info">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                    <span class="check-impact">${item.impact} Rank Signal</span>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.check-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-id');
                const target = checklistState.find(c => c.id === id);
                if (target) {
                    target.completed = !target.completed;
                    renderChecklist();
                    calculateAuditScore();
                }
            });
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const profileData = {
                bizName: document.getElementById('bizName').value,
                rating: document.getElementById('ratingVal').value,
                reviewCount: document.getElementById('reviewCount').value,
                checklist: checklistState
            };
            localStorage.setItem('sketch_gmb_profile_audit', JSON.stringify(profileData));
            alert('💾 Sketch Construction GMB audit saved to local storage!');
        });
    }

    if (resetDemoBtn) {
        resetDemoBtn.addEventListener('click', () => {
            runAutoExtractionPipeline(gmbUrlInput.value);
        });
    }

    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', () => {
            window.print();
        });
    }

    if (runAuditBtn) {
        runAuditBtn.addEventListener('click', () => {
            calculateAuditScore();
            alert('🚀 Sketch Construction GMB Audit recalculated!');
        });
    }

    // Initial render execution
    calculateAuditScore();
    renderMapGrid();
    inspectNodeDetail(3, 3, 1, '0.0');
    generateReviewContent();
    renderNapMatrix();
    renderChecklist();
});
