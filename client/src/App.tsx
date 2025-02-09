import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import Home from "@/pages/Home";
import Devices from "@/pages/Devices";
import Scenes from "@/pages/Scenes";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <Navigation />
      <main className="container mx-auto px-4 pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/devices" component={Devices} />
          <Route path="/scenes" component={Scenes} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
