// animations.js - Sistema SIMPLIFICADO de animações
console.log('🎨 Carregando sistema de animações...');

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ DOM carregado, iniciando animações...');
  
  // ===== CONFIGURAÇÃO =====
  const animationConfig = {
    threshold: 0.15, // 25% do elemento visível para animar
    rootMargin: '0px'
  };
  
  // ===== ELEMENTOS QUE SERÃO ANIMADOS =====
  const elementsToAnimate = [
    'section',
    '.section-title',
    '.diferencial-card',
    '.curso-card',
    '.noticia-item',
    '.noticia-destaque',
    '.professor-card',
    '.depoimento-slide',
    '.parceiro-item',
    '.localizacao-card',
    '.emec-card',
    '.hero-text'
  ];
  
  // Buscar todos os elementos
  let allElements = [];
  elementsToAnimate.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    allElements = [...allElements, ...elements];
  });
  
  console.log(`📊 Encontrados ${allElements.length} elementos para animar`);
  
  // ===== INTERSECTION OBSERVER =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Elemento entrou na viewport
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);
        
        console.log('✨ Elemento animado:', entry.target.tagName);
      } 
      else {
      // Elemento saiu da viewport → reseta para animar novamente
      entry.target.style.opacity = '0';
      entry.target.style.transform = 'translateY(30px)';
      }
    });
  }, animationConfig);
  
  // ===== APLICAR ESTILOS INICIAIS E OBSERVAR =====
  allElements.forEach((element, index) => {
    // Estado inicial (invisível e deslocado)
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    // Começar a observar
    observer.observe(element);
  });
  
  console.log('👀 Observando elementos...');
  
  // ===== ANIMAÇÕES DE HOVER PARA CARDS =====
  const cards = document.querySelectorAll('.diferencial-card, .curso-card, .professor-card, .parceiro-item');
  
  cards.forEach(card => {
    // Estado inicial
    card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
    
    // Hover
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
      this.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
    });
    
    // Mouse sai
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    });
  });
  
  console.log(`🎯 ${cards.length} cards com hover animado`);
  
// ===== CONTADOR ROLLING (ODÔMETRO) =====
const counters = document.querySelectorAll('.stat-number.rolling[data-counter]');

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function buildRolling(element, formatted, suffix) {
  element.innerHTML = '';

  [...formatted].forEach(char => {
    if (!/\d/.test(char)) {
      const sep = document.createElement('span');
      sep.className = 'rolling-sep';
      sep.textContent = char;
      element.appendChild(sep);
      return;
    }

    const digit = document.createElement('span');
    digit.className = 'rolling-digit';

    const strip = document.createElement('span');
    strip.className = 'rolling-strip';

    for (let i = 0; i <= 9; i++) {
      const n = document.createElement('span');
      n.textContent = i;
      strip.appendChild(n);
    }

    digit.appendChild(strip);
    element.appendChild(digit);
  });

  if (suffix) {
    const suf = document.createElement('span');
    suf.className = 'rolling-suffix';
    suf.textContent = suffix;
    element.appendChild(suf);
  }
}

function setRollingValue(element, formatted) {
  const nodes = element.querySelectorAll('.rolling-digit, .rolling-sep');
  const digits = formatted.replace(/\D/g, '').split('');
  let digitIndex = 0;

  nodes.forEach(node => {
    if (node.classList.contains('rolling-digit')) {
      const strip = node.querySelector('.rolling-strip');
      const value = parseInt(digits[digitIndex] || '0', 10);
      digitIndex++;

      strip.style.transform = `translateY(-${value * 1.2}em)`;
    }
  });
}

function padFormatted(current, finalFmt) {
  const template = finalFmt.replace(/\d/g, '0');
  const digits = current.replace(/\D/g, '').padStart(
    finalFmt.replace(/\D/g, '').length,
    '0'
  );

  let result = '';
  let i = 0;

  for (const ch of template) {
    if (ch === '0') {
      result += digits[i++] || '0';
    } else {
      result += ch;
    }
  }

  return result;
}

function animateRolling(element, target, duration = 1400) {
  const decimals = parseInt(element.dataset.decimals || '0', 10);
  const suffix = element.dataset.suffix || '';

  // formata final usando vírgula (pt-BR visual)
  const finalFormatted = target.toFixed(decimals).replace('.', ',');

  const startTime = performance.now();

  buildRolling(element, finalFormatted, suffix);
  setRollingValue(element, finalFormatted.replace(/\d/g, '0'));

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = easeOutCubic(progress);

    const current = target * eased;

    let currentFormatted = current.toFixed(decimals).replace('.', ',');

    // garante mesmo comprimento do final (evita pulo)
    const padded = padFormatted(currentFormatted, finalFormatted);
    setRollingValue(element, padded);

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    if (el.dataset.animated === 'true') return;

    el.dataset.animated = 'true';
    animateRolling(el, parseInt(el.dataset.counter));

    counterObserver.unobserve(el);
  });
}, animationConfig);

counters.forEach(counter => {
  counterObserver.observe(counter);
});

  
  if (counters.length > 0) {
    console.log(`🔢 ${counters.length} contadores configurados`);
  }
  
  // ===== SCROLL SUAVE PARA LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 140;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  console.log('✅ Sistema de animações ativo!');
  console.log('📌 Faça scroll para ver as animações acontecerem');
});