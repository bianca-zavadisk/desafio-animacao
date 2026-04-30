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

class Particle {
    constructor() {
        this.homeX = Math.random() * canvas.width;
        this.homeY = Math.random() * canvas.height;

        this.x = this.homeX;
        this.y = this.homeY;

        this.size = Math.random() * 8 + 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    }

    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.min(100 / dist, 5);

        if (dist < 150) {
            this.x += dx * 0.03 * force;
            this.y += dy * 0.03 * force;
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

const particles = Array.from({length: 300}, () => new Particle());

function animate() {
    ctx.fillStyle = "rgba(17, 17, 17, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate)
}

animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

