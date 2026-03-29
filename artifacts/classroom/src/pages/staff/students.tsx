import { useState } from "react";
import { useListStudents } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Users, Search, BookOpen, Phone, Mail } from "lucide-react";

const YEARS = [1, 2, 3, 4];
const SECTIONS = ["A", "B", "C", "D", "E"];

export default function StaffStudents() {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedSection, setSelectedSection] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");

  const { data: students, isLoading, refetch } = useListStudents(
    {
      year: selectedYear,
      section: selectedSection,
    },
    {
      query: {
        enabled: true,
      }
    }
  );

  const filtered = (students || []).filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold">Students</h1>
        <p className="text-muted-foreground mt-1">Filter and view students by year and section</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Search className="w-4 h-4" /> Filter Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Year</Label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedYear(undefined)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    selectedYear === undefined
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary/50"
                  }`}
                >
                  All
                </button>
                {YEARS.map(y => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(selectedYear === y ? undefined : y)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      selectedYear === y
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary/50"
                    }`}
                  >
                    Year {y}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Section</Label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSection(undefined)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    selectedSection === undefined
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary/50"
                  }`}
                >
                  All
                </button>
                {SECTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSection(selectedSection === s ? undefined : s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      selectedSection === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Name, email, dept..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {isLoading ? "Loading..." : `${filtered.length} Student${filtered.length !== 1 ? "s" : ""}`}
            {(selectedYear || selectedSection) && (
              <span className="text-muted-foreground text-sm font-normal">
                {selectedYear ? `Year ${selectedYear}` : ""}
                {selectedYear && selectedSection ? ", " : ""}
                {selectedSection ? `Section ${selectedSection}` : ""}
              </span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted" />
              <p className="font-medium">No students found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search query</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(student => (
              <Card key={student.studentId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-sm">
                        {student.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0 flex-wrap">
                      {student.year && (
                        <Badge variant="secondary" className="text-xs">Year {student.year}</Badge>
                      )}
                      {student.section && (
                        <Badge variant="outline" className="text-xs">§ {student.section}</Badge>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-foreground truncate">{student.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" /> {student.email}
                  </p>
                  {student.phone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {student.phone}
                    </p>
                  )}
                  {student.department && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <BookOpen className="w-3 h-3" /> {student.department}
                    </p>
                  )}
                  {student.className && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">Class: </span>
                      <span className="text-xs font-medium text-foreground">{student.className}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
