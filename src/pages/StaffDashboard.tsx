import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimetableGrid } from '@/components/TimetableGrid';
import { StatCard } from '@/components/StatCard';
import { Calendar, BookOpen, Users, Clock, QrCode, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function StaffDashboard() {
  const [showQR, setShowQR] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const { toast } = useToast();

  const handleStartClass = () => {
    setShowQR(true);
    toast({ title: '✅ Class started', description: 'QR code generated. Students can scan now.' });
  };

  const handleEndClass = () => {
    setShowQR(false);
    setShowFeedback(true);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFeedback(false);
    setCooldown(true);
    toast({ title: '📝 Post-class feedback submitted', description: 'Session recorded successfully.' });
    setTimeout(() => setCooldown(false), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Schedule</h1>
          <p className="text-sm text-muted-foreground">Dr. Ananya Sharma · CSE Department</p>
        </div>
        <div className="flex gap-2">
          {!showQR ? (
            <Button onClick={handleStartClass} className="gradient-secondary text-secondary-foreground border-0">
              <QrCode className="h-4 w-4 mr-2" />
              Start Class
            </Button>
          ) : (
            <Button onClick={handleEndClass} variant="destructive">
              End Class
            </Button>
          )}
        </div>
      </div>

      {/* Cooldown banner */}
      {cooldown && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-accent/10 border border-accent/30 flex items-center gap-3"
        >
          <span className="text-lg">🔥</span>
          <div>
            <p className="text-sm font-semibold text-foreground">Cooldown Period Active</p>
            <p className="text-xs text-muted-foreground">After 2+ continuous hours — rest for 1 hour. No new classes will be assigned.</p>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Classes" value={4} icon={Calendar} variant="primary" />
        <StatCard title="Subjects" value={2} icon={BookOpen} />
        <StatCard title="Students" value={118} icon={Users} variant="secondary" />
        <StatCard title="Hours This Week" value="18" icon={Clock} subtitle="of 20 max" />
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card rounded-xl p-6 shadow-lg border border-border text-center"
          >
            <h3 className="font-semibold text-foreground mb-2">📱 Scan to Mark Attendance</h3>
            <p className="text-xs text-muted-foreground mb-4">Data Structures · 2A · Room 101</p>
            {/* Mock QR code */}
            <div className="mx-auto w-48 h-48 bg-foreground rounded-xl flex items-center justify-center animate-pulse-glow">
              <div className="w-40 h-40 bg-background rounded-lg grid grid-cols-5 grid-rows-5 gap-1 p-2">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-foreground' : 'bg-background'}`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">⏱ Expires in 2:00 minutes</p>
            <p className="text-xs text-muted-foreground">Scanned: 42/60 students</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post-Class Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
          >
            <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-lg">📋 Post-Class Feedback</h3>
                <span className="badge-danger text-[10px]">MANDATORY</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Data Structures · 2A · Mon 8:30 AM</p>
              
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Did all students attend?</label>
                  <div className="flex gap-2 mt-1.5">
                    <Button type="button" variant="outline" size="sm" className="flex-1">Yes</Button>
                    <Button type="button" variant="outline" size="sm" className="flex-1">No</Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Was the class fully occupied? *</label>
                  <div className="flex gap-2 mt-1.5">
                    <Button type="button" variant="outline" size="sm" className="flex-1 border-success text-success">Yes</Button>
                    <Button type="button" variant="outline" size="sm" className="flex-1">No</Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Attendance Count</label>
                  <input
                    type="number"
                    defaultValue={42}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Class Notes (optional)</label>
                  <textarea
                    placeholder="What was covered today?"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm h-20 resize-none"
                  />
                </div>

                <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit & End Session
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timetable */}
      <div className="bg-card rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Timetable</h3>
        <TimetableGrid />
      </div>
    </div>
  );
}
