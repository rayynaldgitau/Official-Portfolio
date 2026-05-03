import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'motion/react';
import {
  Terminal, Server, Cloud, Code, Database, Container, GitBranch, Mail, Github,
  Linkedin, ExternalLink, Award, GraduationCap, ChevronRight, ChevronDown,
  Menu, X, User, Globe, Twitter, Youtube, Instagram, Facebook, Link, Building2, Eye,
} from 'lucide-react';
import ContactForm from './ContactForm';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const API = import.meta.env.VITE_API_URL ?? '';

async function apiFetch(path: string) {
  const res = await fetch(`${API}/api${path}`, { headers: { 'Cache-Control': 'no-cache' } });
  if (!res.ok) return null;
  return res.json();
}

interface SocialLink { id: number; platform: string; label: string; url: string; }
interface StoredProject { id: number; title: string; description: string; status: string; tags: string[]; views: number; url?: string; }
interface StoredSkill { id: number; name: string; level: number; category: string; }
interface StoredExperience { id: number; role: string; company: string; location: string; startDate: string; endDate: string; current: boolean; description: string; achievements: string[]; }
interface StoredCert { id: number; name: string; issuer: string; year: string; url: string; }
interface AboutData { subtitle: string; cards: { title: string; description: string }[]; stats: { yearsExperience: string; projectsDeployed: string; uptimePct: string }; }
interface ProfileData { name: string; email: string; title: string; bio: string; university: string; currentCompany: string; profilePicUrl?: string | null; logoUrl?: string | null; resumeUrl?: string | null; resumeName?: string | null; }

const DEFAULT_PROFILE: ProfileData = {
  name: 'Raynald Gitau', email: 'raynald.gitau@example.com', title: 'DevOps Engineer',
  bio: 'Building resilient infrastructure and automating the future.',
  university: 'United States International University Africa', currentCompany: '',
};

const DEFAULT_ABOUT: AboutData = {
  subtitle: 'Passionate DevOps engineer focused on building scalable infrastructure and streamlining deployment processes',
  cards: [
    { title: 'Infrastructure Expert', description: 'Designing and managing cloud infrastructure at scale with AWS, Azure, and GCP' },
    { title: 'CI/CD Specialist', description: 'Building automated pipelines that enable rapid, reliable software delivery' },
    { title: 'Automation Advocate', description: 'Creating infrastructure as code solutions that eliminate manual processes' },
  ],
  stats: { yearsExperience: '3+', projectsDeployed: '20+', uptimePct: '99.9%' },
};

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { id: 1, platform: 'github', label: 'GitHub', url: 'https://github.com' },
  { id: 2, platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
  { id: 3, platform: 'email', label: 'Email', url: 'mailto:raynald.gitau@example.com' },
];

const DEFAULT_PROJECTS: StoredProject[] = [
  { id: 1, title: 'Cloud Infrastructure Automation', description: 'Automated AWS infrastructure deployment using Terraform and GitHub Actions, reducing deployment time by 70%.', status: 'active', tags: ['Terraform', 'AWS', 'CI/CD'], views: 1247 },
  { id: 2, title: 'Kubernetes Cluster Management', description: 'Designed and maintained production-grade K8s clusters serving 10M+ requests daily with auto-scaling capabilities.', status: 'completed', tags: ['Kubernetes', 'Docker', 'Monitoring'], views: 892 },
  { id: 3, title: 'CI/CD Pipeline Optimization', description: 'Engineered comprehensive CI/CD pipelines with Jenkins and GitLab, achieving 50% faster build times.', status: 'active', tags: ['Jenkins', 'GitLab', 'Python'], views: 634 },
  { id: 4, title: 'Monitoring & Observability Stack', description: 'Implemented comprehensive monitoring with Prometheus, Grafana, and ELK stack for real-time insights.', status: 'active', tags: ['Prometheus', 'Grafana', 'ELK'], views: 521 },
];

