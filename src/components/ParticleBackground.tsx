import React, {useEffect, useRef} from 'react';
import '../styles/ParticleBackground.css';

const PARTICLE_COUNT = 500;
const REPULSION_RADIUS = 100;
const MAX_DISPLACEMENT = 50;

const COLOR_PROBABILITIES = {
    STAR_WHITE: 0.50,      // 50% - Main sequence stars (white/blue-white)
    STAR_YELLOW: 0.15,     // 15% - G-type stars like our Sun (yellow)
    RED_GIANT: 0.10,       // 10% - Red giants/dwarfs (reddish)
    NEBULA: 0.15,          // 15% - Nebulae (purples/pinks)
    GALAXY_BLUE: 0.10      // 10% - Galaxy arms/blue shifts
};

interface Particle {
    baseX: number;
    baseY: number;
    size: number;
    x: number;
    y: number;
    color: string;
    twinkleSpeed: number;
    twinkleOffset: number;
    baseOpacity: number;
    depth: number;
}

const ParticleBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({x: -1000, y: -1000});
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        updateCanvasSize();

        particlesRef.current = Array.from({length: PARTICLE_COUNT}).map(() => {
            const baseX = Math.random() * canvas.width;
            const baseY = Math.random() * canvas.height;
            const size = Math.random() * 3 + 1;

            let color;
            const random = Math.random();
            if (random < COLOR_PROBABILITIES.STAR_WHITE) {
                // White to blue-white stars (slight variation)
                const blueShift = Math.floor(Math.random() * 30);
                color = `rgba(255, 255, ${255 - blueShift}, ${0.7 + Math.random() * 0.3})`;
            } else if (random < COLOR_PROBABILITIES.STAR_WHITE + COLOR_PROBABILITIES.STAR_YELLOW) {
                // Yellow to orange stars
                color = `rgba(${220 + Math.random() * 35}, ${180 + Math.random() * 50}, 100, 0.8)`;
            } else if (random < COLOR_PROBABILITIES.STAR_WHITE + COLOR_PROBABILITIES.STAR_YELLOW + COLOR_PROBABILITIES.RED_GIANT) {
                // Red giants and red dwarfs
                color = `rgba(${200 + Math.random() * 55}, ${70 + Math.random() * 50}, ${70 + Math.random() * 30}, 0.8)`;
            } else if (random < COLOR_PROBABILITIES.STAR_WHITE + COLOR_PROBABILITIES.STAR_YELLOW + COLOR_PROBABILITIES.RED_GIANT + COLOR_PROBABILITIES.NEBULA) {
                // Nebulae colors (purples, pinks)
                color = `rgba(${150 + Math.random() * 50}, ${70 + Math.random() * 40}, ${180 + Math.random() * 75}, 0.8)`;
            } else {
                // Blue galaxy regions
                color = `rgba(${70 + Math.random() * 40}, ${130 + Math.random() * 60}, ${200 + Math.random() * 55}, 0.8)`;
            }

            const twinkleSpeed = 0.03 + Math.random() * 0.05;
            const twinkleOffset = Math.random() * Math.PI * 2;
            const baseOpacity = 0.5 + Math.random() * 0.5;

            const depth = Math.random();
            const adjustedSize = size * (0.5 + depth * 0.5);

            return {
                baseX, baseY, size: adjustedSize, x: baseX, y: baseY, color,
                twinkleSpeed, twinkleOffset, baseOpacity, depth
            };
        });

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;

            const time = Date.now() * 0.001;

            particlesRef.current.forEach(particle => {
                const {baseX, baseY, size, color} = particle;

                let x = baseX;
                let y = baseY;

                const deltaX = baseX - mouseX;
                const deltaY = baseY - mouseY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                const opacityFactor = 0.5 + 0.5 * Math.sin(time * particle.twinkleSpeed + particle.twinkleOffset);
                const opacity = particle.baseOpacity * opacityFactor;

                const colorMatch = particle.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
                if (colorMatch) {
                    ctx.fillStyle = `rgba(${colorMatch[1]}, ${colorMatch[2]}, ${colorMatch[3]}, ${opacity})`;
                } else {
                    ctx.fillStyle = particle.color;
                }

                if (distance < REPULSION_RADIUS) {
                    const angle = Math.atan2(deltaY, deltaX);
                    const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
                    const depthFactor = 0.2 + particle.depth * 0.8;
                    x += Math.cos(angle) * force * MAX_DISPLACEMENT * depthFactor;
                    y += Math.sin(angle) * force * MAX_DISPLACEMENT * depthFactor;
                }


                const renderStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
                    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);

                    const colorMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
                    if (colorMatch) {
                        const [r, g, b] = [colorMatch[1], colorMatch[2], colorMatch[3]];
                        gradient.addColorStop(0, color);
                        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.3)`);
                        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                    } else {
                        gradient.addColorStop(0, color);
                        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    }

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(x, y, size * 3, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.beginPath();
                    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                };

                renderStar(ctx, x, y, size, color);

                particle.x = x;
                particle.y = y;
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        };

        const handleResize = () => {
            updateCanvasSize();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <>
            <div className="background-gradient"></div>
            <div className="particle-container">
                <canvas ref={canvasRef} className="particle-canvas"/>
            </div>
        </>
    );
};

export default ParticleBackground;
