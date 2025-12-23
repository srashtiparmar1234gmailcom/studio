'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { attendance, getAllUsers } from '@/lib/data';
import { ShredTrackLogo } from '@/components/icons';
import type { User } from '@/lib/types';

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const allUsers = useMemo(() => getAllUsers(), []);

  const attendedUsers = useMemo(() => {
    if (!selectedDate) return [];
    
    const attendanceForDate = attendance.filter(
      (a) => a.date.toDateString() === selectedDate.toDateString()
    );
    
    return attendanceForDate.map(att => allUsers.find(u => u.id === att.userId)).filter(Boolean) as User[];
  }, [selectedDate, allUsers]);

  const attendedDays = useMemo(() => {
    return attendance.map(a => a.date);
  }, []);

  const attendedStyle = { 
    backgroundColor: 'hsl(var(--primary))', 
    color: 'hsl(var(--primary-foreground))',
    borderRadius: '0.375rem',
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Attendance Calendar</CardTitle>
                <CardDescription>Select a date to view attendance.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pt-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                  modifiers={{
                    attended: attendedDays,
                  }}
                  modifiersStyles={{
                    attended: attendedStyle,
                  }}
                  disabled={(date) => date > new Date()}
                />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">
                  Attendance for {selectedDate ? selectedDate.toLocaleDateString() : '...'}
                </CardTitle>
                <CardDescription>
                  {attendedUsers.length} {attendedUsers.length === 1 ? 'user' : 'users'} present.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attendedUsers.length > 0 ? (
                  <ul className="space-y-4">
                    {attendedUsers.map(user => (
                      <li key={user.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No users were present on this day.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
