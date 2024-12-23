import React from "react";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/lib/auth";

const Sidebar = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="h-full w-64 bg-background border-r p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
            alt={user?.full_name}
          />
          <AvatarFallback>{user?.full_name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold truncate">{user?.full_name}</span>
          <span className="text-sm text-muted-foreground truncate">
            {user?.role?.replace("_", " ")}
          </span>
        </div>
      </div>

      <Navigation />

      <div className="mt-auto">
        <Separator className="my-4" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
