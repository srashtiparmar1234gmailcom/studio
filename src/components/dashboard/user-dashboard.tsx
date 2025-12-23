'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getMockUser, getAllMemberships, membershipPlans, attendance as initialAttendance } from '@/lib/data';
import { AttendanceCalendar } from './attendance-calendar';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { User, UserMembership, Attendance } from '@/lib/types';


export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userMembership, setUserMembership] = useState<UserMembership | null>(null);
  const [userAttendance, setUserAttendance] = useState<Date[]>([]);
  
  useEffect(() => {
    const currentUser = getMockUser('customer');
    setUser(currentUser);

    const allMemberships = getAllMemberships();
    const currentUserMembership = allMemberships.find(m => m.userId === currentUser.id) || null;
    setUserMembership(currentUserMembership);

    const storedAttendance = localStorage.getItem('attendance');
    const allAttendance: Attendance[] = storedAttendance ? JSON.parse(storedAttendance).map((a:any) => ({...a, date: new Date(a.date)})) : initialAttendance;
    const currentUserAttendance = allAttendance.filter(a => a.userId === currentUser.id).map(a => a.date);
    setUserAttendance(currentUserAttendance);
  }, []);

  if (!user) {
    return null; // or loading spinner
  }

  const plan = userMembership ? membershipPlans.find(p => p.id === userMembership.planId) : null;
  const remainingDays = userMembership ? userMembership.totalDays - userMembership.daysUsed : 0;
  const progressValue = userMembership ? (userMembership.daysUsed / userMembership.totalDays) * 100 : 0;

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="sm:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="font-headline">{plan ? `${plan.name} Plan` : 'No Active Plan'}</CardTitle>
            <CardDescription className="max-w-lg text-balance leading-relaxed">
              {plan ? `You have ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'} remaining.` : 'Purchase a new membership to start shredding!'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            {plan ? (
              <Button asChild className="bg-accent hover:bg-accent/90"><Link href="/memberships">Renew Membership</Link></Button>
            ) : (
              <Button asChild className="bg-accent hover:bg-accent/90"><Link href="/memberships">View Plans</Link></Button>
            )}
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Days Used</CardDescription>
            <CardTitle className="text-4xl">{userMembership?.daysUsed ?? 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              out of {userMembership?.totalDays ?? 0} total days
            </div>
          </CardContent>
          <CardFooter>
            <Progress value={progressValue} aria-label={`${progressValue}% of days used`} />
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Days Remaining</CardDescription>
            <CardTitle className="text-4xl">{remainingDays}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Your days never expire
            </div>
          </CardContent>
           <CardFooter>
            <Progress value={100 - progressValue} aria-label={`${100-progressValue}% of days remaining`} />
          </CardFooter>
        </Card>
      </div>
      <AttendanceCalendar attendedDays={userAttendance} />
    </div>
  );
}
