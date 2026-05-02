import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const skills = [
  { name: 'Docker', icon: Container, level: 95, category: 'containerization' },
  { name: 'Kubernetes', icon: Server, level: 90, category: 'orchestration' },
  { name: 'AWS', icon: Cloud, level: 92, category: 'cloud' },
  { name: 'Jenkins', icon: GitBranch, level: 88, category: 'ci-cd' },
  { name: 'Terraform', icon: Code, level: 85, category: 'iac' },
  { name: 'PostgreSQL', icon: Database, level: 87, category: 'database' },
  { name: 'Python', icon: Terminal, level: 90, category: 'programming' },
  { name: 'Ansible', icon: Server, level: 83, category: 'automation' },
];

const projects = [
  {
    id: 1,
    title: 'Cloud Infrastructure Automation',
    description: 'Automated AWS infrastructure deployment using Terraform and GitHub Actions, reducing deployment time by 70%.',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=80',
    tags: ['Terraform', 'AWS', 'CI/CD'],
    metrics: { deployments: '500+', uptime: '99.9%' },
    github: '#',
    live: '#'
  },
  {
    id: 2,
    title: 'Kubernetes Cluster Management',
    description: 'Designed and maintained production-grade K8s clusters serving 10M+ requests daily with auto-scaling capabilities.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    tags: ['Kubernetes', 'Docker', 'Monitoring'],
    metrics: { pods: '200+', nodes: '15' },
    github: '#',
    live: '#'
  },
  {
    id: 3,
    title: 'CI/CD Pipeline Optimization',
    description: 'Engineered comprehensive CI/CD pipelines with Jenkins and GitLab, achieving 50% faster build times.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    tags: ['Jenkins', 'GitLab', 'Python'],
    metrics: { builds: '1000+/month', success: '98%' },
    github: '#',
    live: '#'
  },
  {
    id: 4,
    title: 'Monitoring & Observability Stack',
    description: 'Implemented comprehensive monitoring with Prometheus, Grafana, and ELK stack for real-time insights.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    tags: ['Prometheus', 'Grafana', 'ELK'],
    metrics: { metrics: '5000+', alerts: '50+' },
    github: '#',
    live: '#'
  }
];

const experience = [
  {
    role: 'DevOps Engineer',
    company: 'Tech Solutions Inc.',
    period: '2024 - Present',
    description: 'Leading cloud infrastructure initiatives and automation projects.',
    achievements: [
      'Reduced infrastructure costs by 35% through optimization',
      'Implemented GitOps practices across 20+ microservices',
      'Led migration of monolith to microservices architecture'
    ]
  },
  {
    role: 'Junior DevOps Engineer',
    company: 'Cloud Innovations Ltd.',
    period: '2022 - 2024',
    description: 'Managed containerization and deployment pipelines.',
    achievements: [
      'Migrated 15 legacy applications to containerized environments',
      'Achieved 99.95% uptime for critical production systems',
      'Automated routine ops tasks saving 10+ hours per week'
    ]
  }
];

const certifications = [
  { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2024' },
  { name: 'Certified Kubernetes Administrator', issuer: 'CNCF', year: '2023' },
  { name: 'HashiCorp Terraform Associate', issuer: 'HashiCorp', year: '2023' },
];

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-slate-950/90 backdrop-blur-lg border-b border-slate-800' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
              onClick={() => alert('Resume download would be available here.')}
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

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
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
                DevOps Engineer
              </Badge>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              Raynald Gitau
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto">
              Building resilient infrastructure and automating the future
            </p>

            <div className="flex items-center justify-center gap-2 text-slate-400 mb-8">
              <GraduationCap className="w-5 h-5" />
              <p className="text-sm">United States International University Africa</p>
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

            <div className="flex items-center justify-center gap-6">
              {[
                { icon: Github, href: 'https://github.com', label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Mail, href: 'mailto:raynald.gitau@example.com', label: 'Email' }
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 transition-all"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-cyan-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              About <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Me</span>
            </h2>
            <p className="text-xl text-slate-300 text-center mb-16 max-w-3xl mx-auto">
              Passionate DevOps engineer focused on building scalable infrastructure and streamlining deployment processes
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: Server,
                  title: 'Infrastructure Expert',
                  description: 'Designing and managing cloud infrastructure at scale with AWS, Azure, and GCP'
                },
                {
                  icon: GitBranch,
                  title: 'CI/CD Specialist',
                  description: 'Building automated pipelines that enable rapid, reliable software delivery'
                },
                {
                  icon: Code,
                  title: 'Automation Advocate',
                  description: 'Creating infrastructure as code solutions that eliminate manual processes'
                }
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
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-lg px-5 py-3"
                  >
                    <Award className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">{cert.name}</p>
                      <p className="text-xs text-slate-400">{cert.issuer} · {cert.year}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 bg-slate-950/50 relative">
        <div className="max-w-7xl mx-auto px-6">
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
              {skills.map((skill, idx) => (
                <motion.div
                  key={idx}
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
                          <skill.icon className="w-5 h-5 text-cyan-400" />
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
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
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
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-400/50 transition-all overflow-hidden group h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={project.github}
                          className="w-8 h-8 rounded-full bg-slate-900/80 flex items-center justify-center hover:bg-slate-800"
                        >
                          <Github className="w-4 h-4 text-white" />
                        </a>
                        <a
                          href={project.live}
                          className="w-8 h-8 rounded-full bg-slate-900/80 flex items-center justify-center hover:bg-slate-800"
                        >
                          <ExternalLink className="w-4 h-4 text-cyan-400" />
                        </a>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl text-white flex items-center justify-between">
                        {project.title}
                        <ExternalLink className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <CardDescription className="text-slate-400">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="border-cyan-400/30 text-cyan-400 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                        {Object.entries(project.metrics).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-2xl font-bold text-cyan-400">{value}</p>
                            <p className="text-xs text-slate-500 uppercase">{key}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 bg-slate-950/50 relative">
        <div className="max-w-4xl mx-auto px-6">
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
                  key={idx}
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
                        </div>
                        <Badge variant="outline" className="border-slate-700 text-slate-300">
                          {exp.period}
                        </Badge>
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
      <section id="contact" className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Let's <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Connect</span>
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              I'm always interested in discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
              {[
                { icon: Mail, label: 'Email', value: 'raynald.gitau@example.com', href: 'mailto:raynald.gitau@example.com' },
                { icon: Github, label: 'GitHub', value: 'github.com/raynald', href: 'https://github.com' },
                { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/raynald', href: 'https://linkedin.com' },
              ].map((contact, idx) => (
                <motion.a
                  key={idx}
                  href={contact.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center gap-3 p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-400/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                    <contact.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{contact.label}</p>
                    <p className="text-xs text-slate-400 mt-1 break-all">{contact.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              onClick={() => window.location.href = 'mailto:raynald.gitau@example.com'}
            >
              <Mail className="w-5 h-5 mr-2" />
              Send me a message
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">Raynald Gitau</span>
          </div>
          <p className="text-sm text-center">
            Built with React, Tailwind CSS, and Motion — © 2026
          </p>
          <div className="flex items-center gap-4">
            {[Github, Linkedin, Mail].map((Icon, i) => (
              <a key={i} href="#" className="hover:text-cyan-400 transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
