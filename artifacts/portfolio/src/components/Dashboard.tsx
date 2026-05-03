import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard, Briefcase, Code, Settings, BarChart3, Plus, Edit, Trash2,
  Eye, TrendingUp, Users, Activity, FileText, LogOut, Menu, X, Save, Terminal,
  Inbox, Upload, User, CheckCircle, Loader2, Github, Linkedin, Mail, Globe,
  Twitter, Youtube, Instagram, Facebook, Link, History, MapPin, Award,
  ExternalLink, Info,
} from 'lucide-react';
import MessagesInbox from './MessagesInbox';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

const API = import.meta.env.VITE_API_URL ?? '';

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API}/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    ...options,
  });
  if (res.status === 204) return null;
  return res.json();
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

function getSocialIcon(platform: string) {
  return SOCIAL_PLATFORMS.find(p => p.value === platform)?.icon ?? Link;
}

interface Project { id: number; title: string; description: string; status: 'active' | 'completed' | 'archived'; tags: string[]; views: number; url?: string; }
interface Skill { id: number; name: string; level: number; category: string; }
interface Experience { id: number; role: string; company: string; location: string; startDate: string; endDate: string; current: boolean; description: string; achievements: string[]; }
interface Cert { id: number; name: string; issuer: string; year: string; url: string; }
interface SocialLink { id: number; platform: string; label: string; url: string; }
interface AboutData { subtitle: string; cards: { title: string; description: string }[]; stats: { yearsExperience: string; projectsDeployed: string; uptimePct: string }; }
interface ProfileData { name: string; email: string; title: string; bio: string; university: string; currentCompany: string; profilePicUrl?: string | null; logoUrl?: string | null; resumeUrl?: string | null; resumeName?: string | null; }

const DEFAULT_ABOUT: AboutData = {
  subtitle: 'Passionate DevOps engineer focused on building scalable infrastructure',
  cards: [
    { title: 'Infrastructure Expert', description: 'Designing and managing cloud infrastructure at scale' },
    { title: 'CI/CD Specialist', description: 'Building automated pipelines for rapid software delivery' },
    { title: 'Automation Advocate', description: 'Creating infrastructure as code to eliminate manual processes' },
  ],
  stats: { yearsExperience: '3+', projectsDeployed: '20+', uptimePct: '99.9%' },
};

const DEFAULT_PROFILE: ProfileData = {
  name: 'Raynald Gitau', email: 'raynald.gitau@example.com', title: 'DevOps Engineer',
  bio: 'Building resilient infrastructure and automating the future.',
  university: 'United States International University Africa', currentCompany: '',
};

const recentActivity = [
  { action: 'Updated project', target: 'Cloud Infrastructure Automation', time: '2 hours ago' },
  { action: 'Added new skill', target: 'Prometheus', time: '5 hours ago' },
  { action: 'Profile view spike', target: '+124 views', time: '2 days ago' },
];

