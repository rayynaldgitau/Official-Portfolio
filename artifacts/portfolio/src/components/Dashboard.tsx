import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Briefcase,
  Code,
  Settings,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  Activity,
  FileText,
  LogOut,
  Menu,
  X,
  Save,
  Terminal,
  Inbox,
  Upload,
  User,
  CheckCircle,
  Loader2,
  Github,
  Linkedin,
  Mail,
  Globe,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  Link,
  History,
  MapPin,
  Award,
  ExternalLink,
  Info,
} from 'lucide-react';
import MessagesInbox from './MessagesInbox';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';

const SOCIAL_LINKS_KEY = 'portfolio_social_links';
const PROFILE_KEY = 'portfolio_profile';

const DEFAULT_PROFILE = {
  name: 'Raynald Gitau',
  email: 'raynald.gitau@example.com',
  title: 'DevOps Engineer',
  bio: 'Building resilient infrastructure and automating the future.',
  university: 'United States International University Africa',
  currentCompany: '',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
};

function loadProfile() {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

const SOCIAL_PLATFORMS = [
  { label: 'GitHub', value: 'github', icon: Github },
  { label: 'LinkedIn', value: 'linkedin', icon: Linkedin },
  { label: 'Email', value: 'email', icon: Mail },
  { label: 'Twitter / X', value: 'twitter', icon: Twitter },
  { label: 'YouTube', value: 'youtube', icon: Youtube },
  { label: 'Instagram', value: 'instagram', icon: Instagram },
  { label: 'Facebook', value: 'facebook', icon: Facebook },
  { label: 'Website', value: 'website', icon: Globe },
  { label: 'Other', value: 'other', icon: Link },
] as const;

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
  return SOCIAL_PLATFORMS.find(p => p.value === platform)?.icon ?? Link;
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  tags: string[];
  views: number;
}

interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
}

const DEFAULT_PROJECTS: Project[] = [
  { id: 1, title: 'Cloud Infrastructure Automation', description: 'Automated AWS infrastructure deployment using Terraform', status: 'active', tags: ['Terraform', 'AWS', 'CI/CD'], views: 1247 },
  { id: 2, title: 'Kubernetes Cluster Management', description: 'Production-grade K8s clusters with auto-scaling', status: 'completed', tags: ['Kubernetes', 'Docker'], views: 892 },
  { id: 3, title: 'CI/CD Pipeline Optimization', description: 'Comprehensive CI/CD pipelines with Jenkins', status: 'active', tags: ['Jenkins', 'GitLab'], views: 634 },
  { id: 4, title: 'Monitoring & Observability Stack', description: 'Prometheus, Grafana, and ELK stack for real-time insights', status: 'active', tags: ['Prometheus', 'Grafana', 'ELK'], views: 521 },
];

const DEFAULT_SKILLS: Skill[] = [
  { id: 1, name: 'Docker', level: 95, category: 'Containerization' },
  { id: 2, name: 'Kubernetes', level: 90, category: 'Orchestration' },
  { id: 3, name: 'AWS', level: 92, category: 'Cloud' },
  { id: 4, name: 'Jenkins', level: 88, category: 'CI/CD' },
  { id: 5, name: 'Terraform', level: 85, category: 'IaC' },
  { id: 6, name: 'PostgreSQL', level: 87, category: 'Database' },
  { id: 7, name: 'Python', level: 90, category: 'Programming' },
  { id: 8, name: 'Ansible', level: 83, category: 'Automation' },
];

const PROJECTS_KEY = 'portfolio_projects';
const SKILLS_KEY = 'portfolio_skills';

function loadProjects(): Project[] {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PROJECTS;
  } catch {
    return DEFAULT_PROJECTS;
  }
}

