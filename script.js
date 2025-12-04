const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let effects = {
    particles: false,
    rainbow: false,
    sparkles: false,
    glow: false,
    ripple: false
};

let particles = [];
let rainbowTrail = [];
let sparkles = [];
let ripples = [];
let mouseX = 0;
let mouseY = 0;

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Random background color
function randomColor() {
    return `hsl(${Math.random() * 360}, 70%, 50%)`;
}

document.body.style.backgroundColor = randomColor();

// Change background button
document.getElementById('change-bg').addEventListener('click', () => {
    document.body.style.backgroundColor = randomColor();
});

// Toggle buttons
document.querySelectorAll('.toggle-btn[data-effect]').forEach(btn => {
    btn.addEventListener('click', () => {
        const effect = btn.dataset.effect;
        effects[effect] = !effects[effect];
        btn.classList.toggle('active', effects[effect]);
    });
});

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (effects.particles) {
        for (let i = 0; i < 3; i++) {
            particles.push({
                x: mouseX,
                y: mouseY,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1,
                size: Math.random() * 4 + 2,
                color: `hsl(${Math.random() * 360}, 100%, 60%)`
            });
        }
    }

    if (effects.rainbow) {
        rainbowTrail.push({
            x: mouseX,
            y: mouseY,
            hue: (Date.now() / 10) % 360,
            life: 1
        });
        if (rainbowTrail.length > 30) rainbowTrail.shift();
    }

    if (effects.sparkles) {
        if (Math.random() > 0.7) {
            sparkles.push({
                x: mouseX + (Math.random() - 0.5) * 20,
                y: mouseY + (Math.random() - 0.5) * 20,
                life: 1,
                size: Math.random() * 3 + 2
            });
        }
    }

    if (effects.glow) {
        drawGlow(mouseX, mouseY);
    }

    if (effects.ripple) {
        if (Math.random() > 0.9) {
            ripples.push({
                x: mouseX,
                y: mouseY,
                radius: 0,
                life: 1
            });
        }
    }
});

function drawGlow(x, y) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 50);
    gradient.addColorStop(0, `rgba(255, 255, 255, 0.8)`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, 0.3)`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fill();
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Particles
    if (effects.particles) {
        particles = particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            p.vy += 0.1; // gravity

            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            return p.life > 0 && p.y < canvas.height;
        });
    }

    // Rainbow trail
    if (effects.rainbow) {
        for (let i = 0; i < rainbowTrail.length; i++) {
            const point = rainbowTrail[i];
            ctx.globalAlpha = point.life;
            ctx.strokeStyle = `hsl(${point.hue}, 100%, 60%)`;
            ctx.lineWidth = 3;
            if (i > 0) {
                ctx.beginPath();
                ctx.moveTo(rainbowTrail[i - 1].x, rainbowTrail[i - 1].y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            }
            point.life -= 0.05;
        }
        rainbowTrail = rainbowTrail.filter(p => p.life > 0);
    }

    // Sparkles
    if (effects.sparkles) {
        sparkles = sparkles.filter(s => {
            s.life -= 0.03;
            ctx.globalAlpha = s.life;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw cross
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(s.x - s.size * 2, s.y);
            ctx.lineTo(s.x + s.size * 2, s.y);
            ctx.moveTo(s.x, s.y - s.size * 2);
            ctx.lineTo(s.x, s.y + s.size * 2);
            ctx.stroke();

            return s.life > 0;
        });
    }

    // Ripples
    if (effects.ripple) {
        ripples = ripples.filter(r => {
            r.radius += 3;
            r.life -= 0.02;
            ctx.globalAlpha = r.life;
            ctx.strokeStyle = `rgba(255, 255, 255, ${r.life})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            ctx.stroke();

            return r.life > 0 && r.radius < 200;
        });
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
}

animate();

