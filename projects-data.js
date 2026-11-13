/**
 * SKETCH CONSTRUCTION - ONGOING PROJECTS & SITE PHOTO GALLERY DATA MODULE
 * Author: Antigravity AI
 */

// Default initial ongoing projects & site photos seed data
export const DEFAULT_PROJECTS = [
    {
        id: "proj-1",
        title: "Sector 12 Luxury Duplex Villa",
        location: "Sector 12, Naya Raipur, CG",
        category: "ongoing",
        progress: 75,
        stage: "Slab & Column Casting",
        date: "October 2026",
        engineer: "Er. Vikky Sharma",
        description: "3-story luxury duplex villa construction featuring G+2 structural frame, cantilever balconies, and deep foundation engineered for local clay soils.",
        coverImage: "assets/sector12_duplex.webp",
        photos: [
            {
                id: "photo-1-1",
                url: "assets/sector12_duplex.webp",
                stageName: "G+2 Structural Frame Scaffolding",
                date: "Oct 02, 2026",
                caption: "Full shuttering and scaffolding setup prior to 2nd-floor slab casting. Centerline plumb-lines verified on-site.",
                verified: true
            },
            {
                id: "photo-1-2",
                url: "assets/sector12_drawing.webp",
                stageName: "Structural Elevation Blueprint Verification",
                date: "Sep 25, 2026",
                caption: "Technical level height mapping (LVL +0' to +42') and column alignment checked according to architectural blueprints.",
                verified: true
            },
            {
                id: "photo-1-3",
                url: "assets/hero_luxury.webp",
                stageName: "Upper Slab Concrete Casting & Vibration",
                date: "Sep 18, 2026",
                caption: "Monolithic slab pouring using M25 grade concrete mix and mechanical needle vibrators for zero honeycombing.",
                verified: true
            },
            {
                id: "photo-1-4",
                url: "assets/concrete_material.webp",
                stageName: "BIS 456 M25 Slump & Concrete Cube Strength Check",
                date: "Sep 10, 2026",
                caption: "Slump cone test performed on-site for workability, and sample test cubes cast for 28-day compression testing.",
                verified: true
            }
        ]
    },
    {
        id: "proj-2",
        title: "VIP Road Residential Bungalow",
        location: "VIP Road, Khamtrai, Raipur, CG",
        category: "ongoing",
        progress: 60,
        stage: "Plinth Beam & Column Rebar",
        date: "September 2026",
        engineer: "Er. Vikky Sharma",
        description: "Premium residential bungalow with high-strength Fe 550D TMT reinforcement steel and raft foundation for maximum seismic resistance.",
        coverImage: "assets/concrete_material.webp",
        photos: [
            {
                id: "photo-2-1",
                url: "assets/concrete_material.webp",
                stageName: "Column TMT Steel Cage Binding (IS 1786)",
                date: "Sep 28, 2026",
                caption: "Vertical rebar cages bound with 8mm stirrups at 150mm c/c spacing. Clear concrete cover of 40mm strictly maintained.",
                verified: true
            },
            {
                id: "photo-2-2",
                url: "assets/blueprint_schematic.webp",
                stageName: "Foundation Excavation & PCC Bedding",
                date: "Sep 05, 2026",
                caption: "1.5m deep footing excavation completed down to hard strata layer with 100mm PCC M10 lean concrete base.",
                verified: true
            }
        ]
    },
    {
        id: "proj-3",
        title: "Shivanand Nagar G+2 Duplex Frame",
        location: "Shivanand Nagar, Khamtrai, Raipur, CG",
        category: "completed",
        progress: 100,
        stage: "Turnkey Carcass Handover",
        date: "August 2026",
        engineer: "Er. Vikky Sharma",
        description: "3,200 sq.ft. duplex civil carcass complete with internal brick masonry, electrical wall conduits, and 21-day moisture curing.",
        coverImage: "assets/hero_luxury.webp",
        photos: [
            {
                id: "photo-3-1",
                url: "assets/hero_luxury.webp",
                stageName: "Completed Structural Frame Handover",
                date: "Aug 20, 2026",
                caption: "Structural shell fully cast and moisture cured. Handed over to client on schedule with 100% BIS compliance certificate.",
                verified: true
            }
        ]
    },
    {
        id: "proj-4",
        title: "Sadar Bazar Centerline Layout",
        location: "Sadar Bazar, Raipur, CG",
        category: "engineering",
        progress: 100,
        stage: "Centerline Grid & Footing Layout",
        date: "August 2026",
        engineer: "Er. Vikky Sharma",
        description: "Physical grid markings, centerline mapping coordinates, and load-bearing column orientation calculations for commercial and residential shops.",
        coverImage: "assets/blueprint_schematic.webp",
        blueprintUrl: "blueprint-viewer.html?project=sadarbazar",
        photos: [
            {
                id: "photo-4-1",
                url: "assets/blueprint_schematic.webp",
                stageName: "Centerline Layout & Axis Marking",
                date: "Aug 15, 2026",
                caption: "Total station survey and centerline grid lines laid out with 0mm angular error tolerance.",
                verified: true
            },
            {
                id: "photo-4-2",
                url: "assets/concrete_material.webp",
                stageName: "Column Footing Excavation Alignment",
                date: "Aug 18, 2026",
                caption: "Excavation depth and column coordinates cross-verified against municipal approved drawings.",
                verified: true
            }
        ]
    },
    {
        id: "proj-5",
        title: "Sector 12 Elevation Plan (Naya Raipur)",
        location: "Sector 12, Naya Raipur, CG",
        category: "ongoing",
        progress: 85,
        stage: "Architectural Elevation & Structural Drafting",
        date: "September 2026",
        engineer: "Er. Vikky Sharma",
        description: "Ongoing structural drafting and technical level height mapping (LVL +0' to +42') for modern multi-story luxury duplex shell.",
        coverImage: "assets/sector12_drawing.webp",
        blueprintUrl: "blueprint-viewer.html?project=sector12",
        photos: [
            {
                id: "photo-5-1",
                url: "assets/sector12_drawing.webp",
                stageName: "Front Elevation CAD Drafting",
                date: "Sep 22, 2026",
                caption: "Detailed working drawing with cantilever balcony projections, sunshade depths, and floor levels mapped.",
                verified: true
            },
            {
                id: "photo-5-2",
                url: "assets/sector12_duplex.webp",
                stageName: "Actual On-Site Execution Alignment",
                date: "Oct 05, 2026",
                caption: "Actual on-site civil frame matching CAD elevation dimensions to perfection.",
                verified: true
            }
        ]
    }
];

