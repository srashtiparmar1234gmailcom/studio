import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getMockUser, userMemberships, attendance, membershipPlans } from '@/lib/data';
import { User, Edit, Mail, Phone } from 'lucide-react';
import { ShredTrackLogo } from '@/components/icons';

export default function ProfilePage() {
  const user = getMockUser('customer');
  const userMembershipHistory = userMemberships.filter(m => m.userId === user.id);
  const userAttendanceHistory = attendance.filter(a => a.userId === user.id);

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
                <div className="flex items-center space-x-4 text-muted-foreground mt-2">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>{user.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{user.phone}</span></div>
                </div>
              </div>
            </div>
            <Button variant="outline" size="icon" className="absolute top-6 right-6">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit Profile</span>
            </Button>
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
                        <p className="text-sm text-muted-foreground">Purchased on: {mem.startDate.toLocaleDateString()}</p>
                        <p className="text-sm">Days Used: {mem.daysUsed}/{mem.totalDays}</p>
                      </div>
                    );
                  }) : <p className="text-muted-foreground">No membership history found.</p>}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold font-headline mb-4">Attendance History</h2>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                   {userAttendanceHistory.length > 0 ? userAttendanceHistory.map(att => (
                     <div key={att.id} className="flex justify-between items-center p-2 rounded-lg bg-secondary/50">
                       <p>Visit Date:</p>
                       <p className="font-mono text-primary">{att.date.toLocaleDateString()}</p>
                     </div>
                   )) : <p className="text-muted-foreground">No attendance history found.</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
