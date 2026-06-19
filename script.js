/* ============================================
   SEMART STUDIO — JS 3.0
   ============================================ */

/* ----- CURSOR GLOW — efecto ambiente decorativo ----- */
const cursor = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  curX += (mouseX - curX) * 0.04;
  curY += (mouseY - curY) * 0.04;
  if (cursor) {
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ----- SCROLL PROGRESS ----- */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (scrolled / total * 100) + '%';
}, { passive: true });

/* ----- NAVBAR SCROLL ----- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ----- HAMBURGER ----- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ----- INTERSECTION OBSERVER: reveal elements ----- */
const revealItems = document.querySelectorAll(
  '.svc-card, .price-card, .blog-card, .sector-item, .proc-step, .faq-item, .pack-card, .hero-stats-bar, .demo-card, .garantia-item'
);

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(revealItems).indexOf(entry.target) % 6;
      setTimeout(() => entry.target.classList.add('visible'), idx * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealItems.forEach(el => {
  if (!el.classList.contains('reveal')) el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ----- PROBLEM ITEMS stagger ----- */
const probItems = document.querySelectorAll('.prob-item');
const probObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      probObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
probItems.forEach(el => probObserver.observe(el));

/* ----- STAT COUNTERS ----- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('.stat-num[data-target]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

/* ----- FAQ ACCORDION ----- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      if (b.nextElementSibling) b.nextElementSibling.classList.remove('open');
    });

    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      if (answer) answer.classList.add('open');
    }
  });
});

/* ----- PRICE TOGGLE ----- */
const tabOnce    = document.getElementById('tabOnce');
const tabMensual = document.getElementById('tabMensual');
const oncePrices  = document.querySelectorAll('.once-price');
const monthPrices = document.querySelectorAll('.month-price');

if (tabOnce && tabMensual) {
  tabOnce.addEventListener('click', () => {
    tabOnce.classList.add('active');
    tabMensual.classList.remove('active');
    tabOnce.setAttribute('aria-pressed', 'true');
    tabMensual.setAttribute('aria-pressed', 'false');
    oncePrices.forEach(el => el.style.display = 'flex');
    monthPrices.forEach(el => el.style.display = 'none');
  });

  tabMensual.addEventListener('click', () => {
    tabMensual.classList.add('active');
    tabOnce.classList.remove('active');
    tabMensual.setAttribute('aria-pressed', 'true');
    tabOnce.setAttribute('aria-pressed', 'false');
    oncePrices.forEach(el => el.style.display = 'none');
    monthPrices.forEach(el => el.style.display = 'flex');
  });
}

/* ----- CARD TILT ----- */
document.querySelectorAll('.svc-card, .blog-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });
});

/* ----- PARALLAX HERO ----- */
const heroBgImg = document.querySelector('.hero-bg-img');
window.addEventListener('scroll', () => {
  if (!heroBgImg) return;
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    heroBgImg.style.transform = `scale(1) translateY(${scrollY * 0.25}px)`;
  }
}, { passive: true });

/* ----- ACTIVE NAV ----- */
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links .nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${entry.target.id}`) {
          a.style.color = '#F2F6FF';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ----- CHATBOT DEMO ANIMATION ----- */
const chatMessages = [
  { type: 'bot',    text: '¡Hola! Soy el asistente de Estudio Pelo. ¿En qué puedo ayudarte?' },
  { type: 'client', text: '¿Tenéis hueco el sábado por la mañana?' },
  { type: 'bot',    text: 'Sí, tenemos disponibilidad a las 10:00, 11:30 y 12:15. ¿Cuál te viene mejor?' },
  { type: 'client', text: '11:30 perfecto' },
  { type: 'bot',    text: 'Reservado ✅ Sábado a las 11:30. Recibirás confirmación en WhatsApp ahora mismo.' },
];

function runChatDemo(chatBody) {
  let idx = 0;

  function showNext() {
    if (idx >= chatMessages.length) {
      setTimeout(() => {
        chatBody.innerHTML = '';
        idx = 0;
        setTimeout(showNext, 600);
      }, 3500);
      return;
    }

    const msg = chatMessages[idx];
    const el = document.createElement('div');
    el.className = `chat-msg chat-msg-${msg.type}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = msg.text;
    el.appendChild(bubble);
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    chatBody.appendChild(el);
    chatBody.scrollTop = chatBody.scrollHeight;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });

    idx++;
    const delay = msg.type === 'bot' ? 2200 : 1400;
    setTimeout(showNext, delay);
  }

  setTimeout(showNext, 800);
}

