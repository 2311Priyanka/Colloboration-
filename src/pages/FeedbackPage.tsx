import { feedbackData, staffMembers } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { Star, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function FeedbackPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Feedback Analysis</h1>
        <p className="text-sm text-muted-foreground">NLP-powered student feedback insights</p>
      </div>

      {/* Feedback entries */}
      <div className="space-y-3">
        {feedbackData.map((fb, i) => {
          const sentimentLevel = fb.sentiment > 0.7 ? 'success' : fb.sentiment > 0.4 ? 'warning' : 'danger';
          return (
            <motion.div
              key={fb.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl p-5 shadow-sm border border-border"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-foreground">{fb.staffName}</p>
                    <span className="text-xs text-muted-foreground">· Section {fb.classSection}</span>
                  </div>
                  <p className="text-sm text-foreground/80 mb-3">"{fb.comment}"</p>
                  <div className="flex flex-wrap gap-1.5">
                    {fb.topics.map(t => (
                      <span key={t} className="badge-info text-[10px]">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} className={`h-3.5 w-3.5 ${si < Math.round(fb.rating) ? 'text-warning fill-warning' : 'text-muted'}`} />
                    ))}
                  </div>
                  <span className={`badge-${sentimentLevel} text-[10px]`}>
                    {sentimentLevel === 'danger' && <AlertTriangle className="h-3 w-3 mr-1 inline" />}
                    Sentiment: {(fb.sentiment * 100).toFixed(0)}%
                  </span>
                  <p className="text-[10px] text-muted-foreground">{fb.date}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Low sentiment alert */}
      {feedbackData.filter(f => f.sentiment < 0.4).length > 0 && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <p className="font-semibold text-sm text-foreground">Low Satisfaction Alert</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {feedbackData.filter(f => f.sentiment < 0.4).length} staff member(s) have sentiment scores below 40%.
            Consider workload redistribution and support measures.
          </p>
        </div>
      )}
    </div>
  );
}