const LOCAL_STORAGE_KEY = 'sketch_construction_projects_v1';
const API_SYNC_URL = 'https://sketch-whatsapp-api.onrender.com/api/projects';

/**
 * Get all project galleries from Render Cloud Sync, Supabase, or LocalStorage fallback
 */
export async function getProjects() {
    // 1. Fetch live projects from Render Cloud Sync API (so public visitors see new photos)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(API_SYNC_URL, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data) && data.length > 0) {
                saveProjectsToLocal(data);
                return data;
            }
        }
    } catch (apiErr) {
        // Fallback to local
    }

    // 2. Static projects.json fallback (serves directly from GitHub Pages CDN)
    try {
        const jsonRes = await fetch('projects.json?v=' + Date.now());
        if (jsonRes.ok) {
            const jsonData = await jsonRes.json();
            if (jsonData && Array.isArray(jsonData) && jsonData.length > 0) {
                saveProjectsToLocal(jsonData);
                return jsonData;
            }
        }
    } catch (e) {}

    // 3. LocalStorage fallback
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch (e) {
            console.error('Failed to parse local projects:', e);
        }
    }

    // 4. Default seed data
    saveProjectsToLocal(DEFAULT_PROJECTS);
    return DEFAULT_PROJECTS;
}

/**
 * Save projects array to local storage safely
 */
export function saveProjectsToLocal(projects) {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
        console.warn('LocalStorage save warning (storage may be full):', e);
    }
}

/**
 * Save / Update a Project (Render Cloud + Supabase + LocalStorage)
 */
export async function saveProject(projectData) {
    let projects = await getProjects();
    const index = projects.findIndex(p => p.id === projectData.id);

    if (index >= 0) {
        projects[index] = { ...projects[index], ...projectData };
    } else {
        if (!projectData.id) {
            projectData.id = 'proj-' + Date.now();
        }
        projects.unshift(projectData);
    }

    saveProjectsToLocal(projects);

    // Sync to Render cloud backend so all visitors immediately see updates
    try {
        fetch(API_SYNC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projects)
        }).catch(err => console.warn('Render projects sync notice:', err));
    } catch (e) {}

    return projects;
}

/**
 * Delete a Project
 */
export async function deleteProject(projectId) {
    let projects = await getProjects();
    projects = projects.filter(p => p.id !== projectId);
    saveProjectsToLocal(projects);

    try {
        fetch(API_SYNC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projects)
        }).catch(err => console.warn('Render delete sync notice:', err));
    } catch (e) {}

    return projects;
}

/**
 * High-performance client-side image compression
 * Downscales phone camera photos (5-15MB) to crisp WebP/JPEG (~100KB-150KB)
 */
