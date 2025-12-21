'use client';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export function AttendanceCalendar({ attendedDays }: { attendedDays: Date[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

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
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Attendance Calendar</CardTitle>
        <CardDescription>Your green days are your skate days.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pt-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
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
  );
}
