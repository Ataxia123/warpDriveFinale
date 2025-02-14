"use client"
import React, { useEffect, useState } from "react";
import styles from "./Background.module.css";
import SpaceParticles from "./Effects/SpaceParticles";
import WarpSpeedCanvas from "./Effects/WarpSpeedCanvas";
import WarpTunnel from "./Effects/WarpTunnel";
import { useImageStore, useAppStore } from "@/app/store/store";


const Background: React.FC = () => {
    const [warpSpeedOpacity, setWarpSpeedOpacity] = useState("0");
    const [lightSpeed, setLightSpeed] = useState(false);
    const [showDynamicImage, setShowDynamicImage] = useState(true);
    const [showAlternateImage, setShowAlternateImage] = useState(false);
    const warpImage1 = React.useRef<HTMLDivElement>(null);
    const warpImage2 = React.useRef<HTMLDivElement>(null);
    const imageStore = useImageStore();
    const { warping, loadingProgress, travelStatus } = useAppStore(state => state);

    const [bgPosition, setBgPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        setBgPosition({ x: clientX / 50, y: clientY / 50 });
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {
        setLightSpeed(warping);
    }, [warping]);

    useEffect(() => {
        if (warpImage1.current && warpImage2.current) {
            const duration = 12 - 4 * (loadingProgress / 10);
            warpImage1.current.style.animation = `zoomIn ${duration}s infinite linear`;
            warpImage2.current.style.animation = `zoomIn ${duration}s infinite linear 0.5s`;
        }
    }, [loadingProgress]);

    useEffect(() => {
        if (warping && travelStatus == "TargetAcquired") {
            setShowAlternateImage(true);
        } else {
            setShowAlternateImage(false);
        }
    }, [warping, travelStatus]);

    return (
        <div className={styles.background}>
            <img
                className={`${styles.dynamicImage} ${!showAlternateImage ? styles.visible : styles.hidden}`}
                src={imageStore.backgroundImageUrl || "assets/background.png"}
                alt="Dynamic Image"
                style={{
                    transform: `translate(${-bgPosition.x}px, ${-bgPosition.y}px)`,
                }}
            />
            <SpaceParticles />

            <WarpTunnel active={warping} loadingProgress={loadingProgress} />
            {warping && <WarpSpeedCanvas active={warping} progress={loadingProgress} />}
        </div>
    );
};

export default Background;
