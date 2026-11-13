import { getProjects, DEFAULT_PROJECTS } from './projects-data.js';

/**
 * SKETCH CONSTRUCTION - INTERACTIVE WEB LOGIC
 * Author: Antigravity AI
 */

// Google Sheets Webhook URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwglzYMYtqKipDQYItFMRkx7fEwinL-FUQHx2Uo7FS6ZpQzF7GJcfQKTJSd6U4OdYiD7w/exec';

function initApp() {

    // ==========================================
    // 1. HEADER SCROLL EFFECT & MOBILE TOGGLE
    // ==========================================
    const header = document.querySelector('.main-header');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
            mobileToggle.classList.toggle('active');
            
            // Animated sandwich icon to 'X' transition
            const bars = mobileToggle.querySelectorAll('.bar');
            if (mobileToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // Close menu when links are clicked on mobile
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && mobileToggle) {
                navMenu.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
                const bars = mobileToggle.querySelectorAll('.bar');
                if (bars.length > 2) {
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            }
        });
    });


    // ==========================================
    // 2. BLUEPRINT-TO-REALITY DRAG SLIDER
    // ==========================================
    const slider = document.getElementById('splitSlider');
    const realitySlide = document.getElementById('realitySlide');
    const handle = document.getElementById('sliderHandle');

    if (slider && realitySlide && handle) {
        let isDragging = false;

        const moveSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            let position = (clientX - rect.left) / rect.width;
            
            // Boundary constraints
            if (position < 0.05) position = 0.05;
            if (position > 0.95) position = 0.95;
            
            const percent = position * 100;
            realitySlide.style.width = `${percent}%`;
            handle.style.left = `${percent}%`;
        };

        // Desktop drag events
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            slider.classList.add('dragging');
            e.preventDefault(); // Prevents image dragging ghost behaviour
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            slider.classList.remove('dragging');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            moveSlider(e.clientX);
        });

        // Touch/Mobile events
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
            slider.classList.add('dragging');
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
            slider.classList.remove('dragging');
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches.length > 0) {
                moveSlider(e.touches[0].clientX);
            }
        });

        // Click anywhere on slider to jump to that division
        slider.addEventListener('click', (e) => {
            if (e.target.closest('#sliderHandle')) return;
            moveSlider(e.clientX);
        });
    }


    // ==========================================
    // 3. STATS IN-VIEW COUNTING ANIMATION
    // ==========================================
    const statsCompliance = document.getElementById('statsCompliance');
    let statsAnimated = false;

    const animateStats = () => {
        if (!statsCompliance || statsAnimated) return;
        
        const rect = statsCompliance.getBoundingClientRect();
        const inView = (rect.top <= window.innerHeight) && (rect.bottom >= 0);
        
        if (inView) {
            statsAnimated = true;
            let current = 0;
            const target = 100; // 100% compliance target
            const duration = 1500; // Time in ms
            const step = Math.ceil(duration / target);

            const interval = setInterval(() => {
                current += 1;
                statsCompliance.textContent = current + '%';
                if (current >= target) {
                    statsCompliance.textContent = target + '%';
                    clearInterval(interval);
                }
            }, step);
        }
    };

    window.addEventListener('scroll', animateStats);
    // Initial check in case it's in view on load
    animateStats();


    // ==========================================
    // 4. PORTFOLIO FILTER CATEGORIES
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Manage Active states
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            const currentItems = document.querySelectorAll('.portfolio-item');

            currentItems.forEach(item => {
                const category = item.getAttribute('data-category') || '';
                const classes = item.className || '';
                
                // Matches if "all", or category attribute contains filterValue, or class contains filterValue
                const isMatch = filterValue === 'all' || 
                    category.split(' ').includes(filterValue) || 
                    classes.split(' ').includes(filterValue);

                item.style.transform = 'scale(0.85)';
                item.style.opacity = '0';

                setTimeout(() => {
                    if (isMatch) {
                        item.classList.remove('hidden');
                        item.style.display = '';
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.classList.add('hidden');
                        item.style.display = 'none';
                    }
                }, 200);
            });
        });
    });


    // ==========================================
    // 5. TENDER SUBMISSION FORM & FILE INPUT
    // ==========================================
    const fileInput = document.getElementById('projectBriefFile');
    const fileNameLabel = document.getElementById('fileNameLabel');
    const fileContainer = document.getElementById('fileUploadContainer');
    
    if (fileInput && fileNameLabel) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const name = e.target.files[0].name;
                const sizeMB = (e.target.files[0].size / (1024 * 1024)).toFixed(2);
                fileNameLabel.textContent = `Attached: ${name} (${sizeMB} MB)`;
                fileContainer.style.borderColor = 'var(--primary)';
                fileContainer.style.backgroundColor = 'rgba(255, 184, 0, 0.05)';
            } else {
                fileNameLabel.textContent = 'Upload Blueprint / Site Layout (PDF, DWG up to 20MB)';
                fileContainer.style.borderColor = 'var(--border-color)';
                fileContainer.style.backgroundColor = 'transparent';
            }
        });
    }

    const tenderForm = document.getElementById('tenderForm');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetFormBtn');

    if (tenderForm && formSuccess) {
        tenderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Disable submit button during processing
            const submitBtn = document.getElementById('submitBtn');
            const submitText = submitBtn.querySelector('span');
            submitBtn.disabled = true;
            submitText.textContent = 'Processing...';

            const nameValue = document.getElementById('clientName').value;
            const emailValue = document.getElementById('clientEmail').value;
            const phoneValue = document.getElementById('clientPhone').value;
            const projectTypeValue = document.getElementById('projectType').value;
            const budgetValue = document.getElementById('projectScale').value;
            const descriptionValue = document.getElementById('projectBrief').value;
            const attachmentValue = fileInput.files.length > 0 ? fileInput.files[0].name : 'No attachment';

            const formData = {
                "Timestamp": new Date().toLocaleString(),
                // Name variations
                "NAME": nameValue,
                "NAME ": nameValue,
                "Name": nameValue,
                "name": nameValue,
                "Full Name": nameValue,
                "Full Name ": nameValue,
                "Full Name / Org": nameValue,
                "Full Name / Org ": nameValue,
                
                // Email variations
                "GMAIL ADDRESS": emailValue,
                "GMAIL ADDRESS ": emailValue,
                "Gmail Address": emailValue,
                "Email": emailValue,
                "email": emailValue,
                "Email ID": emailValue,
                "Email ID ": emailValue,
                
                // Phone variations
                "mobile number": phoneValue,
                "mobile number ": phoneValue,
                "Mobile Number": phoneValue,
                "Mobile Number ": phoneValue,
                "phone": phoneValue,
                "Phone": phoneValue,
                "Phone Number": phoneValue,
                "phone number": phoneValue,
                "WhatsApp Mobile Number": phoneValue,
                "WhatsApp Mobile Number ": phoneValue,
                "Contact": phoneValue,
                "contact": phoneValue,
                
                // Project type variations
                "project type": projectTypeValue,
                "project type ": projectTypeValue,
                "Project Type": projectTypeValue,
                "Project Type ": projectTypeValue,
                "type": projectTypeValue,
                "Type": projectTypeValue,
                
                // Budget / Scale variations
                "budget": budgetValue,
                "budget ": budgetValue,
                "Budget": budgetValue,
                "Estimated Scale": budgetValue,
                "Estimated Scale ": budgetValue,
                "scale": budgetValue,
                "Scale": budgetValue,
                
                // Description variations
                "discription": descriptionValue,
                "discription ": descriptionValue,
                "description": descriptionValue,
                "description ": descriptionValue,
                "Description": descriptionValue,
                "Project Outline & Technical Brief": descriptionValue,
                "Project Outline & Technical Brief ": descriptionValue,
                "message": descriptionValue,
                "Message": descriptionValue,
                "Message ": descriptionValue,
                
                // Attachment variations
                "Attachment": attachmentValue,
                "Attachment ": attachmentValue,
                "attachment": attachmentValue,
                "Upload Blueprint / Site Layout": attachmentValue,
                "Upload Blueprint / Site Layout ": attachmentValue,
                "Blueprint": attachmentValue,
                "blueprint": attachmentValue,
                "File": attachmentValue,
                "file": attachmentValue
            };

            // 1. Submit to Google Sheets (legacy webhook)
            if (GOOGLE_SHEET_URL) {
                const params = new URLSearchParams(formData);
                const uploadUrl = `${GOOGLE_SHEET_URL}?${params.toString()}`;

                fetch(uploadUrl, {
                    method: 'POST',
                    mode: 'no-cors'
                }).catch(error => console.error('Google Sheets submission error:', error));
            }

            // 2. Submit to WhatsApp & Supabase Integration API
            const apiPayload = {
                name: nameValue,
                email: emailValue,
                phone: phoneValue,
                project_type: projectTypeValue,
                budget: budgetValue,
                description: descriptionValue,
                attachment_url: attachmentValue
            };

            const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5000'
                : 'https://sketch-whatsapp-api.onrender.com';

            fetch(`${API_BASE}/api/lead`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiPayload)
            })
            .then(res => res.json())
            .then(data => {
                console.log('WhatsApp API Success:', data);
                formSuccess.classList.add('active');
                submitBtn.disabled = false;
                submitText.textContent = 'Get in Touch';
            })
            .catch(error => {
                console.warn('WhatsApp API Server Offline, falling back to client-only success display. Error:', error);
                // Fallback display to prevent UX block
                formSuccess.classList.add('active');
                submitBtn.disabled = false;
                submitText.textContent = 'Get in Touch';
            });
        });

        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                // Hide Overlay
                formSuccess.classList.remove('active');
                // Reset form inputs
                tenderForm.reset();
                // Reset custom file uploader
                fileNameLabel.textContent = 'Upload Blueprint / Site Layout (PDF, DWG up to 20MB)';
                fileContainer.style.borderColor = 'var(--border-color)';
                fileContainer.style.backgroundColor = 'transparent';
            });
        }
    }

    // ==========================================
    // 6. CIVIL MATERIAL & COST ESTIMATOR LOGIC
    // ==========================================
    const plotArea = document.getElementById('plotArea');
    const areaVal = document.getElementById('areaVal');
    const qualityGrade = document.getElementById('qualityGrade');
    const floorBtns = document.querySelectorAll('.floor-btn');
    
    const outCement = document.getElementById('outCement');
    const outSteel = document.getElementById('outSteel');
    const outSand = document.getElementById('outSand');
    const outCost = document.getElementById('outCost');

    let selectedFloors = 1;

    const calculateMaterials = () => {
        if (!plotArea || !qualityGrade) return;
        
        const area = parseInt(plotArea.value);
        const rate = parseInt(qualityGrade.value);
        const totalArea = area * selectedFloors;

        // Visual text updates
        if (areaVal) areaVal.textContent = area;

        // Quantitative estimations (standard civil engineering formulas)
        const cement = Math.round(totalArea * 0.4); 
        const steel = (totalArea * 0.0035).toFixed(1); 
        const sand = Math.round(totalArea * 0.024);
        const totalCost = totalArea * rate;

        // Output formatting
        if (outCement) outCement.textContent = cement;
        if (outSteel) outSteel.textContent = steel;
        if (outSand) outSand.textContent = sand;
        
        if (outCost) {
            outCost.textContent = '₹' + totalCost.toLocaleString('en-IN');
        }
    };

    if (plotArea) {
        plotArea.addEventListener('input', calculateMaterials);
    }
    if (qualityGrade) {
        qualityGrade.addEventListener('change', calculateMaterials);
    }
    
    floorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            floorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedFloors = parseInt(btn.getAttribute('data-floors'));
            calculateMaterials();
        });
    });

    // Run initial calculations
    calculateMaterials();

    // ==========================================
    // FAQ ACCORDION DROPDOWN TOGGLE LOGIC
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const isActive = item.classList.contains('active');
                
                // Close all other open FAQ accordion items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle clicked item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        }
    });

    // ==========================================
    // 7. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target); // Trigger reveal only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('in-view'));
    }

    // ==========================================
    // 8. FLOATING ACTION BUTTONS SCROLL DISPLAY
    // ==========================================
    const floatingBtn = document.getElementById('floatingContactBtn');
    const floatingWaBtn = document.getElementById('floatingWhatsappBtn');

    const handleFloatingBtns = () => {
        if (window.scrollY > 300) {
            if (floatingBtn) floatingBtn.classList.add('visible');
            // Stagger WhatsApp button appearance by 150ms
            if (floatingWaBtn) setTimeout(() => floatingWaBtn.classList.add('visible'), 150);
        } else {
            if (floatingBtn) floatingBtn.classList.remove('visible');
            if (floatingWaBtn) floatingWaBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleFloatingBtns);

    // ==========================================
    // 10. 3D CARD MOUSEMOVE TILT MICRO-INTERACTION
    // ==========================================
    const tiltCards = document.querySelectorAll('.service-card, .pillar-card, .compliance-card, .testimonial-card, .portfolio-item');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // ==========================================
    // 11. DYNAMIC ONGOING PROJECT GALLERY & LIGHTBOX MODAL
    // ==========================================
    // 12. ONGOING PROJECTS & SITE PHOTO GALLERY MODAL
    // ==========================================
    let projectsData = Array.isArray(DEFAULT_PROJECTS) ? [...DEFAULT_PROJECTS] : [];
    let currentModalProject = null;
    let currentModalPhotoIdx = 0;

    async function initProjectsGallery() {
        // First render synchronously with default projects so user sees content with zero wait
        renderOngoingProjectsCards();

        try {
            const liveData = await getProjects();
            if (liveData && Array.isArray(liveData) && liveData.length > 0) {
                projectsData = liveData;
                window.SKETCH_PROJECTS = liveData;
                renderOngoingProjectsCards();
            }
        } catch (e) {
            console.warn('Projects gallery background sync note:', e);
        }
    }

    function renderOngoingProjectsCards() {
        const grid = document.getElementById('portfolioGrid');
        if (!grid) return;

        // Find existing dynamically rendered ongoing cards and remove them to avoid duplicates
        const existingDynamic = grid.querySelectorAll('.dynamic-project-card');
        existingDynamic.forEach(el => el.remove());

        // For any projects created dynamically that aren't hardcoded in the static HTML:
        const hardcodedIds = ['proj-1', 'proj-2', 'proj-3'];

        projectsData.forEach(proj => {
            if (!hardcodedIds.includes(proj.id)) {
                const card = document.createElement('div');
                card.className = `portfolio-item ongoing ${proj.category || ''} dynamic-project-card reveal in-view`;
                card.setAttribute('data-category', `ongoing ${proj.category || 'residential'}`);
                card.style.cursor = 'pointer';

                const photoCount = proj.photos ? proj.photos.length : 1;
                const isOngoing = proj.category === 'ongoing' || proj.progress < 100;

                card.innerHTML = `
                    <div class="portfolio-image-box" onclick="window.openSitePhotoModal('${proj.id}')">
                        <img src="${proj.coverImage || (proj.photos && proj.photos[0] ? proj.photos[0].url : 'assets/hero_luxury.webp')}" alt="${proj.title}" width="1024" height="1024" loading="lazy">
                        <div class="portfolio-overlay">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span class="project-tag" style="${isOngoing ? 'background: rgba(74, 222, 128, 0.15); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.3);' : ''}">
                                    ${isOngoing ? '<span class="pulse-dot" style="display:inline-block; margin-right:5px; background:#4ade80;"></span> LIVE ONGOING SITE' : 'COMPLETED SITE'}
                                </span>
                                <span style="font-family: var(--font-technical); font-size: 11px; color: var(--primary); background: rgba(0,0,0,0.6); padding: 2px 8px; border-radius: 10px;">
                                    📸 ${photoCount} Photo${photoCount > 1 ? 's' : ''}
                                </span>
                            </div>
                            <h3>${proj.title}</h3>
                            <p class="project-desc">${proj.description}</p>
                            
                            <!-- Progress Track -->
                            <div style="margin: 12px 0 16px 0;">
                                <div style="display:flex; justify-content:space-between; font-size:11px; font-family:var(--font-technical); color:#FFF; margin-bottom:4px;">
                                    <span>${proj.stage || 'Construction Progress'}</span>
                                    <strong style="color:var(--primary);">${proj.progress || 0}%</strong>
                                </div>
                                <div style="height: 4px; background: rgba(255,255,255,0.15); border-radius: 2px; overflow: hidden;">
                                    <div style="width: ${proj.progress || 0}%; height: 100%; background: linear-gradient(90deg, #4ade80, var(--primary)); border-radius: 2px;"></div>
                                </div>
                            </div>

                            <span class="project-more">
                                View Site Photos & Inspection Log
                                <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                            </span>
                        </div>
                    </div>
                `;

                grid.insertBefore(card, grid.firstChild);
            }
        });
    }

    // Lightbox modal methods exposed globally
    window.openSitePhotoModal = function(projectId) {
        currentModalProject = (projectsData && projectsData.find(p => p.id === projectId)) ||
                              (DEFAULT_PROJECTS && DEFAULT_PROJECTS.find(p => p.id === projectId));
        if (!currentModalProject) return;

        currentModalPhotoIdx = 0;
        const modal = document.getElementById('sitePhotoModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            updateModalPhotoDisplay();
        }
    };

    window.closeSitePhotoModal = function() {
        const modal = document.getElementById('sitePhotoModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    window.selectSitePhoto = function(idx) {
        currentModalPhotoIdx = idx;
        updateModalPhotoDisplay();
    };

    window.prevSitePhoto = function() {
        if (!currentModalProject || !currentModalProject.photos) return;
        currentModalPhotoIdx = (currentModalPhotoIdx - 1 + currentModalProject.photos.length) % currentModalProject.photos.length;
        updateModalPhotoDisplay();
    };

    window.nextSitePhoto = function() {
        if (!currentModalProject || !currentModalProject.photos) return;
        currentModalPhotoIdx = (currentModalPhotoIdx + 1) % currentModalProject.photos.length;
        updateModalPhotoDisplay();
    };

    function updateModalPhotoDisplay() {
        if (!currentModalProject) return;

        const photos = currentModalProject.photos || [{ url: currentModalProject.coverImage, stageName: currentModalProject.stage, date: currentModalProject.date, caption: currentModalProject.description }];
        const currentPhoto = photos[currentModalPhotoIdx] || photos[0];

        document.getElementById('modalMainImg').src = currentPhoto.url;
        document.getElementById('modalStageBadge').textContent = currentPhoto.stageName || currentModalProject.stage || 'Site Photo';
        document.getElementById('modalProjectTitle').textContent = currentModalProject.title;
        document.getElementById('modalProjectLocation').innerHTML = `<i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> ${currentModalProject.location}`;
        
        document.getElementById('modalProgressVal').textContent = (currentModalProject.progress || 0) + '%';
        document.getElementById('modalProgressBar').style.width = (currentModalProject.progress || 0) + '%';

        document.getElementById('modalPhotoCaption').textContent = currentPhoto.caption || currentModalProject.description;
        document.getElementById('modalEngineer').textContent = currentModalProject.engineer || 'Er. Vikky Sharma';
        document.getElementById('modalPhotoDate').textContent = 'Date: ' + (currentPhoto.date || currentModalProject.date || 'Active');

        document.getElementById('modalPhotoCounter').textContent = `${currentModalPhotoIdx + 1} / ${photos.length}`;

        // WhatsApp inquiry deep link
        const waMsg = encodeURIComponent(`Hello Er. Vikky Sharma, I saw your ongoing site photos for "${currentModalProject.title}" in ${currentModalProject.location}. I would like to inquire about a similar construction project.`);
        document.getElementById('modalWhatsappBtn').href = `https://wa.me/918349886687?text=${waMsg}`;

        // Thumbnails
        const thumbContainer = document.getElementById('modalThumbnails');
        thumbContainer.innerHTML = '';
        photos.forEach((ph, i) => {
            const thumb = document.createElement('img');
            thumb.src = ph.url;
            thumb.className = `modal-thumb-item ${i === currentModalPhotoIdx ? 'active' : ''}`;
            thumb.onclick = () => window.selectSitePhoto(i);
            thumbContainer.appendChild(thumb);
        });
    }

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeSitePhotoModal();
        }
    });

    initProjectsGallery();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}


