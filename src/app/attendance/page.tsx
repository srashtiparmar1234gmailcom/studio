'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { attendance as initialAttendance, getAllUsers } from '@/lib/data';
import { ShredTrackLogo } from '@/components/icons';
import type { User, Attendance } from '@/lib/types';

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isClient, setIsClient] = useState(false);
  const allUsers = useMemo(() => getAllUsers(), []);
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);


  useEffect(() => {
    setIsClient(true);
    const storedAttendance = localStorage.getItem('attendance');
    if (storedAttendance) {
      setAttendance(JSON.parse(storedAttendance).map((a: any) => ({...a, date: new Date(a.date)})));
    }
  }, []);

  const attendedUsers = useMemo(() => {
    if (!selectedDate) return [];
    
    const attendanceForDate = attendance.filter(
      (a) => a.date.toDateString() === selectedDate.toDateString()
    );
    
    return attendanceForDate.map(att => allUsers.find(u => u.id === att.userId)).filter(Boolean) as User[];
  }, [selectedDate, allUsers, attendance]);

  const attendedDays = useMemo(() => {
    return attendance.map(a => a.date);
  }, [attendance]);

  const attendedStyle = { 
    backgroundColor: 'hsl(var(--primary))', 
    color: 'hsl(var(--primary-foreground))',
    borderRadius: '0.375rem',
  };

  const todayStyle = {
    color: 'hsl(var(--accent))',
    fontWeight: 'bold',
  }

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
                    today: todayStyle,
                  }}
                  disabled={(date) => date > new Date() || date < new Date('2024-01-01')}
                  styles={{
                    day: { transition: 'background-color 0.2s ease, color 0.2s ease' },
                  }}
                />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">
                  Attendance for {isClient && selectedDate ? selectedDate.toLocaleDateString() : '...'}
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