const DEFAULT_SKILLS: StoredSkill[] = [
  { id: 1, name: 'Docker', level: 95, category: 'Containerization' },
  { id: 2, name: 'Kubernetes', level: 90, category: 'Orchestration' },
  { id: 3, name: 'AWS', level: 92, category: 'Cloud' },
  { id: 4, name: 'Jenkins', level: 88, category: 'CI/CD' },
  { id: 5, name: 'Terraform', level: 85, category: 'IaC' },
  { id: 6, name: 'PostgreSQL', level: 87, category: 'Database' },
  { id: 7, name: 'Python', level: 90, category: 'Programming' },
  { id: 8, name: 'Ansible', level: 83, category: 'Automation' },
];

const DEFAULT_EXPERIENCE: StoredExperience[] = [
  { id: 1, role: 'DevOps Engineer', company: 'Tech Solutions Inc.', location: 'Nairobi, Kenya', startDate: '2024', endDate: '', current: true, description: 'Leading cloud infrastructure initiatives and automation projects.', achievements: ['Reduced infrastructure costs by 35%', 'Implemented GitOps practices across 20+ microservices', 'Led migration of monolith to microservices architecture'] },
  { id: 2, role: 'Junior DevOps Engineer', company: 'Cloud Innovations Ltd.', location: 'Nairobi, Kenya', startDate: '2022', endDate: '2024', current: false, description: 'Managed containerization and deployment pipelines.', achievements: ['Migrated 15 legacy applications to containers', 'Achieved 99.95% uptime for critical systems', 'Automated ops tasks saving 10+ hours per week'] },
];

const DEFAULT_CERTS: StoredCert[] = [
  { id: 1, name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2024', url: '' },
  { id: 2, name: 'Certified Kubernetes Administrator', issuer: 'CNCF', year: '2023', url: '' },
  { id: 3, name: 'HashiCorp Terraform Associate', issuer: 'HashiCorp', year: '2023', url: '' },
];

function getSocialIcon(platform: string) {
  const map: Record<string, React.ElementType> = {
    github: Github, linkedin: Linkedin, email: Mail, twitter: Twitter,
    youtube: Youtube, instagram: Instagram, facebook: Facebook, website: Globe,
  };
  return map[platform] ?? Link;
}

function getSkillIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('docker') || n.includes('container')) return Container;
  if (n.includes('kubernetes') || n.includes('k8s')) return Server;
  if (n.includes('aws') || n.includes('azure') || n.includes('gcp') || n.includes('cloud')) return Cloud;
  if (n.includes('jenkins') || n.includes('gitlab') || n.includes('github') || n.includes('git')) return GitBranch;
  if (n.includes('terraform') || n.includes('ansible')) return Code;
  if (n.includes('postgres') || n.includes('mysql') || n.includes('mongo') || n.includes('sql')) return Database;
  if (n.includes('python') || n.includes('bash') || n.includes('terminal')) return Terminal;
  return Server;
}

const PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80',
];

function parseStatNum(val: string): { num: number; suffix: string } {
  const m = val.match(/^([\d.]+)(.*)$/);
  return m ? { num: parseFloat(m[1]), suffix: m[2] } : { num: NaN, suffix: val };
}

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const { num, suffix } = parseStatNum(value);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView || isNaN(num)) return;
    const duration = 1600;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * num * 10) / 10);
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(num);
    };
    requestAnimationFrame(tick);
  }, [inView, num]);
  if (isNaN(num)) return <span ref={ref}>{value}</span>;
  const formatted = Number.isInteger(num) ? Math.round(display).toString() : display.toFixed(1);
  return <span ref={ref}>{formatted}{suffix}</span>;
}

function useTypewriter(text: string, speed = 35, startDelay = 900) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return displayed;
}

