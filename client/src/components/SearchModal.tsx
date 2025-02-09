
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export function SearchModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [search, setSearch] = useState("");
  const { data: devices } = useQuery({ queryKey: ["/api/devices"] });
  const { data: history } = useQuery({ queryKey: ["/api/history"] });

  const filteredDevices = devices?.filter(device => 
    device.name.toLowerCase().includes(search.toLowerCase()) ||
    device.room.toLowerCase().includes(search.toLowerCase()) ||
    device.type.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const filteredHistory = history?.filter(entry =>
    entry.deviceName.toLowerCase().includes(search.toLowerCase()) ||
    entry.action.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
        <DialogTitle className="text-lg font-semibold mb-4">Search</DialogTitle>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices, rooms, history..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {search.length > 0 && (
            <>
              {filteredDevices.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-white">Devices</h3>
                  <div className="space-y-2">
                    {filteredDevices.map(device => (
                      <Link key={device.id} href={`/devices`} onClick={() => onOpenChange(false)}>
                        <Card className="cursor-pointer hover:bg-primary/5">
                          <CardContent className="p-4">
                            <div className="font-medium text-white">{device.name}</div>
                            <div className="text-sm text-white/70">{device.room} • {device.type}</div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredHistory.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-white">History</h3>
                  <div className="space-y-2">
                    {filteredHistory.map(entry => (
                      <Link key={entry.id} href="/scenes" onClick={() => onOpenChange(false)}>
                        <Card className="cursor-pointer hover:bg-primary/5">
                          <CardContent className="p-4">
                            <div className="font-medium text-white">{entry.deviceName}</div>
                            <div className="text-sm text-white/70">
                              {entry.action} • {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredDevices.length === 0 && filteredHistory.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No results found for "{search}"
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
