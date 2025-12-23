'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Home,
  Users,
  CalendarCheck,
  CreditCard,
  LogOut,
  User,
  ChevronsLeft,
  ChevronsRight,
  Menu,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import AdminDashboard from './dashboard/admin-dashboard';
import UserDashboard from './dashboard/user-dashboard';
import { ShredTrackLogo } from './icons';
import { getMockUser } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [role, setRole] = useState<'admin' | 'customer' | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole') as 'admin' | 'customer' | null;
    if (userRole) {
      setRole(userRole);
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!role) {
    return null; // Or a loading spinner
  }

  const user = getMockUser(role);

  const navItems = role === 'admin'
    ? [
        { href: '/', icon: Home, label: 'Dashboard' },
        { href: '/users', icon: Users, label: 'Users' },
        { href: '/attendance', icon: CalendarCheck, label: 'Attendance' },
        { href: '/memberships', icon: CreditCard, label: 'Plans' },
      ]
    : [
        { href: '/', icon: Home, label: 'Dashboard' },
        { href: '/memberships', icon: CreditCard, label: 'Memberships' },
        { href: '/profile', icon: User, label: 'Profile' },
      ];

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userDetails');
    router.push('/login');
  };

  const NavLink = ({ item, isCollapsed }: { item: typeof navItems[0], isCollapsed: boolean }) => (
    <TooltipProvider delayDuration={0}>
       <Tooltip>
        <TooltipTrigger asChild>
           <Link
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
              'text-base font-semibold',
              isCollapsed && 'justify-center'
            )}
           >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.label}</span>}
           </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
       </Tooltip>
    </TooltipProvider>
  )

  const sidebarContent = (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-card">
      <div className={cn("flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6", isCollapsed && "justify-center")}>
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {!isCollapsed && <ShredTrackLogo />}
        </Link>
      </div>
      <div className="flex-1">
        <nav className={cn("grid items-start px-2 text-sm font-medium lg:px-4", isCollapsed && "px-1")}>
          {navItems.map((item) => <NavLink key={item.label} item={item} isCollapsed={isCollapsed} />)}
        </nav>
      </div>
      
    </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]">
      <div className={cn("hidden border-r bg-muted/40 md:block transition-all duration-300", isCollapsed ? "md:w-20" : "md:w-64")}>
        {sidebarContent}
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <SheetHeader className='sr-only'>
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg font-headline">
              {role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
            </h1>
          </div>
          
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link href="/profile"><User className="mr-2 h-4 w-4" /><span>Profile</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/memberships"><CreditCard className="mr-2 h-4 w-4" /><span>Billing</span></Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /><span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
        </main>
      </div>
    </div>
  );
}
