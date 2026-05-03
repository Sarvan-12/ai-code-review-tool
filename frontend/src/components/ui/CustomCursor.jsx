import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let mouse = { x: width / 2, y: height / 2 };
    let pos = { x: width / 2, y: height / 2 }; 
    let particles = [];
    let isHovering = false;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // Check if hovering over interactive elements
      if (e.target) {
        isHovering = e.target.closest('a, button, input, textarea, select, .history-item, .btn-clear-corner') !== null;
      }
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    const colors = ['#818cf8', '#c084fc', '#f472b6', '#38bdf8', '#2dd4bf']; // Indigo, Purple, Pink, Sky, Teal

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1; // Increased size slightly (1 to 3px)
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015; // Slower fade
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
      }
      draw(ctx) {
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color; 
        ctx.shadowBlur = 6; // Stronger glow
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    let targetRadius = 4;
    let currentRadius = 4;
    let colorIndex = 0;
    let colorTimer = 0;

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth follow (Lerp)
      pos.x += (mouse.x - pos.x) * 0.2;
      pos.y += (mouse.y - pos.y) * 0.2;

      // Spawn particles when moving fast enough
      const dx = mouse.x - pos.x;
      const dy = mouse.y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 1) { // Lowered threshold to spawn more particles
        particles.push(new Particle(pos.x, pos.y));
        particles.push(new Particle(pos.x + dx * 0.33, pos.y + dy * 0.33));
        particles.push(new Particle(pos.x + dx * 0.66, pos.y + dy * 0.66));
      }

      // Update and draw trail
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }

      // Handle hover state
      targetRadius = isHovering ? 14 : 4; // Slightly larger outer ring
      currentRadius += (targetRadius - currentRadius) * 0.15;

      // Slowly cycle main cursor color through the palette
      colorTimer += 0.01;
      if (colorTimer > 1) {
        colorTimer = 0;
        colorIndex = (colorIndex + 1) % colors.length;
      }
      
      // We will just use the active color from the palette for the main dot
      const mainColor = colors[colorIndex];

      // Draw Main Cursor Dot
      ctx.globalAlpha = 1;
      
      // Inner solid dot (White when hovering, colored otherwise)
      ctx.fillStyle = isHovering ? '#ffffff' : mainColor; 
      ctx.shadowBlur = 8;
      ctx.shadowColor = mainColor;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isHovering ? 2 : 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Outer subtle ring 
      ctx.strokeStyle = mainColor;
      ctx.globalAlpha = isHovering ? 0.8 : 0.4;
      ctx.lineWidth = isHovering ? 1.5 : 1;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, currentRadius, 0, Math.PI * 2);
      ctx.stroke();

      requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none', // Critical: lets clicks pass through
        zIndex: 99999, // Stays on top of absolutely everything
      }}
    />
  );
};

export default CustomCursor;
