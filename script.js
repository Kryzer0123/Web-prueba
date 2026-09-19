// Importar las funciones necesarias de Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAijXCsoF0S5BxE8x6UBoHmrHfJBqiEuKI",
  authDomain: "web-prueba-bd043.firebaseapp.com",
  projectId: "web-prueba-bd043",
  storageBucket: "web-prueba-bd043.firebasestorage.app",
  messagingSenderId: "165726822435",
  appId: "1:165726822435:web:d0398c4b2229fe49111196",
  measurementId: "G-30FQDYJ12Z"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Instancia de la base de datos Firestore
window.isAdminLoggedIn = false;

window.handleAdminLogin = async function(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmailInput').value.trim();
  const password = document.getElementById('adminPasswordInput').value;
  const errorEl = document.getElementById('adminLoginError');
  const errorText = document.getElementById('errorText');

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDocRef = doc(db, "staff_users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().role === "admin") {
      window.isAdminLoggedIn = true;
      window.closeAdminModal();
      window.updateAdminUI(); 
      window.showToast("¡Sesión de Staff iniciada con éxito!", "success");
    } else {
      await signOut(auth);
      errorText.textContent = "Este usuario no tiene permisos de administrador en Firestore.";
      errorEl.classList.remove('hidden');
    }
  } catch (error) {
    console.error("Error en login:", error);
    errorText.textContent = "Error: " + error.message;
    errorEl.classList.remove('hidden');
  }
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "staff_users", user.uid));
    if (userDoc.exists() && userDoc.data().role === "admin") {
      window.isAdminLoggedIn = true;
      window.updateAdminUI();
    }
  }
});

const DEFAULT_RULES = [
  {
    id: "rule-1",
    code: "GEN-01",
    category: "CONCEPTOS",
    title: "Valorar la Vida (NVHQ)",
    penalty: "Ban 3 Días",
    summary: "Debes actuar en todo momento priorizando la supervivencia física e integridad de tu personaje.",
    description: "Tu personaje debe temer por su vida en situaciones donde esté encañonado o supere en número de armas. Ejemplo: Si una persona te encañona por la espalda a corta distancia, no puedes sacar un arma ni huir corriendo."
  },
  {
    id: "rule-2",
    code: "GEN-02",
    category: "CONCEPTOS",
    title: "Powergaming (PG)",
    penalty: "Ban 30m",
    summary: "Realizar acciones dentro del juego que no serían posibles en la vida real o forzar el rol de otros.",
    description: "Incluye conducir vehículos deportivos por montañas escarpadas a gran velocidad, andar normalmente tras sufrir un accidente grave sin rol de mecatrónica/heridas, o usar comandos para obligar a otro jugador sin opción de defensa."
  },
  {
    id: "rule-3",
    code: "GEN-03",
    category: "CONCEPTOS",
    title: "Metagaming (MG)",
    penalty: "Ban 1 Día",
    summary: "Utilizar información obtenida fuera del juego (OOC) para beneficio de tu personaje dentro del juego (IC).",
    description: "Queda estrictamente prohibido usar datos leídos en Discord, transmisiones de Twitch o chats externos para localizar jugadores, conocer identidades secretas o ejecutar venganzas en el servidor."
  }
  
];

