import { useState } from "react";
import { QrCode, Plus, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function FeedbackFormsPage() {
  const [forms, setForms] = useState([
    { id: "1", title: "CS201 – Data Structures Feedback", subject: "Data Structures", staff: "Dr. Kumar", created: "Mar 15" },
    { id: "2", title: "CS301 – AI Lab Feedback", subject: "AI Lab", staff: "Prof. Sharma", created: "Mar 16" },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const createForm = () => {
    if (!newTitle.trim()) return;
    const id = Date.now().toString();
    setForms(prev => [...prev, { id, title: newTitle, subject: "", staff: "", created: new Date().toLocaleDateString([], { month: "short", day: "numeric" }) }]);
    toast.success("Feedback form created! QR code generated.");
    setNewTitle("");
    setShowCreate(false);
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/student-feedback/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Feedback link copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold heading-display gradient-text">Feedback Forms</h1>
          <p className="text-sm text-muted-foreground mt-1">Create feedback forms with QR codes for students.</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} className="gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> Create Form
        </Button>
      </div>

      {showCreate && (
        <div className="glass-card p-6 slide-up max-w-lg">
          <h3 className="text-base font-semibold mb-4 heading-display">New Feedback Form</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Form Title</Label>
              <Input placeholder="e.g., CS201 Mid-Sem Feedback" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="glass" />
            </div>
            <div className="flex gap-3">
              <Button onClick={createForm} className="gradient-primary text-primary-foreground">Create & Generate QR</Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <div key={form.id} className="glass-card-hover p-5 swipe-card">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{form.title}</p>
                <p className="text-xs text-muted-foreground mt-1">Created {form.created}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyLink(form.id)}
                className="flex-1 text-xs"
              >
                {copiedId === form.id ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {copiedId === form.id ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
