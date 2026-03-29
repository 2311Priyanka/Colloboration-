import { TimetableGrid } from '@/components/TimetableGrid';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TimetablePage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Timetable Manager</h1>
          <p className="text-sm text-muted-foreground">AI-optimized weekly schedule · Version 3</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button
            size="sm"
            className="gradient-secondary text-secondary-foreground border-0"
            onClick={() => toast({ title: '🤖 AI Optimizer Running', description: 'Regenerating timetable with latest constraints...' })}
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Regenerate
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl p-5 shadow-sm">
        <TimetableGrid />
      </div>

      <div className="bg-card rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-3">AI Constraints Applied</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          {[
            'No staff conflict (double-booking)',
            'Cooldown: 1hr after 2+ continuous hrs',
            'Labs only 8:30 AM – 4:30 PM',
            'Break protection (tea + lunch)',
            'Room capacity ≥ student count',
            'Max 20 hrs/week per staff',
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted">
              <span className="text-success">✓</span>
              <span className="text-foreground">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
