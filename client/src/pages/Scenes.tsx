import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Scene } from "@shared/schema";
import SceneCard from "@/components/SceneCard";

export default function Scenes() {
  const { data: scenes, isLoading } = useQuery<Scene[]>({ 
    queryKey: ["/api/scenes"]
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Scenes</h1>
        <p className="text-muted-foreground mt-2">
          Activate predefined device configurations
        </p>
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : scenes?.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No scenes configured
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scenes?.map(scene => (
            <SceneCard key={scene.id} scene={scene} />
          ))}
        </div>
      )}
    </div>
  );
}
