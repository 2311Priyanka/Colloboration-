import { notifications } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Calendar, MessageSquare, Heart, UserCheck } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  swap: Calendar,
  absence: AlertTriangle,
  feedback: MessageSquare,
  burnout: Heart,
  occupancy: UserCheck,
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <p className="text-sm text-muted-foreground">Stay updated on all changes</p>
      </div>

      <div className="space-y-2">
        {notifications.map((n, i) => {
          const Icon = iconMap[n.type] || Bell;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-card rounded-xl p-4 shadow-sm border flex items-start gap-3 ${!n.read ? 'border-primary/30 bg-primary/5' : 'border-border'}`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${!n.read ? 'bg-primary/10' : 'bg-muted'}`}>
                <Icon className={`h-4 w-4 ${!n.read ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
