// Navigation mobile
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
if (burger && nav) {
  burger.addEventListener('click', () => nav.classList.toggle('active'));
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    nav?.classList.remove('active');
  });
});

// Filtrage catégories
const categoryBtns = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    productCards.forEach(card => {
      const ok = (category === 'all' || card.dataset.category === category);
      card.style.display = ok ? 'flex' : 'none';
      if (ok) card.style.animation = 'fadeIn .45s ease';
    });
  });
});

// Sélection couleur
document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const card = dot.closest('.product-card');
    card?.querySelectorAll('.color-dot').forEach(d => (d.style.border = '2px solid transparent'));
    dot.style.border = '2px solid var(--apple-blue)';
  });
});

// Sélection option (stockage / taille)
document.querySelectorAll('.storage-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    card?.querySelectorAll('.storage-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Vue 360 (animation)
document.querySelectorAll('.rotate-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.closest('.product-image-container')?.querySelector('.product-img');
    if (!img) return;
    img.style.transform = 'rotateY(360deg)';
    setTimeout(() => (img.style.transform = 'rotateY(0deg)'), 900);
  });
});

// Modal réservation
const modal = document.getElementById('reservationModal');
const closeBtn = document.querySelector('.close');

document.querySelectorAll('.reserve-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    if (!card || !modal) return;

    const name = card.querySelector('h3')?.textContent?.trim() || 'Produit';
    const selectedColor = card.querySelector('.color-dot[style*="border"]')?.getAttribute('data-color') || 'Non sélectionné';
    const selectedOpt = card.querySelector('.storage-btn.active')?.textContent?.trim() || 'Non sélectionné';
    const priceValue = card.querySelector('.price-input')?.value || '0';

    document.getElementById('productName').value = name;
    document.getElementById('productConfig').value = `${selectedOpt} - ${selectedColor}`;
    document.getElementById('productPrice').value = `${priceValue} DA`;

    modal.style.display = 'block';
  });
});

closeBtn?.addEventListener('click', () => (modal.style.display = 'none'));
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

// Envoi réservation (mock)
const form = document.getElementById('reservationForm');
form?.addEventListener('submit', e => {
  e.preventDefault();

  const data = {
    product: document.getElementById('productName').value,
    configuration: document.getElementById('productConfig').value,
    price: document.getElementById('productPrice').value,
    customerName: document.getElementById('customerName').value,
    customerPhone: document.getElementById('customerPhone').value,
    customerEmail: document.getElementById('customerEmail').value,
    storeLocation: document.getElementById('storeLocation').value,
    notes: document.getElementById('customerNotes').value,
    createdAt: new Date().toISOString(),
  };

  console.log('Réservation:', data);
  alert(`Réservation envoyée !

${data.product}
${data.configuration}
${data.price}

Boutique: ${data.storeLocation}
Téléphone: ${data.customerPhone}`);

  modal.style.display = 'none';
  form.reset();
});

// Prix: mode admin (à activer)
function enableAdminMode() {
  document.querySelectorAll('.price-input').forEach(input => {
    input.disabled = false;
    input.style.background = '#fff3cd';
  });
  console.log('Mode Admin activé: modifie les prix, sauvegarde auto');
}
window.enableAdminMode = enableAdminMode;

function savePrices() {
  const prices = {};
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.dataset.id;
    const val = card.querySelector('.price-input')?.value;
    if (id) prices[id] = val || '';
  });
  localStorage.setItem('productPrices', JSON.stringify(prices));
}

function loadPrices() {
  const raw = localStorage.getItem('productPrices');
  if (!raw) return;
  const prices = JSON.parse(raw);
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.dataset.id;
    const input = card.querySelector('.price-input');
    if (input && prices[id] != null) input.value = prices[id];
  });
}

loadPrices();
document.querySelectorAll('.price-input').forEach(input => input.addEventListener('change', savePrices));

// Scroll animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('.product-card,.news-card,.store-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'all .6s ease';
  observer.observe(el);
});
