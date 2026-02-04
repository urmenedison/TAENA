
const canvas = document.getElementById('tulipCanvas');
const ctx = canvas.getContext('2d');

let width, height, tulips = [], sparkles = [], time = 0;

function setup() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    // Determine base size based on screen width (Bigger on Desktop)
    const baseScale = width > 800 ? 1.8 : 0.8;

    tulips = [];
    for (let i = 0; i < 50; i++) {
        tulips.push({
            // Spread coordinates
            x: (Math.random() - 0.5) * (width * 0.5), 
            y: (Math.random() - 0.5) * (height * 0.4),
            scale: (0.8 + Math.random() * 0.7) * baseScale, // Large scaling
            angle: (Math.random() - 0.5) * 0.7,
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.4
        });
    }
    // Sort by Y so flowers in back draw first
    tulips.sort((a, b) => a.y - b.y);

    sparkles = Array.from({length: 100}, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        s: Math.random() * 2,
        v: Math.random() * 0.4 + 0.1
    }));
}

function drawTulip(x, y, scale, sway, angle) {
    ctx.save();
    ctx.translate(x + sway, y);
    ctx.scale(scale, scale);
    ctx.rotate(angle);

    // Petal Glow (Makes them pop on large screens)
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(255, 0, 0, 0.3)";

    const drawPetal = (w, h, rot, fill, rimColor) => {
        ctx.save();
        ctx.rotate(rot);
        ctx.fillStyle = fill;
        ctx.strokeStyle = rimColor;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-w, -h/2, -w, -h, 0, -h);
        ctx.bezierCurveTo(w, -h, w, -h/2, 0, 0);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    };

    // Layers (Back to Front)
    drawPetal(12, 30, -0.35, "#300000", "#500000"); // Deep Back
    drawPetal(12, 30, 0.35, "#300000", "#500000");
    drawPetal(16, 38, -0.15, "#800000", "#a00000"); // Mid
    drawPetal(16, 38, 0.15, "#800000", "#a00000");
    drawPetal(15, 36, 0, "#ff0000", "rgba(255,255,255,0.4)"); // Front Bright
    
    ctx.restore();

    // Stem - Fixed thick stems for big flowers
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(width / 2, height + 100); 
    ctx.quadraticCurveTo(width / 2, y + 200, x + sway, y);
    ctx.strokeStyle = "#0a1a0a";
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
    ctx.restore();
}

function animate() {
    // Background fill
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    time += 0.015;

    // Draw Glitters
    sparkles.forEach(s => {
        s.y -= s.v;
        if (s.y < 0) s.y = height;
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw 50 Large Tulips
    const cx = width / 2;
    const cy = height * 0.5;

    tulips.forEach(t => {
        const sway = Math.sin(time * t.speed + t.phase) * 20;
        drawTulip(cx + t.x, cy + t.y, t.scale, sway, t.angle);
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', setup);
setup();
animate();
