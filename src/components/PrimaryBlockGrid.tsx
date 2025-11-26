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

interface PrimaryBlockGridProps {
    baseColor?: string;
    highlightColor?: string;
    imageToTrace?: string;
    traceThreshold?: number;
    traceDensity?: number;
}

const PrimaryBlockGrid = ({
                              baseColor,
                              highlightColor,
                              imageToTrace,
                              traceThreshold = 129,
                              traceDensity = 1
                          }: PrimaryBlockGridProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const requestIdRef = useRef<number | null>(null);
    const rotationRef = useRef(0);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const rotationSpeed = 0.05; // Faster rotation speed
        let animationId: number;

        const rotate = () => {
            rotationRef.current = (rotationRef.current + rotationSpeed) % 360;
            animationId = requestAnimationFrame(rotate);
        };

        animationId = requestAnimationFrame(rotate);
        return () => cancelAnimationFrame(animationId);
    }, []);

    const {theme} = useThemeContext();
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
        ctx.scale(dpr, dpr);

        const blockSize = 8;
        const spacing = 2.5;
        const blocks: Block[] = [];

        const worldSize = Math.sqrt(dimensions.width ** 2 + dimensions.height ** 2);

        const createUniformGrid = () => {
            blocks.length = 0;
            const worldOffsetX = (dimensions.width - worldSize) / 2;
            const worldOffsetY = (dimensions.height - worldSize) / 2;
            const cols = Math.floor(worldSize / (blockSize + spacing));
            const rows = Math.floor(worldSize / (blockSize + spacing));

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    blocks.push({
                        x: worldOffsetX + x * (blockSize + spacing),
                        y: worldOffsetY + y * (blockSize + spacing),
                        offsetX: 0,
                        offsetY: 0,
                        vx: 0,
                        vy: 0,
                        speed: 0,
                        normalizedSpeed: 0,
                        springFactor: 0.08 + Math.random() * 0.04,
                    });
                }
            }
        };

        const createImageBasedGrid = (img: HTMLImageElement) => {
            blocks.length = 0;
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return;

            let imgWidth = img.width, imgHeight = img.height;
            const maxWidth = dimensions.width * 0.8, maxHeight = dimensions.height * 0.8;
            if (imgWidth > maxWidth) {
                imgHeight *= maxWidth / imgWidth;
                imgWidth = maxWidth;
            }
            if (imgHeight > maxHeight) {
                imgWidth *= maxHeight / imgHeight;
                imgHeight = maxHeight;
            }

            tempCanvas.width = imgWidth;
            tempCanvas.height = imgHeight;
            tempCtx.drawImage(img, 0, 0, imgWidth, imgHeight);

            const imageData = tempCtx.getImageData(0, 0, imgWidth, imgHeight);
            const data = imageData.data;
            const offsetX = (dimensions.width - imgWidth) / 2;
            const offsetY = (dimensions.height - imgHeight) / 2;
            const sampleSize = Math.max(1, Math.floor(8 / traceDensity));

            for (let y = 0; y < imgHeight; y += sampleSize) {
                for (let x = 0; x < imgWidth; x += sampleSize) {
                    const i = (Math.floor(y) * Math.round(imgWidth) + Math.floor(x)) * 4;
                    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    if (data[i + 3] > 0 && brightness < traceThreshold) {
                        blocks.push({
                            x: offsetX + x,
                            y: offsetY + y,
                            offsetX: 0,
                            offsetY: 0,
                            vx: 0,
                            vy: 0,
                            speed: 0,
                            normalizedSpeed: 0,
                            springFactor: 0.08 + Math.random() * 0.04,
                        });
                    }
                }
            }
        };

        let lastMouseX = 0, lastMouseY = 0, mouseVX = 0, mouseVY = 0;

        const transformMouseCoordinates = (x: number, y: number) => {
            const angle = rotationRef.current;
            const centerX = dimensions.width / 2;
            const centerY = dimensions.height / 2;
            const translatedX = x - centerX;
            const translatedY = y - centerY;
            const radians = (-angle * Math.PI) / 180;
            const cos = Math.cos(radians);
            const sin = Math.sin(radians);
            const rotatedX = translatedX * cos - translatedY * sin;
            const rotatedY = translatedX * sin + translatedY * cos;
            return {x: rotatedX + centerX, y: rotatedY + centerY};
        };

        const getMousePos = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            return transformMouseCoordinates(e.clientX - rect.left, e.clientY - rect.top);
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            ctx.save();
            ctx.translate(dimensions.width / 2, dimensions.height / 2);
            ctx.rotate((rotationRef.current * Math.PI) / 180);
            ctx.translate(-dimensions.width / 2, -dimensions.height / 2);

            for (const block of blocks) {
                const dx = block.x - lastMouseX;
                const dy = block.y - lastMouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const influence = Math.max(0, 100 - dist) / 100;

                block.vx += mouseVX * 0.1 * influence;
                block.vy += mouseVY * 0.1 * influence;

                if (Math.random() < 0.05) {
                    block.vx += (Math.random() - 0.5) * 2;
                    block.vy += (Math.random() - 0.5) * 2;
                }

                block.offsetX += block.vx;
                block.offsetY += block.vy;
                block.vx *= 0.85;
                block.vy *= 0.85;

                block.offsetX += (0 - block.offsetX) * block.springFactor;
                block.offsetY += (0 - block.offsetY) * block.springFactor;

                block.speed = Math.sqrt(block.vx * block.vx + block.vy * block.vy);
                block.normalizedSpeed = Math.min(1, block.speed / 20);
            }

            const sortedBlocks = [...blocks].sort((a, b) => a.speed - b.speed);
            for (const block of sortedBlocks) {
                if (block.normalizedSpeed > 0.05) {
                    const baseCol = effectiveBaseColor.replace('#', '');
                    const highlightCol = effectiveHighlightColor.replace('#', '');
                    const baseR = parseInt(baseCol.substring(0, 2), 16);
                    const baseG = parseInt(baseCol.substring(2, 4), 16);
                    const baseB = parseInt(baseCol.substring(4, 6), 16);
                    const highlightR = parseInt(highlightCol.substring(0, 2), 16);
                    const highlightG = parseInt(highlightCol.substring(2, 4), 16);
                    const highlightB = parseInt(highlightCol.substring(4, 6), 16);
                    const r = baseR + (highlightR - baseR) * block.normalizedSpeed;
                    const g = baseG + (highlightG - baseG) * block.normalizedSpeed;
                    const b = baseB + (highlightB - baseB) * block.normalizedSpeed;
                    ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
                } else {
                    ctx.fillStyle = effectiveBaseColor;
                }
                ctx.fillRect(block.x + block.offsetX, block.y + block.offsetY, blockSize, blockSize);
            }

            ctx.restore();
            requestIdRef.current = requestAnimationFrame(animate);
        };

        const init = () => {
            if (imageToTrace) {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => createImageBasedGrid(img);
                img.onerror = createUniformGrid;
                img.src = imageToTrace;
            } else {
                createUniformGrid();
            }
            if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current);
            animate();
        };
        init();

        const handleMouseMove = (e: MouseEvent) => {
            const pos = getMousePos(e);
            mouseVX = pos.x - lastMouseX;
            mouseVY = pos.y - lastMouseY;
            lastMouseX = pos.x;
            lastMouseY = pos.y;
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            const {x: clickX, y: clickY} = getMousePos(e);
            for (const block of blocks) {
                const dx = block.x - clickX;
                const dy = block.y - clickY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const impulse = 30 * (1 - Math.min(1, dist / Math.max(dimensions.width, dimensions.height)));
                block.vx += (dx / (dist || 1)) * impulse;
                block.vy += (dy / (dist || 1)) * impulse;
            }
        };

        const handleResize = () => setDimensions({width: window.innerWidth, height: window.innerHeight});
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('resize', handleResize);

        return () => {
            if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('resize', handleResize);
        };
    }, [dimensions, effectiveBaseColor, effectiveHighlightColor, imageToTrace, traceThreshold, traceDensity]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1,
                pointerEvents: 'auto'
            }}
        />
    );
};

export default PrimaryBlockGrid;
