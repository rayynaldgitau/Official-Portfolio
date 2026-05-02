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
  X
} from 'lucide-react';
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

const statsData = [
  { label: 'Total Projects', value: '24', change: '+3 this month', icon: Briefcase, color: 'cyan' },
  { label: 'Skills Listed', value: '18', change: '+2 this week', icon: Code, color: 'blue' },
  { label: 'Profile Views', value: '3,847', change: '+12% this week', icon: Eye, color: 'purple' },
  { label: 'Total Visitors', value: '12,429', change: '+8% this month', icon: Users, color: 'green' },
];

const recentActivity = [
  { action: 'Updated project', target: 'Cloud Infrastructure Automation', time: '2 hours ago' },
  { action: 'Added new skill', target: 'Prometheus', time: '5 hours ago' },
  { action: 'Published article', target: 'Kubernetes Best Practices', time: '1 day ago' },
  { action: 'Profile view spike', target: '+124 views', time: '2 days ago' },
];

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  tags: string[];
  views: number;
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: 'Cloud Infrastructure Automation',
    description: 'Automated AWS infrastructure deployment using Terraform',
    status: 'active',
    tags: ['Terraform', 'AWS', 'CI/CD'],
    views: 1247
  },
  {
    id: 2,
    title: 'Kubernetes Cluster Management',
    description: 'Production-grade K8s clusters with auto-scaling',
    status: 'completed',
    tags: ['Kubernetes', 'Docker'],
    views: 892
  },
  {
    id: 3,
    title: 'CI/CD Pipeline Optimization',
    description: 'Comprehensive CI/CD pipelines with Jenkins',
    status: 'active',
    tags: ['Jenkins', 'GitLab'],
    views: 634
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    tags: '',
  });

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      const project: Project = {
        id: projects.length + 1,
        title: newProject.title,
        description: newProject.description,
        status: 'active',
        tags: newProject.tags.split(',').map(t => t.trim()),
        views: 0
      };
      setProjects([...projects, project]);
      setNewProject({ title: '', description: '', tags: '' });
      setIsAddingProject(false);
    }
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <motion.aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}
        initial={false}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="font-bold text-sm">RG</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Raynald Gitau</p>
                  <p className="text-xs text-slate-400">Admin Dashboard</p>
                </div>
              </motion.div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-slate-800"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-400/30'
                    : 'hover:bg-slate-800 text-slate-400'
                }`}
                whileHover={{ x: 4 }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-slate-800 text-slate-400"
          >
            <LogOut className="w-5 h-5 mr-3" />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-slate-400">Welcome back, Raynald! Here's what's happening.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/30 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                          </div>
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-xs text-green-400">{stat.change}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest portfolio updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-800 last:border-0">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />
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

                {/* Quick Actions */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Manage your portfolio content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700" onClick={() => setActiveTab('projects')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Project
                    </Button>
                    <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700" onClick={() => setActiveTab('skills')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Skill
                    </Button>
                    <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700">
                      <Edit className="w-4 h-4 mr-2" />
                      Update Profile Info
                    </Button>
                    <Button className="w-full justify-start bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Projects</h1>
                  <p className="text-slate-400">Manage your portfolio projects</p>
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
                      <DialogDescription className="text-slate-400">
                        Create a new project for your portfolio
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="title">Project Title</Label>
                        <Input
                          id="title"
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          className="bg-slate-800 border-slate-700"
                          placeholder="Enter project title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          className="bg-slate-800 border-slate-700"
                          placeholder="Describe your project"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={newProject.tags}
                          onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                          className="bg-slate-800 border-slate-700"
                          placeholder="e.g., Docker, Kubernetes, AWS"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingProject(false)} className="border-slate-700">
                        Cancel
                      </Button>
                      <Button onClick={handleAddProject} className="bg-gradient-to-r from-cyan-500 to-blue-600">
                        Add Project
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-slate-900 border border-slate-800 mb-6">
                  <TabsTrigger value="all">All Projects</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/30 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{project.title}</h3>
                              <Badge
                                variant="outline"
                                className={
                                  project.status === 'active'
                                    ? 'border-green-400/30 text-green-400'
                                    : 'border-blue-400/30 text-blue-400'
                                }
                              >
                                {project.status}
                              </Badge>
                            </div>
                            <p className="text-slate-400 mb-4">{project.description}</p>
                            <div className="flex items-center gap-4">
                              <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="border-cyan-400/30 text-cyan-400">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-slate-500">
                                <Eye className="w-4 h-4" />
                                {project.views} views
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="hover:bg-slate-800">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-500/20 hover:text-red-400"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="active" className="space-y-4">
                  {projects.filter(p => p.status === 'active').map((project) => (
                    <Card key={project.id} className="bg-slate-900/50 border-slate-800">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-slate-400">{project.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  {projects.filter(p => p.status === 'completed').map((project) => (
                    <Card key={project.id} className="bg-slate-900/50 border-slate-800">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-slate-400">{project.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Skills</h1>
                  <p className="text-slate-400">Manage your technical skills</p>
                </div>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'PostgreSQL', 'Python', 'Ansible'].map((skill, idx) => (
                  <Card key={idx} className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/30 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                            <Code className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{skill}</h3>
                            <p className="text-xs text-slate-400">Expert</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-red-400">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Analytics</h1>
                <p className="text-slate-400">Track your portfolio performance</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-4xl">12,429</CardTitle>
                    <CardDescription>Total Visitors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-400 text-sm">+8% from last month</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-4xl">3,847</CardTitle>
                    <CardDescription>Page Views</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-400 text-sm">+12% from last week</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-4xl">2:34</CardTitle>
                    <CardDescription>Avg. Session Duration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-400 text-sm">+15% from last week</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle>Traffic Overview</CardTitle>
                  <CardDescription>Portfolio traffic over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[120, 280, 350, 420, 380, 450, 520, 480, 550, 610, 580, 640].map((height, idx) => (
                      <motion.div
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t-lg"
                        initial={{ height: 0 }}
                        animate={{ height: `${(height / 640) * 100}%` }}
                        transition={{ delay: idx * 0.1 }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-slate-400">Manage your portfolio settings</p>
              </div>

              <div className="space-y-6 max-w-2xl">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input defaultValue="Raynald Gitau" className="bg-slate-800 border-slate-700" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input defaultValue="raynald.gitau@example.com" className="bg-slate-800 border-slate-700" />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        defaultValue="United States International University Africa"
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <Textarea
                        defaultValue="DevOps engineer passionate about cloud infrastructure and automation"
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">Save Changes</Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                    <CardDescription>Update your social media profiles</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>GitHub</Label>
                      <Input placeholder="https://github.com/username" className="bg-slate-800 border-slate-700" />
                    </div>
                    <div>
                      <Label>LinkedIn</Label>
                      <Input placeholder="https://linkedin.com/in/username" className="bg-slate-800 border-slate-700" />
                    </div>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">Save Changes</Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
