export type Tone = "cyan" | "lime" | "amber" | "violet";

export interface Metric {
  label: string;
  value: string;
  tone?: Tone;
}

export interface StorySection {
  heading: string;
  body: string; // markdown
}

export interface Social {
  label: string;
  handle: string;
  url: string;
  kind: "github" | "linkedin" | "medium" | "leetcode" | "codeforces" | "email";
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  subTagline: string;
  bioShort: string;
  bioLong: string; // markdown
  email: string;
  location: string;
  openTo: string;
  resumeUrl: string;
  socials: Social[];
  heroChips: Metric[];
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  tags: string[];
  metrics: Metric[];
  diagram?: string;
  motif: string;
  github?: string;
  dates?: string;
  award?: string;
  story: StorySection[];
  pinned: boolean;
  visible: boolean;
}

export interface Blog {
  slug: string;
  title: string;
  source: "local" | "medium";
  url?: string;
  excerpt: string;
  body?: string; // markdown, local posts only
  tags: string[];
  readingTime: number;
  date: string; // ISO
  featured: boolean;
  visible: boolean;
  relatedProjects: string[];
}

export interface ExperienceItem {
  role: string;
  org: string;
  dates: string;
  location: string;
  summary: string;
  bullets: string[];
  motif: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  dates: string;
  gpa: string;
  details: string;
}

export interface Achievement {
  title: string;
  detail: string;
  year: string;
  motif: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100, flamegraph bar width
  note?: string;
}

export interface SkillGroup {
  name: string;
  tone: Tone;
  skills: Skill[];
}

export interface DsaProfile {
  platform: string;
  handle: string;
  url: string;
  note: string;
}

export interface Content {
  profile: Profile;
  projects: Project[];
  blogs: Blog[];
  experience: ExperienceItem[];
  education: EducationItem[];
  achievements: Achievement[];
  skillGroups: SkillGroup[];
  dsaProfiles: DsaProfile[];
  coursework: string[];
}
