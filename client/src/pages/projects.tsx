import { Layout } from "@/components/layout";
import { useProjects, useCreateProject } from "@/hooks/use-projects";
import { Card, Button, Input } from "@/components/ui-components";
import { Plus, Folder, Calendar, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"; // Assuming standard Shadcn dialog structure is available or mocked
import { useToast } from "@/hooks/use-toast";

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const { mutate: createProject, isPending } = useCreateProject();
  const { toast } = useToast();
  const [newProjectName, setNewProjectName] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    if (!newProjectName) return;
    createProject({ name: newProjectName, description: "" }, {
      onSuccess: () => {
        toast({ title: "Project created" });
        setOpen(false);
        setNewProjectName("");
      }
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Projects</h1>
            <p className="text-muted-foreground">Organize your generations into workspaces.</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" className="gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  label="Name"
                  placeholder="Marketing Campaign Q1"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} isLoading={isPending}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Card key={project.id} className="p-6 cursor-pointer hover:border-primary/50 group relative">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Folder className="w-6 h-6" />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              
              <h3 className="font-bold text-lg mb-1">{project.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {project.description || "No description provided."}
              </p>
              
              <div className="flex items-center text-xs text-muted-foreground gap-2 pt-4 border-t border-white/5">
                <Calendar className="w-3 h-3" />
                Created {project.createdAt ? format(new Date(project.createdAt), 'MMM d, yyyy') : 'Unknown'}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
