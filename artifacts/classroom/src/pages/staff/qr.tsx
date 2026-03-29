import { useState, useEffect } from "react";
import { useGetStaffTimetable, useGenerateQR } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

export default function QRGenerator() {
  const { data: timetable, isLoading } = useGetStaffTimetable();
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [qrData, setQrData] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const generateMut = useGenerateQR({
    mutation: {
      onSuccess: (data) => {
        setQrData(data.qrData); // Assuming API returns the actual string to encode in QR, usually the token
        setTimeLeft(120); // 2 minutes
        toast({ title: "QR Generated successfully" });
      }
    }
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      setQrData(null);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleGenerate = () => {
    if (!selectedSlot) return toast({ variant: "destructive", title: "Select a class first" });
    const slot = timetable?.find(s => s.id === selectedSlot);
    if (!slot) return;
    
    generateMut.mutate({
      data: { classId: slot.classId, slotId: slot.id, expiresInSeconds: 120 }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Attendance Scanner</h1>
        <p className="text-muted-foreground mt-1">Generate a time-limited QR code for your current class</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-8">
          {!qrData ? (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                <QrCode className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="space-y-2 text-left">
                <Label>Select Class Session</Label>
                <select 
                  className="flex h-11 w-full rounded-xl border-2 border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none"
                  value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)}
                >
                  <option value="">-- Choose a scheduled class --</option>
                  {timetable?.map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {slot.day} {slot.startTime} - {slot.className} ({slot.subjectName})
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleGenerate} disabled={generateMut.isPending || isLoading} className="w-full h-12 text-lg">
                {generateMut.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Generate QR Code
              </Button>
            </div>
          ) : (
            <div className="space-y-6 flex flex-col items-center">
              <div className="p-4 bg-white rounded-xl shadow-inner border border-gray-100 inline-block">
                <QRCodeSVG value={qrData} size={256} level="H" includeMargin />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold font-mono tracking-widest text-primary">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Students must scan before timer expires</p>
              </div>
              
              <Button variant="outline" onClick={() => setQrData(null)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
