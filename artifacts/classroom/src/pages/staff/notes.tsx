import { useState } from "react";
import { useGetClasses, useGetNotes, useCreateNote } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function StaffNotes() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const { data: classes, isLoading: loadingClasses } = useGetClasses();
  
  // Only fetch notes if a class is selected
  const { data: notes, isLoading: loadingNotes, refetch } = useGetNotes(selectedClass, {
    query: { enabled: !!selectedClass }
  });

  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const createNoteMut = useCreateNote({
    mutation: {
      onSuccess: () => {
        toast({ title: "Note published" });
        setContent("");
        setIsAdding(false);
        refetch();
      }
    }
  });

  const handleCreate = () => {
    if(!content.trim()) return;
    createNoteMut.mutate({ classId: selectedClass, data: { content } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Class Notes & Announcements</h1>
          <p className="text-muted-foreground mt-1">Share resources and updates with your classes</p>
        </div>
        
        <div className="w-full md:w-64">
          <Label className="sr-only">Select Class</Label>
          <select 
            className="flex h-11 w-full rounded-xl border-2 border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none"
            value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
          >
            <option value="">-- Select a Class --</option>
            {classes?.map(c => <option key={c.id} value={c.id}>{c.name} ({c.department})</option>)}
          </select>
        </div>
      </div>

      {!selectedClass ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <FileText className="w-12 h-12 opacity-20 mb-4" />
            <p>Select a class from the dropdown to view or post notes.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"}>
               {isAdding ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> New Post</>}
            </Button>
          </div>

          {isAdding && (
            <Card className="border-primary/30 shadow-lg shadow-primary/5">
              <CardContent className="p-6 space-y-4">
                <textarea 
                  className="w-full min-h-[120px] p-4 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 resize-y"
                  placeholder="Write your announcement or paste resource links here..."
                  value={content} onChange={e => setContent(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button onClick={handleCreate} disabled={createNoteMut.isPending || !content.trim()}>
                    {createNoteMut.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : "Publish Post"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {loadingNotes ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : notes?.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground border rounded-xl bg-card">No notes posted yet.</div>
            ) : (
              notes?.map(note => (
                <Card key={note.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground">
                          {note.staffName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground leading-tight">{note.staffName}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(note.createdAt), 'MMM d, yyyy • h:mm a')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap text-foreground/90">{note.content}</div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
