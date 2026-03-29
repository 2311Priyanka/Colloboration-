import { useState, useRef, useEffect, useCallback } from "react";
import { useScanQR } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ScanLine, CheckCircle2, Camera, CameraOff } from "lucide-react";

export default function StudentScan() {
  const { toast } = useToast();
  const [manualToken, setManualToken] = useState("");
  const [scanSuccess, setScanSuccess] = useState<any>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const scanMut = useScanQR({
    mutation: {
      onSuccess: (data) => {
        setScanSuccess(data);
        stopCamera();
        toast({ title: "Attendance Marked!", description: data.message });
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Scan Failed", description: err?.message || "Invalid or expired QR code" });
      }
    }
  });

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = async () => {
    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      setCameraError("Camera access denied. Please use the manual token entry below.");
    }
  };

  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualToken.trim()) {
      scanMut.mutate({ data: { qrToken: manualToken.trim() } });
    }
  };

  if (scanSuccess) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center space-y-6 p-6">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Attendance Recorded!</h2>
          <p className="text-muted-foreground mt-2">{scanSuccess.message}</p>
          {scanSuccess.className && (
            <p className="text-sm text-muted-foreground mt-1">
              {scanSuccess.subject && <span>{scanSuccess.subject} • </span>}
              <span>{scanSuccess.className}</span>
            </p>
          )}
        </div>
        <Button size="lg" className="w-full" onClick={() => setScanSuccess(null)}>
          Scan Another
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pt-6 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Scan QR Code</h1>
        <p className="text-muted-foreground mt-1">Point your camera at the QR code displayed by your lecturer</p>
      </div>

      <Card className="overflow-hidden border-2 border-primary/20">
        <CardContent className="p-0">
          {cameraActive ? (
            <div className="relative bg-black aspect-square">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-56 relative">
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-sm" />
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-sm" />
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-sm" />
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-sm" />
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/60 animate-pulse" />
                </div>
              </div>
              {scanMut.isPending && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-muted/50 flex flex-col items-center justify-center gap-4 p-8">
              {cameraError ? (
                <>
                  <CameraOff className="w-12 h-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">{cameraError}</p>
                </>
              ) : (
                <>
                  <Camera className="w-16 h-16 text-muted-foreground" />
                  <p className="text-muted-foreground text-center">Click below to activate camera</p>
                </>
              )}
              <Button onClick={startCamera} variant="outline" className="gap-2">
                <Camera className="w-4 h-4" />
                Start Camera
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {cameraActive && (
        <Button variant="outline" onClick={stopCamera} className="w-full gap-2">
          <CameraOff className="w-4 h-4" />
          Stop Camera
        </Button>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-muted-foreground uppercase tracking-wider">Or enter code manually</span>
        </div>
      </div>

      <form onSubmit={handleManualSubmit} className="flex gap-3">
        <Input
          placeholder="Paste QR token here..."
          value={manualToken}
          onChange={e => setManualToken(e.target.value)}
          className="font-mono text-sm"
        />
        <Button type="submit" disabled={scanMut.isPending || !manualToken.trim()}>
          {scanMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
        </Button>
      </form>

      <p className="text-xs text-center text-muted-foreground">
        Your lecturer will display a QR code. Scan it or copy the token they share.
      </p>
    </div>
  );
}
