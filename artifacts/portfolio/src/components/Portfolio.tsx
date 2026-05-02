import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Server,
  Cloud,
  Code,
  Database,
  Container,
  GitBranch,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Award,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  User,
  Globe,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  Link,
  Building2,
  Eye,
} from 'lucide-react';
import ContactForm from './ContactForm';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const PROFILE_PIC_KEY = 'portfolio_profile_pic_url';
const PROJECTS_KEY = 'portfolio_projects';
const SKILLS_KEY = 'portfolio_skills';
const RESUME_KEY = 'portfolio_resume_url';
const RESUME_NAME_KEY = 'portfolio_resume_name';
const SOCIAL_LINKS_KEY = 'portfolio_social_links';
const PROFILE_KEY = 'portfolio_profile';

const DEFAULT_PROFILE = {
  name: 'Raynald Gitau',
  email: 'raynald.gitau@example.com',
  title: 'DevOps Engineer',
  bio: 'Building resilient infrastructure and automating the future.',
  university: 'United States International University Africa',
  currentCompany: '',
};

function loadProfile() {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

interface SocialLink {
  id: number;
  platform: string;
  label: string;
  url: string;
}

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { id: 1, platform: 'github', label: 'GitHub', url: 'https://github.com' },
  { id: 2, platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
  { id: 3, platform: 'email', label: 'Email', url: 'mailto:raynald.gitau@example.com' },
];

function loadSocialLinks(): SocialLink[] {
  try {
    const stored = localStorage.getItem(SOCIAL_LINKS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SOCIAL_LINKS;
  } catch {
    return DEFAULT_SOCIAL_LINKS;
  }
}

function getSocialIcon(platform: string) {
  const map: Record<string, React.ElementType> = {
    github: Github,
    linkedin: Linkedin,
    email: Mail,
    twitter: Twitter,
    youtube: Youtube,
    instagram: Instagram,
    facebook: Facebook,
    website: Globe,
  };
  return map[platform] ?? Link;
}

interface StoredProject {
  id: number;
  title: string;
  description: string;
  status: string;
  tags: string[];
  views: number;
  url?: string;
}

interface StoredSkill {
  id: number;
  name: string;
  level: number;
  category: string;
}

const DEFAULT_PORTFOLIO_PROJECTS: StoredProject[] = [
  { id: 1, title: 'Cloud Infrastructure Automation', description: 'Automated AWS infrastructure deployment using Terraform and GitHub Actions, reducing deployment time by 70%.', status: 'active', tags: ['Terraform', 'AWS', 'CI/CD'], views: 1247 },
  { id: 2, title: 'Kubernetes Cluster Management', description: 'Designed and maintained production-grade K8s clusters serving 10M+ requests daily with auto-scaling capabilities.', status: 'completed', tags: ['Kubernetes', 'Docker', 'Monitoring'], views: 892 },
  { id: 3, title: 'CI/CD Pipeline Optimization', description: 'Engineered comprehensive CI/CD pipelines with Jenkins and GitLab, achieving 50% faster build times.', status: 'active', tags: ['Jenkins', 'GitLab', 'Python'], views: 634 },
  { id: 4, title: 'Monitoring & Observability Stack', description: 'Implemented comprehensive monitoring with Prometheus, Grafana, and ELK stack for real-time insights.', status: 'active', tags: ['Prometheus', 'Grafana', 'ELK'], views: 521 },
];

const DEFAULT_PORTFOLIO_SKILLS: StoredSkill[] = [
  { id: 1, name: 'Docker', level: 95, category: 'Containerization' },
  { id: 2, name: 'Kubernetes', level: 90, category: 'Orchestration' },
  { id: 3, name: 'AWS', level: 92, category: 'Cloud' },
  { id: 4, name: 'Jenkins', level: 88, category: 'CI/CD' },
  { id: 5, name: 'Terraform', level: 85, category: 'IaC' },
  { id: 6, name: 'PostgreSQL', level: 87, category: 'Database' },
  { id: 7, name: 'Python', level: 90, category: 'Programming' },
  { id: 8, name: 'Ansible', level: 83, category: 'Automation' },
];

function loadPortfolioProjects(): StoredProject[] {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PORTFOLIO_PROJECTS;
  } catch {
    return DEFAULT_PORTFOLIO_PROJECTS;
  }
}

function loadPortfolioSkills(): StoredSkill[] {
  try {
    const stored = localStorage.getItem(SKILLS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PORTFOLIO_SKILLS;
  } catch {
    return DEFAULT_PORTFOLIO_SKILLS;
  }
}

function ProfilePicture({ name }: { name: string }) {
  const [url, setUrl] = useState<string | null>(() => localStorage.getItem(PROFILE_PIC_KEY));

  useEffect(() => {
    const handler = () => setUrl(localStorage.getItem(PROFILE_PIC_KEY));
    window.addEventListener('profile-pic-updated', handler);
    return () => window.removeEventListener('profile-pic-updated', handler);
  }, []);

  return (
    <motion.div
      className="flex justify-center mb-8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
    >
      <div className="relative">
        <div className="w-36 h-36 rounded-full ring-4 ring-cyan-400/60 ring-offset-4 ring-offset-slate-950 overflow-hidden shadow-2xl shadow-cyan-500/30 bg-slate-800 flex items-center justify-center">
          {url ? (
            <img src={url} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-slate-500">
              <User className="w-14 h-14" />
            </div>
          )}
        </div>
        <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-950 shadow-md" title="Available for work" />
      </div>
    </motion.div>
  );
}

const PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80',
];

function getSkillIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('docker') || n.includes('container')) return Container;
  if (n.includes('kubernetes') || n.includes('k8s')) return Server;
  if (n.includes('aws') || n.includes('azure') || n.includes('gcp') || n.includes('cloud')) return Cloud;
  if (n.includes('jenkins') || n.includes('gitlab') || n.includes('github') || n.includes('git')) return GitBranch;
  if (n.includes('terraform') || n.includes('ansible') || n.includes('puppet') || n.includes('chef')) return Code;
  if (n.includes('postgres') || n.includes('mysql') || n.includes('mongo') || n.includes('database') || n.includes('sql')) return Database;
  if (n.includes('python') || n.includes('bash') || n.includes('script') || n.includes('terminal')) return Terminal;
  return Server;
}

