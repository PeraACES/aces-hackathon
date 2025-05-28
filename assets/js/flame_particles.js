const canvas = document.getElementById('flame-canvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const emberColors = ['#ff4500', '#ff8c00', '#ffa500', '#ffd700'];

    let wind = 0;
    let windChangeTimer = 0;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.alpha = 0.6 + Math.random() * 0.4;
        this.scale = 0.5 + Math.random() * 1.5;
        this.velocity = 2 + Math.random() * 5;
        this.angle = Math.random() * Math.PI * 2;
        this.color = emberColors[Math.floor(Math.random() * emberColors.length)];
        this.windOffset = 0;
        this.length = 10 + Math.random() * 20;
      }

      update() {
        this.y -= this.velocity;
        this.windOffset += wind * 0.05;
        this.x += Math.sin(this.angle) * 0.5 + this.windOffset;
        this.angle += 0.01;
        this.alpha -= 0.003;
        this.scale *= 0.995;

        if (this.alpha <= 0 || this.y < -20 || this.x < -20 || this.x > width + 20) {
          this.reset();
        }
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.toRGBA(this.color, this.alpha);
        ctx.lineWidth = this.scale;
        const endX = this.x + Math.cos(this.angle) * this.length;
        const endY = this.y + Math.sin(this.angle) * this.length;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
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

    const particles = Array.from({ length: 200 }, () => new Particle());

    function updateWind(deltaTime) {
      windChangeTimer += deltaTime;
      if (windChangeTimer > 2000) {
        wind = (Math.random() - 0.5) * 1;
        windChangeTimer = 0;
      }
    }

    let lastTime = performance.now();
    function animate(time) {
      const deltaTime = time - lastTime;
      lastTime = time;

      updateWind(deltaTime);

      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.update();
        p.draw(ctx);
      }
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    animate(lastTime);