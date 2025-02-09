
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface DeviceHistory {
  id: number;
  deviceId: number;
  deviceName: string;
  action: string;
  timestamp: Date;
}

export default function History() {
  const { data: history, isLoading } = useQuery<DeviceHistory[]>({ 
    queryKey: ["/api/history"]
  });

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-3xl font-bold">Device History</h1>
        <p className="text-muted-foreground mt-2">
          Track your device activity over time
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : history?.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No device activity recorded
        </p>
      ) : (
        <div className="space-y-4">
          {history?.map(entry => (
            <Card key={entry.id} className="glass hover:glow transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">{entry.deviceName}</h3>
                    <p className="text-sm text-white/70">{entry.action}</p>
                  </div>
                  <p className="text-sm text-white/70">
                    {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
