import type { Education, Job, Project, SocialLink } from "@/types";

export const socialLinks: SocialLink[] = [
  {
    platform: "linkedin",
    url: "https://www.linkedin.com/in/smit11patel",
    label: "LinkedIn",
  },
  {
    platform: "twitter",
    url: "https://x.com/_smitsp11",
    label: "X",
  },
];

export const photos = [
  {
    src: "/images/IMG_3958.png",
    alt: "Chicago skyline at twilight",
    caption: "Chicago",
  },
  {
    src: "/images/IMG_0121.JPG",
    alt: "Beach sunset in Port Burwell",
    caption: "Port Burwell",
  },
  {
    src: "/images/IMG_8507.png",
    alt: "Toronto skyline from the ferry",
    caption: "Toronto",
  },
];

export const jobs: Job[] = [
  {
    id: "1",
    company: "General Magic",
    role: "Founding Intern",
    location: "Toronto, ON",
    startDate: "May 2026",
    endDate: "Present",
    description: "Building insurance-specific AI for modern brokerages.",
    companyUrl: "https://generalmagic.inc/",
    logo: "/images/logos/general-magic.png",
  },
  {
    id: "2",
    company: "DeepIDV",
    role: "ML Engineer Intern",
    location: "San Francisco, CA",
    startDate: "Mar",
    endDate: "May 2026",
    description:
      "Deepfake detection and identity verification for humans and AI agents.",
    companyUrl: "https://www.deepidv.com/",
    logo: "/images/logos/deepidv.png",
  },
  {
    id: "3",
    company: "Stupid Ideas Hackathon",
    role: "Co-Founder",
    location: "Toronto, ON",
    startDate: "2025",
    endDate: "Present",
    description:
      "Building a global community of builders by removing the pressure of competition and reintroducing passion in creation.",
    companyUrl: "https://www.stupideas.com/",
    logo: "/images/logos/stupid-ideas.png",
  },
];

export const education: Education = {
  id: "1",
  institution: "University of Toronto",
  degree: "Computer Engineering",
  field: "",
  startDate: "",
  endDate: "Expected Graduation 2028",
  highlights: ["Faculty of Applied Science & Engineering Award ($10,000)"],
};

export const projects: Project[] = [
  {
    id: "1",
    title: "BehavAced",
    description:
      "An AI-powered behavioral interview that helps improve your communication during interviews.",
    techStack: ["Python", "Supabase", "AI", "Next.js"],
    imageUrl: "/images/behavaced.png",
    githubUrl: "https://github.com/smitsp11/BehavAced",
    featured: true,
    year: 2025,
  },
  {
    id: "2",
    title: "Sonna",
    description:
      "Inspired by Suits Donna: a voice AI assistant with conversation, memory, and reminder scheduling.",
    techStack: ["Python", "FastAPI", "PostgreSQL", "Celery"],
    imageUrl: "/images/sonna.png",
    githubUrl: "https://github.com/smitsp11/sonna",
    featured: true,
    year: 2025,
  },
  {
    id: "3",
    title: "Viva",
    description:
      "A classroom-aligned, voice-first learning assistant that helps students think out loud and learn async.",
    techStack: ["TypeScript", "FastAPI", "MongoDB", "Auth"],
    imageUrl: "/images/viva.png",
    githubUrl: "https://github.com/VictorWong123/nexHacks2026",
    featured: true,
    year: 2026,
  },
  {
    id: "4",
    title: "readMax",
    description:
      "A web app that flashes one word at a time at a chosen WPM to increase reading speed.",
    techStack: ["HTML", "RSVP", "JavaScript", "ORP"],
    imageUrl: "/images/readmax.png",
    githubUrl: "https://github.com/smitsp11/readMax",
    featured: true,
    year: 2026,
  },
];
