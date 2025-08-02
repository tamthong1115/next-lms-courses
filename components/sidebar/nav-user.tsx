"use client";

import {
    IconDashboard,
    IconDotsVertical,
    IconLogout,
} from "@tabler/icons-react";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {HomeIcon, Tv2} from "lucide-react";
import {useSignOut} from "@/hooks/use-signout";
import {getUserInitial, getUserName} from "@/utils/user";

export function NavUser({
                            user,
                        }: {
    user: {
        name: string;
        email: string;
        image?: string | null | undefined;
    };
}) {
    const {isMobile} = useSidebar();
    const handleSignOut = useSignOut();
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user.image ?? `https://avatar.vercel.sh/${user.email}`}
                                    alt={user.name}
                                />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
                            </div>
                            <IconDotsVertical className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={user.image ?? `https://avatar.vercel.sh/${user.email}`}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {getUserInitial(user)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{getUserName(user)}</span>
                                    <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href="/public">
                                    <HomeIcon/>
                                    Homepage
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin">
                                    <IconDashboard/>
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/courses">
                                    <Tv2/>
                                    Courses
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleSignOut}>
                            <IconLogout/>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
