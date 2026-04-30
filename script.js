const canvas = document.getElementById("magnetCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Configurações globais controladas pela interface
const config = {
    count: 300,
    baseSize: 8,
    range: 150,
    force: 0.03
};

class Particle {
    constructor() {
        this.homeX = Math.random() * canvas.width;
        this.homeY = Math.random() * canvas.height;

        this.x = this.homeX;
        this.y = this.homeY;

        this.randomSizeMult = Math.random(); 
        this.updateSize();
        
        this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    }

    updateSize() {
        this.size = this.randomSizeMult * config.baseSize + 1;
    }

    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.min(100 / dist, 5);

        if (dist < config.range) {
            this.x += dx * config.force * force;
            this.y += dy * config.force * force;
        } else {
            this.x += (this.homeX - this.x) * 0.05;
            this.y += (this.homeY - this.y) * 0.05;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

let particles = Array.from({length: config.count}, () => new Particle());

function updateParticleCount() {
    if (config.count > particles.length) {
        const diff = config.count - particles.length;
        for(let i = 0; i < diff; i++) {
            particles.push(new Particle());
        }
    } else if (config.count < particles.length) {
        particles.splice(config.count); // Remove o excesso
    }
}

function animate() {
    ctx.fillStyle = "rgba(17, 17, 17, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Scrolls de interface
document.getElementById('particleCount').addEventListener('input', (e) => {
    config.count = parseInt(e.target.value);
    document.getElementById('countVal').innerText = config.count;
    updateParticleCount();
});

document.getElementById('baseSize').addEventListener('input', (e) => {
    config.baseSize = parseInt(e.target.value);
    document.getElementById('sizeVal').innerText = config.baseSize;
    particles.forEach(p => p.updateSize()); 
});

document.getElementById('forceRange').addEventListener('input', (e) => {
    config.range = parseInt(e.target.value);
    document.getElementById('rangeVal').innerText = config.range;
});

document.getElementById('attractionForce').addEventListener('input', (e) => {
    config.force = parseFloat(e.target.value);
    document.getElementById('forceVal').innerText = config.force;
});