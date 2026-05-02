import { useState } from 'react';
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

const initialProjects: Project[] = [
  { id: 1, title: 'Cloud Infrastructure Automation', description: 'Automated AWS infrastructure deployment using Terraform', status: 'active', tags: ['Terraform', 'AWS', 'CI/CD'], views: 1247 },
  { id: 2, title: 'Kubernetes Cluster Management', description: 'Production-grade K8s clusters with auto-scaling', status: 'completed', tags: ['Kubernetes', 'Docker'], views: 892 },
  { id: 3, title: 'CI/CD Pipeline Optimization', description: 'Comprehensive CI/CD pipelines with Jenkins', status: 'active', tags: ['Jenkins', 'GitLab'], views: 634 },
  { id: 4, title: 'Monitoring & Observability Stack', description: 'Prometheus, Grafana, and ELK stack for real-time insights', status: 'active', tags: ['Prometheus', 'Grafana', 'ELK'], views: 521 },
];

const initialSkills: Skill[] = [
  { id: 1, name: 'Docker', level: 95, category: 'Containerization' },
  { id: 2, name: 'Kubernetes', level: 90, category: 'Orchestration' },
  { id: 3, name: 'AWS', level: 92, category: 'Cloud' },
  { id: 4, name: 'Jenkins', level: 88, category: 'CI/CD' },
  { id: 5, name: 'Terraform', level: 85, category: 'IaC' },
  { id: 6, name: 'PostgreSQL', level: 87, category: 'Database' },
  { id: 7, name: 'Python', level: 90, category: 'Programming' },
  { id: 8, name: 'Ansible', level: 83, category: 'Automation' },
];

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
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [newProject, setNewProject] = useState({ title: '', description: '', tags: '' });
  const [newSkill, setNewSkill] = useState({ name: '', level: '80', category: '' });

  const [profileSettings, setProfileSettings] = useState({
    name: 'Raynald Gitau',
    email: 'raynald.gitau@example.com',
    title: 'DevOps Engineer',
    bio: 'Building resilient infrastructure and automating the future.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

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
    { id: 'messages', label: 'Messages', icon: Inbox },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <motion.aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col fixed left-0 top-0 bottom-0 z-40`}
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
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-slate-800 text-slate-400 ml-auto">
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-400/30'
                    : 'hover:bg-slate-800 text-slate-400'
                }`}
                whileHover={{ x: sidebarOpen ? 4 : 0 }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
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
            {sidebarOpen && <span className="ml-3 text-sm">Back to Portfolio</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8">

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
                      <Label className="text-white">Bio</Label>
                      <Textarea value={profileSettings.bio} onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" rows={3} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Social Links</CardTitle>
                    <CardDescription>Update your social media profiles</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-white">GitHub URL</Label>
                      <Input value={profileSettings.github} onChange={(e) => setProfileSettings({ ...profileSettings, github: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" placeholder="https://github.com/username" />
                    </div>
                    <div>
                      <Label className="text-white">LinkedIn URL</Label>
                      <Input value={profileSettings.linkedin} onChange={(e) => setProfileSettings({ ...profileSettings, linkedin: e.target.value })} className="bg-slate-800 border-slate-700 mt-1 text-white" placeholder="https://linkedin.com/in/username" />
                    </div>
                  </CardContent>
                </Card>

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
