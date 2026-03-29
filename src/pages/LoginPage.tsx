import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClassSyncLogo } from '@/components/ClassSyncLogo';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserRole } from '@/lib/mock-data';
import { GraduationCap, UserCog, Users } from 'lucide-react';

const roles: { value: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'hod', label: 'HOD', icon: UserCog, desc: 'Head of Department' },
  { value: 'staff', label: 'Faculty', icon: Users, desc: 'Teaching Staff' },
  { value: 'student', label: 'Student', icon: GraduationCap, desc: 'Student Portal' },
];

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>('hod');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - hero */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center text-white"
        >
          <ClassSyncLogo size="lg" showText={false} />
          <h1 className="text-4xl font-bold mt-8">ClassSync AI</h1>
          <p className="text-lg mt-3 opacity-80 max-w-md">
            AI-powered classroom management with 100% occupancy guarantee, smart scheduling, and real-time analytics.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {['AI Timetabling', 'Burnout Detection', 'NLP Feedback', 'QR Attendance'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur-sm border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="lg:hidden flex justify-center">
            <ClassSyncLogo size="lg" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your ClassSync AI account</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2">
            {roles.map(r => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  role === r.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <r.icon className={`h-5 w-5 mx-auto ${role === r.value ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className={`text-xs font-semibold mt-1.5 ${role === r.value ? 'text-primary' : 'text-foreground'}`}>{r.label}</p>
                <p className="text-[10px] text-muted-foreground">{r.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={`${role}@college.edu`}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0 hover:opacity-90">
              Sign In as {roles.find(r => r.value === role)?.label}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Demo mode: Click Sign In with any credentials
          </p>
        </motion.div>
      </div>
    </div>
  );
}
