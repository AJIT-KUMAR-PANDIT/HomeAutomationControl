import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Device } from "@shared/schema";
import DeviceCard from "@/components/DeviceCard";
import DeviceModel from "@/components/DeviceModel";

export default function Devices() {
  const { data: devices, isLoading } = useQuery<Device[]>({ 
    queryKey: ["/api/devices"]
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Devices</h1>
        <p className="text-muted-foreground mt-2">
          Manage your connected devices
        </p>
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : devices?.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No devices found
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {devices?.map(device => (
            <div key={device.id} className="space-y-4">
              <DeviceModel device={device} />
              <DeviceCard device={device} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
