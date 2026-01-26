/**
 * Type definitions for the Photography Portfolio
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  year: number;
}

export interface Job {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | "Present";
  description: string;
  highlights: string[];
  logoUrl?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface Photo {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  location?: string;
  date?: string;
  width: number;
  height: number;
}

export interface SocialLink {
  platform: "github" | "linkedin" | "twitter" | "email" | "instagram";
  url: string;
  label: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  socialLinks: SocialLink[];
}

// Animation & Scroll State Types
export interface ScrollState {
  progress: number;
  direction: "up" | "down";
  velocity: number;
}

export interface CursorState {
  x: number;
  y: number;
  isVisible: boolean;
  isHovering: boolean;
}

// Hero Section State
export interface HeroState {
  isVisible: boolean;
  cameraOpacity: number;
  scrollProgress: number;
}

// Theme State
export type ThemeMode = "light" | "darkroom";

export interface ThemeState {
  mode: ThemeMode;
  backgroundColor: string;
  textColor: string;
}
