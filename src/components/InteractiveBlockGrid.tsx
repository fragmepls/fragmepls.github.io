import {useEffect, useRef, useState} from 'react';
import {useThemeContext} from '../context/ThemeContext';

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
    imageToTrace?: string;
    traceThreshold?: number;
    traceDensity?: number;
}

const InteractiveBlockGrid = ({
                                  baseColor,
                                  highlightColor,
                                  imageToTrace,
                                  traceThreshold = 129,
                                  traceDensity = 1
                              }: InteractiveBlockGridProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const requestIdRef = useRef<number | null>(null);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const {theme} = useThemeContext();

    // Determine colors based on theme
    const effectiveBaseColor = baseColor || (theme === 'dark' ? '#2a2a2a' : '#e8e8e8');
    const effectiveHighlightColor = highlightColor || (theme === 'dark' ? '#ff2525' : '#535bf2');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.style.width = `${dimensions.width}px`;
        canvas.style.height = `${dimensions.height}px`;
        canvas.width = Math.round(dimensions.width * dpr);
        canvas.height = Math.round(dimensions.height * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        let rayEffectActive = false;
        let rayEffectDuration = 0;
        const RAY_EFFECT_MAX_DURATION = 5;
        const rayIntensity = 10;

        const blockSize = 8;
        const spacing = 2.5;
        const blocks: Block[] = [];

        // Function to create blocks in grid pattern
        const createUniformGrid = () => {
            const cols = Math.floor(dimensions.width / (blockSize + spacing));
            const rows = Math.floor(dimensions.height / (blockSize + spacing));
            const gridWidth = cols * (blockSize + spacing) - spacing;
            const gridHeight = rows * (blockSize + spacing) - spacing;
            const offsetX = (dimensions.width - gridWidth) / 2;
            const offsetY = (dimensions.height - gridHeight) / 2;

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
        };

        // Function to create blocks based on image data
        const createImageBasedGrid = (img: HTMLImageElement) => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return;

            let imgWidth = img.width;
            let imgHeight = img.height;
            const maxWidth = dimensions.width * 0.8;
            const maxHeight = dimensions.height * 0.8;

            if (imgWidth > maxWidth) {
                imgHeight = (maxWidth / imgWidth) * imgHeight;
                imgWidth = maxWidth;
            }

            if (imgHeight > maxHeight) {
                imgWidth = (maxHeight / imgHeight) * imgWidth;
                imgHeight = maxHeight;
            }

            tempCanvas.width = Math.round(imgWidth);
            tempCanvas.height = Math.round(imgHeight);
            tempCtx.drawImage(img, 0, 0, imgWidth, imgHeight);

            let imageData: ImageData | null = null;
            try {
                imageData = tempCtx.getImageData(0, 0, Math.round(imgWidth), Math.round(imgHeight));
            } catch (err) {
                console.error('Unable to read image data (CORS/tainted canvas). Ensure image is same-origin or server sends Access-Control-Allow-Origin.', err);
                createUniformGrid();
                return;
            }
            const data = imageData.data;
            const offsetX = (dimensions.width - imgWidth) / 2;
            const offsetY = (dimensions.height - imgHeight) / 2;
            const sampleSize = Math.max(1, Math.floor(8 / traceDensity));

            for (let y = 0; y < imgHeight; y += sampleSize) {
                for (let x = 0; x < imgWidth; x += sampleSize) {
                    const pixelIndex = (Math.floor(y) * Math.round(imgWidth) + Math.floor(x)) * 4;
                    const r = data[pixelIndex];
                    const g = data[pixelIndex + 1];
                    const b = data[pixelIndex + 2];
                    const a = data[pixelIndex + 3];
                    const brightness = (r + g + b) / 3;

                    if (a > 0 && brightness < traceThreshold) {
                        blocks.push({
                            x: offsetX + x,
                            y: offsetY + y,
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
            }
        };

        // Mouse tracking
        let lastMouseX = 0;
        let lastMouseY = 0;
        let mouseVX = 0;
        let mouseVY = 0;
        let mouseMoved = false;

        const getMousePos = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            return {x: e.clientX - rect.left, y: e.clientY - rect.top};
        };

        // Animation function
        function animate() {
            if (!ctx) return;
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
                    block.vx += (Math.random() - 0.5) * 2;
                    block.vy += (Math.random() - 0.5) * 2;
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
        }

        // Either load image or use uniform grid
        if (imageToTrace) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                createImageBasedGrid(img);
                requestIdRef.current = requestAnimationFrame(animate);
            };
            img.onerror = () => {
                console.error('Error loading trace image');
                createUniformGrid();
                requestIdRef.current = requestAnimationFrame(animate);
            };
            img.src = imageToTrace;
        } else {
            createUniformGrid();
            requestIdRef.current = requestAnimationFrame(animate);
        }

        // Mouse move tracking
        const handleMouseMove = (e: MouseEvent) => {
            const pos = getMousePos(e);
            mouseVX = pos.x - lastMouseX;
            mouseVY = pos.y - lastMouseY;
            lastMouseX = pos.x;
            lastMouseY = pos.y;
            mouseMoved = true;
        };

        // Left-click ray effect
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 0) {
                const pos = getMousePos(e);
                rayEffectActive = true;
                rayEffectDuration = 0;
                lastMouseX = pos.x;
                lastMouseY = pos.y;
            }
        };

        // Right-click impulse effect
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            const pos = getMousePos(e);
            const clickX = pos.x;
            const clickY = pos.y;
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

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('resize', handleResize);
            if (requestIdRef.current !== null) {
                cancelAnimationFrame(requestIdRef.current);
            }
        };
    }, [dimensions, effectiveBaseColor, effectiveHighlightColor, theme, imageToTrace, traceThreshold, traceDensity]);

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
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    );
};

export default InteractiveBlockGrid;
