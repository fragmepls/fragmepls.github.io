import {useEffect, useRef, useState} from 'react';
import '../styles/DvdBounce.css';

interface Position {
    x: number;
    y: number;
}

interface Velocity {
    x: number;
    y: number;
}

export const DvdBounce = () => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<Position>({x: 0, y: 0});
    const [velocity, setVelocity] = useState<Velocity>({x: 2, y: 2});

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // Initialize position on mount
        const rect = element.getBoundingClientRect();
        setPosition({
            x: Math.random() * (window.innerWidth - rect.width),
            y: Math.random() * (window.innerHeight - rect.height)
        });
    }, []);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const animate = () => {
            const rect = element.getBoundingClientRect();
            const parentWidth = window.innerWidth;
            const parentHeight = window.innerHeight;

            setPosition(prev => {
                let newX = prev.x + velocity.x;
                let newY = prev.y + velocity.y;
                let newVelocityX = velocity.x;
                let newVelocityY = velocity.y;

                if (newX <= 0 || newX + rect.width >= parentWidth) {
                    newVelocityX = -velocity.x;
                    newX = newX <= 0 ? 0 : parentWidth - rect.width;
                }

                if (newY <= 0 || newY + rect.height >= parentHeight) {
                    newVelocityY = -velocity.y;
                    newY = newY <= 0 ? 0 : parentHeight - rect.height;
                }

                setVelocity({x: newVelocityX, y: newVelocityY});

                return {x: newX, y: newY};
            });
        };

        const intervalId = setInterval(animate, 16);

        return () => clearInterval(intervalId);
    }, [velocity]);

    return (
        <div
            ref={elementRef}
            className="dvd-bounce"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
        >
            Work in progress
        </div>
    );
};