const chatBody = document.getElementById('chatBody');
if (chatBody) {
  const chatObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runChatDemo(chatBody);
        chatObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  chatObserver.observe(chatBody);
}

/* ----- AUTOMATION FLOW ANIMATION ----- */
const autoFlow = document.getElementById('autoFlow');
if (autoFlow) {
  const afElements = autoFlow.querySelectorAll('.af-step, .af-arrow');
  const afObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        afElements.forEach((el, i) => {
          setTimeout(() => el.classList.add('af-visible'), i * 180);
        });
        afObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  afObserver.observe(autoFlow);
}

/* ============================================================
   FLOATING CHATBOT WIDGET — Asistente Semart Studio
   ============================================================ */

const botKB = [
  /* ---- SALUDOS ---- */
  {
    match: /^(hola|hey|buenos|buenas|ola|hi|hello|qué tal|que tal|saludos|buenas tardes|buenos días|buenas noches)(\s.*)?$/i,
    reply: `¡Hola! 👋\n\n¿En qué te puedo ayudar? Cuéntame un poco de tu negocio y te digo qué tiene más sentido para tu caso.`
  },

  /* ---- NO SÉ QUÉ NECESITO / CONFUSIÓN (PRIORIDAD ALTA) ---- */
  {
    match: /no sé|no sabría|no se qué|no se que|no tengo claro|qué me conviene|que me conviene|cuál me viene|cual me viene|qué elegir|que elegir|por dónde empiezo|por donde empiezo|qué me recomiendas|que me recomiendas|no sé cuál|no se cual|qué necesito|que necesito/i,
    reply: `Eso es exactamente lo más habitual — casi nadie sabe por dónde empezar, y tiene todo el sentido.\n\nAntes de decirte nada, cuéntame: ¿tienes web ahora mismo? ¿Y cómo llegan la mayoría de tus clientes hoy — te buscan en Google, te recomiendan, redes sociales?\n\nCon eso ya puedo decirte qué cambiaría más la cosa para tu negocio.`
  },

  /* ---- NEGOCIOS ESPECÍFICOS + INCERTIDUMBRE ---- */
  {
    match: /(fisio|fisioterapia|fisioterapeuta|osteopata|osteopatía)/i,
    reply: `Una clínica de fisio tiene mucho margen para crecer online, la mayoría no lo están aprovechando bien.\n\nCasi todos los pacientes nuevos buscan "fisioterapeuta + ciudad" antes de llamar. Si no apareces o tu web no transmite confianza, se van al siguiente resultado sin pensárselo.\n\nLo que más impacto suele tener en vuestro sector:\n→ Web optimizada para Google con reserva online integrada\n→ Recordatorios automáticos 24h antes (las cancelaciones de última hora son el gran problema)\n\n¿Tienes web ahora mismo? ¿Y cuánto os afectan las cancelaciones tardías?`
  },
  {
    match: /(clínica|clinica|médico|medico|consulta médica|consulta medica|dentista|dental|odontolog)/i,
    reply: `Para una clínica lo más importante suele ser la captación de pacientes nuevos + reducir cancelaciones, que en este sector duelen mucho.\n\nLo primero que miramos siempre: ¿aparecéis en Google cuando alguien busca vuestro servicio en vuestra ciudad? Mucha gente busca antes de llamar, y si no estáis en los primeros resultados, directamente no existís para ese potencial paciente.\n\n¿Tenéis web ahora? ¿Y cómo conseguís la mayoría de pacientes nuevos actualmente?`
  },
  {
    match: /(peluquer|barbería|barberia|estética|estetica|nail|uñas|depilac|belleza)/i,
    reply: `Los centros de belleza y peluquerías son los negocios que más se benefician de la automatización — porque el tiempo al teléfono tomando citas es un problema real.\n\nLo más habitual: recordatorio automático 24h antes, las cancelas de último momento caen un 60%. Y que los clientes puedan reservar solos desde el móvil a las 11 de la noche, que es cuando más se acuerdan.\n\n¿Cuánto tiempo calculas que se pierde a la semana solo con el tema de citas?`
  },
  {
    match: /(restaurante|bar |cafetería|cafeteria|hostelería|hosteleria|comida|gastro|carta|menú)/i,
    reply: `Un restaurante tiene mucho que ganar online, especialmente si dependéis de reservas.\n\nLo más urgente: ¿aparecéis en Google Maps con fotos actualizadas y buenas reseñas? Ese es el primer filtro que usa la gente para elegir dónde comer. Si no tenéis eso bien trabajado, estáis perdiendo clientes que ya os querían elegir.\n\nDepués vendría la web con carta online y sistema de reservas. ¿Cómo está vuestra situación ahora mismo en Google?`
  },
  {
    match: /(gimnasio|gym |fitness|pilates|yoga|crossfit|entrenamiento|personal trainer)/i,
    reply: `Para un gimnasio o centro deportivo, hay dos cosas que más impacto tienen: conseguir socios nuevos en momentos clave (enero, verano) y retener a los que ya tienes.\n\nLa automatización aquí es muy potente: mensaje a quien lleva 2 semanas sin venir, oferta de renovación antes de que caduque, recordatorio de clase... todo sin que tengas que hacer nada.\n\n¿Cómo estáis gestionando las bajas ahora? ¿Y los meses de más baja afluencia?`
  },
  {
    match: /(academia|clases|formación|formacion|curso|escuela)/i,
    reply: `Una academia tiene un ciclo muy marcado — septiembre y enero son los momentos de captar alumnos, y el resto del año es retener y llenar bajas.\n\nLo que más funciona: una web que aparezca en Google cuando busquen "academia de [materia] en [ciudad]" + un sistema que recuerde a los alumnos sus clases y automatice las inscripciones.\n\n¿Qué asignaturas o cursos dais? Y, ¿tenéis web ahora mismo?`
  },
  {
    match: /(taller|mecánico|mecanico|reparación|reparacion|chapista|pintura de coche)/i,
    reply: `Un taller tiene una ventaja enorme: los clientes buscan específicamente "taller mecánico + [ciudad]" cuando tienen un problema, y el que aparece primero en Google se lleva la llamada.\n\nEl combo que más funciona para talleres: presencia en Google bien optimizada + web que transmita profesionalidad + botón de WhatsApp bien visible para pedir presupuesto directo.\n\n¿Cómo consigues la mayoría de clientes ahora — recomendación, Google, o de toda la vida?`
  },
  {
    match: /(inmobiliaria|inmueble|alquiler|pisos|casas|propiedades|agente inmobiliario)/i,
    reply: `En inmobiliaria la web es el activo principal — es donde la gente ve los inmuebles y decide si os llama.\n\nLo importante no es solo que sea bonita, sino que aparezca cuando busquen en Google y que facilite el contacto inmediato. La mayoría de leads se pierden porque la gente tiene que esforzarse para encontrar el botón de contacto.\n\n¿Tenéis web ahora? ¿Y cómo está vuestro posicionamiento en Google para búsquedas locales?`
  },
  {
    match: /(tienda|comercio|local|shop|venta)/i,
    reply: `Para una tienda o comercio local, lo más importante es que la gente os encuentre cuando busque lo que vendéis en vuestra ciudad.\n\nLo primero: Google Business bien optimizado con fotos, horarios y reseñas actualizadas. Es gratuito y tiene un impacto enorme. Después, una web que haga de catálogo y facilite el contacto.\n\n¿Qué tipo de productos vendéis? ¿Y tenéis ya algo de presencia online?`
  },

  /* ---- PRECIOS ---- */
  {
    match: /precio|cuánto cuesta|cuanto cuesta|cuánto vale|cuanto vale|coste|presupuest|cuota|tarifa|pagar|cobr/i,
    reply: `Te doy los rangos orientativos, aunque siempre adaptamos al negocio real:\n\n💻 Web Profesional — desde 450€ (pago único) o 80€/mes\n⚡ Automatizaciones — desde 150€/mes\n🤖 Chatbot IA — desde 250€/mes\n🚀 Pack Completo — desde 2.500€ o 300€/mes\n\nEn la llamada gratuita te doy un número exacto para tu caso. Sin compromiso y sin sorpresas después. ¿Qué presupuesto tienes más o menos en mente?`
  },

  /* ---- WEB ---- */
  {
    match: /web|página|pagina|diseño|website/i,
    reply: `La web que hacemos no es solo "algo bonito en internet". Está pensada para que la gente que te busque en Google llegue a ella, confíe en ti en los primeros 5 segundos y contacte directamente.\n\nIncluye diseño a medida, SEO local, reservas online, botón de WhatsApp siempre visible y reseñas de Google integradas. Lista en 2–4 semanas.\n\n¿Para qué tipo de negocio la necesitas?`
  },

  /* ---- AUTOMATIZACIONES ---- */
  {
    match: /automatiz|recordatorio|confirmaci|seguimiento|lead|cancelaci/i,
    reply: `Las automatizaciones son básicamente: todo lo que haces repetitivamente a mano — confirmaciones, recordatorios, seguimiento — pero funcionando solo, 24h.\n\nEl impacto más concreto: las cancelaciones de última hora bajan un 60%, y dejas de perder leads porque no respondiste a tiempo.\n\n¿Qué es lo más tedioso que haces manualmente ahora mismo en el día a día?`
  },

  /* ---- CHATBOT ---- */
  {
    match: /chatbot|bot|asistente|inteligencia artificial|ia|24h|24 hora/i,
    reply: `El chatbot es como tener alguien que atiende a tus clientes a las 3 de la madrugada si hace falta.\n\nResponde preguntas, agenda citas y captura datos de clientes potenciales — integrado en tu web, WhatsApp o Instagram. Se entrena con la información real de tu negocio, así que responde como si fuera tú.\n\nEste chat que estás usando ahora mismo es un ejemplo de cómo funciona. ¿Para qué canal lo necesitarías más — web, WhatsApp, o Instagram?`
  },

  /* ---- PACK ---- */
  {
    match: /pack|completo|todo junto|todo en uno|combo/i,
    reply: `El Pack Completo es web + automatizaciones + chatbot todo integrado desde el primer día.\n\nLa ventaja de hacerlo junto es que todo se conecta: la web capta al cliente, el chatbot lo atiende, y las automatizaciones hacen el seguimiento. Sin fricciones entre partes.\n\nDesde 2.500€ o 300€/mes. ¿Cuánto tiempo llevas con el negocio y en qué punto estás digitalmente ahora mismo?`
  },

  /* ---- TIEMPO / PLAZO ---- */
  {
    match: /tiempo|plazo|tarda|cuándo|cuando|cuánto tiempo|entrega|semana/i,
    reply: `Depende del proyecto, pero los tiempos habituales:\n\n→ Web: 2–4 semanas\n→ Automatizaciones: 1–2 semanas\n→ Chatbot: 1–2 semanas\n→ Pack completo: 3–5 semanas\n\nEn cada fase te mando avances para que lo revises y lo apruebes. Nada sale sin que tú lo hayas visto primero.`
  },

  /* ---- SOBRE SERGIO ---- */
  {
    match: /sergio|quién eres|quien eres|fundador|sobre ti|equipo|experiencia/i,
    reply: `Soy Sergio Martínez, tengo 24 años y llevo un tiempo trabajando en hostelería y logística antes de montar Semart Studio.\n\nEso me ayuda bastante — sé lo que es gestionar un negocio con clientes reales, con márgenes ajustados y sin tiempo para complicaciones técnicas. No vengo de una agencia, vengo del campo.\n\nMi forma de trabajar: primero entiendo bien tu negocio, y solo entonces te propongo lo que tiene más sentido. Si no creo que algo te vaya a servir, te lo digo.`
  },

  /* ---- PERMANENCIAS / CONTRATO ---- */
  {
    match: /cancel|permanencia|contrato|compromiso|obligat|salir|baja|vincul/i,
    reply: `Sin permanencias, sin contratos de larga duración.\n\nSi en algún momento no te está aportando lo suficiente, cancelas y ya está. Lo que hagamos siempre es tuyo — la web, las automatizaciones, todo — y no depende de mí para seguir funcionando.\n\nQuiero que sigas conmigo porque los resultados lo merecen, no porque no tengas otra opción.`
  },

  /* ---- LOCALIZACIÓN ---- */
  {
    match: /valencia|dónde|donde|localiz|presencial|españa|ciudad|ubicaci/i,
    reply: `Trabajo con negocios de toda España de forma online. Si estás en Valencia o cerca, también podemos vernos en persona si lo prefieres — pero la mayoría de proyectos los hacemos completamente a distancia sin ningún problema.\n\n¿De qué ciudad eres?`
  },

  /* ---- MALA EXPERIENCIA ANTERIOR ---- */
  {
    match: /antes tuve|ya probé|ya probe|no funcionó|no funciono|me salió mal|me salio mal|perdí dinero|perdi dinero|me timaron|mala experiencia/i,
    reply: `Lo entiendo, y por desgracia es más común de lo que debería.\n\nLo que suele pasar: se entrega una web genérica que queda bonita pero sin estrategia detrás — sin SEO, sin conversión pensada, sin seguimiento. Y el cliente no ve clientes nuevos, así que concluye que "internet no funciona para mí". El problema casi nunca es internet.\n\n¿Qué fue exactamente lo que no funcionó? Cuéntame y te digo con honestidad si lo que necesitas es diferente a lo que ya probaste.`
  },

  /* ---- DESCONFIANZA / PRUEBAS ---- */
  {
    match: /funciona de verdad|seguro que funciona|me lo demuestras|prueba|demostración|casos|ejemplos/i,
    reply: `Es la pregunta que me parece más honesta y respetable.\n\nSemart Studio es un proyecto reciente, así que no tengo cartera de clientes de 10 años que enseñarte. Lo que sí tengo es un enfoque muy directo: te digo lo que creo que puede funcionar para tu caso, y si no lo veo claro, te lo digo antes de cobrarte nada.\n\nLo más práctico: una llamada de 20 minutos donde te cuento exactamente qué haría para tu negocio y qué esperar. Sin compromiso. Así juzgas tú si tiene sentido.`
  },

  /* ---- CARO / PRESUPUESTO BAJO ---- */
  {
    match: /caro|demasiado|mucho dinero|no me llega|no tengo tanto|presupuesto bajo|ajustado|poco presupuesto/i,
    reply: `Te entiendo, y no voy a insistir en nada que no tenga sentido para ti.\n\nLo que sí te digo: hay opciones para distintos momentos. Empezar solo con una web bien hecha (desde 450€) ya marca una diferencia real si ahora mismo no tienes presencia online.\n\n¿Cuánto aproximadamente podrías invertir? Con eso te cuento qué tiene sentido hacer ahora y qué dejar para más adelante.`
  },

  /* ---- POR QUÉ SEMART ---- */
  {
    match: /diferenci|por qué vosotros|por qué tú|competencia|otras agencias|otras opciones|freelance|más barato/i,
    reply: `Seré directo: no somos los más baratos ni los más grandes.\n\nLo que sí ofrezco es que hablas conmigo directamente en todo momento — no con un account manager que te pasa mensajes —, y que entiendo los negocios locales desde dentro porque he estado en ese lado.\n\nNo vendo paquetes estándar. Cada proyecto lo pienso desde cero para ese negocio concreto. Si eso te parece valioso, hablamos. Si buscas el precio más bajo, probablemente hay opciones más baratas.`
  },

  /* ---- PROCESO ---- */
  {
    match: /cómo funciona|como funciona|el proceso|qué pasos|que pasos|cómo empezamos|como empezamos/i,
    reply: `Sencillo:\n\n1️⃣ Llamada de 20 min (gratis) — me cuentas tu negocio y tus objetivos\n2️⃣ Propuesta a medida — plan claro con precio real, sin letra pequeña\n3️⃣ Desarrollo — me encargo de todo, tú revisas y apruebas cada fase\n4️⃣ Lanzamiento — activo y funcionando, con acompañamiento incluido\n\n¿Quieres que empecemos?`
  },

  /* ---- GOOGLE / SEO ---- */
  {
    match: /google|seo|posicion|aparecer|búsqueda|busqueda|reseñas|maps/i,
    reply: `El SEO local es lo que hace que la gente te encuentre cuando busca lo que ofreces en tu ciudad.\n\nEn la web que hacemos siempre va incluido: estructura optimizada, meta etiquetas, velocidad de carga, y configuración del perfil de Google Business. Sin eso, la web es un escaparate que nadie ve.\n\n¿Sabes ahora mismo en qué posición apareces si buscas tu servicio en Google?`
  },

  /* ---- CONTACTO ---- */
  {
    match: /contacto|llamada|reunión|reunion|empezar|hablar|consulta/i,
    reply: `Perfecto, lo más rápido es la llamada gratuita — 20 minutos y te digo exactamente qué tiene más sentido para tu caso.\n\nResérvala en: calendly.com/semartestudio\n\nO si prefieres ir más directo, el WhatsApp (botón verde en la página) suele ser lo más rápido. Respondo el mismo día.`
  },

  /* ---- GARANTÍAS ---- */
  {
    match: /garantía|garantia|confianza|seguro|riesgo|fiable/i,
    reply: `Trabajo con total transparencia:\n\n→ Presupuesto claro antes de empezar, sin cifras que cambian a mitad\n→ Sin costes ocultos\n→ Tú apruebas cada fase antes de publicar\n→ Sin permanencias — cancelas cuando quieras\n→ Lo que hagamos es siempre tuyo\n\nY si en algún momento no estás conforme con el trabajo, lo hablamos. Sin dramas.`
  },

  /* ---- GRACIAS / OK ---- */
  {
    match: /gracias|genial|perfecto|muy bien|ok|vale|👍|entendido/i,
    reply: `De nada 😊 Si en algún momento tienes más dudas o quieres dar el paso, aquí estoy. Lo más útil siempre es una llamada de 20 minutos — suele aclarar más que cualquier chat.`
  },
];

