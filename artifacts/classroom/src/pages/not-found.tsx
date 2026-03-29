import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
      <h1 className="text-8xl font-display font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The page you are looking for doesn't exist or you don't have permission to access it.
      </p>
      <Link href="/">
        <Button size="lg">Return to Dashboard</Button>
      </Link>
    </div>
  );
}
