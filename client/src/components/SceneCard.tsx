import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { type Scene } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

interface SceneCardProps {
  scene: Scene;
}

export default function SceneCard({ scene }: SceneCardProps) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  async function activateScene() {
    setIsPending(true);
    try {
      await apiRequest("POST", `/api/scenes/${scene.id}/activate`, {});
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{scene.name}</h3>
            <p className="text-sm text-muted-foreground">
              {scene.devices.length} devices
            </p>
          </div>
          
          <Button
            size="icon"
            disabled={isPending}
            onClick={activateScene}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