const EXPERIENCE_KEY = 'portfolio_experience';

interface StoredExperience {
  id: number;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

const DEFAULT_EXPERIENCE: StoredExperience[] = [
  {
    id: 1,
    role: 'DevOps Engineer',
    company: 'Tech Solutions Inc.',
    location: 'Nairobi, Kenya',
    startDate: '2024',
    endDate: '',
    current: true,
    description: 'Leading cloud infrastructure initiatives and automation projects.',
    achievements: [
      'Reduced infrastructure costs by 35% through optimization',
      'Implemented GitOps practices across 20+ microservices',
      'Led migration of monolith to microservices architecture',
    ],
  },
  {
    id: 2,
    role: 'Junior DevOps Engineer',
    company: 'Cloud Innovations Ltd.',
    location: 'Nairobi, Kenya',
    startDate: '2022',
    endDate: '2024',
    current: false,
    description: 'Managed containerization and deployment pipelines.',
    achievements: [
      'Migrated 15 legacy applications to containerized environments',
      'Achieved 99.95% uptime for critical production systems',
      'Automated routine ops tasks saving 10+ hours per week',
    ],
  },
];

function loadExperience(): StoredExperience[] {
  try {
    const stored = localStorage.getItem(EXPERIENCE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_EXPERIENCE;
  } catch {
    return DEFAULT_EXPERIENCE;
  }
}

const CERT_KEY = 'portfolio_certifications';

interface StoredCert {
  id: number;
  name: string;
  issuer: string;
  year: string;
  url: string;
}

const DEFAULT_CERTS: StoredCert[] = [
  { id: 1, name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2024', url: '' },
  { id: 2, name: 'Certified Kubernetes Administrator', issuer: 'CNCF', year: '2023', url: '' },
  { id: 3, name: 'HashiCorp Terraform Associate', issuer: 'HashiCorp', year: '2023', url: '' },
];

function loadCerts(): StoredCert[] {
  try {
    const stored = localStorage.getItem(CERT_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_CERTS;
  } catch {
    return DEFAULT_CERTS;
  }
}

const ABOUT_KEY = 'portfolio_about';

interface AboutData {
  subtitle: string;
  cards: { title: string; description: string }[];
  stats: { yearsExperience: string; projectsDeployed: string; uptimePct: string };
}

const DEFAULT_ABOUT: AboutData = {
  subtitle: 'Passionate DevOps engineer focused on building scalable infrastructure and streamlining deployment processes',
  cards: [
    { title: 'Infrastructure Expert', description: 'Designing and managing cloud infrastructure at scale with AWS, Azure, and GCP' },
    { title: 'CI/CD Specialist', description: 'Building automated pipelines that enable rapid, reliable software delivery' },
    { title: 'Automation Advocate', description: 'Creating infrastructure as code solutions that eliminate manual processes' },
  ],
  stats: { yearsExperience: '3+', projectsDeployed: '20+', uptimePct: '99.9%' },
};

function loadAbout(): AboutData {
  try {
    const stored = localStorage.getItem(ABOUT_KEY);
    if (!stored) return DEFAULT_ABOUT;
    const parsed = JSON.parse(stored);
    return {
      subtitle: parsed.subtitle ?? DEFAULT_ABOUT.subtitle,
      cards: parsed.cards ?? DEFAULT_ABOUT.cards,
      stats: { ...DEFAULT_ABOUT.stats, ...parsed.stats },
    };
  } catch {
    return DEFAULT_ABOUT;
  }
}

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portfolioProjects, setPortfolioProjects] = useState<StoredProject[]>(loadPortfolioProjects);
  const [portfolioSkills, setPortfolioSkills] = useState<StoredSkill[]>(loadPortfolioSkills);
  const [resumeUrl, setResumeUrl] = useState<string | null>(() => localStorage.getItem(RESUME_KEY));
  const [resumeFileName, setResumeFileName] = useState<string | null>(() => localStorage.getItem(RESUME_NAME_KEY));
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(loadSocialLinks);
  const [profile, setProfile] = useState(loadProfile);
  const [experience, setExperience] = useState<StoredExperience[]>(loadExperience);
  const [certifications, setCertifications] = useState<StoredCert[]>(loadCerts);
  const [aboutData, setAboutData] = useState<AboutData>(loadAbout);
  const [selectedProject, setSelectedProject] = useState<{ project: StoredProject; idx: number } | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleProjectsUpdate = () => setPortfolioProjects(loadPortfolioProjects());
    const handleSkillsUpdate = () => setPortfolioSkills(loadPortfolioSkills());
    const handleResumeUpdate = () => {
      setResumeUrl(localStorage.getItem(RESUME_KEY));
      setResumeFileName(localStorage.getItem(RESUME_NAME_KEY));
    };
    const handleSocialUpdate = () => setSocialLinks(loadSocialLinks());
    const handleProfileUpdate = () => setProfile(loadProfile());
    const handleExperienceUpdate = () => setExperience(loadExperience());
    const handleCertsUpdate = () => setCertifications(loadCerts());
    const handleAboutUpdate = () => setAboutData(loadAbout());
    window.addEventListener('portfolio-projects-updated', handleProjectsUpdate);
    window.addEventListener('portfolio-skills-updated', handleSkillsUpdate);
    window.addEventListener('resume-updated', handleResumeUpdate);
    window.addEventListener('social-links-updated', handleSocialUpdate);
    window.addEventListener('profile-updated', handleProfileUpdate);
    window.addEventListener('experience-updated', handleExperienceUpdate);
    window.addEventListener('certs-updated', handleCertsUpdate);
    window.addEventListener('about-updated', handleAboutUpdate);
    return () => {
      window.removeEventListener('portfolio-projects-updated', handleProjectsUpdate);
      window.removeEventListener('portfolio-skills-updated', handleSkillsUpdate);
      window.removeEventListener('resume-updated', handleResumeUpdate);
      window.removeEventListener('social-links-updated', handleSocialUpdate);
      window.removeEventListener('profile-updated', handleProfileUpdate);
      window.removeEventListener('experience-updated', handleExperienceUpdate);
      window.removeEventListener('certs-updated', handleCertsUpdate);
      window.removeEventListener('about-updated', handleAboutUpdate);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const navItems = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-slate-950/90 backdrop-blur-lg border-b border-slate-800' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => scrollTo('home')}
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Terminal className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              RG
            </span>
          </motion.button>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-sm text-slate-300 hover:text-cyan-400 transition-colors"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950"
              onClick={() => {
                if (resumeUrl) {
                  const a = document.createElement('a');
                  a.href = resumeUrl;
                  a.download = resumeFileName || 'resume';
                  a.click();
                } else {
                  alert('No resume uploaded yet. Go to the admin dashboard → Settings to upload your resume.');
                }
              }}
              title={resumeUrl ? `Download ${resumeFileName}` : 'No resume uploaded yet'}
            >
              Resume
            </Button>
          </div>

          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 px-6 py-4 space-y-3"
          >
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="block w-full text-left text-slate-300 hover:text-cyan-400 transition-colors py-2"
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              style={{
                left: `${(i * 17 + 5) % 100}%`,
                top: `${(i * 23 + 10) % 100}%`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: (i % 5) * 0.4,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <Badge variant="outline" className="border-cyan-400 text-cyan-400 px-4 py-2 text-sm">
                <Server className="w-4 h-4 mr-2" />
                {profile.title}
              </Badge>
            </motion.div>

            {/* Profile Picture */}
            <ProfilePicture name={profile.name} />

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              {profile.name}
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto">
              {profile.bio}
            </p>

            <div className="flex flex-col items-center gap-2 mb-8">
              {profile.currentCompany && (
                <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full px-4 py-1.5">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <p className="text-sm text-cyan-300 font-medium">Currently at {profile.currentCompany}</p>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-400">
                <GraduationCap className="w-4 h-4" />
                <p className="text-sm">{profile.university}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-12 flex-wrap">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={() => scrollTo('contact')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Get In Touch
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 hover:border-cyan-400 text-white"
                onClick={() => scrollTo('projects')}
              >
                View Projects
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              {socialLinks.map((social, idx) => {
                const SocialIcon = getSocialIcon(social.platform);
                return (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    aria-label={social.label}
                    className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 transition-all"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                  >
                    <SocialIcon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => scrollTo('about')}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-slate-500" />
          <ChevronDown className="w-5 h-5 text-slate-400 -mt-3" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
              About <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Me</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 text-center mb-10 max-w-3xl mx-auto px-2">
              {aboutData.subtitle}
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
              {[
                { value: aboutData.stats.yearsExperience, label: 'Years Experience' },
                { value: aboutData.stats.projectsDeployed, label: 'Projects Deployed' },
                { value: aboutData.stats.uptimePct, label: 'Uptime Guarantee' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <p className="text-4xl md:text-5xl font-bold text-cyan-400">{stat.value}</p>
                  <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
              {[
                { icon: Server, ...aboutData.cards[0] },
                { icon: GitBranch, ...aboutData.cards[1] },
                { icon: Code, ...aboutData.cards[2] },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                >
                  <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/50 transition-all h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <CardTitle className="text-xl text-white">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-slate-400">{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Certifications */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-center mb-8 text-white">
                Certifications
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {certifications.map((cert, idx) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {cert.url ? (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 hover:border-cyan-400/40 rounded-lg px-5 py-3 transition-all group">
                        <Award className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{cert.name}</p>
                          <p className="text-xs text-slate-400">{cert.issuer} · {cert.year}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 ml-1 transition-colors" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-lg px-5 py-3">
                        <Award className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-sm font-semibold text-white">{cert.name}</p>
                          <p className="text-xs text-slate-400">{cert.issuer} · {cert.year}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 md:py-32 bg-slate-950/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Technical <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Skills</span>
            </h2>
            <p className="text-xl text-slate-300 text-center mb-16 max-w-3xl mx-auto">
              Expertise across the modern DevOps toolchain
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolioSkills.map((skill, idx) => {
                const SkillIcon = getSkillIcon(skill.name);
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/50 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                            <SkillIcon className="w-5 h-5 text-cyan-400" />
                          </div>
                          <h3 className="font-semibold text-white">{skill.name}</h3>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                          <motion.div
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 text-right">{skill.level}%</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Featured <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="text-xl text-slate-300 text-center mb-16 max-w-3xl mx-auto">
              Real-world infrastructure and automation solutions
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {portfolioProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedProject({ project, idx })}
                  className="cursor-pointer"
                >
                  <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/50 transition-all overflow-hidden group h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img src={PROJECT_IMAGES[idx % PROJECT_IMAGES.length]} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-cyan-400 font-medium">View Details</span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl text-white flex items-center justify-between">
                        {project.title}
                        <ExternalLink className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <CardDescription className="text-slate-400 line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="border-cyan-400/30 text-cyan-400 text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-800 text-sm text-slate-400">
                        <span className={`w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-green-400' : 'bg-blue-400'}`} />
                        {project.status === 'active' ? 'Active' : 'Completed'} · {project.views} views
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            />
            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl shadow-cyan-500/10"
                initial={{ scale: 0.92, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.92, y: 30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                onClick={e => e.stopPropagation()}
              >
                {/* Image header */}
                <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-2xl">
                  <img
                    src={PROJECT_IMAGES[selectedProject.idx % PROJECT_IMAGES.length]}
                    alt={selectedProject.project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/70 backdrop-blur-sm border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {/* Status badge */}
                  <div className="absolute bottom-4 left-6 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${selectedProject.project.status === 'active' ? 'bg-green-400' : 'bg-blue-400'}`} />
                    <span className="text-sm font-medium text-white">
                      {selectedProject.project.status === 'active' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{selectedProject.project.title}</h2>
                  <p className="text-slate-300 leading-relaxed mb-6">{selectedProject.project.description}</p>

                  {/* Tags */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.project.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="border-cyan-400/40 text-cyan-300 bg-cyan-500/5 px-3 py-1 text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-6 py-4 border-t border-b border-slate-800 mb-6 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-slate-500" />
                      <span>{selectedProject.project.views.toLocaleString()} views</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 flex-wrap">
                    {selectedProject.project.url && (
                      <a
                        href={selectedProject.project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Project
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-5 py-2.5 rounded-lg transition-all text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Experience Section */}
      <section id="experience" className="py-16 md:py-32 bg-slate-950/50 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Experience</span>
            </h2>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent" />

              {experience.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  className="relative pl-20 pb-16"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                >
                  <div className="absolute left-5 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-4 border-slate-950" />

                  <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/30 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                        <div>
                          <CardTitle className="text-2xl text-white">{exp.role}</CardTitle>
                          <p className="text-cyan-400 mt-1 font-medium">{exp.company}</p>
                          {exp.location && <p className="text-slate-500 text-sm mt-0.5">{exp.location}</p>}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline" className="border-slate-700 text-slate-300">
                            {exp.startDate}{exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}
                          </Badge>
                          {exp.current && (
                            <span className="text-xs text-cyan-400 font-medium">Current Role</span>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-slate-400">{exp.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-300">
                            <Award className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                            <span className="text-sm">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-32 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Let's <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Connect</span>
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto text-center">
              I'm always interested in discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Contact links */}
              <div className="space-y-4">
                {socialLinks.map((social, idx) => {
                  const SocialIcon = getSocialIcon(social.platform);
                  const displayUrl = social.url.replace(/^mailto:/, '').replace(/^https?:\/\//, '');
                  return (
                    <motion.a
                      key={social.id}
                      href={social.url}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 p-5 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-400/50 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all flex-shrink-0">
                        <SocialIcon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{social.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{displayUrl}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <ContactForm />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">{profile.name}</span>
          </div>
          <p className="text-sm text-center">
            Built with React, Tailwind CSS, and Motion — © 2026
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const SocialIcon = getSocialIcon(social.platform);
              return (
                <a key={social.id} href={social.url} aria-label={social.label} className="hover:text-cyan-400 transition-colors">
                  <SocialIcon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
