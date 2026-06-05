/**
 * SKETCH CONSTRUCTION - INTERACTIVE WEB LOGIC
 * Author: Antigravity AI
 */

// Google Sheets Webhook URL (Deploy Apps Script for sheet: https://docs.google.com/spreadsheets/d/1EEov3pz7k2qLEzBmRN42Gk9kiHzPIEtdbIh6_t4YBkI/edit)
// Paste the generated deployment Web App URL below:
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwglzYMYtqKipDQYItFMRkx7fEwinL-FUQHx2Uo7FS6ZpQzF7GJcfQKTJSd6U4OdYiD7w/exec';

document.addEventListener('DOMContentLoaded', () => {

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
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Manage Active states
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Trigger transition animation scale
                item.style.transform = 'scale(0.8)';
                item.style.opacity = '0';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        item.classList.remove('hidden');
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.classList.add('hidden');
                    }
                }, 300);
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

            if (GOOGLE_SHEET_URL) {
                const params = new URLSearchParams(formData);
                const uploadUrl = `${GOOGLE_SHEET_URL}?${params.toString()}`;

                // Webhook submit to Google Sheet
                fetch(uploadUrl, {
                    method: 'POST',
                    mode: 'no-cors', 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(() => {
                    formSuccess.classList.add('active');
                    submitBtn.disabled = false;
                    submitText.textContent = 'Get in Touch';
                })
                .catch(error => {
                    console.error('Submission error:', error);
                    // fallback to show success on network error for preview purposes
                    formSuccess.classList.add('active');
                    submitBtn.disabled = false;
                    submitText.textContent = 'Get in Touch';
                });
            } else {
                // Simulate server verification delay
                setTimeout(() => {
                    formSuccess.classList.add('active');
                    submitBtn.disabled = false;
                    submitText.textContent = 'Get in Touch';
                }, 1500);
            }
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
});
