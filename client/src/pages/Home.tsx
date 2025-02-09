import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Device } from "@shared/schema";
import DeviceCard from "@/components/DeviceCard";
import { Home as HomeIcon } from "lucide-react";

export default function Home() {
  const { data: devices, isLoading } = useQuery<Device[]>({ 
    queryKey: ["/api/devices"]
  });

  const activeDevices = devices?.filter(d => d.state) ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Welcome Home</h1>
        <p className="text-muted-foreground mt-2">
          Control your smart home devices
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Devices
            </CardTitle>
            <HomeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                `${activeDevices.length} / ${devices?.length}`
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Access</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-20" />
                </CardContent>
              </Card>
            ))
          ) : (
            devices?.slice(0, 3).map(device => (
              <DeviceCard key={device.id} device={device} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
