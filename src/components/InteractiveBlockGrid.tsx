import {useRef, useEffect, useState, useContext} from 'react';
import {ThemeContext} from '../context/ThemeContext';

interface Block {
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    vx: number;
    vy: number;
    speed: number;
    normalizedSpeed: number;
    springFactor: number;
}

interface InteractiveBlockGridProps {
    baseColor?: string;
    highlightColor?: string;
}

const InteractiveBlockGrid =
    ({
         baseColor,
         highlightColor
     }: InteractiveBlockGridProps) => {
        const canvasRef = useRef<HTMLCanvasElement | null>(null);
        const requestIdRef = useRef<number | null>(null);
        const [dimensions, setDimensions] = useState({
            width: window.innerWidth,
            height: window.innerHeight
        });

        const {theme} = useContext(ThemeContext);

        // Determine colors based on theme
        const effectiveBaseColor = baseColor || (theme === 'dark' ? '#1a1a1a' : '#e8e8e8');
        const effectiveHighlightColor = highlightColor || (theme === 'dark' ? '#ff2525' : '#535bf2');

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return; // Early return if canvas is null

            const ctx = canvas.getContext('2d');
            if (!ctx) return; // Early return if context is null

            // Canvas setup
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;

            const blockSize = 12;
            const spacing = 2.5;
            const cols = Math.floor(dimensions.width / (blockSize + spacing));
            const rows = Math.floor(dimensions.height / (blockSize + spacing));

            const gridWidth = cols * (blockSize + spacing) - spacing;
            const gridHeight = rows * (blockSize + spacing) - spacing;

            const offsetX = (dimensions.width - gridWidth) / 2;
            const offsetY = (dimensions.height - gridHeight) / 2;

            // Initialize blocks with proper typing
            const blocks: Block[] = [];
            let rayEffectActive = false;
            let rayEffectDuration = 0;
            const rayIntensity = 200;
            const RAY_EFFECT_MAX_DURATION = 1;

            // Create grid of blocks
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    blocks.push({
                        x: offsetX + x * (blockSize + spacing),
                        y: offsetY + y * (blockSize + spacing),
                        offsetX: 0,
                        offsetY: 0,
                        vx: 0,
                        vy: 0,
                        speed: 0,
                        normalizedSpeed: 0,
                        springFactor: 0.08 + Math.random() * 0.04
                    });
                }
            }

            // Mouse tracking
            let lastMouseX = 0;
            let lastMouseY = 0;
            let mouseVX = 0;
            let mouseVY = 0;
            let mouseMoved = false;

            // Animation function
            const animate = () => {
                ctx.clearRect(0, 0, dimensions.width, dimensions.height);

                // Handle ray effect
                if (rayEffectActive) {
                    if (rayEffectDuration < RAY_EFFECT_MAX_DURATION) {
                        for (const block of blocks) {
                            const dx = block.x - lastMouseX;
                            const dy = block.y - lastMouseY;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            const influence = Math.max(0, 100 - dist) / 100;

                            block.vx += rayIntensity * influence;
                            block.vy += rayIntensity * influence;
                        }
                        rayEffectDuration++;
                    } else {
                        rayEffectActive = false;
                    }
                }

                // Update block physics
                for (const block of blocks) {
                    const dx = block.x - lastMouseX;
                    const dy = block.y - lastMouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const influence = Math.max(0, 100 - dist) / 100;

                    // Calculate speed for color and sorting
                    block.speed = Math.sqrt(block.vx * block.vx + block.vy * block.vy);
                    block.normalizedSpeed = Math.min(1, block.speed / 20);

                    // Apply mouse movement influence
                    if (mouseMoved) {
                        block.vx += mouseVX * 0.1 * influence;
                        block.vy += mouseVY * 0.1 * influence;
                    }

                    // Random movement
                    if (Math.random() < 0.05) {
                        block.vx += (Math.random() - 0.5) * 0.4;
                        block.vy += (Math.random() - 0.5) * 0.4;
                    }

                    // Apply velocity and friction
                    block.offsetX += block.vx;
                    block.offsetY += block.vy;
                    block.vx *= 0.85;
                    block.vy *= 0.85;

                    // Spring return to original position
                    block.offsetX += (0 - block.offsetX) * block.springFactor;
                    block.offsetY += (0 - block.offsetY) * block.springFactor;
                }

                // Sort blocks by speed for proper layering
                const sortedBlocks = [...blocks].sort((a, b) => a.speed - b.speed);

                // Draw blocks
                for (const block of sortedBlocks) {
                    if (block.normalizedSpeed > 0.05) {
                        const baseCol = effectiveBaseColor.replace('#', '');
                        const highlightCol = effectiveHighlightColor.replace('#', '');

                        // Handle both 3-digit and 6-digit hex formats
                        const baseR = parseInt(baseCol.length === 3 ? baseCol[0] + baseCol[0] : baseCol.substring(0, 2), 16);
                        const baseG = parseInt(baseCol.length === 3 ? baseCol[1] + baseCol[1] : baseCol.substring(2, 4), 16);
                        const baseB = parseInt(baseCol.length === 3 ? baseCol[2] + baseCol[2] : baseCol.substring(4, 6), 16);

                        const highlightR = parseInt(highlightCol.length === 3 ? highlightCol[0] + highlightCol[0] : highlightCol.substring(0, 2), 16);
                        const highlightG = parseInt(highlightCol.length === 3 ? highlightCol[1] + highlightCol[1] : highlightCol.substring(2, 4), 16);
                        const highlightB = parseInt(highlightCol.length === 3 ? highlightCol[2] + highlightCol[2] : highlightCol.substring(4, 6), 16);

                        // Color interpolation
                        const r = baseR * (1 - block.normalizedSpeed) + highlightR * block.normalizedSpeed;
                        const g = baseG * (1 - block.normalizedSpeed) + highlightG * block.normalizedSpeed;
                        const b = baseB * (1 - block.normalizedSpeed) + highlightB * block.normalizedSpeed;

                        ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
                    } else {
                        ctx.fillStyle = effectiveBaseColor;
                    }

                    ctx.fillRect(block.x + block.offsetX, block.y + block.offsetY, blockSize, blockSize);
                }

                mouseMoved = false;
                requestIdRef.current = requestAnimationFrame(animate);
            };

            // Event handlers with proper typing
            const handleMouseMove = (e: MouseEvent) => {
                mouseVX = e.clientX - lastMouseX;
                mouseVY = e.clientY - lastMouseY;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                mouseMoved = true;
            };

            const handleMouseDown = (e: MouseEvent) => {
                if (e.button === 0) {
                    rayEffectActive = true;
                    rayEffectDuration = 0;
                    lastMouseX = e.clientX;
                    lastMouseY = e.clientY;
                }
            };

            const handleContextMenu = (e: MouseEvent) => {
                e.preventDefault();
                const clickX = e.clientX;
                const clickY = e.clientY;

                for (const block of blocks) {
                    const dx = block.x - clickX;
                    const dy = block.y - clickY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = Math.max(dimensions.width, dimensions.height);

                    const impulseStrength = 30 * (1 - Math.min(1, dist / maxDist));
                    const normalizedDx = dx / (dist || 1);
                    const normalizedDy = dy / (dist || 1);

                    block.vx += normalizedDx * impulseStrength;
                    block.vy += normalizedDy * impulseStrength;
                }
            };

            const handleResize = () => {
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            };

            // Add event listeners
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('contextmenu', handleContextMenu);
            window.addEventListener('resize', handleResize);

            // Start animation
            requestIdRef.current = requestAnimationFrame(animate);

            // Cleanup function
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mousedown', handleMouseDown);
                window.removeEventListener('contextmenu', handleContextMenu);
                window.removeEventListener('resize', handleResize);
                if (requestIdRef.current !== null) {
                    cancelAnimationFrame(requestIdRef.current);
                }
            };
        }, [dimensions, effectiveBaseColor, effectiveHighlightColor, theme]);

        return (
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    background: 'transparent',
                    margin: 0,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0
                }}
            />
        );
    };

export default InteractiveBlockGrid;
