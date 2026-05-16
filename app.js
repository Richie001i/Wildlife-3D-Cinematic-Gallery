const animalData = {
  lion: {
    title: "Lion",
    desc: "The lion is a large cat of the genus Panthera native to Africa and India. It has a muscular, deep-chested body, short, rounded head, round ears, and a hairy tuft at the end of its tail. It is sexually dimorphic; adult male lions are larger than females and have a prominent mane. It is a social species, forming groups called prides.",
    stats: [
      "<strong>Scientific Name</strong> Panthera leo",
      "<strong>Conservation Status</strong> Vulnerable",
      "<strong>Lifespan</strong> 10-14 years",
      "<strong>Speed</strong> 80 km/h"
    ],
    wikiUrl: "https://en.wikipedia.org/wiki/Lion",
    bgClass: "bg-lion",
    particleType: "dust",
    particleCount: 60
  },
  eagle: {
    title: "Eagle",
    desc: "Eagle is the common name for many large birds of prey of the family Accipitridae. Eagles belong to several groups of genera, not all of which are closely related. Most of the 60 species of eagle are from Eurasia and Africa. Outside this area, just 14 species can be found.",
    stats: [
      "<strong>Scientific Name</strong> Accipitridae",
      "<strong>Conservation Status</strong> Least Concern",
      "<strong>Lifespan</strong> 14-35 years",
      "<strong>Speed</strong> up to 320 km/h (diving)"
    ],
    wikiUrl: "https://en.wikipedia.org/wiki/Eagle",
    bgClass: "bg-eagle",
    particleType: "feather",
    particleCount: 40
  },
  tiger: {
    title: "Tiger",
    desc: "The tiger is the largest living cat species and a member of the genus Panthera. It is most recognisable for its dark vertical stripes on orange fur with a white underside. An apex predator, it primarily preys on ungulates, such as deer and wild boar.",
    stats: [
      "<strong>Scientific Name</strong> Panthera tigris",
      "<strong>Conservation Status</strong> Endangered",
      "<strong>Lifespan</strong> 10-15 years",
      "<strong>Speed</strong> 49-65 km/h"
    ],
    wikiUrl: "https://en.wikipedia.org/wiki/Tiger",
    bgClass: "bg-tiger",
    particleType: "leaf",
    particleCount: 40
  }
};

const items = document.querySelectorAll('.item');
const detailView = document.getElementById('detailView');
const detailBg = document.getElementById('detailBg');
const closeBtn = document.getElementById('closeBtn');

const detailImage = document.getElementById('detailImage');
const detailTitle = document.getElementById('detailTitle');
const detailDesc = document.getElementById('detailDesc');
const detailStats = document.getElementById('detailStats');
const wikiLink = document.getElementById('wikiLink');

let currentParticles = [];

// Attach click events to the 3D slider items
items.forEach(item => {
  item.addEventListener('click', () => {
    const animalId = item.getAttribute('data-animal');
    const imgSrc = item.querySelector('img').src;
    openDetail(animalId, imgSrc);
  });
});

closeBtn.addEventListener('click', closeDetail);

function openDetail(id, imgSrc) {
  const data = animalData[id];
  if(!data) return;

  // Pause the CSS animation on the slider
  document.body.classList.add('viewing-detail');

  // Populate dynamic data
  detailImage.src = imgSrc;
  detailTitle.textContent = data.title;
  detailDesc.textContent = data.desc;
  
  detailStats.innerHTML = "";
  data.stats.forEach(stat => {
    const li = document.createElement('li');
    li.innerHTML = stat;
    detailStats.appendChild(li);
  });
  
  wikiLink.href = data.wikiUrl;

  // Set the specific blurred background image class
  detailBg.className = 'detail-bg ' + data.bgClass;

  // Generate specific 3D particle effects
  clearParticles();
  generateParticles(data.particleType, data.particleCount);

  // Show the detail view overlay
  detailView.classList.remove('hidden');

  // GSAP 3D Entry Animations
  gsap.fromTo(detailView, 
    { opacity: 0 }, 
    { opacity: 1, duration: 0.5 }
  );

  gsap.fromTo(".detail-image-wrapper",
    { x: -300, rotationY: -45, opacity: 0 },
    { x: 0, rotationY: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.1 }
  );

  gsap.fromTo(".detail-text",
    { x: 300, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
  );
  
  gsap.fromTo(".close-btn",
    { y: -50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)", delay: 0.8 }
  );
}

function closeDetail() {
  gsap.to(detailView, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      detailView.classList.add('hidden');
      document.body.classList.remove('viewing-detail');
      clearParticles();
    }
  });
}

function generateParticles(type, count) {
  for(let i=0; i<count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle', type);
    
    // Randomize initial positions
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    
    p.style.left = startX + 'px';
    p.style.top = startY + 'px';
    
    detailBg.appendChild(p);
    currentParticles.push(p);

    // Animate differently based on the particle type for 3D depth effect
    if(type === 'dust') {
      // Dust floats randomly
      gsap.to(p, {
        y: startY - (Math.random() * 150 + 50),
        x: startX + (Math.random() * 100 - 50),
        opacity: 0,
        duration: Math.random() * 4 + 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2
      });
    } else if (type === 'feather' || type === 'leaf') {
      // Feathers and leaves fall downwards
      gsap.to(p, {
        y: window.innerHeight + 100,
        x: startX + (Math.random() * 300 - 150),
        rotation: Math.random() * 360,
        duration: Math.random() * 6 + 4,
        repeat: -1,
        ease: "none",
        delay: Math.random() * 5
      });
    }
  }
}

function clearParticles() {
  currentParticles.forEach(p => {
    gsap.killTweensOf(p); // Important to kill GSAP tweens before removing DOM elements
    p.remove();
  });
  currentParticles = [];
}