function botFindReply(text) {
  const clean = text.trim();
  for (const entry of botKB) {
    if (entry.match.test(clean)) return entry.reply;
  }
  return `Entendido 👍 Para darte una respuesta más precisa, lo mejor es una llamada rápida de 20 minutos.\n\nPuedes reservarla gratis en: calendly.com/semartestudio\n\nO si prefieres, escríbeme directamente por WhatsApp (botón verde en la página) y respondo enseguida.`;
}

function botAddMsg(container, type, text) {
  const msg = document.createElement('div');
  msg.className = `bot-msg ${type}`;
  const bubble = document.createElement('div');
  bubble.className = 'bot-msg-text';
  bubble.textContent = text;
  msg.appendChild(bubble);
  msg.style.opacity = '0';
  msg.style.transform = 'translateY(6px)';
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    msg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    msg.style.opacity = '1';
    msg.style.transform = 'translateY(0)';
  }));
  return msg;
}

function botShowTyping(container) {
  const typing = document.createElement('div');
  typing.className = 'bot-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
  return typing;
}

(function initBotWidget() {
  const trigger  = document.getElementById('botTrigger');
  const window_  = document.getElementById('botWindow');
  const closeBtn = document.getElementById('botClose');
  const body_    = document.getElementById('botWinBody');
  const input    = document.getElementById('botInput');
  const send     = document.getElementById('botSend');
  const badge    = document.getElementById('botBadge');
  if (!trigger || !window_) return;

  let opened = false;

  function openBot() {
    opened = true;
    trigger.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    window_.classList.add('open');
    window_.setAttribute('aria-hidden', 'false');
    if (badge) badge.style.opacity = '0';
    if (!body_.hasChildNodes()) {
      setTimeout(() => {
        botAddMsg(body_, 'bot', '¡Hola! 👋 Soy el asistente de Semart Studio.\n\n¿Tienes alguna pregunta sobre nuestros servicios o precios? Estoy aquí para ayudarte.');
      }, 300);
    }
    setTimeout(() => { if (input) input.focus(); }, 350);
  }

  function closeBot() {
    trigger.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    window_.classList.remove('open');
    window_.setAttribute('aria-hidden', 'true');
  }

  trigger.addEventListener('click', () => {
    if (trigger.classList.contains('open')) closeBot();
    else openBot();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeBot);

  function handleSend() {
    const text = input ? input.value.trim() : '';
    if (!text) return;
    input.value = '';
    botAddMsg(body_, 'user', text);
    const typing = botShowTyping(body_);
    body_.scrollTop = body_.scrollHeight;
    const delay = 900 + Math.random() * 600;
    setTimeout(() => {
      typing.remove();
      const reply = botFindReply(text);
      botAddMsg(body_, 'bot', reply);
    }, delay);
  }

  if (send) send.addEventListener('click', handleSend);
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });
  }
})();
