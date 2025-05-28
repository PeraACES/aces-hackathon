const canvas = document.getElementById('flame-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const emberColors = ['#ff4500', '#ffa500', '#ffff33'];
let wind = 0;
let windTimer = 0;

class Ember {
    constructor() {
    this.reset();
    }

    reset() {
    this.x = Math.random() * width;
    this.y = height + Math.random() * 100;
    this.length = 20 + Math.random() * 30;
    this.alpha = 0.8;
    this.scale = 1 + Math.random();
    this.angle = Math.random() * Math.PI * 2;
    this.color = emberColors[Math.floor(Math.random() * emberColors.length)];
    this.curve = (Math.random() - 0.5) * 40;
    this.velocity = Math.random() * 5 + 2;
    }

    update() {
    this.y -= this.velocity;
    this.x += wind * 0.6 + Math.sin(this.angle) * 0.3;
    this.angle += 0.01;
    this.alpha -= 0.004;

    if (this.alpha <= 0 || this.y < -50 || this.x < -50 || this.x > width + 50) {
        this.reset();
    }
    }

    draw(ctx) {
    const endX = this.x + Math.cos(this.angle) * this.length;
    const endY = this.y + Math.sin(this.angle) * this.length;

    const ctrlX = this.x + this.curve;
    const ctrlY = this.y - this.length / 2;

    const grad = ctx.createLinearGradient(this.x, this.y, endX, endY);
    grad.addColorStop(0, `rgba(255,255,255,0)`);
    grad.addColorStop(0.3, this.toRGBA(this.color, this.alpha));
    grad.addColorStop(1, `rgba(255,255,255,0)`);

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
    ctx.strokeStyle = grad;
    ctx.lineWidth = this.scale;
    ctx.lineCap = 'round';
    ctx.stroke();
    }

    toRGBA(hex, alpha) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
    }
}

const embers = Array.from({ length: 10 }, () => new Ember());

function updateWind(dt) {
    windTimer += dt;
    if (windTimer > 2000) {
    wind = (Math.random() - 0.5) * 1;
    windTimer = 0;
    }
}

let last = performance.now();
function animate(now) {
    const dt = now - last;
    last = now;

    updateWind(dt);

    ctx.clearRect(0, 0, width, height);
    for (const ember of embers) {
    ember.update();
    ember.draw(ctx);
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

animate(last);