function loadSkills(): Skill[] {
  try {
    const stored = localStorage.getItem(SKILLS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SKILLS;
  } catch {
    return DEFAULT_SKILLS;
  }
}

interface Experience {
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

const EXPERIENCE_KEY = 'portfolio_experience';

const DEFAULT_EXPERIENCE: Experience[] = [
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

function loadExperience(): Experience[] {
  try {
    const stored = localStorage.getItem(EXPERIENCE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_EXPERIENCE;
  } catch {
    return DEFAULT_EXPERIENCE;
  }
}

interface Cert {
  id: number;
  name: string;
  issuer: string;
  year: string;
  url: string;
}

const CERT_KEY = 'portfolio_certifications';

const DEFAULT_CERTS: Cert[] = [
  { id: 1, name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2024', url: '' },
  { id: 2, name: 'Certified Kubernetes Administrator', issuer: 'CNCF', year: '2023', url: '' },
  { id: 3, name: 'HashiCorp Terraform Associate', issuer: 'HashiCorp', year: '2023', url: '' },
];

function loadCerts(): Cert[] {
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

const recentActivity = [
  { action: 'Updated project', target: 'Cloud Infrastructure Automation', time: '2 hours ago' },
  { action: 'Added new skill', target: 'Prometheus', time: '5 hours ago' },
  { action: 'Published article', target: 'Kubernetes Best Practices', time: '1 day ago' },
  { action: 'Profile view spike', target: '+124 views', time: '2 days ago' },
];

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [skills, setSkills] = useState<Skill[]>(loadSkills);
  const [experiences, setExperiences] = useState<Experience[]>(loadExperience);
  const [certs, setCerts] = useState<Cert[]>(loadCerts);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  const [newProject, setNewProject] = useState({ title: '', description: '', tags: '' });
  const [newSkill, setNewSkill] = useState({ name: '', level: '80', category: '' });
  const [newExp, setNewExp] = useState({ role: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '', achievements: '' });
  const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '', url: '' });
  const [editingCert, setEditingCert] = useState<Cert | null>(null);
  const [aboutData, setAboutData] = useState<AboutData>(loadAbout);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSyncGitHub = async () => {
    setSyncState('syncing');
    setSyncMessage(null);
    try {
      const res = await fetch('/api/sync/github', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncState('success');
        setSyncMessage('Pushed to GitHub successfully!');
      } else {
        setSyncState('error');
        setSyncMessage(data.error || 'Push failed.');
      }
    } catch {
      setSyncState('error');
      setSyncMessage('Network error — could not reach the server.');
    }
    setTimeout(() => { setSyncState('idle'); setSyncMessage(null); }, 5000);
  };

  useEffect(() => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    window.dispatchEvent(new Event('portfolio-projects-updated'));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
    window.dispatchEvent(new Event('portfolio-skills-updated'));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(EXPERIENCE_KEY, JSON.stringify(experiences));
    window.dispatchEvent(new Event('experience-updated'));
  }, [experiences]);

  useEffect(() => {
    localStorage.setItem(CERT_KEY, JSON.stringify(certs));
    window.dispatchEvent(new Event('certs-updated'));
  }, [certs]);

  useEffect(() => {
    localStorage.setItem(ABOUT_KEY, JSON.stringify(aboutData));
    window.dispatchEvent(new Event('about-updated'));
  }, [aboutData]);

  const [profileSettings, setProfileSettings] = useState(loadProfile);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileSettings));
    window.dispatchEvent(new Event('profile-updated'));
  }, [profileSettings]);

  const PROFILE_PIC_KEY = 'portfolio_profile_pic_url';
  const RESUME_KEY = 'portfolio_resume_url';
  const RESUME_NAME_KEY = 'portfolio_resume_name';

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(loadSocialLinks);
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [newSocial, setNewSocial] = useState({ platform: 'github', label: 'GitHub', url: '' });
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);

  useEffect(() => {
    localStorage.setItem(SOCIAL_LINKS_KEY, JSON.stringify(socialLinks));
    window.dispatchEvent(new Event('social-links-updated'));
  }, [socialLinks]);

  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(() => localStorage.getItem(PROFILE_PIC_KEY));
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeUrl, setResumeUrl] = useState<string | null>(() => localStorage.getItem(RESUME_KEY));
  const [resumeName, setResumeName] = useState<string | null>(() => localStorage.getItem(RESUME_NAME_KEY));
  const [resumeUploadState, setResumeUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.');
      return;
    }
    setUploadState('uploading');
    setUploadError(null);
    try {
      const res = await fetch('/api/storage/uploads/request-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!res.ok) throw new Error('Failed to get upload URL');
      const { uploadURL, objectPath } = await res.json();
      const putRes = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      if (!putRes.ok) throw new Error('Upload to storage failed');
      const publicUrl = `/api/storage/objects${objectPath}`;
      localStorage.setItem(PROFILE_PIC_KEY, publicUrl);
      setProfilePicUrl(publicUrl);
      window.dispatchEvent(new Event('profile-pic-updated'));
      setUploadState('done');
      setTimeout(() => setUploadState('idle'), 3000);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
      setUploadState('error');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setResumeUploadError('Please select a PDF or Word document.');
      return;
    }
    setResumeUploadState('uploading');
    setResumeUploadError(null);
    try {
      const res = await fetch('/api/storage/uploads/request-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!res.ok) throw new Error('Failed to get upload URL');
      const { uploadURL, objectPath } = await res.json();
      const putRes = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      if (!putRes.ok) throw new Error('Upload to storage failed');
      const publicUrl = `/api/storage/objects${objectPath}`;
      localStorage.setItem(RESUME_KEY, publicUrl);
      localStorage.setItem(RESUME_NAME_KEY, file.name);
      setResumeUrl(publicUrl);
      setResumeName(file.name);
      window.dispatchEvent(new Event('resume-updated'));
      setResumeUploadState('done');
      setTimeout(() => setResumeUploadState('idle'), 3000);
    } catch (err) {
      setResumeUploadError(err instanceof Error ? err.message : 'Upload failed');
      setResumeUploadState('error');
    }
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      setProjects([...projects, {
        id: Date.now(),
        title: newProject.title,
        description: newProject.description,
        status: 'active',
        tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean),
        views: 0
      }]);
      setNewProject({ title: '', description: '', tags: '' });
      setIsAddingProject(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.name) {
      setSkills([...skills, {
        id: Date.now(),
        name: newSkill.name,
        level: parseInt(newSkill.level) || 80,
        category: newSkill.category,
      }]);
      setNewSkill({ name: '', level: '80', category: '' });
      setIsAddingSkill(false);
    }
  };

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const statsData = [
    { label: 'Total Projects', value: projects.length.toString(), change: '+3 this month', icon: Briefcase, color: 'cyan' },
    { label: 'Skills Listed', value: skills.length.toString(), change: '+2 this week', icon: Code, color: 'blue' },
    { label: 'Profile Views', value: '3,847', change: '+12% this week', icon: Eye, color: 'purple' },
    { label: 'Total Visitors', value: '12,429', change: '+8% this month', icon: Users, color: 'green' },
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'experience', label: 'Experience', icon: History },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'about', label: 'About Section', icon: Info },
    { id: 'messages', label: 'Messages', icon: Inbox },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`
          bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 z-40
          transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-64 md:w-20'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        initial={false}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">Raynald Gitau</p>
                  <p className="text-xs text-slate-400">Admin Dashboard</p>
                </div>
              </motion.div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex hover:bg-slate-800 text-slate-400 ml-auto">
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMobileSidebarOpen(false)} className="md:hidden hover:bg-slate-800 text-slate-400 ml-auto">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-400/30'
                    : 'hover:bg-slate-800 text-slate-400'
                }`}
                whileHover={{ x: sidebarOpen ? 4 : 0 }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={`text-sm font-medium md:${sidebarOpen ? 'block' : 'hidden'}`}>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-slate-800 text-slate-400"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`ml-3 text-sm md:${sidebarOpen ? 'block' : 'hidden'}`}>Back to Portfolio</span>
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-auto transition-all duration-300 ml-0 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-20 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setMobileSidebarOpen(true)} className="hover:bg-slate-800 text-slate-400 p-1">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-white">Admin Dashboard</span>
          </div>
        </div>
        <div className="p-4 md:p-8">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-slate-400">Welcome back, Raynald! Here's what's happening.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                    <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/30 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center">
                            <stat.icon className="w-6 h-6 text-cyan-400" />
                          </div>
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1 text-white">{stat.value}</h3>
                        <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-xs text-green-400">{stat.change}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest portfolio updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-800 last:border-0">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="text-slate-300">{activity.action}</span>{' '}
                              <span className="text-cyan-400 font-medium">{activity.target}</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <FileText className="w-5 h-5 text-blue-400" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Manage your portfolio content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white" onClick={() => setActiveTab('projects')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Project
                    </Button>
                    <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white" onClick={() => setActiveTab('skills')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Skill
                    </Button>
                    <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white" onClick={() => setActiveTab('settings')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Profile Info
                    </Button>
                    <Button className="w-full justify-start bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700" onClick={onLogout}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Live Portfolio
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Projects</h1>
                  <p className="text-slate-400">Manage your portfolio projects ({projects.length} total)</p>
                </div>
                <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Add New Project</DialogTitle>
                      <DialogDescription className="text-slate-400">Create a new project for your portfolio</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="p-title">Project Title</Label>
                        <Input id="p-title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="Enter project title" />
                      </div>
                      <div>
                        <Label htmlFor="p-desc">Description</Label>
                        <Textarea id="p-desc" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="Describe your project" />
                      </div>
                      <div>
                        <Label htmlFor="p-tags">Tags (comma-separated)</Label>
                        <Input id="p-tags" value={newProject.tags} onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="e.g., Docker, Kubernetes, AWS" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingProject(false)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={handleAddProject} className="bg-gradient-to-r from-cyan-500 to-blue-600">Add Project</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="bg-slate-900 border border-slate-800 mb-6">
                  <TabsTrigger value="all">All ({projects.length})</TabsTrigger>
                  <TabsTrigger value="active">Active ({projects.filter(p => p.status === 'active').length})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({projects.filter(p => p.status === 'completed').length})</TabsTrigger>
                </TabsList>

                {(['all', 'active', 'completed'] as const).map(tab => (
                  <TabsContent key={tab} value={tab} className="space-y-4">
                    {projects
                      .filter(p => tab === 'all' || p.status === tab)
                      .map((project) => (
                        <motion.div key={project.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/30 transition-all">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                                    <Badge variant="outline" className={project.status === 'active' ? 'border-green-400/30 text-green-400' : 'border-blue-400/30 text-blue-400'}>
                                      {project.status}
                                    </Badge>
                                  </div>
                                  <p className="text-slate-400 mb-4">{project.description}</p>
                                  <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex flex-wrap gap-2">
                                      {project.tags.map((tag, i) => (
                                        <Badge key={i} variant="outline" className="border-cyan-400/30 text-cyan-400 text-xs">{tag}</Badge>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-slate-500">
                                      <Eye className="w-4 h-4" />{project.views} views
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Button variant="ghost" size="sm" className="hover:bg-slate-800 text-slate-400" onClick={() => setEditingProject(project)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="hover:bg-red-500/20 hover:text-red-400 text-slate-400" onClick={() => setProjects(projects.filter(p => p.id !== project.id))}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    }
                    {projects.filter(p => tab === 'all' || p.status === tab).length === 0 && (
                      <div className="text-center py-12 text-slate-500">No {tab} projects found.</div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>

              {/* Edit Project Dialog */}
              {editingProject && (
                <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Edit Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Title</Label>
                        <Input value={editingProject.title} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea value={editingProject.description} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" />
                      </div>
                      <div>
                        <Label>Tags (comma-separated)</Label>
                        <Input value={editingProject.tags.join(', ')} onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(',').map(t => t.trim()) })} className="bg-slate-800 border-slate-700 mt-1" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingProject(null)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={() => { setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p)); setEditingProject(null); }} className="bg-gradient-to-r from-cyan-500 to-blue-600">Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </motion.div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Skills</h1>
                  <p className="text-slate-400">Manage your technical skills ({skills.length} total)</p>
                </div>
                <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Add New Skill</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Skill Name</Label>
                        <Input value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="e.g., Ansible" />
                      </div>
                      <div>
                        <Label>Proficiency Level (0-100)</Label>
                        <Input type="number" min="0" max="100" value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input value={newSkill.category} onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="e.g., Automation" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingSkill(false)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={handleAddSkill} className="bg-gradient-to-r from-cyan-500 to-blue-600">Add Skill</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <motion.div key={skill.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/30 transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                              <Code className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{skill.name}</h3>
                              <p className="text-xs text-slate-400">{skill.category}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-800 text-slate-400">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-red-400 text-slate-400" onClick={() => setSkills(skills.filter(s => s.id !== skill.id))}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1">
                          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full" style={{ width: `${skill.level}%` }} />
                        </div>
                        <p className="text-xs text-slate-400 text-right">{skill.level}%</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Work Experience</h1>
                  <p className="text-slate-400">Manage your job history ({experiences.length} entries)</p>
                </div>
                <Dialog open={isAddingExp} onOpenChange={setIsAddingExp}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Work Experience</DialogTitle>
                      <DialogDescription className="text-slate-400">Fill in the details for this role.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <Label>Job Title / Role</Label>
                          <Input value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="e.g. DevOps Engineer" />
                        </div>
                        <div className="col-span-2">
                          <Label>Company</Label>
                          <Input value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="e.g. Acme Corp" />
                        </div>
                        <div className="col-span-2">
                          <Label>Location</Label>
                          <Input value={newExp.location} onChange={e => setNewExp({ ...newExp, location: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="e.g. Nairobi, Kenya" />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input value={newExp.startDate} onChange={e => setNewExp({ ...newExp, startDate: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="e.g. 2022" />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input value={newExp.endDate} onChange={e => setNewExp({ ...newExp, endDate: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="e.g. 2024" disabled={newExp.current} />
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <input type="checkbox" id="current-new" checked={newExp.current} onChange={e => setNewExp({ ...newExp, current: e.target.checked, endDate: e.target.checked ? '' : newExp.endDate })} className="w-4 h-4 rounded accent-cyan-400" />
                          <Label htmlFor="current-new" className="cursor-pointer">I currently work here</Label>
                        </div>
                        <div className="col-span-2">
                          <Label>Description</Label>
                          <Textarea value={newExp.description} onChange={e => setNewExp({ ...newExp, description: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" rows={2} placeholder="Brief role summary..." />
                        </div>
                        <div className="col-span-2">
                          <Label>Key Achievements <span className="text-slate-500 font-normal">(one per line)</span></Label>
                          <Textarea value={newExp.achievements} onChange={e => setNewExp({ ...newExp, achievements: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" rows={4} placeholder={"Reduced costs by 30%\nLed team of 5 engineers\nImplemented CI/CD pipeline"} />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingExp(false)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={() => {
                        if (newExp.role && newExp.company) {
                          setExperiences([...experiences, {
                            id: Date.now(),
                            role: newExp.role,
                            company: newExp.company,
                            location: newExp.location,
                            startDate: newExp.startDate,
                            endDate: newExp.current ? '' : newExp.endDate,
                            current: newExp.current,
                            description: newExp.description,
                            achievements: newExp.achievements.split('\n').map(a => a.trim()).filter(Boolean),
                          }]);
                          setNewExp({ role: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '', achievements: '' });
                          setIsAddingExp(false);
                        }
                      }} className="bg-gradient-to-r from-cyan-500 to-blue-600">Add Experience</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <Card key={exp.id} className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/20 transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold text-white text-lg">{exp.role}</h3>
                            {exp.current && <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30 text-xs">Current</Badge>}
                          </div>
                          <p className="text-cyan-400 font-medium">{exp.company}</p>
                          <div className="flex items-center gap-3 mt-1 text-slate-400 text-sm">
                            {exp.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{exp.location}</span>}
                            <span>{exp.startDate}{exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}</span>
                          </div>
                          {exp.description && <p className="text-slate-400 text-sm mt-2">{exp.description}</p>}
                          {exp.achievements.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {exp.achievements.slice(0, 2).map((a, i) => (
                                <li key={i} className="text-slate-400 text-xs flex items-start gap-1.5">
                                  <span className="text-cyan-400 mt-0.5">•</span>{a}
                                </li>
                              ))}
                              {exp.achievements.length > 2 && <li className="text-slate-500 text-xs">+{exp.achievements.length - 2} more achievements</li>}
                            </ul>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-800 text-slate-400" onClick={() => setEditingExp({ ...exp })}>
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-red-400 text-slate-400" onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {experiences.length === 0 && (
                  <div className="text-center py-16 text-slate-500">
                    <History className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>No work experience added yet.</p>
                    <p className="text-sm mt-1">Click "Add Role" to get started.</p>
                  </div>
                )}
              </div>

              {/* Edit Experience Dialog */}
              {editingExp && (
                <Dialog open={!!editingExp} onOpenChange={(open) => { if (!open) setEditingExp(null); }}>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Experience</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <Label>Job Title / Role</Label>
                          <Input value={editingExp.role} onChange={e => setEditingExp({ ...editingExp, role: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" />
                        </div>
                        <div className="col-span-2">
                          <Label>Company</Label>
                          <Input value={editingExp.company} onChange={e => setEditingExp({ ...editingExp, company: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" />
                        </div>
                        <div className="col-span-2">
                          <Label>Location</Label>
                          <Input value={editingExp.location} onChange={e => setEditingExp({ ...editingExp, location: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input value={editingExp.startDate} onChange={e => setEditingExp({ ...editingExp, startDate: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input value={editingExp.endDate} onChange={e => setEditingExp({ ...editingExp, endDate: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" disabled={editingExp.current} />
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <input type="checkbox" id="current-edit" checked={editingExp.current} onChange={e => setEditingExp({ ...editingExp, current: e.target.checked, endDate: e.target.checked ? '' : editingExp.endDate })} className="w-4 h-4 rounded accent-cyan-400" />
                          <Label htmlFor="current-edit" className="cursor-pointer">I currently work here</Label>
                        </div>
                        <div className="col-span-2">
                          <Label>Description</Label>
                          <Textarea value={editingExp.description} onChange={e => setEditingExp({ ...editingExp, description: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" rows={2} />
                        </div>
                        <div className="col-span-2">
                          <Label>Key Achievements <span className="text-slate-500 font-normal">(one per line)</span></Label>
                          <Textarea value={editingExp.achievements.join('\n')} onChange={e => setEditingExp({ ...editingExp, achievements: e.target.value.split('\n') })} className="bg-slate-800 border-slate-700 mt-1" rows={4} />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingExp(null)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={() => {
                        setExperiences(experiences.map(e => e.id === editingExp.id ? { ...editingExp, achievements: editingExp.achievements.map(a => a.trim()).filter(Boolean) } : e));
                        setEditingExp(null);
                      }} className="bg-gradient-to-r from-cyan-500 to-blue-600">Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </motion.div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Certifications</h1>
                  <p className="text-slate-400">Manage your credentials ({certs.length} total)</p>
                </div>
                <Dialog open={isAddingCert} onOpenChange={setIsAddingCert}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Certification
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Certification</DialogTitle>
                      <DialogDescription className="text-slate-400">Add a new credential or certificate.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Certification Name</Label>
                        <Input value={newCert.name} onChange={e => setNewCert({ ...newCert, name: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="e.g. AWS Solutions Architect" />
                      </div>
                      <div>
                        <Label>Issuing Organisation</Label>
                        <Input value={newCert.issuer} onChange={e => setNewCert({ ...newCert, issuer: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="e.g. Amazon Web Services" />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input value={newCert.year} onChange={e => setNewCert({ ...newCert, year: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="e.g. 2024" />
                      </div>
                      <div>
                        <Label>Credential URL <span className="text-slate-500 font-normal">(optional)</span></Label>
                        <Input value={newCert.url} onChange={e => setNewCert({ ...newCert, url: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="https://credly.com/badges/..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingCert(false)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={() => {
                        if (newCert.name && newCert.issuer) {
                          setCerts([...certs, { id: Date.now(), ...newCert }]);
                          setNewCert({ name: '', issuer: '', year: '', url: '' });
                          setIsAddingCert(false);
                        }
                      }} className="bg-gradient-to-r from-cyan-500 to-blue-600">Add Certification</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {certs.map((cert) => (
                  <motion.div key={cert.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/20 transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Award className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm leading-tight">{cert.name}</h3>
                            <p className="text-cyan-400 text-xs mt-0.5">{cert.issuer}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{cert.year}</p>
                            {cert.url && (
                              <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 mt-1 transition-colors">
                                <ExternalLink className="w-3 h-3" /> View credential
                              </a>
                            )}
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-slate-800 text-slate-400" onClick={() => setEditingCert({ ...cert })}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-red-400 text-slate-400" onClick={() => setCerts(certs.filter(c => c.id !== cert.id))}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {certs.length === 0 && (
                  <div className="col-span-2 text-center py-16 text-slate-500">
                    <Award className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>No certifications added yet.</p>
                    <p className="text-sm mt-1">Click "Add Certification" to get started.</p>
                  </div>
                )}
              </div>

              {/* Edit Dialog */}
              {editingCert && (
                <Dialog open={!!editingCert} onOpenChange={(open) => { if (!open) setEditingCert(null); }}>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Certification</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Certification Name</Label>
                        <Input value={editingCert.name} onChange={e => setEditingCert({ ...editingCert, name: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" />
                      </div>
                      <div>
                        <Label>Issuing Organisation</Label>
                        <Input value={editingCert.issuer} onChange={e => setEditingCert({ ...editingCert, issuer: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input value={editingCert.year} onChange={e => setEditingCert({ ...editingCert, year: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" />
                      </div>
                      <div>
                        <Label>Credential URL <span className="text-slate-500 font-normal">(optional)</span></Label>
                        <Input value={editingCert.url} onChange={e => setEditingCert({ ...editingCert, url: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" placeholder="https://credly.com/badges/..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingCert(null)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={() => {
                        setCerts(certs.map(c => c.id === editingCert.id ? editingCert : c));
                        setEditingCert(null);
                      }} className="bg-gradient-to-r from-cyan-500 to-blue-600">Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </motion.div>
          )}

          {/* About Section Tab */}
          {activeTab === 'about' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">About Section</h1>
                <p className="text-slate-400">Edit the About Me section that appears on your portfolio</p>
              </div>

              <div className="max-w-2xl space-y-6">
                {/* Subtitle */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Section Subtitle</CardTitle>
                    <CardDescription>The introductory paragraph shown below the "About Me" heading</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={aboutData.subtitle}
                      onChange={e => setAboutData(prev => ({ ...prev, subtitle: e.target.value }))}
                      rows={3}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Stats</CardTitle>
                    <CardDescription>Numbers displayed prominently in the About section</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { key: 'yearsExperience', label: 'Years Experience', placeholder: '3+' },
                      { key: 'projectsDeployed', label: 'Projects Deployed', placeholder: '20+' },
                      { key: 'uptimePct', label: 'Uptime Guarantee', placeholder: '99.9%' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm text-slate-400 mb-1">{label}</label>
                        <input
                          type="text"
                          value={aboutData.stats[key as keyof typeof aboutData.stats]}
                          onChange={e => setAboutData(prev => ({ ...prev, stats: { ...prev.stats, [key]: e.target.value } }))}
                          placeholder={placeholder}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Feature Cards */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Expertise Cards</CardTitle>
                    <CardDescription>The three highlight cards shown below the stats</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {aboutData.cards.map((card, idx) => (
                      <div key={idx} className="space-y-2 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Card {idx + 1}</label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={e => {
                            const updated = [...aboutData.cards];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setAboutData(prev => ({ ...prev, cards: updated }));
                          }}
                          placeholder="Title"
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <textarea
                          value={card.description}
                          onChange={e => {
                            const updated = [...aboutData.cards];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setAboutData(prev => ({ ...prev, cards: updated }));
                          }}
                          rows={2}
                          placeholder="Description"
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <p className="text-xs text-slate-500">Changes are saved and synced to your portfolio automatically as you type.</p>
              </div>
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="p-0">
              <MessagesInbox />
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Analytics</h1>
                <p className="text-slate-400">Track your portfolio performance</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {[
                  { value: '12,429', label: 'Total Visitors', change: '+8% from last month', color: 'cyan' },
                  { value: '3,847', label: 'Page Views', change: '+12% from last week', color: 'blue' },
                  { value: '4m 23s', label: 'Avg. Session Duration', change: '+5% from last month', color: 'purple' },
                ].map((stat, idx) => (
                  <Card key={idx} className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-4xl text-white">{stat.value}</CardTitle>
                      <CardDescription>{stat.label}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-green-400 text-sm">{stat.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Top Projects by Views</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {projects.sort((a, b) => b.views - a.views).map((project) => (
                      <div key={project.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300 truncate max-w-[200px]">{project.title}</span>
                          <span className="text-cyan-400 font-medium">{project.views}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full"
                            style={{ width: `${(project.views / Math.max(...projects.map(p => p.views))) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Traffic Sources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { source: 'Direct', percentage: 42, visitors: 5220 },
                      { source: 'LinkedIn', percentage: 28, visitors: 3480 },
                      { source: 'GitHub', percentage: 18, visitors: 2237 },
                      { source: 'Search', percentage: 12, visitors: 1491 },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">{item.source}</span>
                          <span className="text-slate-400">{item.visitors} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full" style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-slate-400">Update your portfolio profile information</p>
              </div>

              <div className="max-w-2xl space-y-6">
                {/* GitHub Sync */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Github className="w-5 h-5 text-slate-300" />
                      GitHub Sync
                    </CardTitle>
                    <CardDescription>Push the latest portfolio changes to your GitHub repository</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Button
                        onClick={handleSyncGitHub}
                        disabled={syncState === 'syncing'}
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white"
                      >
                        {syncState === 'syncing' ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Pushing…</>
                        ) : syncState === 'success' ? (
                          <><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Pushed!</>
                        ) : syncState === 'error' ? (
                          <><X className="w-4 h-4 mr-2 text-red-400" /> Failed</>
                        ) : (
                          <><Github className="w-4 h-4 mr-2" /> Push to GitHub</>
                        )}
                      </Button>
                      {syncMessage && (
                        <p className={`text-sm ${syncState === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                          {syncMessage}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Picture Upload */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Profile Picture</CardTitle>
                    <CardDescription>Upload a photo to display in the hero section of your portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0">
                        {profilePicUrl ? (
                          <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePicUpload}
                        />
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadState === 'uploading'}
                          className={
                            uploadState === 'done'
                              ? 'bg-green-600 hover:bg-green-700 w-full'
                              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 w-full'
                          }
                        >
                          {uploadState === 'uploading' ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</>
                          ) : uploadState === 'done' ? (
                            <><CheckCircle className="w-4 h-4 mr-2" />Photo Updated!</>
                          ) : (
                            <><Upload className="w-4 h-4 mr-2" />{profilePicUrl ? 'Change Photo' : 'Upload Photo'}</>
                          )}
                        </Button>
                        {profilePicUrl && uploadState !== 'uploading' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-slate-400 hover:text-red-400"
                            onClick={() => {
                              localStorage.removeItem(PROFILE_PIC_KEY);
                              setProfilePicUrl(null);
                              window.dispatchEvent(new Event('profile-pic-updated'));
                            }}
                          >
                            Remove photo
                          </Button>
                        )}
                        {uploadError && (
                          <p className="text-red-400 text-sm">{uploadError}</p>
                        )}
                        <p className="text-slate-500 text-xs">Supports JPG, PNG, WebP. Recommended: 400×400px or larger.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Full Name</Label>
                        <Input value={profileSettings.name} onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" />
                      </div>
                      <div>
                        <Label className="text-white">Job Title</Label>
                        <Input value={profileSettings.title} onChange={(e) => setProfileSettings({ ...profileSettings, title: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-white">Email</Label>
                      <Input value={profileSettings.email} onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" type="email" />
                    </div>
                    <div>
                      <Label className="text-white">Currently Working At</Label>
                      <Input value={profileSettings.currentCompany ?? ''} onChange={(e) => setProfileSettings({ ...profileSettings, currentCompany: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" placeholder="e.g. Google, Microsoft, Self-employed..." />
                    </div>
                    <div>
                      <Label className="text-white">University / School</Label>
                      <Input value={profileSettings.university} onChange={(e) => setProfileSettings({ ...profileSettings, university: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" placeholder="e.g. MIT, Stanford..." />
                    </div>
                    <div>
                      <Label className="text-white">Bio / Tagline</Label>
                      <Textarea value={profileSettings.bio} onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" rows={3} />
                    </div>
                  </CardContent>
                </Card>

                {/* Resume Upload */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Resume</CardTitle>
                    <CardDescription>Upload your resume — it will be available for download from the portfolio navbar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-lg bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <input
                          ref={resumeInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleResumeUpload}
                        />
                        {resumeName && (
                          <p className="text-sm text-slate-300 truncate">Current: <span className="text-cyan-400">{resumeName}</span></p>
                        )}
                        <Button
                          onClick={() => resumeInputRef.current?.click()}
                          disabled={resumeUploadState === 'uploading'}
                          className={
                            resumeUploadState === 'done'
                              ? 'bg-green-600 hover:bg-green-700 w-full'
                              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 w-full'
                          }
                        >
                          {resumeUploadState === 'uploading' ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</>
                          ) : resumeUploadState === 'done' ? (
                            <><CheckCircle className="w-4 h-4 mr-2" />Resume Uploaded!</>
                          ) : (
                            <><Upload className="w-4 h-4 mr-2" />{resumeUrl ? 'Replace Resume' : 'Upload Resume'}</>
                          )}
                        </Button>
                        {resumeUrl && resumeUploadState !== 'uploading' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-slate-400 hover:text-red-400"
                            onClick={() => {
                              localStorage.removeItem(RESUME_KEY);
                              localStorage.removeItem(RESUME_NAME_KEY);
                              setResumeUrl(null);
                              setResumeName(null);
                              window.dispatchEvent(new Event('resume-updated'));
                            }}
                          >
                            Remove resume
                          </Button>
                        )}
                        {resumeUploadError && (
                          <p className="text-red-400 text-sm">{resumeUploadError}</p>
                        )}
                        <p className="text-slate-500 text-xs">Supports PDF, DOC, DOCX.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Social Links</CardTitle>
                        <CardDescription className="mt-1">Manage links shown in the hero, contact, and footer sections</CardDescription>
                      </div>
                      <Dialog open={isAddingSocial} onOpenChange={setIsAddingSocial}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                            <Plus className="w-4 h-4 mr-1" /> Add Link
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800 text-white">
                          <DialogHeader>
                            <DialogTitle>Add Social Link</DialogTitle>
                            <DialogDescription className="text-slate-400">Choose a platform and enter your profile URL</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label>Platform</Label>
                              <select
                                value={newSocial.platform}
                                onChange={(e) => {
                                  const p = SOCIAL_PLATFORMS.find(x => x.value === e.target.value);
                                  setNewSocial({ platform: e.target.value, label: p?.label ?? e.target.value, url: newSocial.url });
                                }}
                                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                              >
                                {SOCIAL_PLATFORMS.map(p => (
                                  <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label>URL</Label>
                              <Input
                                value={newSocial.url}
                                onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                                className="bg-slate-800 border-slate-700 mt-1 text-white"
                                placeholder={newSocial.platform === 'email' ? 'mailto:you@example.com' : 'https://...'}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddingSocial(false)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                            <Button
                              onClick={() => {
                                if (newSocial.url) {
                                  setSocialLinks([...socialLinks, { id: Date.now(), platform: newSocial.platform, label: newSocial.label, url: newSocial.url }]);
                                  setNewSocial({ platform: 'github', label: 'GitHub', url: '' });
                                  setIsAddingSocial(false);
                                }
                              }}
                              className="bg-gradient-to-r from-cyan-500 to-blue-600"
                            >
                              Add Link
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {socialLinks.length === 0 && (
                      <p className="text-slate-500 text-sm text-center py-4">No social links yet. Click "Add Link" to get started.</p>
                    )}
                    {socialLinks.map((link) => {
                      const SocialIcon = getSocialIcon(link.platform);
                      return (
                        <div key={link.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                          <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <SocialIcon className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{link.label}</p>
                            <p className="text-xs text-slate-400 truncate">{link.url}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              variant="ghost" size="sm"
                              className="h-8 w-8 p-0 hover:bg-slate-700 text-slate-400"
                              onClick={() => setEditingSocial(link)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              className="h-8 w-8 p-0 hover:text-red-400 text-slate-400"
                              onClick={() => setSocialLinks(socialLinks.filter(s => s.id !== link.id))}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Edit Social Link Dialog */}
                {editingSocial && (
                  <Dialog open={!!editingSocial} onOpenChange={() => setEditingSocial(null)}>
                    <DialogContent className="bg-slate-900 border-slate-800 text-white">
                      <DialogHeader>
                        <DialogTitle>Edit Social Link</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Platform</Label>
                          <select
                            value={editingSocial.platform}
                            onChange={(e) => {
                              const p = SOCIAL_PLATFORMS.find(x => x.value === e.target.value);
                              setEditingSocial({ ...editingSocial, platform: e.target.value, label: p?.label ?? e.target.value });
                            }}
                            className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          >
                            {SOCIAL_PLATFORMS.map(p => (
                              <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label>URL</Label>
                          <Input
                            value={editingSocial.url}
                            onChange={(e) => setEditingSocial({ ...editingSocial, url: e.target.value })}
                            className="bg-slate-800 border-slate-700 mt-1 text-white"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingSocial(null)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                        <Button
                          onClick={() => {
                            setSocialLinks(socialLinks.map(s => s.id === editingSocial.id ? editingSocial : s));
                            setEditingSocial(null);
                          }}
                          className="bg-gradient-to-r from-cyan-500 to-blue-600"
                        >
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                <Button
                  onClick={handleSaveSettings}
                  className={`w-full ${settingsSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'}`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {settingsSaved ? 'Saved!' : 'Save Changes'}
                </Button>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
