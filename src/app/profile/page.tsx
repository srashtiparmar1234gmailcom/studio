'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getMockUser, userMemberships, attendance, membershipPlans, getAllUsers } from '@/lib/data';
import { User, Edit, Mail, Phone, Lock } from 'lucide-react';
import { ShredTrackLogo } from '@/components/icons';
import { useEffect, useState } from 'react';
import type { User as UserType } from '@/lib/types';
import { AttendanceCalendar } from '@/components/dashboard/attendance-calendar';

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [name, setName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userAttendance, setUserAttendance] = useState<Date[]>([]);

  useEffect(() => {
    const userData = getMockUser('customer');
    setUser(userData);
    if (userData) {
      setName(userData.name);
      
      // Load attendance from localStorage
      const storedAttendance = localStorage.getItem('attendance');
      const allAttendance = storedAttendance ? JSON.parse(storedAttendance).map((a:any) => ({...a, date: new Date(a.date)})) : attendance;
      const userAttendanceHistory = allAttendance.filter((a: any) => a.userId === userData.id);
      setUserAttendance(userAttendanceHistory.map((a: any) => a.date));
    }
  }, []);

  const handleSaveChanges = () => {
    if (user) {
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      
      const allUsers = getAllUsers();
      const userIndex = allUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(allUsers));
      }
      
      localStorage.setItem('userDetails', JSON.stringify(updatedUser));
      setIsDialogOpen(false);
    }
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  const userMembershipHistory = userMemberships.filter(m => m.userId === user.id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b border-border flex justify-between items-center">
        <Link href="/">
          <ShredTrackLogo />
        </Link>
        <Button asChild variant="outline">
          <Link href="/">Dashboard</Link>
        </Button>
      </header>
      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="relative">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
                <div className="flex flex-col space-y-2 text-muted-foreground mt-2">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>{user.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{user.phone}</span></div>
                   <div className="flex items-center gap-2"><Lock className="h-4 w-4" /><span>{user.password}</span></div>
                </div>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="absolute top-6 right-6">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit Profile</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Email</Label>
                    <p className="col-span-3 text-sm text-muted-foreground">{user.email}</p>
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Phone</Label>
                    <p className="col-span-3 text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Password</Label>
                    <p className="col-span-3 text-sm text-muted-foreground">{user.password}</p>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold font-headline mb-4">Membership History</h2>
                <div className="space-y-4">
                  {userMembershipHistory.length > 0 ? userMembershipHistory.map(mem => {
                    const plan = membershipPlans.find(p => p.id === mem.planId);
                    return (
                      <div key={mem.id} className="p-4 rounded-lg border bg-secondary/50">
                        <p className="font-semibold text-primary">{plan?.name} Plan</p>
                        <p className="text-sm text-muted-foreground">Purchased on: {new Date(mem.startDate).toLocaleDateString()}</p>
                        <p className="text-sm">Days Used: {mem.daysUsed}/{mem.totalDays}</p>
                      </div>
                    );
                  }) : <p className="text-muted-foreground">No membership history found.</p>}
                </div>
              </div>
              <div>
                 <AttendanceCalendar attendedDays={userAttendance} />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
