import {useEffect, useRef, useState} from 'react';
import {useThemeContext} from '../context/ThemeContext';

interface Block {
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    vx: number;
    vy: number;
    springFactor: number;
}

export const SecondaryBlockGrid = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const requestIdRef = useRef<number | null>(null);
    const rotationRef = useRef(0);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const {theme} = useThemeContext();
    const blockColor = theme === 'dark' ? '#1a1a1a' : '#f5f5f5';
    const bodyBackgroundColor = theme === 'dark' ? '#0a0a0a' : '#ffffff';

    useEffect(() => {
        const rotationSpeed = 0.02; // Slower rotation speed
        const rotateAnimation = () => {
            rotationRef.current = (rotationRef.current + rotationSpeed) % 360;
            requestIdRef.current = requestAnimationFrame(rotateAnimation);
        };
        rotateAnimation();
        return () => {
            if (requestIdRef.current) {
                cancelAnimationFrame(requestIdRef.current);
            }
        };
    }, []);

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
        const blocks: Block[] = [];

        const worldSize = Math.sqrt(dimensions.width ** 2 + dimensions.height ** 2);
        const worldOffsetX = (dimensions.width - worldSize) / 2;
        const worldOffsetY = (dimensions.height - worldSize) / 2;

        const createBlocks = () => {
            blocks.length = 0;
            const numBlocks = Math.floor((worldSize * worldSize) / 2500);
            for (let i = 0; i < numBlocks; i++) {
                blocks.push({
                    x: worldOffsetX + Math.random() * worldSize,
                    y: worldOffsetY + Math.random() * worldSize,
                    offsetX: 0,
                    offsetY: 0,
                    vx: 0,
                    vy: 0,
                    springFactor: 0.02 + Math.random() * 0.02,
                });
            }
        };

        let lastMouseX = 0;
        let lastMouseY = 0;
        let mouseVX = 0;
        let mouseVY = 0;

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

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const transformedPos = transformMouseCoordinates(e.clientX - rect.left, e.clientY - rect.top);
            mouseVX = transformedPos.x - lastMouseX;
            mouseVY = transformedPos.y - lastMouseY;
            lastMouseX = transformedPos.x;
            lastMouseY = transformedPos.y;
        };

        const animate = () => {
            if (!ctx) return;
            ctx.fillStyle = bodyBackgroundColor;
            ctx.fillRect(0, 0, dimensions.width, dimensions.height);

            ctx.save();
            ctx.translate(dimensions.width / 2, dimensions.height / 2);
            ctx.rotate((rotationRef.current * Math.PI) / 180);
            ctx.translate(-dimensions.width / 2, -dimensions.height / 2);

            ctx.fillStyle = blockColor;
            for (const block of blocks) {
                const dx = block.x - lastMouseX;
                const dy = block.y - lastMouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const influence = Math.max(0, 100 - dist) / 100;

                block.vx += mouseVX * 0.1 * influence;
                block.vy += mouseVY * 0.1 * influence;

                block.offsetX += block.vx;
                block.offsetY += block.vy;
                block.vx *= 0.85;
                block.vy *= 0.85;

                block.offsetX += (0 - block.offsetX) * block.springFactor;
                block.offsetY += (0 - block.offsetY) * block.springFactor;

                ctx.fillRect(block.x + block.offsetX, block.y + block.offsetY, blockSize, blockSize);
            }
            ctx.restore();
            requestIdRef.current = requestAnimationFrame(animate);
        };

        createBlocks();
        animate();

        window.addEventListener('mousemove', handleMouseMove);
        const handleResize = () => setDimensions({width: window.innerWidth, height: window.innerHeight});
        window.addEventListener('resize', handleResize);

        return () => {
            if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, [dimensions, blockColor, bodyBackgroundColor]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    );
};
