import { useState } from "react";
import { useGetSubjects, useCreateSubject, useDeleteSubject, CreateSubjectRequestType } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Subjects() {
  const { data: subjects, isLoading, refetch } = useGetSubjects();
  const { toast } = useToast();
  
  const createSub = useCreateSubject({
    mutation: {
      onSuccess: () => {
        toast({ title: "Subject created" });
        refetch();
        setIsAdding(false);
        setForm({ name: '', code: '', type: 'THEORY', credits: 3 });
      }
    }
  });

  const deleteSub = useDeleteSubject({
    mutation: {
      onSuccess: () => {
        toast({ title: "Subject deleted" });
        refetch();
      }
    }
  });

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    name: '', code: '', type: 'THEORY' as CreateSubjectRequestType, credits: 3
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSub.mutate({ data: { ...form, credits: Number(form.credits) } });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">My Subjects</h1>
          <p className="text-muted-foreground mt-1">Manage courses you teach</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"}>
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add Subject</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-2 md:col-span-2">
                <Label>Subject Name</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Data Structures" />
              </div>
              <div className="space-y-2">
                <Label>Course Code</Label>
                <Input value={form.code} onChange={e => setForm({...form, code: e.target.value})} required placeholder="CS201" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <select 
                  className="flex h-11 w-full rounded-xl border-2 border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none"
                  value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}
                >
                  <option value="THEORY">Theory</option>
                  <option value="LAB">Lab</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Credits</Label>
                <Input type="number" min="1" max="6" value={form.credits} onChange={e => setForm({...form, credits: Number(e.target.value)})} required />
              </div>
              <div className="md:col-span-5 flex justify-end mt-2">
                <Button type="submit" disabled={createSub.isPending}>
                  {createSub.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Subject"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : subjects?.length === 0 ? (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground">No subjects yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">Add your first subject to get started.</p>
            <Button onClick={() => setIsAdding(true)}>Add Subject</Button>
          </div>
        ) : (
          subjects?.map(sub => (
            <Card key={sub.id} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-6 relative">
                <button 
                  onClick={() => { if(confirm('Delete this subject?')) deleteSub.mutate({id: sub.id}) }}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Badge variant={sub.type === 'LAB' ? 'warning' : 'secondary'} className="mb-3">{sub.type}</Badge>
                <h3 className="font-bold text-xl mb-1 truncate pr-6">{sub.name}</h3>
                <p className="text-muted-foreground text-sm font-mono">{sub.code} • {sub.credits} Credits</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
