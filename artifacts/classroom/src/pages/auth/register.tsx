import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRegister, UserRole, RegisterRequestRole } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const YEARS = [1, 2, 3, 4];
const SECTIONS = ["A", "B", "C", "D", "E"];

export default function Register() {
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "STUDENT" as RegisterRequestRole,
    designation: "",
    year: "" as string,
    section: "" as string,
  });

  const registerMutation = useRegister({
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.user);
        toast({ title: "Account created!", description: "Welcome to SmartClass." });
      },
      onError: (error: any) => {
        toast({ 
          variant: "destructive", 
          title: "Registration Failed", 
          description: error?.response?.data?.message || "An error occurred" 
        });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      department: formData.department,
      role: formData.role,
    };
    if (formData.designation) payload.designation = formData.designation;
    if (formData.year) payload.year = Number(formData.year);
    if (formData.section) payload.section = formData.section;
    registerMutation.mutate({ data: payload });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const isStudent = formData.role === "STUDENT";
  const isStaff = formData.role === "STAFF" || formData.role === "HOD";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-12">
      <div 
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/auth-bg.png)` }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground mt-2">Join the smart classroom platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="name@university.edu" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="e.g. CS" value={formData.department} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select 
                  id="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border-2 border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                >
                  <option value="STUDENT">Student</option>
                  <option value="STAFF">Staff</option>
                  <option value="HOD">HOD</option>
                </select>
              </div>
            </div>

            {isStaff && (
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" placeholder="e.g. Assistant Professor" value={formData.designation} onChange={handleChange} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">{isStudent ? "Year of Study" : "Year Group"}</Label>
                <select 
                  id="year" 
                  value={formData.year} 
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border-2 border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                >
                  <option value="">Select year</option>
                  {YEARS.map(y => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">{isStudent ? "Section" : "Section Handled"}</Label>
                <select 
                  id="section" 
                  value={formData.section} 
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border-2 border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                >
                  <option value="">Select section</option>
                  {SECTIONS.map(s => (
                    <option key={s} value={s}>Section {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={registerMutation.isPending} size="lg">
              {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Register
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