const DEFAULT_FEATURE_DATA = {
  facciones: {
    description: "Policía, médicos, bomberos, gobierno, prensa, noticieros, restaurantes, mecánicos, concesionarios, ammunations, discotecas y mucho más: cada facción con sus propios sistemas inmersivos para vivir el rol como nunca.",
    items: [
      { id: 'item-1', title: "LSPD & Operativa Táctica", img: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=1200&q=80" },
      { id: 'item-2', title: "Servicios de Emergencia (EMS)", img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80" },
      { id: 'item-3', title: "Gobierno & Alcaldía", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" }
    ]
  },
  criminal: {
    description: "Bandas organizadas, mafias, laboratorios ocultos de sustancias ilícitas, atrevidos robos a bancos con planificación y control territorial de zonas conflictivas.",
    items: [
      { id: 'item-4', title: "Control Territorial & Bandas", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80" },
      { id: 'item-5', title: "Laboratorios Clandestinos", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80" }
    ]
  },
  civil: {
    description: "Desarrolla tu vida legal desde cero: consigue empleo de camionero, minero o pescador, compra tu propia casa, invierte en negocios y asciende en la sociedad.",
    items: [
      { id: 'item-6', title: "Trabajos Civiles Dinámicos", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80" },
      { id: 'item-7', title: "Bienes Raíces & Viviendas", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80" }
    ]
  },
  coches: {
    description: "Más de 200 vehículos importados exclusivos, manejo realista optimizado, sistema de tuning avanzado con piezas estéticas y mecánicas personalizables.",
    items: [
      { id: 'item-8', title: "Concesionario de Importación", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80" },
      { id: 'item-9', title: "Tuning & Personalización", img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80" }
    ]
  },
  sistemas: {
    description: "Optimización extrema a 60+ FPS, chat de voz 3D espacial con radio y teléfono móvil interactivo con aplicaciones bancarias, GPS y redes sociales.",
    items: [
      { id: 'item-10', title: "Teléfono Móvil Avanzado", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80" },
      { id: 'item-11', title: "Radio & Voz Espacial 3D", img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80" }
    ]
  }
};

const DEFAULT_PATCHES = [
  {
    id: "patch-1",
    version: "v2.5.0",
    date: "18 de Sep, 2026",
    category: "Major Update",
    title: "Actualización de Sistema Legal & Vehículos Importados",
    added: [
      "Nuevo MDIC Policial v3.0 con reconocimiento de matrículas automatizado.",
      "Concesionario de Importación exclusivo con 15 vehículos deportivos custom.",
      "Minijuego de Mecánica Avanzada para sintonización de motores."
    ],
    changed: [
      "Rebalanceo de precios de combustible en todas las gasolineras.",
      "Aumento de la velocidad de respuesta de las llamadas del 911."
    ],
    fixed: [
      "Corregido error de duplicación de objetos en inventarios de maletero.",
      "Solucionado desfase de sincronización en puertas de la Comisaría Central."
    ]
  }
];

const DEFAULT_CATEGORIES = [
  { id: 'cat-conceptos', name: '3. Conocimientos Básicos de Rol' },
  { id: 'cat-casos', name: '4. Resolución de Casos Prácticos' }
];

const DEFAULT_QUESTIONS = [
  { id: 'q-1', categoryId: 'cat-conceptos', type: 'textarea', text: '¿Qué es el Rol de Entorno (RE) y cómo debe aplicarse?', placeholder: 'Explícalo brevemente...' },
  { id: 'q-2', categoryId: 'cat-conceptos', type: 'textarea', text: '¿Cuál es la diferencia principal entre IC y OOC?', placeholder: 'Explícalo brevemente...' },
  { id: 'q-3', categoryId: 'cat-conceptos', type: 'textarea', text: 'Define Metagaming (MG) y pon un ejemplo de lo que no se debe hacer.', placeholder: 'Explícalo con un ejemplo...' },
  { id: 'q-4', categoryId: 'cat-conceptos', type: 'textarea', text: 'Define Powergaming (PG) y pon un ejemplo.', placeholder: 'Explícalo con un ejemplo...' },
  { id: 'q-5', categoryId: 'cat-conceptos', type: 'textarea', text: '¿Qué significa "Valor de la Vida" (NVL)?', placeholder: 'Explícalo brevemente...' },
  { id: 'q-6', categoryId: 'cat-casos', type: 'textarea', text: 'Situación 1: Vas caminando por una zona conflictiva y unos enmascarados te interceptan con armas de fuego para robarte sin vía de escape. ¿Cómo reaccionas?', placeholder: 'Describe la reacción de tu personaje...' },
  { id: 'q-7', categoryId: 'cat-casos', type: 'textarea', text: 'Situación 2: Sufres un aparatoso accidente automovilístico frontal a gran velocidad contra un poste. ¿Cuál es tu reacción inmediata de rol?', placeholder: 'Describe cómo interpretas las heridas y el entorno...' }
];

let rulesData = [];
let featureData = {};
let patchesData = [];
let whitelistAppsData = [];
let whitelistCategories = [];
let whitelistQuestions = [];
let currentCategory = 'ALL';
let currentFeatureTab = 'facciones';
let currentPatchCategory = 'ALL';

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

window.navigateTo = function(route) {
  const views = ['inicio', 'normativas', 'whitelist', 'notas-de-parche'];
  const targetRoute = views.includes(route) ? route : 'inicio';

  window.location.hash = targetRoute;

  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    const navEl = document.getElementById(`nav-${v}`);
    
    if (v === targetRoute) {
      if (el) {
        el.classList.remove('hidden-view');
        el.classList.add('active-view');
      }
      if (navEl) {
        navEl.classList.add('text-brand-500', 'font-black');
        navEl.classList.remove('text-slate-300');
      }
    } else {
      if (el) {
        el.classList.add('hidden-view');
        el.classList.remove('active-view');
      }
      if (navEl) {
        navEl.classList.remove('text-brand-500', 'font-black');
        navEl.classList.add('text-slate-300');
      }
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  window.navigateTo(hash);
});

function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 20), 60);
  let mouse = { x: width / 2, y: height / 2 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x -= (dx / dist) * 0.8;
        this.y -= (dy / dist) * 0.8;
      }
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(48, 169, 255, ${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#30a9ff';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(48, 169, 255, ${0.15 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

window.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  loadData();
  window.switchFeatureTab('facciones');
  renderRules();
  renderPatches();
  renderWhitelistFormBuilder();
  updateWhitelistBadge();

  const initialHash = window.location.hash.replace('#', '');
  window.navigateTo(initialHash || 'inicio');
});

function loadData() {
  const storedRules = localStorage.getItem('omerta_rp_rules');
  rulesData = storedRules ? JSON.parse(storedRules) : [...DEFAULT_RULES];

  const storedFeatures = localStorage.getItem('omerta_rp_feature_data');
  featureData = storedFeatures ? JSON.parse(storedFeatures) : JSON.parse(JSON.stringify(DEFAULT_FEATURE_DATA));

  const storedPatches = localStorage.getItem('omerta_rp_patches');
  patchesData = storedPatches ? JSON.parse(storedPatches) : [...DEFAULT_PATCHES];

  const storedWl = localStorage.getItem('omerta_rp_whitelist_apps');
  whitelistAppsData = storedWl ? JSON.parse(storedWl) : [];

  const storedCats = localStorage.getItem('omerta_rp_whitelist_categories');
  whitelistCategories = storedCats ? JSON.parse(storedCats) : [...DEFAULT_CATEGORIES];

  const storedQ = localStorage.getItem('omerta_rp_whitelist_questions');
  whitelistQuestions = storedQ ? JSON.parse(storedQ) : [...DEFAULT_QUESTIONS];
}

function saveData() {
  localStorage.setItem('omerta_rp_rules', JSON.stringify(rulesData));
  localStorage.setItem('omerta_rp_feature_data', JSON.stringify(featureData));
  localStorage.setItem('omerta_rp_patches', JSON.stringify(patchesData));
  localStorage.setItem('omerta_rp_whitelist_apps', JSON.stringify(whitelistAppsData));
  localStorage.setItem('omerta_rp_whitelist_categories', JSON.stringify(whitelistCategories));
  localStorage.setItem('omerta_rp_whitelist_questions', JSON.stringify(whitelistQuestions));
}

window.switchFeatureTab = function(tabKey) {
  currentFeatureTab = tabKey;
  const data = featureData[tabKey];
  if (!data) return;

  document.querySelectorAll('.feature-tab-btn').forEach(btn => {
    btn.className = "feature-tab-btn px-6 py-2.5 rounded-full text-xs font-extrabold transition-all bg-[#121826] text-slate-300 border border-slate-800 hover:border-slate-600";
  });

  const activeBtn = document.getElementById(`tab-btn-${tabKey}`);
  if (activeBtn) {
    activeBtn.className = "feature-tab-btn px-6 py-2.5 rounded-full text-xs font-extrabold transition-all bg-[#241c0c] text-[#facc15] border border-[#facc15]/50 shadow-[0_0_15px_rgba(250,204,21,0.2)]";
  }

  document.getElementById('featureDescriptionText').textContent = data.description;
  renderThumbnails(data.items);
};

function renderThumbnails(items) {
  const thumbsContainer = document.getElementById('featureThumbnailsContainer');
  thumbsContainer.innerHTML = '';

  if (!items || items.length === 0) {
    thumbsContainer.innerHTML = '<div class="col-span-2 text-xs text-slate-500 italic p-4">No hay imágenes en esta categoría. Usa el botón de Staff para añadir una.</div>';
    document.getElementById('mainFeatureDisplayImg').src = "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=1200&q=80";
    document.getElementById('mainFeatureCaption').textContent = "Sin imágenes";
    return;
  }

  items.forEach((item, index) => {
    const thumbDiv = document.createElement('div');
    thumbDiv.className = `rounded-2xl overflow-hidden glass-card border cursor-pointer transition-all h-24 relative group ${index === 0 ? 'border-[#facc15] shadow-[0_0_10px_rgba(250,204,21,0.3)]' : 'border-slate-800 hover:border-slate-600'}`;
    
    thumbDiv.onclick = () => {
      document.getElementById('mainFeatureDisplayImg').src = item.img;
      document.getElementById('mainFeatureCaption').textContent = item.title;
      
      thumbsContainer.querySelectorAll('div').forEach(d => {
        d.className = "rounded-2xl overflow-hidden glass-card border cursor-pointer transition-all h-24 relative group border-slate-800 hover:border-slate-600";
      });
      thumbDiv.className = "rounded-2xl overflow-hidden glass-card border cursor-pointer transition-all h-24 relative group border-[#facc15] shadow-[0_0_10px_rgba(250,204,21,0.3)]";
    };

    let deleteBtnHTML = '';
    if (window.isAdminLoggedIn) {
      deleteBtnHTML = `
        <button onclick="event.stopPropagation(); deleteFeatureImage('${item.id}')" class="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/80 text-white hover:bg-red-600 flex items-center justify-center text-[10px] z-20 shadow" title="Eliminar imagen">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;
    }

    thumbDiv.innerHTML = `
      ${deleteBtnHTML}
      <img src="${escapeHTML(item.img)}" alt="${escapeHTML(item.title)}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
      <div class="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors"></div>
      <div class="absolute bottom-1 left-2 right-2 text-[10px] font-bold text-white truncate drop-shadow">${escapeHTML(item.title)}</div>
    `;
    thumbsContainer.appendChild(thumbDiv);
  });

  if (items.length > 0) {
    document.getElementById('mainFeatureDisplayImg').src = items[0].img;
    document.getElementById('mainFeatureCaption').textContent = items[0].title;
  }
}

window.openFeatureImageModal = function() {
  if (!window.isAdminLoggedIn) return;
  const modal = document.getElementById('featureImageModal');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.remove('opacity-0', 'scale-95'), 10);
  document.getElementById('featureImgTitleInput').value = "";
  document.getElementById('featureImgUrlInput').value = "";
};

window.closeFeatureImageModal = function() {
  const modal = document.getElementById('featureImageModal');
  modal.classList.add('opacity-0', 'scale-95');
  setTimeout(() => modal.classList.add('hidden'), 300);
};

window.saveFeatureImage = function(e) {
  e.preventDefault();
  if (!window.isAdminLoggedIn) return;

  const title = document.getElementById('featureImgTitleInput').value.trim();
  const img = document.getElementById('featureImgUrlInput').value.trim();

  if (!featureData[currentFeatureTab]) {
    featureData[currentFeatureTab] = { description: "", items: [] };
  }

  const newItem = {
    id: 'item-' + Date.now(),
    title,
    img
  };

  featureData[currentFeatureTab].items.push(newItem);
  saveData();
  window.switchFeatureTab(currentFeatureTab);
  window.closeFeatureImageModal();
  window.showToast("Imagen añadida con éxito", "success");
};

window.deleteFeatureImage = function(itemId) {
  if (!window.isAdminLoggedIn) return;
  if (confirm("¿Estás seguro de eliminar esta imagen?")) {
    if (featureData[currentFeatureTab] && featureData[currentFeatureTab].items) {
      featureData[currentFeatureTab].items = featureData[currentFeatureTab].items.filter(i => i.id !== itemId);
      saveData();
      window.switchFeatureTab(currentFeatureTab);
      window.showToast("Imagen eliminada", "info");
    }
  }
};

function renderRules() {
  const container = document.getElementById('rulesContainer');
  const emptyState = document.getElementById('emptyRulesState');
  const searchInput = document.getElementById('rulesSearchInput');
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";

  if (!container) return;
  container.innerHTML = '';

  const filtered = rulesData.filter(rule => {
    const matchesCat = (currentCategory === 'ALL' || rule.category === currentCategory);
    const matchesSearch = rule.title.toLowerCase().includes(searchTerm) ||
                          rule.code.toLowerCase().includes(searchTerm) ||
                          rule.summary.toLowerCase().includes(searchTerm);
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  } else {
    emptyState.classList.add('hidden');
  }

  filtered.forEach((rule) => {
    const card = document.createElement('div');
    card.className = "glass-card rounded-2xl border border-brand-border p-5 hover:border-brand-500/50 transition-all duration-300 tilt-card";
    card.id = rule.id;

    let adminActions = '';
    if (window.isAdminLoggedIn) {
      adminActions = `
        <div class="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
          <button onclick="event.stopPropagation(); openEditRuleModal('${rule.id}')" class="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white text-xs font-bold transition-all">
            <i class="fa-solid fa-pen"></i> Editar
          </button>
          <button onclick="event.stopPropagation(); deleteRule('${rule.id}')" class="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition-all">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none" onclick="toggleAccordion('${rule.id}')">
        <div class="flex items-start gap-4">
          <span class="px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 font-extrabold text-xs whitespace-nowrap mt-0.5">
            ${escapeHTML(rule.code)}
          </span>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-lg font-extrabold text-white">${escapeHTML(rule.title)}</h3>
              <span class="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">${escapeHTML(rule.penalty)}</span>
            </div>
            <p class="text-slate-400 text-xs sm:text-sm mt-1">${escapeHTML(rule.summary)}</p>
          </div>
        </div>
        <div class="flex items-center justify-between md:justify-end gap-3 text-brand-400 font-bold text-xs">
          <span>Ver detalle</span>
          <i class="fa-solid fa-chevron-down transition-transform duration-300" id="icon-${rule.id}"></i>
        </div>
      </div>
      <div id="content-${rule.id}" class="accordion-content">
        <p class="text-slate-300 text-sm mt-3 pt-3 border-t border-slate-800 leading-relaxed">${escapeHTML(rule.description)}</p>
        ${adminActions}
      </div>
    `;
    container.appendChild(card);
  });
}

window.toggleAccordion = function(id) {
  const content = document.getElementById(`content-${id}`);
  const icon = document.getElementById(`icon-${id}`);
  if (!content) return;

  const isOpen = content.classList.contains('open');
  document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
  document.querySelectorAll('.fa-chevron-down').forEach(i => i.style.transform = 'rotate(0deg)');

  if (!isOpen) {
    content.classList.add('open');
    content.style.maxHeight = content.scrollHeight + 'px';
    if (icon) icon.style.transform = 'rotate(180deg)';
  } else {
    content.style.maxHeight = '0px';
  }
};

window.setCategoryFilter = function(cat) {
  currentCategory = cat;
  document.querySelectorAll('.category-tab').forEach(btn => {
    btn.className = "category-tab px-4 py-3 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-300 border border-slate-800 glass-card text-slate-400 hover:text-white hover:border-brand-500/50 hover:scale-105";
  });
  event.currentTarget.className = "category-tab active px-4 py-3 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-300 border border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:scale-105";
  renderRules();
};

window.filterRules = function() {
  renderRules();
};

window.openRuleModal = function() {
  if (!window.isAdminLoggedIn) return;
  const modal = document.getElementById('ruleFormModal');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.remove('opacity-0', 'scale-95'), 10);
  document.getElementById('modalFormTitle').textContent = "Agregar Nueva Normativa";
  document.getElementById('ruleEditId').value = "";
  document.getElementById('ruleCodeInput').value = "";
  document.getElementById('ruleTitleInput').value = "";
  document.getElementById('ruleSummaryInput').value = "";
  document.getElementById('ruleDescriptionInput').value = "";
};

window.openEditRuleModal = function(ruleId) {
  if (!window.isAdminLoggedIn) return;
  const rule = rulesData.find(r => r.id === ruleId);
  if (!rule) return;

  const modal = document.getElementById('ruleFormModal');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.remove('opacity-0', 'scale-95'), 10);
  document.getElementById('modalFormTitle').textContent = "Editar Normativa";
  document.getElementById('ruleEditId').value = rule.id;
  document.getElementById('ruleCodeInput').value = rule.code;
  document.getElementById('ruleCategoryInput').value = rule.category;
  document.getElementById('ruleTitleInput').value = rule.title;
  document.getElementById('rulePenaltyInput').value = rule.penalty;
  document.getElementById('ruleSummaryInput').value = rule.summary;
  document.getElementById('ruleDescriptionInput').value = rule.description;
};

window.closeRuleModal = function() {
  const modal = document.getElementById('ruleFormModal');
  modal.classList.add('opacity-0', 'scale-95');
  setTimeout(() => modal.classList.add('hidden'), 300);
};

window.saveRule = function(e) {
  e.preventDefault();
  if (!window.isAdminLoggedIn) return;

  const editId = document.getElementById('ruleEditId').value;
  const code = document.getElementById('ruleCodeInput').value.trim();
  const category = document.getElementById('ruleCategoryInput').value;
  const title = document.getElementById('ruleTitleInput').value.trim();
  const penalty = document.getElementById('rulePenaltyInput').value;
  const summary = document.getElementById('ruleSummaryInput').value.trim();
  const description = document.getElementById('ruleDescriptionInput').value.trim();

  if (editId) {
    const rule = rulesData.find(r => r.id === editId);
    if (rule) {
      rule.code = code;
      rule.category = category;
      rule.title = title;
      rule.penalty = penalty;
      rule.summary = summary;
      rule.description = description;
      window.showToast("Normativa actualizada con éxito", "success");
    }
  } else {
    const newRule = {
      id: 'rule-' + Date.now(),
      code,
      category,
      title,
      penalty,
      summary,
      description
    };
    rulesData.unshift(newRule);
    window.showToast("Normativa creada con éxito", "success");
  }

  saveData();
  renderRules();
  window.closeRuleModal();
};

window.deleteRule = function(ruleId) {
  if (!window.isAdminLoggedIn) return;
  if (confirm("¿Estás seguro de eliminar esta regla?")) {
    rulesData = rulesData.filter(r => r.id !== ruleId);
    saveData();
    renderRules();
    window.showToast("Normativa eliminada", "info");
  }
};

window.confirmResetRules = function() {
  if (confirm("¿Restablecer normativas predeterminadas? Se perderán los cambios personalizados.")) {
    rulesData = [...DEFAULT_RULES];
    saveData();
    renderRules();
    window.showToast("Normativas restablecidas", "info");
  }
};

function renderPatches() {
  const container = document.getElementById('patchesContainer');
  const emptyState = document.getElementById('emptyPatchesState');
  if (!container) return;
  container.innerHTML = '';

  const filtered = patchesData.filter(patch => {
    return currentPatchCategory === 'ALL' || patch.category === currentPatchCategory;
  });

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  } else {
    emptyState.classList.add('hidden');
  }

  filtered.forEach((patch) => {
    const item = document.createElement('div');
    item.className = "relative pl-8 sm:pl-12 group";

    let addedHTML = '';
    if (patch.added && patch.added.length > 0 && patch.added[0] !== "") {
      addedHTML = `<div class="space-y-1.5"><h5 class="text-xs font-black text-emerald-400 uppercase">Novedades [+]</h5><ul class="space-y-1 text-xs sm:text-sm text-slate-300">` +
        patch.added.map(a => `<li>• ${escapeHTML(a)}</li>`).join('') + `</ul></div>`;
    }

    let changedHTML = '';
    if (patch.changed && patch.changed.length > 0 && patch.changed[0] !== "") {
      changedHTML = `<div class="space-y-1.5"><h5 class="text-xs font-black text-amber-400 uppercase">Cambios & Ajustes [*]</h5><ul class="space-y-1 text-xs sm:text-sm text-slate-300">` +
        patch.changed.map(c => `<li>• ${escapeHTML(c)}</li>`).join('') + `</ul></div>`;
    }

    let fixedHTML = '';
    if (patch.fixed && patch.fixed.length > 0 && patch.fixed[0] !== "") {
      fixedHTML = `<div class="space-y-1.5"><h5 class="text-xs font-black text-sky-400 uppercase">Bugs Corregidos [-]</h5><ul class="space-y-1 text-xs sm:text-sm text-slate-300">` +
        patch.fixed.map(f => `<li>• ${escapeHTML(f)}</li>`).join('') + `</ul></div>`;
    }

    let adminPatchActions = '';
    if (window.isAdminLoggedIn) {
      adminPatchActions = `
        <div class="flex items-center gap-2 pt-3 border-t border-slate-800">
          <button onclick="deletePatch('${patch.id}')" class="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition-all">
            <i class="fa-solid fa-trash"></i> Eliminar Parche
          </button>
        </div>
      `;
    }

    item.innerHTML = `
      <div class="absolute left-2 sm:left-6 top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#0b0e14] shadow-[0_0_10px_rgba(16,185,129,0.8)] z-10 group-hover:scale-125 transition-transform"></div>
      <div class="glass-card rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs border border-emerald-500/30">${escapeHTML(patch.version)}</span>
            <h3 class="text-lg sm:text-xl font-black text-white">${escapeHTML(patch.title)}</h3>
          </div>
          <span class="text-xs text-slate-400 font-medium">${escapeHTML(patch.date)}</span>
        </div>
        <div class="space-y-4">
          ${addedHTML}
          ${changedHTML}
          ${fixedHTML}
        </div>
        ${adminPatchActions}
      </div>
    `;
    container.appendChild(item);
  });
}

window.setPatchCategoryFilter = function(cat) {
  currentPatchCategory = cat;
  document.querySelectorAll('.patch-tab').forEach(btn => {
    btn.className = "patch-tab px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-300 border border-slate-800 glass-card text-slate-400 hover:text-white hover:border-emerald-500/50 hover:scale-105";
  });
  event.currentTarget.className = "patch-tab active px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-300 border border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:scale-105";
  renderPatches();
};

window.openPatchModal = function() {
  if (!window.isAdminLoggedIn) return;
  const modal = document.getElementById('patchFormModal');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.remove('opacity-0', 'scale-95'), 10);
  document.getElementById('patchModalTitle').textContent = "Publicar Notas de Parche";
  document.getElementById('patchEditId').value = "";
  document.getElementById('patchVersionInput').value = "";
  document.getElementById('patchDateInput').value = "";
  document.getElementById('patchTitleInput').value = "";
  document.getElementById('patchAddedInput').value = "";
  document.getElementById('patchChangedInput').value = "";
  document.getElementById('patchFixedInput').value = "";
};

window.closePatchModal = function() {
  const modal = document.getElementById('patchFormModal');
  modal.classList.add('opacity-0', 'scale-95');
  setTimeout(() => modal.classList.add('hidden'), 300);
};

window.savePatch = function(e) {
  e.preventDefault();
  if (!window.isAdminLoggedIn) return;

  const version = document.getElementById('patchVersionInput').value.trim();
  const date = document.getElementById('patchDateInput').value.trim();
  const category = document.getElementById('patchCategoryInput').value;
  const title = document.getElementById('patchTitleInput').value.trim();
  const added = document.getElementById('patchAddedInput').value.split('\n').map(s => s.trim()).filter(Boolean);
  const changed = document.getElementById('patchChangedInput').value.split('\n').map(s => s.trim()).filter(Boolean);
  const fixed = document.getElementById('patchFixedInput').value.split('\n').map(s => s.trim()).filter(Boolean);

  const newPatch = {
    id: 'patch-' + Date.now(),
    version,
    date,
    category,
    title,
    added,
    changed,
    fixed
  };

  patchesData.unshift(newPatch);
  saveData();
  renderPatches();
  window.closePatchModal();
  window.showToast("Notas de parche publicadas con éxito", "success");
};

window.deletePatch = function(id) {
  if (!window.isAdminLoggedIn) return;
  if (confirm("¿Estás seguro de eliminar este parche?")) {
    patchesData = patchesData.filter(p => p.id !== id);
    saveData();
    renderPatches();
    window.showToast("Parche eliminado", "info");
  }
};

window.confirmResetPatches = function() {
  if (confirm("¿Restablecer notas de parche predeterminadas?")) {
    patchesData = [...DEFAULT_PATCHES];
    saveData();
    renderPatches();
    window.showToast("Parches restablecidos", "info");
  }
};

window.toggleAdminModal = function() {
  if (window.isAdminLoggedIn) {
    if (confirm("¿Cerrar sesión de Modo Staff?")) {
      window.isAdminLoggedIn = false;
      window.updateAdminUI();
      window.showToast("Sesión de Staff cerrada", "info");
    }
  } else {
    const modal = document.getElementById('adminPasswordModal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0', 'scale-95'), 10);
    document.getElementById('adminPasswordInput').value = "";
    document.getElementById('adminLoginError').classList.add('hidden');
  }
};

window.closeAdminModal = function() {
  const modal = document.getElementById('adminPasswordModal');
  modal.classList.add('opacity-0', 'scale-95');
  setTimeout(() => modal.classList.add('hidden'), 300);
};

window.updateAdminUI = function() {
  const adminBtnText = document.getElementById('adminBtnText');
  const adminIcon = document.getElementById('adminIcon');
  const adminToggleBtn = document.getElementById('adminToggleBtn');
  const addRuleBtn = document.getElementById('addRuleBtn');
  const resetRulesBtn = document.getElementById('resetRulesBtn');
  const addPatchBtn = document.getElementById('addPatchBtn');
  const resetPatchesBtn = document.getElementById('resetPatchesBtn');
  const staffWhitelistToolbar = document.getElementById('staffWhitelistToolbar');
  const addFeatureImageBtn = document.getElementById('addFeatureImageBtn');

  if (window.isAdminLoggedIn) {
    adminBtnText.textContent = "Staff Activo";
    adminIcon.className = "fa-solid fa-user-shield text-emerald-400 text-sm";
    adminToggleBtn.className = "px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all duration-300 flex items-center gap-2 border-emerald-500/60 bg-emerald-950/40 text-emerald-300 hover:scale-105 active:scale-95";
    
    if (addRuleBtn) addRuleBtn.classList.remove('hidden');
    if (resetRulesBtn) resetRulesBtn.classList.remove('hidden');
    if (addPatchBtn) addPatchBtn.classList.remove('hidden');
    if (resetPatchesBtn) resetPatchesBtn.classList.remove('hidden');
    if (staffWhitelistToolbar) staffWhitelistToolbar.classList.remove('hidden');
    if (addFeatureImageBtn) addFeatureImageBtn.classList.remove('hidden');
  } else {
    adminBtnText.textContent = "Modo Staff";
    adminIcon.className = "fa-solid fa-user-shield text-brand-500 text-sm";
    adminToggleBtn.className = "px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all duration-300 flex items-center gap-2 border-slate-700 bg-slate-900/80 text-slate-300 hover:border-brand-500 hover:text-white hover:scale-105 active:scale-95";

    if (addRuleBtn) addRuleBtn.classList.add('hidden');
    if (resetRulesBtn) resetRulesBtn.classList.add('hidden');
    if (addPatchBtn) addPatchBtn.classList.add('hidden');
    if (resetPatchesBtn) resetPatchesBtn.classList.add('hidden');
    if (staffWhitelistToolbar) staffWhitelistToolbar.classList.add('hidden');
    if (addFeatureImageBtn) addFeatureImageBtn.classList.add('hidden');
    window.showWhitelistFormView();
  }

  renderRules();
  renderPatches();
  renderWhitelistFormBuilder();
  window.switchFeatureTab(currentFeatureTab);
};

// Whitelist & Form Builder
function renderWhitelistFormBuilder() {
  const container = document.getElementById('dynamicCategoriesContainer');
  if (!container) return;
  container.innerHTML = '';

  whitelistCategories.forEach((cat, index) => {
    const catQuestions = whitelistQuestions.filter(q => q.categoryId === cat.id);
    
    let catAdminControls = '';
    if (window.isAdminLoggedIn) {
      catAdminControls = `
        <div class="flex items-center gap-2">
          <button type="button" onclick="openEditCategoryModal('${cat.id}')" class="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white text-xs font-bold transition-all">
            <i class="fa-solid fa-pen"></i> Editar
          </button>
          <button type="button" onclick="deleteCategory('${cat.id}')" class="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition-all">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      `;
    }

    const catDiv = document.createElement('div');
    catDiv.className = "border-t border-slate-800/80 pt-6 space-y-4";
    
    let questionsHTML = '';
    catQuestions.forEach(q => {
      let qAdminControls = '';
      if (window.isAdminLoggedIn) {
        qAdminControls = `
          <div class="flex items-center gap-2 mt-2">
            <button type="button" onclick="openEditQuestionModal('${q.id}')" class="px-2 py-1 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white text-[11px] font-bold">
              <i class="fa-solid fa-pen"></i> Editar Pregunta
            </button>
            <button type="button" onclick="deleteQuestion('${q.id}')" class="px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-[11px] font-bold">
              <i class="fa-solid fa-trash"></i> Eliminar
            </button>
          </div>
        `;
      }

      let fieldHTML = '';
      if (q.type === 'textarea') {
        fieldHTML = `<textarea id="${q.id}" rows="3" required placeholder="${escapeHTML(q.placeholder)}" class="w-full px-4 py-2.5 rounded-xl glass-card text-white text-sm focus:border-sky-500"></textarea>`;
      } else {
        fieldHTML = `<input type="text" id="${q.id}" required placeholder="${escapeHTML(q.placeholder)}" class="w-full px-4 py-3 rounded-xl glass-card text-white focus:outline-none focus:border-sky-500 text-sm" />`;
      }

      questionsHTML += `
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">${escapeHTML(q.text)}</label>
          ${fieldHTML}
          ${qAdminControls}
        </div>
      `;
    });

    catDiv.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h3 class="text-lg font-black text-sky-400 flex items-center gap-2">
          <span class="w-7 h-7 rounded-lg bg-sky-500/20 flex items-center justify-center text-xs">${index + 3}</span> ${escapeHTML(cat.name)}
        </h3>
        ${catAdminControls}
      </div>
      <div class="space-y-4">
        ${questionsHTML || '<p class="text-xs text-slate-500 italic">No hay preguntas en esta categoría.</p>'}
      </div>
    `;
    container.appendChild(catDiv);
  });

  const select = document.getElementById('questionCategorySelect');
  if (select) {
    select.innerHTML = whitelistCategories.map(c => `<option value="${c.id}">${escapeHTML(c.name)}</option>`).join('');
  }
}

window.handleWhitelistSubmit = function(e) {
  e.preventDefault();
  const discord = document.getElementById('wlDiscord').value.trim();
  const age = document.getElementById('wlAge').value.trim();
  const charName = document.getElementById('wlCharName').value.trim();
  const charAge = document.getElementById('wlCharAge').value.trim();
  const charBirth = document.getElementById('wlCharBirth').value.trim();
  const charApp = document.getElementById('wlCharApp').value.trim();
  const charLore = document.getElementById('wlCharLore').value.trim();

  const answers = {};
  whitelistQuestions.forEach(q => {
    const el = document.getElementById(q.id);
    if (el) {
      answers[q.text] = el.value.trim();
    }
  });

  const newApp = {
    id: 'app-' + Date.now(),
    date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    discord,
    age,
    charName,
    charAge,
    charBirth,
    charApp,
    charLore,
    answers,
    status: 'pending'
  };

  whitelistAppsData.unshift(newApp);
  saveData();
  updateWhitelistBadge();
  
  document.getElementById('whitelistForm').reset();
  window.showToast("¡Solicitud de Whitelist enviada con éxito! Revisa tu estado con el Staff.", "success");
  window.navigateTo('inicio');
};

window.showWhitelistFormView = function() {
  document.getElementById('whitelistFormWrapper').classList.remove('hidden');
  document.getElementById('whitelistAdminPanel').classList.add('hidden');
  document.getElementById('btnViewApps').classList.remove('hidden');
  document.getElementById('btnReturnForm').classList.add('hidden');
};

window.showWhitelistManagerView = function() {
  document.getElementById('whitelistFormWrapper').classList.add('hidden');
  document.getElementById('whitelistAdminPanel').classList.remove('hidden');
  document.getElementById('btnViewApps').classList.add('hidden');
  document.getElementById('btnReturnForm').classList.remove('hidden');
  renderWhitelistApplications();
};

function updateWhitelistBadge() {
  const pendingCount = whitelistAppsData.filter(a => a.status === 'pending').length;
  const countEl = document.getElementById('pendingAppsCount');
  if (countEl) countEl.textContent = pendingCount;
}

function renderWhitelistApplications() {
  const container = document.getElementById('whitelistApplicationsContainer');
  const emptyState = document.getElementById('emptyWhitelistState');
  if (!container) return;
  container.innerHTML = '';

  if (whitelistAppsData.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  } else {
    emptyState.classList.add('hidden');
  }

  whitelistAppsData.forEach(app => {
    const card = document.createElement('div');
    card.className = "glass-card rounded-2xl p-6 border border-slate-800 space-y-4";
    
    let statusBadge = '';
    if (app.status === 'approved') {
      statusBadge = '<span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">Aprobada</span>';
    } else if (app.status === 'rejected') {
      statusBadge = '<span class="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">Rechazada</span>';
    } else {
      statusBadge = '<span class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">Pendiente</span>';
    }

    let answersHTML = '';
    for (const [qText, ans] of Object.entries(app.answers || {})) {
      answersHTML += `
        <div class="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
          <span class="block text-xs font-bold text-sky-400 mb-1">${escapeHTML(qText)}</span>
          <p class="text-xs text-slate-300">${escapeHTML(ans)}</p>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div class="flex items-center gap-3">
          <h4 class="text-base font-black text-white">${escapeHTML(app.charName)} <span class="text-xs font-normal text-slate-400">(Discord: ${escapeHTML(app.discord)})</span></h4>
          ${statusBadge}
        </div>
        <span class="text-xs text-slate-400">${escapeHTML(app.date)}</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
        <div><strong class="text-slate-400">Edad Real / IC:</strong> ${app.age} años / ${app.charAge} IC</div>
        <div><strong class="text-slate-400">Nacimiento:</strong> ${escapeHTML(app.charBirth)}</div>
      </div>

      <div class="space-y-2">
        <div><strong class="text-xs text-slate-400 uppercase">Apariencia:</strong> <p class="text-xs text-slate-300">${escapeHTML(app.charApp)}</p></div>
        <div><strong class="text-xs text-slate-400 uppercase">Lore:</strong> <p class="text-xs text-slate-300">${escapeHTML(app.charLore)}</p></div>
      </div>

      <div class="space-y-2 pt-2 border-t border-slate-800">
        <strong class="text-xs text-sky-400 uppercase">Respuestas al Test:</strong>
        <div class="space-y-2">
          ${answersHTML}
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
        <button onclick="updateWhitelistStatus('${app.id}', 'approved')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all">Aprobar</button>
        <button onclick="updateWhitelistStatus('${app.id}', 'rejected')" class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all">Rechazar</button>
        <button onclick="deleteWhitelistApp('${app.id}')" class="px-3 py-2 rounded-xl glass-card text-slate-400 hover:text-white font-bold text-xs transition-all">Eliminar</button>
      </div>
    `;
    container.appendChild(card);
  });
}

window.updateWhitelistStatus = function(id, status) {
  const app = whitelistAppsData.find(a => a.id === id);
  if (app) {
    app.status = status;
    saveData();
    updateWhitelistBadge();
    renderWhitelistApplications();
    window.showToast(`Solicitud ${status === 'approved' ? 'aprobada' : 'rechazada'}`, status === 'approved' ? 'success' : 'info');
  }
};

window.deleteWhitelistApp = function(id) {
  if (confirm("¿Estás seguro de eliminar esta solicitud?")) {
    whitelistAppsData = whitelistAppsData.filter(a => a.id !== id);
    saveData();
    updateWhitelistBadge();
    renderWhitelistApplications();
    window.showToast("Solicitud eliminada", "info");
  }
};

window.openAddCategoryModal = function() {
  if (!window.isAdminLoggedIn) return;
  const modal = document.getElementById('categoryModal');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.remove('opacity-0', 'scale-95'), 10);
  document.getElementById('categoryModalTitle').textContent = "Nueva Categoría";
  document.getElementById('categoryEditId').value = "";
  document.getElementById('categoryNameInput').value = "";
};

window.openEditCategoryModal = function(catId) {
  if (!window.isAdminLoggedIn) return;
  const cat = whitelistCategories.find(c => c.id === catId);
  if (!cat) return;
  const modal = document.getElementById('categoryModal');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.remove('opacity-0', 'scale-95'), 10);
  document.getElementById('categoryModalTitle').textContent = "Editar Categoría";
  document.getElementById('categoryEditId').value = cat.id;
  document.getElementById('categoryNameInput').value = cat.name;
};

window.closeCategoryModal = function() {
  const modal = document.getElementById('categoryModal');
  modal.classList.add('opacity-0', 'scale-95');
  setTimeout(() => modal.classList.add('hidden'), 300);
};

window.saveCategory = function(e) {
  e.preventDefault();
  if (!window.isAdminLoggedIn) return;
  const editId = document.getElementById('categoryEditId').value;
  const name = document.getElementById('categoryNameInput').value.trim();

  if (editId) {
    const cat = whitelistCategories.find(c => c.id === editId);
    if (cat) cat.name = name;
    window.showToast("Categoría actualizada", "success");
  } else {
    const newCat = { id: 'cat-' + Date.now(), name };
    whitelistCategories.push(newCat);
    window.showToast("Categoría creada", "success");
  }

  saveData();
  renderWhitelistFormBuilder();
  window.closeCategoryModal();
};

window.deleteCategory = function(catId) {
  if (!window.isAdminLoggedIn) return;
  if (confirm("¿Eliminar categoría y sus preguntas asociadas?")) {
    whitelistCategories = whitelistCategories.filter(c => c.id !== catId);
    whitelistQuestions = whitelistQuestions.filter(q => q.categoryId !== catId);
    saveData();
    renderWhitelistFormBuilder();
    window.showToast("Categoría eliminada", "info");
  }
};

window.openAddQuestionModal = function() {
  if (!window.isAdminLoggedIn) return;
  const modal = document.getElementById('addQuestionModal');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.remove('opacity-0', 'scale-95'), 10);
  document.getElementById('questionModalTitle').textContent = "Añadir Pregunta a Whitelist";
  document.getElementById('questionEditId').value = "";
  document.getElementById('questionTextInput').value = "";
  document.getElementById('questionPlaceholderInput').value = "";
};

window.openEditQuestionModal = function(qId) {
  if (!window.isAdminLoggedIn) return;
  const q = whitelistQuestions.find(item => item.id === qId);
  if (!q) return;
  const modal = document.getElementById('addQuestionModal');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.remove('opacity-0', 'scale-95'), 10);
  document.getElementById('questionModalTitle').textContent = "Editar Pregunta";
  document.getElementById('questionEditId').value = q.id;
  document.getElementById('questionCategorySelect').value = q.categoryId;
  document.getElementById('questionTypeSelect').value = q.type;
  document.getElementById('questionTextInput').value = q.text;
  document.getElementById('questionPlaceholderInput').value = q.placeholder;
};

window.closeAddQuestionModal = function() {
  const modal = document.getElementById('addQuestionModal');
  modal.classList.add('opacity-0', 'scale-95');
  setTimeout(() => modal.classList.add('hidden'), 300);
};

window.saveQuestion = function(e) {
  e.preventDefault();
  if (!window.isAdminLoggedIn) return;
  const editId = document.getElementById('questionEditId').value;
  const categoryId = document.getElementById('questionCategorySelect').value;
  const type = document.getElementById('questionTypeSelect').value;
  const text = document.getElementById('questionTextInput').value.trim();
  const placeholder = document.getElementById('questionPlaceholderInput').value.trim();

  if (editId) {
    const q = whitelistQuestions.find(item => item.id === editId);
    if (q) {
      q.categoryId = categoryId;
      q.type = type;
      q.text = text;
      q.placeholder = placeholder;
    }
    window.showToast("Pregunta actualizada", "success");
  } else {
    const newQ = { id: 'q-' + Date.now(), categoryId, type, text, placeholder };
    whitelistQuestions.push(newQ);
    window.showToast("Pregunta añadida", "success");
  }

  saveData();
  renderWhitelistFormBuilder();
  window.closeAddQuestionModal();
};

window.deleteQuestion = function(qId) {
  if (!window.isAdminLoggedIn) return;
  if (confirm("¿Estás seguro de eliminar esta pregunta?")) {
    whitelistQuestions = whitelistQuestions.filter(q => q.id !== qId);
    saveData();
    renderWhitelistFormBuilder();
    window.showToast("Pregunta eliminada", "info");
  }
};

window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  let bgColor = 'bg-slate-900 border-sky-500/40 text-white';
  let icon = '<i class="fa-solid fa-circle-info text-sky-400"></i>';

  if (type === 'success') {
    bgColor = 'bg-slate-900 border-emerald-500/40 text-white';
    icon = '<i class="fa-solid fa-circle-check text-emerald-400"></i>';
  } else if (type === 'info') {
    bgColor = 'bg-slate-900 border-brand-500/40 text-white';
    icon = '<i class="fa-solid fa-bell text-brand-400"></i>';
  }

  toast.className = `glass-card border px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold transition-all duration-300 translate-y-5 opacity-0 pointer-events-auto ${bgColor}`;
  toast.innerHTML = `${icon} <span>${escapeHTML(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-5', 'opacity-0');
  }, 50);

  setTimeout(() => {
    toast.classList.add('translate-y-5', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};