const TERMINAL_CMDS = [
  'kubectl apply -f deployment.yaml', 'docker build -t app:latest .', 'terraform apply --auto-approve',
  'git push origin main', 'helm upgrade --install app ./chart', 'ansible-playbook deploy.yml',
  'aws eks update-kubeconfig --name prod', 'systemctl restart nginx',
];

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{ project: StoredProject; idx: number } | null>(null);

  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<StoredProject[]>(DEFAULT_PROJECTS);
  const [skills, setSkills] = useState<StoredSkill[]>(DEFAULT_SKILLS);
  const [experience, setExperience] = useState<StoredExperience[]>(DEFAULT_EXPERIENCE);
  const [certs, setCerts] = useState<StoredCert[]>(DEFAULT_CERTS);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(DEFAULT_SOCIAL_LINKS);
  const [aboutData, setAboutData] = useState<AboutData>(DEFAULT_ABOUT);

  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const typedBio = useTypewriter(profile.bio);

  const loadAll = useCallback(async () => {
    const [p, s, e, c, sl, a, pr] = await Promise.all([
      apiFetch('/projects'), apiFetch('/skills'), apiFetch('/experience'),
      apiFetch('/certifications'), apiFetch('/social-links'), apiFetch('/about'), apiFetch('/profile'),
    ]);
    if (p?.length) setProjects(p);
    if (s?.length) setSkills(s);
    if (e?.length) setExperience(e);
    if (c?.length) setCerts(c);
    if (sl?.length) setSocialLinks(sl);
    if (a) setAboutData(a);
    if (pr) setProfile(pr);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Listen for dashboard updates and reload
  useEffect(() => {
    const events = ['portfolio-projects-updated', 'portfolio-skills-updated', 'profile-updated', 'experience-updated', 'certs-updated', 'social-links-updated', 'about-updated', 'profile-pic-updated', 'logo-updated', 'resume-updated'];
    const handler = () => loadAll();
    events.forEach(e => window.addEventListener(e, handler));
    return () => events.forEach(e => window.removeEventListener(e, handler));
  }, [loadAll]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const navItems = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 z-[200] origin-left" style={{ scaleX: progressScaleX }} />

      <motion.nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-lg border-b border-slate-800' : 'bg-transparent'}`} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <motion.button onClick={() => scrollTo('home')} className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <img src={profile.logoUrl || '/logo.png'} alt="Logo" className="h-10 w-auto" />
          </motion.button>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <motion.button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-sm text-slate-300 hover:text-cyan-400 transition-colors" whileHover={{ y: -2 }}>{item}</motion.button>
            ))}
            <Button variant="outline" size="sm" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950" onClick={() => {
              if (profile.resumeUrl) { const a = document.createElement('a'); a.href = profile.resumeUrl; a.download = profile.resumeName || 'resume'; a.click(); }
              else alert('No resume uploaded yet.');
            }}>Resume</Button>
          </div>
          <button className="md:hidden text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 px-6 py-4 space-y-3">
            {navItems.map(item => <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="block w-full text-left text-slate-300 hover:text-cyan-400 transition-colors py-2">{item}</button>)}
          </motion.div>
        )}
      </motion.nav>

      {/* Hero */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
        <div className="absolute inset-0 overflow-hidden">
          {[{ w: 400, h: 400, bg: '#22d3ee', left: '5%', top: '10%', dx: [0, 40, -20, 0], dy: [0, -30, 40, 0], dur: 14 }, { w: 320, h: 320, bg: '#3b82f6', left: '70%', top: '5%', dx: [0, -30, 20, 0], dy: [0, 40, -25, 0], dur: 18 }, { w: 250, h: 250, bg: '#06b6d4', left: '85%', top: '55%', dx: [0, 20, -40, 0], dy: [0, -20, 30, 0], dur: 12 }].map((orb, i) => (
            <motion.div key={i} className="absolute rounded-full blur-[80px] opacity-[0.07]" style={{ width: orb.w, height: orb.h, background: orb.bg, left: orb.left, top: orb.top }} animate={{ x: orb.dx, y: orb.dy }} transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut' }} />
          ))}
          {TERMINAL_CMDS.map((cmd, i) => (
            <motion.div key={i} className="absolute font-mono text-xs text-cyan-400/20 whitespace-nowrap pointer-events-none select-none" style={{ left: `${(i * 13 + 3) % 85}%`, top: `${(i * 19 + 8) % 90}%` }} animate={{ opacity: [0, 0.25, 0.1, 0.25, 0], y: [0, -18, 0] }} transition={{ duration: 6 + i * 1.5, repeat: Infinity, delay: i * 0.9, ease: 'easeInOut' }}>$ {cmd}</motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div className="inline-block mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
              <Badge variant="outline" className="border-cyan-400 text-cyan-400 px-4 py-2 text-sm"><Server className="w-4 h-4 mr-2" />{profile.title}</Badge>
            </motion.div>

            <motion.div className="flex justify-center mb-8" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}>
              <div className="relative">
                <div className="w-36 h-36 rounded-full ring-4 ring-cyan-400/60 ring-offset-4 ring-offset-slate-950 overflow-hidden shadow-2xl shadow-cyan-500/30 bg-slate-800 flex items-center justify-center">
                  {profile.profilePicUrl ? <img src={profile.profilePicUrl} alt={profile.name} className="w-full h-full object-cover" /> : <User className="w-14 h-14 text-slate-500" />}
                </div>
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-950" />
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">{profile.name}</h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto min-h-[1.8em]">
              {typedBio}
              <motion.span className="inline-block w-[2px] h-5 bg-cyan-400 ml-0.5 align-middle" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.75, repeat: Infinity }} />
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
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700" onClick={() => scrollTo('contact')}><Mail className="w-4 h-4 mr-2" />Get In Touch</Button>
              <Button size="lg" variant="outline" className="border-slate-700 hover:border-cyan-400 text-white" onClick={() => scrollTo('projects')}>View Projects<ChevronRight className="w-4 h-4 ml-2" /></Button>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              {socialLinks.map((social, idx) => {
                const SocialIcon = getSocialIcon(social.platform);
                return (
                  <motion.a key={social.id} href={social.url} aria-label={social.label} className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 transition-all" whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + idx * 0.1 }}>
                    <SocialIcon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer" onClick={() => scrollTo('about')} animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown className="w-5 h-5 text-slate-500" />
          <ChevronDown className="w-5 h-5 text-slate-400 -mt-3" />
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="py-16 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">About <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Me</span></h2>
            <p className="text-lg md:text-xl text-slate-300 text-center mb-10 max-w-3xl mx-auto">{aboutData.subtitle}</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
              {[{ value: aboutData.stats.yearsExperience, label: 'Years Experience' }, { value: aboutData.stats.projectsDeployed, label: 'Projects Deployed' }, { value: aboutData.stats.uptimePct, label: 'Uptime Guarantee' }].map((stat, idx) => (
                <motion.div key={idx} className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }}>
                  <p className="text-4xl md:text-5xl font-bold text-cyan-400"><AnimatedCounter value={stat.value} /></p>
                  <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
              {[{ icon: Server, ...aboutData.cards[0] }, { icon: GitBranch, ...aboutData.cards[1] }, { icon: Code, ...aboutData.cards[2] }].map((item, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }}>
                  <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/50 transition-all h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4"><item.icon className="w-6 h-6 text-cyan-400" /></div>
                      <CardTitle className="text-xl text-white">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent><CardDescription className="text-slate-400">{item.description}</CardDescription></CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-center mb-8 text-white">Certifications</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {certs.map((cert, idx) => (
                  <motion.div key={cert.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                    {cert.url ? (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 hover:border-cyan-400/40 rounded-lg px-5 py-3 transition-all group">
                        <Award className="w-5 h-5 text-cyan-400" />
                        <div><p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{cert.name}</p><p className="text-xs text-slate-400">{cert.issuer} · {cert.year}</p></div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 ml-1" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-lg px-5 py-3">
                        <Award className="w-5 h-5 text-cyan-400" />
                        <div><p className="text-sm font-semibold text-white">{cert.name}</p><p className="text-xs text-slate-400">{cert.issuer} · {cert.year}</p></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-16 md:py-32 bg-slate-950/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Technical <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Skills</span></h2>
            <p className="text-xl text-slate-300 text-center mb-16 max-w-3xl mx-auto">Expertise across the modern DevOps toolchain</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill, idx) => {
                const SkillIcon = getSkillIcon(skill.name);
                return (
                  <motion.div key={skill.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ scale: 1.05, y: -5 }}>
                    <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/50 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center"><SkillIcon className="w-5 h-5 text-cyan-400" /></div>
                          <h3 className="font-semibold text-white">{skill.name}</h3>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                          <motion.div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full" initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: idx * 0.1 }} />
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

      {/* Projects */}
      <section id="projects" className="py-16 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Featured <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Projects</span></h2>
            <p className="text-xl text-slate-300 text-center mb-16 max-w-3xl mx-auto">Real-world infrastructure and automation solutions</p>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, idx) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }} whileHover={{ y: -4 }} onClick={() => setSelectedProject({ project, idx })} className="cursor-pointer">
                  <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/50 transition-all overflow-hidden group h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img src={PROJECT_IMAGES[idx % PROJECT_IMAGES.length]} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl text-white flex items-center justify-between">{project.title}<ExternalLink className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" /></CardTitle>
                      <CardDescription className="text-slate-400 line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">{project.tags.map(tag => <Badge key={tag} variant="outline" className="border-cyan-400/30 text-cyan-400 text-xs">{tag}</Badge>)}</div>
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

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} />
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl" initial={{ scale: 0.92, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, y: 30, opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }} onClick={e => e.stopPropagation()}>
                <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-2xl">
                  <img src={PROJECT_IMAGES[selectedProject.idx % PROJECT_IMAGES.length]} alt={selectedProject.project.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/70 backdrop-blur-sm border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400 transition-all"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{selectedProject.project.title}</h2>
                  <p className="text-slate-300 leading-relaxed mb-6">{selectedProject.project.description}</p>
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Technologies</p>
                    <div className="flex flex-wrap gap-2">{selectedProject.project.tags.map(tag => <Badge key={tag} variant="outline" className="border-cyan-400/40 text-cyan-300 bg-cyan-500/5 px-3 py-1 text-sm">{tag}</Badge>)}</div>
                  </div>
                  <div className="flex items-center gap-6 py-4 border-t border-b border-slate-800 mb-6 text-sm text-slate-400">
                    <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-slate-500" /><span>{selectedProject.project.views.toLocaleString()} views</span></div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {selectedProject.project.url && <a href={selectedProject.project.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm"><ExternalLink className="w-4 h-4" />View Project</a>}
                    <button onClick={() => setSelectedProject(null)} className="flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-5 py-2.5 rounded-lg transition-all text-sm">Close</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Experience */}
      <section id="experience" className="py-16 md:py-32 bg-slate-950/50 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center"><span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Experience</span></h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent" />
              {experience.map((exp, idx) => (
                <motion.div key={exp.id} className="relative pl-20 pb-16" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }}>
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
                          <Badge variant="outline" className="border-slate-700 text-slate-300">{exp.startDate}{exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}</Badge>
                          {exp.current && <span className="text-xs text-cyan-400 font-medium">Current Role</span>}
                        </div>
                      </div>
                      <CardDescription className="text-slate-400">{exp.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {exp.achievements.map((a, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-300"><Award className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" /><span className="text-sm">{a}</span></li>
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

      {/* Contact */}
      <section id="contact" className="py-16 md:py-32 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Let's <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Connect</span></h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto text-center">I'm always interested in discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                {socialLinks.map((social, idx) => {
                  const SocialIcon = getSocialIcon(social.platform);
                  const displayUrl = social.url.replace(/^mailto:/, '').replace(/^https?:\/\//, '');
                  return (
                    <motion.a key={social.id} href={social.url} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ x: 4 }} className="flex items-center gap-4 p-5 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-400/50 transition-all group">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0"><SocialIcon className="w-6 h-6 text-cyan-400" /></div>
                      <div><p className="text-sm font-semibold text-white">{social.label}</p><p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{displayUrl}</p></div>
                    </motion.a>
                  );
                })}
              </div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}><ContactForm /></motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
          <img src={profile.logoUrl || '/logo.png'} alt="Logo" className="h-7 w-auto" />
          <p className="text-sm text-center">Built with React, Tailwind CSS, and Motion — © 2026</p>
          <div className="flex items-center gap-4">
            {socialLinks.map(social => { const SocialIcon = getSocialIcon(social.platform); return <a key={social.id} href={social.url} aria-label={social.label} className="hover:text-cyan-400 transition-colors"><SocialIcon className="w-4 h-4" /></a>; })}
          </div>
        </div>
      </footer>
    </div>
  );
}
