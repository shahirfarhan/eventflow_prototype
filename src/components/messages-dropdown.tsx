"use client";

import { MessageSquare } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const DUMMY_CHATS = [
  {
    id: "1",
    vendorName: "Grand Oak Ballroom",
    lastMessage: "Hi, the venue is available on July 15th. The price is RM 5,000.",
    time: "2h ago",
    unread: true,
  },
  {
    id: "2",
    vendorName: "Capture The Moment",
    lastMessage: "Sure! We can discuss the photography package during our meeting.",
    time: "5h ago",
    unread: false,
  },
  {
    id: "3",
    vendorName: "Gourmet Delights",
    lastMessage: "We have updated the menu as per your request. Let us know!",
    time: "1d ago",
    unread: false,
  },
];

export function MessagesDropdown() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Messages</h3>
        </div>
        <ScrollArea className="h-80">
          {DUMMY_CHATS.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "flex items-start gap-3 p-4 hover:bg-muted cursor-pointer transition-colors",
                chat.unread && "bg-muted/50"
              )}
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {chat.vendorName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">
                    {chat.vendorName}
                  </p>
                  <p className="text-xs text-muted-foreground">{chat.time}</p>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="p-2 border-t text-center">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View all messages
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