interface DashboardProps { onLogout: () => void; }

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certs, setCerts] = useState<Cert[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [aboutData, setAboutData] = useState<AboutData>(DEFAULT_ABOUT);
  const [profileSettings, setProfileSettings] = useState<ProfileData>(DEFAULT_PROFILE);

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [isAddingSocial, setIsAddingSocial] = useState(false);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [editingCert, setEditingCert] = useState<Cert | null>(null);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);

  const [newProject, setNewProject] = useState({ title: '', description: '', tags: '', url: '' });
  const [newSkill, setNewSkill] = useState({ name: '', level: '80', category: '' });
  const [newExp, setNewExp] = useState({ role: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '', achievements: '' });
  const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '', url: '' });
  const [newSocial, setNewSocial] = useState({ platform: 'github', label: 'GitHub', url: '' });

  const [settingsSaved, setSettingsSaved] = useState(false);
  const [syncState, setSyncState] = useState<'idle'|'syncing'|'success'|'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string|null>(null);
  const [uploadState, setUploadState] = useState<'idle'|'uploading'|'done'|'error'>('idle');
  const [uploadError, setUploadError] = useState<string|null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [p, s, e, c, sl, a, pr] = await Promise.all([
      apiFetch('/projects'), apiFetch('/skills'), apiFetch('/experience'),
      apiFetch('/certifications'), apiFetch('/social-links'), apiFetch('/about'), apiFetch('/profile'),
    ]);
    if (p) setProjects(p);
    if (s) setSkills(s);
    if (e) setExperiences(e);
    if (c) setCerts(c);
    if (sl) setSocialLinks(sl);
    if (a) setAboutData(a);
    if (pr) setProfileSettings(pr);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);
  useEffect(() => { window.dispatchEvent(new Event('portfolio-projects-updated')); }, [projects]);
  useEffect(() => { window.dispatchEvent(new Event('portfolio-skills-updated')); }, [skills]);
  useEffect(() => { window.dispatchEvent(new Event('profile-updated')); }, [profileSettings]);

  const handleSyncGitHub = async () => {
    setSyncState('syncing'); setSyncMessage(null);
    const data = await apiFetch('/sync/github', { method: 'POST' });
    setSyncState(data?.success ? 'success' : 'error');
    setSyncMessage(data?.success ? 'Pushed to GitHub!' : data?.error || 'Push failed.');
    setTimeout(() => { setSyncState('idle'); setSyncMessage(null); }, 5000);
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description) return;
    await apiFetch('/projects', { method: 'POST', body: JSON.stringify({ title: newProject.title, description: newProject.description, status: 'active', tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean), views: 0, url: newProject.url || null }) });
    setNewProject({ title: '', description: '', tags: '', url: '' });
    setIsAddingProject(false);
    await loadAll();
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    await apiFetch(`/projects/${editingProject.id}`, { method: 'PUT', body: JSON.stringify(editingProject) });
    setEditingProject(null);
    await loadAll();
  };

  const handleDeleteProject = async (id: number) => {
    await apiFetch(`/projects/${id}`, { method: 'DELETE' });
    await loadAll();
  };

  const handleAddSkill = async () => {
    if (!newSkill.name) return;
    await apiFetch('/skills', { method: 'POST', body: JSON.stringify({ name: newSkill.name, level: parseInt(newSkill.level) || 80, category: newSkill.category }) });
    setNewSkill({ name: '', level: '80', category: '' });
    setIsAddingSkill(false);
    await loadAll();
  };

  const handleUpdateSkill = async () => {
    if (!editingSkill) return;
    await apiFetch(`/skills/${editingSkill.id}`, { method: 'PUT', body: JSON.stringify(editingSkill) });
    setEditingSkill(null);
    await loadAll();
  };

  const handleDeleteSkill = async (id: number) => {
    await apiFetch(`/skills/${id}`, { method: 'DELETE' });
    await loadAll();
  };

  const handleAddExp = async () => {
    if (!newExp.role || !newExp.company) return;
    await apiFetch('/experience', { method: 'POST', body: JSON.stringify({ ...newExp, endDate: newExp.current ? '' : newExp.endDate, achievements: newExp.achievements.split('\n').map(a => a.trim()).filter(Boolean) }) });
    setNewExp({ role: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '', achievements: '' });
    setIsAddingExp(false);
    await loadAll();
  };

  const handleUpdateExp = async () => {
    if (!editingExp) return;
    await apiFetch(`/experience/${editingExp.id}`, { method: 'PUT', body: JSON.stringify({ ...editingExp, achievements: editingExp.achievements.map(a => a.trim()).filter(Boolean) }) });
    setEditingExp(null);
    await loadAll();
  };

  const handleDeleteExp = async (id: number) => {
    await apiFetch(`/experience/${id}`, { method: 'DELETE' });
    await loadAll();
  };

  const handleAddCert = async () => {
    if (!newCert.name || !newCert.issuer) return;
    await apiFetch('/certifications', { method: 'POST', body: JSON.stringify(newCert) });
    setNewCert({ name: '', issuer: '', year: '', url: '' });
    setIsAddingCert(false);
    await loadAll();
  };

  const handleUpdateCert = async () => {
    if (!editingCert) return;
    await apiFetch(`/certifications/${editingCert.id}`, { method: 'PUT', body: JSON.stringify(editingCert) });
    setEditingCert(null);
    await loadAll();
  };

  const handleDeleteCert = async (id: number) => {
    await apiFetch(`/certifications/${id}`, { method: 'DELETE' });
    await loadAll();
  };

  const handleAddSocial = async () => {
    if (!newSocial.url) return;
    await apiFetch('/social-links', { method: 'POST', body: JSON.stringify(newSocial) });
    setNewSocial({ platform: 'github', label: 'GitHub', url: '' });
    setIsAddingSocial(false);
    await loadAll();
  };

  const handleUpdateSocial = async () => {
    if (!editingSocial) return;
    await apiFetch(`/social-links/${editingSocial.id}`, { method: 'PUT', body: JSON.stringify(editingSocial) });
    setEditingSocial(null);
    await loadAll();
  };

  const handleDeleteSocial = async (id: number) => {
    await apiFetch(`/social-links/${id}`, { method: 'DELETE' });
    await loadAll();
  };

  const handleSaveAbout = async () => {
    await apiFetch('/about', { method: 'POST', body: JSON.stringify(aboutData) });
    await loadAll();
  };

  const handleSaveSettings = async () => {
    await apiFetch('/profile', { method: 'POST', body: JSON.stringify(profileSettings) });
    await loadAll();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadState('uploading'); setUploadError(null);
    const res = await fetch(`${API}/api/storage/uploads/request-url`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }) });
    if (!res.ok) { setUploadState('error'); setUploadError('Failed to get upload URL'); return; }
    const { uploadURL, objectPath } = await res.json();
    const put = await fetch(uploadURL, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
    if (!put.ok) { setUploadState('error'); setUploadError('Upload failed'); return; }
    const publicUrl = `${API}/api/storage/objects${objectPath}`;
    const updated = { ...profileSettings, profilePicUrl: publicUrl };
    setProfileSettings(updated);
    await apiFetch('/profile', { method: 'POST', body: JSON.stringify(updated) });
    window.dispatchEvent(new Event('profile-pic-updated'));
    setUploadState('done'); setTimeout(() => setUploadState('idle'), 3000);
    if (fileInputRef.current) fileInputRef.current.value = '';
    await loadAll();
  };

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

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-400"><Loader2 className="w-6 h-6 animate-spin text-cyan-400" /><span>Loading dashboard...</span></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {mobileSidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setMobileSidebarOpen(false)} />}
      <motion.aside className={`bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-64 md:w-20'} ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`} initial={false}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          {sidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"><Terminal className="w-4 h-4 text-white" /></div>
            <div><p className="font-semibold text-sm text-white">Raynald Gitau</p><p className="text-xs text-slate-400">Admin Dashboard</p></div>
          </motion.div>}
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex hover:bg-slate-800 text-slate-400 ml-auto">{sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}</Button>
          <Button variant="ghost" size="sm" onClick={() => setMobileSidebarOpen(false)} className="md:hidden hover:bg-slate-800 text-slate-400 ml-auto"><X className="w-4 h-4" /></Button>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto space-y-1">
          {menuItems.map(item => (
            <motion.button key={item.id} onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-400/30' : 'hover:bg-slate-800 text-slate-400'}`} whileHover={{ x: sidebarOpen ? 4 : 0 }}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm font-medium md:${sidebarOpen ? 'block' : 'hidden'}`}>{item.label}</span>
            </motion.button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" className="w-full justify-start hover:bg-slate-800 text-slate-400" onClick={onLogout}><LogOut className="w-5 h-5 flex-shrink-0" /><span className={`ml-3 text-sm md:${sidebarOpen ? 'block' : 'hidden'}`}>Back to Portfolio</span></Button>
        </div>
      </motion.aside>

      <main className={`flex-1 overflow-auto transition-all duration-300 ml-0 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="md:hidden sticky top-0 z-20 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setMobileSidebarOpen(true)} className="hover:bg-slate-800 text-slate-400 p-1"><Menu className="w-5 h-5" /></Button>
          <span className="font-semibold text-sm text-white">Admin Dashboard</span>
        </div>
        <div className="p-4 md:p-8">

          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8"><h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1><p className="text-slate-400">Welcome back, Raynald!</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[{ label: 'Total Projects', value: projects.length.toString(), icon: Briefcase }, { label: 'Skills Listed', value: skills.length.toString(), icon: Code }, { label: 'Profile Views', value: '3,847', icon: Eye }, { label: 'Total Visitors', value: '12,429', icon: Users }].map((stat, idx) => (
                  <Card key={idx} className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/30 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4"><div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center"><stat.icon className="w-6 h-6 text-cyan-400" /></div><TrendingUp className="w-4 h-4 text-green-400" /></div>
                      <h3 className="text-2xl font-bold mb-1 text-white">{stat.value}</h3><p className="text-sm text-slate-400">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-white"><Activity className="w-5 h-5 text-cyan-400" />Recent Activity</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((a, idx) => (
                      <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-800 last:border-0">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                        <div><p className="text-sm"><span className="text-slate-300">{a.action}</span> <span className="text-cyan-400 font-medium">{a.target}</span></p><p className="text-xs text-slate-500 mt-1">{a.time}</p></div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-white"><FileText className="w-5 h-5 text-blue-400" />Quick Actions</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white" onClick={() => setActiveTab('projects')}><Plus className="w-4 h-4 mr-2" />Add New Project</Button>
                    <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white" onClick={() => setActiveTab('skills')}><Plus className="w-4 h-4 mr-2" />Add New Skill</Button>
                    <Button className="w-full justify-start bg-gradient-to-r from-cyan-500 to-blue-600" onClick={onLogout}><Eye className="w-4 h-4 mr-2" />View Live Portfolio</Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div><h1 className="text-3xl font-bold mb-2">Projects</h1><p className="text-slate-400">{projects.length} total</p></div>
                <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
                  <DialogTrigger asChild><Button className="bg-gradient-to-r from-cyan-500 to-blue-600"><Plus className="w-4 h-4 mr-2" />Add Project</Button></DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader><DialogTitle>Add New Project</DialogTitle><DialogDescription className="text-slate-400">Create a new project</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div><Label>Title</Label><Input value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Description</Label><Textarea value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Tags (comma-separated)</Label><Input value={newProject.tags} onChange={e => setNewProject({ ...newProject, tags: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Project URL (optional)</Label><Input value={newProject.url} onChange={e => setNewProject({ ...newProject, url: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
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
                    {projects.filter(p => tab === 'all' || p.status === tab).map(project => (
                      <Card key={project.id} className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/30 transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                                <Badge variant="outline" className={project.status === 'active' ? 'border-green-400/30 text-green-400' : 'border-blue-400/30 text-blue-400'}>{project.status}</Badge>
                              </div>
                              <p className="text-slate-400 mb-4">{project.description}</p>
                              <div className="flex flex-wrap gap-2">{project.tags.map((tag, i) => <Badge key={i} variant="outline" className="border-cyan-400/30 text-cyan-400 text-xs">{tag}</Badge>)}</div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button variant="ghost" size="sm" className="hover:bg-slate-800 text-slate-400" onClick={() => setEditingProject(project)}><Edit className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" className="hover:bg-red-500/20 hover:text-red-400 text-slate-400" onClick={() => handleDeleteProject(project.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
              {editingProject && (
                <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div><Label>Title</Label><Input value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" /></div>
                      <div><Label>Description</Label><Textarea value={editingProject.description} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" /></div>
                      <div><Label>Tags (comma-separated)</Label><Input value={editingProject.tags.join(', ')} onChange={e => setEditingProject({ ...editingProject, tags: e.target.value.split(',').map(t => t.trim()) })} className="bg-slate-800 border-slate-700 mt-1 text-white" /></div>
                      <div><Label>Status</Label>
                        <select value={editingProject.status} onChange={e => setEditingProject({ ...editingProject, status: e.target.value as Project['status'] })} className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                          <option value="active">Active</option><option value="completed">Completed</option><option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingProject(null)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={handleUpdateProject} className="bg-gradient-to-r from-cyan-500 to-blue-600">Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div><h1 className="text-3xl font-bold mb-2">Skills</h1><p className="text-slate-400">{skills.length} total</p></div>
                <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
                  <DialogTrigger asChild><Button className="bg-gradient-to-r from-cyan-500 to-blue-600"><Plus className="w-4 h-4 mr-2" />Add Skill</Button></DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader><DialogTitle>Add New Skill</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div><Label>Skill Name</Label><Input value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Level (0-100)</Label><Input type="number" min="0" max="100" value={newSkill.level} onChange={e => setNewSkill({ ...newSkill, level: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Category</Label><Input value={newSkill.category} onChange={e => setNewSkill({ ...newSkill, category: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingSkill(false)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={handleAddSkill} className="bg-gradient-to-r from-cyan-500 to-blue-600">Add Skill</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map(skill => (
                  <Card key={skill.id} className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/30 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center"><Code className="w-5 h-5 text-cyan-400" /></div>
                          <div><h3 className="font-semibold text-white">{skill.name}</h3><p className="text-xs text-slate-400">{skill.category}</p></div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-800 text-slate-400" onClick={() => setEditingSkill({ ...skill })}><Edit className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-red-400 text-slate-400" onClick={() => handleDeleteSkill(skill.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1"><div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full" style={{ width: `${skill.level}%` }} /></div>
                      <p className="text-xs text-slate-400 text-right">{skill.level}%</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {editingSkill && (
                <Dialog open={!!editingSkill} onOpenChange={open => { if (!open) setEditingSkill(null); }}>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader><DialogTitle>Edit Skill</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div><Label>Name</Label><Input value={editingSkill.name} onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" /></div>
                      <div><Label>Level (0-100)</Label><Input type="number" min="0" max="100" value={editingSkill.level} onChange={e => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) || 0 })} className="bg-slate-800 border-slate-700 mt-1 text-white" /></div>
                      <div><Label>Category</Label><Input value={editingSkill.category} onChange={e => setEditingSkill({ ...editingSkill, category: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingSkill(null)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={handleUpdateSkill} className="bg-gradient-to-r from-cyan-500 to-blue-600">Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </motion.div>
          )}

          {activeTab === 'experience' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div><h1 className="text-3xl font-bold mb-2">Work Experience</h1><p className="text-slate-400">{experiences.length} entries</p></div>
                <Dialog open={isAddingExp} onOpenChange={setIsAddingExp}>
                  <DialogTrigger asChild><Button className="bg-gradient-to-r from-cyan-500 to-blue-600"><Plus className="w-4 h-4 mr-2" />Add Role</Button></DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Add Work Experience</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div><Label>Job Title</Label><Input value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Company</Label><Input value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Location</Label><Input value={newExp.location} onChange={e => setNewExp({ ...newExp, location: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Start Date</Label><Input value={newExp.startDate} onChange={e => setNewExp({ ...newExp, startDate: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                        <div><Label>End Date</Label><Input value={newExp.endDate} onChange={e => setNewExp({ ...newExp, endDate: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" disabled={newExp.current} /></div>
                      </div>
                      <div className="flex items-center gap-2"><input type="checkbox" checked={newExp.current} onChange={e => setNewExp({ ...newExp, current: e.target.checked })} className="w-4 h-4 accent-cyan-400" /><Label>Currently work here</Label></div>
                      <div><Label>Description</Label><Textarea value={newExp.description} onChange={e => setNewExp({ ...newExp, description: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" rows={2} /></div>
                      <div><Label>Achievements (one per line)</Label><Textarea value={newExp.achievements} onChange={e => setNewExp({ ...newExp, achievements: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" rows={4} /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingExp(false)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={handleAddExp} className="bg-gradient-to-r from-cyan-500 to-blue-600">Add Experience</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-4">
                {experiences.map(exp => (
                  <Card key={exp.id} className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-white text-lg">{exp.role}</h3>
                            {exp.current && <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30 text-xs">Current</Badge>}
                          </div>
                          <p className="text-cyan-400 font-medium">{exp.company}</p>
                          <p className="text-slate-400 text-sm mt-1">{exp.location} · {exp.startDate}{exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-800 text-slate-400" onClick={() => setEditingExp({ ...exp })}><Edit className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-red-400 text-slate-400" onClick={() => handleDeleteExp(exp.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {experiences.length === 0 && <div className="text-center py-16 text-slate-500"><History className="w-10 h-10 mx-auto mb-3 opacity-40" /><p>No work experience added yet.</p></div>}
              </div>
              {editingExp && (
                <Dialog open={!!editingExp} onOpenChange={open => { if (!open) setEditingExp(null); }}>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Edit Experience</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div><Label>Job Title</Label><Input value={editingExp.role} onChange={e => setEditingExp({ ...editingExp, role: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Company</Label><Input value={editingExp.company} onChange={e => setEditingExp({ ...editingExp, company: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Location</Label><Input value={editingExp.location} onChange={e => setEditingExp({ ...editingExp, location: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Start Date</Label><Input value={editingExp.startDate} onChange={e => setEditingExp({ ...editingExp, startDate: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                        <div><Label>End Date</Label><Input value={editingExp.endDate} onChange={e => setEditingExp({ ...editingExp, endDate: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" disabled={editingExp.current} /></div>
                      </div>
                      <div className="flex items-center gap-2"><input type="checkbox" checked={editingExp.current} onChange={e => setEditingExp({ ...editingExp, current: e.target.checked })} className="w-4 h-4 accent-cyan-400" /><Label>Currently work here</Label></div>
                      <div><Label>Description</Label><Textarea value={editingExp.description} onChange={e => setEditingExp({ ...editingExp, description: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" rows={2} /></div>
                      <div><Label>Achievements (one per line)</Label><Textarea value={editingExp.achievements.join('\n')} onChange={e => setEditingExp({ ...editingExp, achievements: e.target.value.split('\n') })} className="bg-slate-800 border-slate-700 mt-1" rows={4} /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingExp(null)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={handleUpdateExp} className="bg-gradient-to-r from-cyan-500 to-blue-600">Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </motion.div>
          )}

          {activeTab === 'certifications' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div><h1 className="text-3xl font-bold mb-2">Certifications</h1><p className="text-slate-400">{certs.length} total</p></div>
                <Dialog open={isAddingCert} onOpenChange={setIsAddingCert}>
                  <DialogTrigger asChild><Button className="bg-gradient-to-r from-cyan-500 to-blue-600"><Plus className="w-4 h-4 mr-2" />Add Certification</Button></DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
                    <DialogHeader><DialogTitle>Add Certification</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div><Label>Name</Label><Input value={newCert.name} onChange={e => setNewCert({ ...newCert, name: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Issuer</Label><Input value={newCert.issuer} onChange={e => setNewCert({ ...newCert, issuer: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Year</Label><Input value={newCert.year} onChange={e => setNewCert({ ...newCert, year: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Credential URL (optional)</Label><Input value={newCert.url} onChange={e => setNewCert({ ...newCert, url: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingCert(false)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={handleAddCert} className="bg-gradient-to-r from-cyan-500 to-blue-600">Add Certification</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {certs.map(cert => (
                  <Card key={cert.id} className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center"><Award className="w-5 h-5 text-cyan-400" /></div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm">{cert.name}</h3>
                          <p className="text-cyan-400 text-xs mt-0.5">{cert.issuer}</p>
                          <p className="text-slate-500 text-xs">{cert.year}</p>
                          {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 mt-1"><ExternalLink className="w-3 h-3" />View credential</a>}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-slate-800 text-slate-400" onClick={() => setEditingCert({ ...cert })}><Edit className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-red-400 text-slate-400" onClick={() => handleDeleteCert(cert.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {certs.length === 0 && <div className="col-span-2 text-center py-16 text-slate-500"><Award className="w-10 h-10 mx-auto mb-3 opacity-40" /><p>No certifications added yet.</p></div>}
              </div>
              {editingCert && (
                <Dialog open={!!editingCert} onOpenChange={open => { if (!open) setEditingCert(null); }}>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
                    <DialogHeader><DialogTitle>Edit Certification</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div><Label>Name</Label><Input value={editingCert.name} onChange={e => setEditingCert({ ...editingCert, name: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Issuer</Label><Input value={editingCert.issuer} onChange={e => setEditingCert({ ...editingCert, issuer: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>Year</Label><Input value={editingCert.year} onChange={e => setEditingCert({ ...editingCert, year: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                      <div><Label>URL</Label><Input value={editingCert.url} onChange={e => setEditingCert({ ...editingCert, url: e.target.value })} className="bg-slate-800 border-slate-700 mt-1" /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingCert(null)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                      <Button onClick={handleUpdateCert} className="bg-gradient-to-r from-cyan-500 to-blue-600">Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8"><h1 className="text-3xl font-bold mb-2">About Section</h1></div>
              <div className="max-w-2xl space-y-6">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader><CardTitle className="text-white text-base">Subtitle</CardTitle></CardHeader>
                  <CardContent><textarea value={aboutData.subtitle} onChange={e => setAboutData(prev => ({ ...prev, subtitle: e.target.value }))} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" /></CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader><CardTitle className="text-white text-base">Stats</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {[{ key: 'yearsExperience', label: 'Years Experience' }, { key: 'projectsDeployed', label: 'Projects Deployed' }, { key: 'uptimePct', label: 'Uptime %' }].map(({ key, label }) => (
                      <div key={key}><label className="block text-sm text-slate-400 mb-1">{label}</label><input type="text" value={aboutData.stats[key as keyof typeof aboutData.stats]} onChange={e => setAboutData(prev => ({ ...prev, stats: { ...prev.stats, [key]: e.target.value } }))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
                    ))}
                  </CardContent>
                </Card>
                <Button onClick={handleSaveAbout} className="bg-gradient-to-r from-cyan-500 to-blue-600 w-full"><Save className="w-4 h-4 mr-2" />Save About Section</Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && <div className="p-0"><MessagesInbox /></div>}

          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8"><h1 className="text-3xl font-bold mb-2">Analytics</h1><p className="text-slate-400">Portfolio performance</p></div>
              <div className="grid lg:grid-cols-3 gap-6">
                {[{ value: '12,429', label: 'Total Visitors', change: '+8%' }, { value: '3,847', label: 'Page Views', change: '+12%' }, { value: '4m 23s', label: 'Avg. Session', change: '+5%' }].map((s, i) => (
                  <Card key={i} className="bg-slate-900/50 border-slate-800"><CardHeader><CardTitle className="text-4xl text-white">{s.value}</CardTitle><CardDescription>{s.label}</CardDescription></CardHeader><CardContent><p className="text-green-400 text-sm">{s.change} this month</p></CardContent></Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8"><h1 className="text-3xl font-bold mb-2">Settings</h1></div>
              <div className="max-w-2xl space-y-6">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader><CardTitle className="text-white flex items-center gap-2"><Github className="w-5 h-5" />GitHub Sync</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Button onClick={handleSyncGitHub} disabled={syncState === 'syncing'} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white">
                        {syncState === 'syncing' ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Pushing…</> : syncState === 'success' ? <><CheckCircle className="w-4 h-4 mr-2 text-green-400" />Pushed!</> : <><Github className="w-4 h-4 mr-2" />Push to GitHub</>}
                      </Button>
                      {syncMessage && <p className={`text-sm ${syncState === 'success' ? 'text-green-400' : 'text-red-400'}`}>{syncMessage}</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader><CardTitle className="text-white">Profile Picture</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                        {profileSettings.profilePicUrl ? <img src={profileSettings.profilePicUrl} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-slate-500" />}
                      </div>
                      <div className="flex-1 space-y-3">
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                        <Button onClick={() => fileInputRef.current?.click()} disabled={uploadState === 'uploading'} className={uploadState === 'done' ? 'bg-green-600 w-full' : 'bg-gradient-to-r from-cyan-500 to-blue-600 w-full'}>
                          {uploadState === 'uploading' ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</> : uploadState === 'done' ? <><CheckCircle className="w-4 h-4 mr-2" />Updated!</> : <><Upload className="w-4 h-4 mr-2" />Upload Photo</>}
                        </Button>
                        {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader><CardTitle className="text-white">Profile Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label className="text-white">Full Name</Label><Input value={profileSettings.name} onChange={e => setProfileSettings({ ...profileSettings, name: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" /></div>
                      <div><Label className="text-white">Job Title</Label><Input value={profileSettings.title} onChange={e => setProfileSettings({ ...profileSettings, title: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" /></div>
                    </div>
                    <div><Label className="text-white">Email</Label><Input value={profileSettings.email} onChange={e => setProfileSettings({ ...profileSettings, email: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" /></div>
                    <div><Label className="text-white">University</Label><Input value={profileSettings.university} onChange={e => setProfileSettings({ ...profileSettings, university: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" /></div>
                    <div><Label className="text-white">Bio</Label><Textarea value={profileSettings.bio} onChange={e => setProfileSettings({ ...profileSettings, bio: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" rows={3} /></div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Social Links</CardTitle>
                      <Dialog open={isAddingSocial} onOpenChange={setIsAddingSocial}>
                        <DialogTrigger asChild><Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600"><Plus className="w-4 h-4 mr-1" />Add</Button></DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800 text-white">
                          <DialogHeader><DialogTitle>Add Social Link</DialogTitle></DialogHeader>
                          <div className="space-y-4 py-4">
                            <div><Label>Platform</Label>
                              <select value={newSocial.platform} onChange={e => { const p = SOCIAL_PLATFORMS.find(x => x.value === e.target.value); setNewSocial({ platform: e.target.value, label: p?.label ?? e.target.value, url: newSocial.url }); }} className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none">
                                {SOCIAL_PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                              </select>
                            </div>
                            <div><Label>URL</Label><Input value={newSocial.url} onChange={e => setNewSocial({ ...newSocial, url: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" /></div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddingSocial(false)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                            <Button onClick={handleAddSocial} className="bg-gradient-to-r from-cyan-500 to-blue-600">Add Link</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {socialLinks.map(link => {
                      const SocialIcon = getSocialIcon(link.platform);
                      return (
                        <div key={link.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                          <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center"><SocialIcon className="w-4 h-4 text-cyan-400" /></div>
                          <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white">{link.label}</p><p className="text-xs text-slate-400 truncate">{link.url}</p></div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-700 text-slate-400" onClick={() => setEditingSocial(link)}><Edit className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-red-400 text-slate-400" onClick={() => handleDeleteSocial(link.id)}><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </div>
                      );
                    })}
                    {socialLinks.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No social links yet.</p>}
                  </CardContent>
                </Card>

                {editingSocial && (
                  <Dialog open={!!editingSocial} onOpenChange={() => setEditingSocial(null)}>
                    <DialogContent className="bg-slate-900 border-slate-800 text-white">
                      <DialogHeader><DialogTitle>Edit Social Link</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div><Label>Platform</Label>
                          <select value={editingSocial.platform} onChange={e => { const p = SOCIAL_PLATFORMS.find(x => x.value === e.target.value); setEditingSocial({ ...editingSocial, platform: e.target.value, label: p?.label ?? e.target.value }); }} className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none">
                            {SOCIAL_PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                          </select>
                        </div>
                        <div><Label>URL</Label><Input value={editingSocial.url} onChange={e => setEditingSocial({ ...editingSocial, url: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" /></div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingSocial(null)} className="border-slate-700 text-white hover:bg-slate-800">Cancel</Button>
                        <Button onClick={handleUpdateSocial} className="bg-gradient-to-r from-cyan-500 to-blue-600">Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                <Button onClick={handleSaveSettings} className={`w-full ${settingsSaved ? 'bg-green-600' : 'bg-gradient-to-r from-cyan-500 to-blue-600'}`}>
                  <Save className="w-4 h-4 mr-2" />{settingsSaved ? 'Saved!' : 'Save Settings'}
                </Button>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
