import { useState } from "react";
import { MessageSquare, Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function FeedbackPage() {
  const { user } = useAuth();
  const [stress, setStress] = useState(5);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("feedback").insert({
      staff_id: user?.id,
      stress_level: stress,
      rating,
      feedback_text: text,
      feedback_type: "staff",
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Feedback submitted!");
      setText("");
      setRating(0);
      setStress(5);
    }
    setLoading(false);
  };

  const stressLabel = stress <= 3 ? "Low" : stress <= 6 ? "Moderate" : stress <= 8 ? "High" : "Critical";
  const stressColor = stress <= 3 ? "text-success" : stress <= 6 ? "text-primary" : stress <= 8 ? "text-warning" : "text-destructive";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold heading-display gradient-text">Feedback</h1>
        <p className="text-sm text-muted-foreground mt-1">Share your stress level and feedback.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stress */}
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold mb-6 heading-display">Stress Level</h3>
          <div className="text-center mb-6">
            <span className={`text-6xl font-bold heading-display ${stressColor}`}>{stress}</span>
            <span className="text-xl text-muted-foreground">/10</span>
            <p className={`mt-2 text-sm font-medium ${stressColor}`}>{stressLabel}</p>
          </div>
          <Slider value={[stress]} onValueChange={([v]) => setStress(v)} min={1} max={10} step={1} />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
            <span>Relaxed</span>
            <span>Overwhelmed</span>
          </div>
        </div>

        {/* Rating */}
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold mb-6 heading-display">Student Rating</h3>
          <div className="flex justify-center gap-3 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-125 active:scale-95"
              >
                <Star
                  className={`h-10 w-10 transition-colors ${
                    s <= (hoverRating || rating) ? "fill-warning text-warning" : "text-muted"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Rated <span className="font-bold text-foreground">{rating}/5</span>
            </p>
          )}
        </div>
      </div>

      {/* Text Feedback */}
      <div className="glass-card p-6 max-w-2xl">
        <h3 className="text-base font-semibold mb-4 heading-display flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" /> Comments
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts on workload, schedule, or any concerns..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="glass"
          />
          <Button type="submit" disabled={loading} className="gradient-primary text-primary-foreground">
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </div>
    </div>
  );
}