export async function compressImage(file, options = {}) {
    const maxWidth = options.maxWidth || 1600;
    const maxHeight = options.maxHeight || 1600;
    const quality = options.quality !== undefined ? options.quality : 0.82;

    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image/')) {
            return reject(new Error('Selected file is not an image'));
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Scale down keeping aspect ratio
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                // White background to avoid black background on transparent PNGs converted to JPEG
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);

                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', quality);

                canvas.toBlob((blob) => {
                    const origKB = Math.round(file.size / 1024);
                    const compKB = blob ? Math.round(blob.size / 1024) : Math.round((dataUrl.length * 0.75) / 1024);
                    const savedPct = origKB > 0 ? Math.round(((origKB - compKB) / origKB) * 100) : 0;

                    resolve({
                        blob: blob || null,
                        dataUrl,
                        width,
                        height,
                        originalSizeKB: origKB,
                        compressedSizeKB: compKB,
                        savingsPercent: Math.max(0, savedPct),
                        fileName: file.name.replace(/\.[^/.]+$/, "") + ".jpg"
                    });
                }, 'image/jpeg', quality);
            };
            img.onerror = () => reject(new Error('Failed to load image for processing'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Upload Image to Cloud CDN (Permanent Public CDN via Render API / ImgBB with Local Fallback)
 */
export async function uploadImageToCloud(imageInput, fileName = 'site_photo.jpg', customApiKey = '') {
    const key = customApiKey || localStorage.getItem('sketch_imgbb_api_key') || '';

    // Convert input to base64 dataUrl if needed
    let dataUrl = '';
    if (typeof imageInput === 'string' && imageInput.startsWith('data:')) {
        dataUrl = imageInput;
    } else if (imageInput instanceof Blob) {
        dataUrl = await new Promise((resolve) => {
            const r = new FileReader();
            r.onload = e => resolve(e.target.result);
            r.readAsDataURL(imageInput);
        });
    }

    // 1. If ImgBB key is configured, upload to ImgBB free permanent CDN
    if (key && key.trim().length > 5) {
        try {
            const formData = new FormData();
            if (dataUrl) {
                const base64Clean = dataUrl.split(',')[1];
                formData.append('image', base64Clean);
            }

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key.trim())}`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data && data.success && data.data && data.data.url) {
                return {
                    success: true,
                    url: data.data.display_url || data.data.url,
                    thumb: data.data.thumb ? data.data.thumb.url : null,
                    provider: 'ImgBB Cloud CDN',
                    isCloud: true
                };
            }
        } catch (netErr) {
            console.warn('ImgBB Network failed:', netErr);
        }
    }

    // 2. High-speed Permanent Public Cloud CDN via Render Backend API
    if (dataUrl) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 18000); // 18s timeout

            const res = await fetch('https://sketch-whatsapp-api.onrender.com/api/upload-photo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: dataUrl,
                    fileName: fileName
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data && data.success && data.url) {
                    return {
                        success: true,
                        url: data.url,
                        provider: 'Permanent Public CDN',
                        isCloud: true
                    };
                }
            }
        } catch (cdnErr) {
            console.warn('Render Cloud Photo CDN upload notice:', cdnErr.message);
        }
    }

    // 3. Fallback to optimized compressed data URL if offline
    return {
        success: true,
        url: dataUrl,
        provider: 'Optimized Local Image',
        isCloud: false
    };
}

/**
 * Quick Add Photo to an Existing Project
 */
export async function addPhotoToProject(projectId, photoData) {
    let projects = await getProjects();
    const proj = projects.find(p => p.id === projectId);
    if (!proj) throw new Error('Project not found: ' + projectId);
    if (!proj.photos) proj.photos = [];

    const newPhoto = {
        id: 'photo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        url: photoData.url,
        stageName: photoData.stageName || proj.stage || 'Ongoing Site Stage',
        date: photoData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        caption: photoData.caption || 'Inspection verified by Er. Vikky Sharma.',
        verified: true
    };

    // Prepend new photo
    proj.photos.unshift(newPhoto);

    // Update cover if requested or if default
    if (photoData.setCover || !proj.coverImage || proj.coverImage === 'assets/hero_luxury.webp') {
        proj.coverImage = photoData.url;
    }

    if (photoData.stageName) {
        proj.stage = photoData.stageName;
    }

    await saveProject(proj);
    return { project: proj, photo: newPhoto };
}

/**
 * Quick Create a New Project with Initial Photo
 */
export async function createQuickProject(projectData) {
    const newProj = {
        id: 'proj-' + Date.now(),
        title: projectData.title || 'New Construction Site',
        location: projectData.location || 'Raipur, Chhattisgarh',
        category: projectData.category || 'ongoing',
        progress: parseInt(projectData.progress) || 60,
        stage: projectData.stage || 'Structure Casting',
        engineer: projectData.engineer || 'Er. Vikky Sharma',
        description: projectData.description || 'Full-scale structural civil construction and on-site engineering supervision in Raipur.',
        coverImage: projectData.coverImage || 'assets/hero_luxury.webp',
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        photos: projectData.photos || []
    };

    await saveProject(newProj);
    return newProj;
}

/**
 * Export current projects data as downloadable JS file (projects-data.js)
 */
export async function exportProjectsAsModule() {
    const projects = await getProjects();
    const code = `/**
 * SKETCH CONSTRUCTION - ONGOING PROJECTS & SITE PHOTO GALLERY DATA MODULE
 * Exported on ${new Date().toLocaleString()}
 */

export const DEFAULT_PROJECTS = ${JSON.stringify(projects, null, 4)};
`;
    return code;
}
