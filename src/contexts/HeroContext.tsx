"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface HeroContextType {
  isHeroVisible: boolean;
  setIsHeroVisible: (visible: boolean) => void;
  cameraOpacity: number;
  setCameraOpacity: (opacity: number) => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  isModelLoaded: boolean;
  setIsModelLoaded: (loaded: boolean) => void;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

interface HeroProviderProps {
  children: ReactNode;
}

export function HeroProvider({ children }: HeroProviderProps) {
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [cameraOpacity, setCameraOpacity] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const handleSetIsHeroVisible = useCallback((visible: boolean) => {
    setIsHeroVisible(visible);
  }, []);

  const handleSetCameraOpacity = useCallback((opacity: number) => {
    setCameraOpacity(Math.max(0, Math.min(1, opacity)));
  }, []);

  const handleSetScrollProgress = useCallback((progress: number) => {
    setScrollProgress(Math.max(0, Math.min(1, progress)));
  }, []);

  const handleSetIsModelLoaded = useCallback((loaded: boolean) => {
    setIsModelLoaded(loaded);
  }, []);

  return (
    <HeroContext.Provider
      value={{
        isHeroVisible,
        setIsHeroVisible: handleSetIsHeroVisible,
        cameraOpacity,
        setCameraOpacity: handleSetCameraOpacity,
        scrollProgress,
        setScrollProgress: handleSetScrollProgress,
        isModelLoaded,
        setIsModelLoaded: handleSetIsModelLoaded,
      }}
    >
      {children}
    </HeroContext.Provider>
  );
}

export function useHero() {
  const context = useContext(HeroContext);
  if (context === undefined) {
    throw new Error("useHero must be used within a HeroProvider");
  }
  return context;
}
