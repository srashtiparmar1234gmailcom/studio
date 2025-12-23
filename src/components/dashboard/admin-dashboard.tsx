'use client';

import {
  Users,
  Award,
  CalendarCheck,
  MoreHorizontal,
  PlusCircle,
  User as UserIcon,
  Mail,
  KeyRound,
  CalendarPlus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

import { getAllUsers, getAllMemberships, membershipPlans, addAttendance, assignMembership } from '@/lib/data';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useEffect, useState } from 'react';
import type { User, Attendance, UserMembership } from '@/lib/types';
import { Label } from '../ui/label';

export default function AdminDashboard() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [userMemberships, setUserMemberships] = useState<UserMembership[]>([]);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const { toast } = useToast();

  const loadData = () => {
    setAllUsers(getAllUsers());
    const storedAttendance = localStorage.getItem('attendance');
    if (storedAttendance) {
      setAttendance(JSON.parse(storedAttendance).map((a: any) => ({...a, date: new Date(a.date)})));
    } else {
      setAttendance([]);
    }
    setUserMemberships(getAllMemberships());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAttendance = (userId: string, userName: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const hasAttendedToday = attendance.some(
      a => a.userId === userId && new Date(a.date).toDateString() === today.toDateString()
    );

    if (hasAttendedToday) {
      toast({
        variant: 'destructive',
        title: 'Attendance Already Marked',
        description: `${userName} has already been marked as present today.`,
      });
      return;
    }
    
    addAttendance(userId);
    loadData(); // Reload all data to reflect changes
    
    toast({
      title: 'Attendance Marked',
      description: `${userName} has been marked as present for today.`,
    });
  };

  const handleOpenEditMembership = (user: User) => {
    setEditingUser(user);
    const currentMembership = userMemberships.find(m => m.userId === user.id);
    setSelectedPlan(currentMembership?.planId || '');
    setIsMemberDialogOpen(true);
  };
  
  const handleAssignMembership = () => {
    if (editingUser && selectedPlan) {
      assignMembership(editingUser.id, selectedPlan);
      toast({
        title: 'Membership Assigned',
        description: `${editingUser.name} has been assigned the ${membershipPlans.find(p => p.id === selectedPlan)?.name} plan.`,
      });
      setIsMemberDialogOpen(false);
      setEditingUser(null);
      setSelectedPlan('');
      loadData(); // Reload all data to reflect changes
    } else {
       toast({
        variant: 'destructive',
        title: 'Assignment Failed',
        description: `Please select a plan.`,
      });
    }
  };

  const handleOpenUserDetails = (user: User) => {
    setViewingUser(user);
    setIsDetailsDialogOpen(true);
  };


  const activeMemberships = userMemberships.filter(m => (m.totalDays - m.daysUsed) > 0).length;
  const todaysAttendance = attendance.filter(a => a.date.toDateString() === new Date().toDateString()).length;

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (attendance.length === 0) {
      setChartData([]);
      return;
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyAttendance = monthNames.map(month => ({ name: month, total: 0 }));

    attendance.forEach(att => {
        const monthIndex = new Date(att.date).getMonth();
        monthlyAttendance[monthIndex].total += 1;
    });

    setChartData(monthlyAttendance);
  }, [attendance]);


  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.filter(u => u.role === 'customer').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Memberships</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMemberships}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAttendance}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage park members and their attendance.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1 bg-accent hover:bg-accent/90">
              <a href="/signup">
                Add User
                <PlusCircle className="h-4 w-4" />
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remaining Days</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.filter(u => u.role === 'customer').map(user => {
                  const membership = userMemberships.find(m => m.userId === user.id);
                  const plan = membership ? membershipPlans.find(p => p.id === membership.planId) : null;
                  const remainingDays = membership ? membership.totalDays - membership.daysUsed : 0;
                  const status = membership ? (remainingDays > 0 ? 'Active' : 'Expired') : 'No Plan';

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{user.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{plan ? plan.name : 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={status === 'Active' ? 'default' : status === 'Expired' ? 'destructive' : 'secondary'} className={status === 'Active' ? 'bg-green-600/80 text-white' : ''}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>{remainingDays}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleMarkAttendance(user.id, user.name)}>Mark Attendance</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEditMembership(user)}>Edit Membership</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenUserDetails(user)}>View Details</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Attendance Overview</CardTitle>
                    <CardDescription>An overview of user attendance this year.</CardDescription>
                </CardHeader>
                <CardContent>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                        No attendance data available.
                      </div>
                    )
                  }
                </CardContent>
            </Card>
        </div>
      </div>
      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Membership for {editingUser?.name}</DialogTitle>
            <DialogDescription>
              Select a new membership plan to assign to the user. This will replace any existing plan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right">
                Plan
              </Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger id="plan" className="col-span-3">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {membershipPlans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name} - ₹{plan.price}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAssignMembership}>Assign Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="grid gap-4 py-4 text-sm">
                <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <div className="font-semibold">{viewingUser.name}</div>
                </div>
                <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>{viewingUser.email}</div>
                </div>
                <div className="flex items-center gap-3">
                    <KeyRound className="h-5 w-5 text-muted-foreground" />
                    <div>{viewingUser.password}</div>
                </div>
                <div className="flex items-center gap-3">
                    <CalendarPlus className="h-5 w-5 text-muted-foreground" />
                    <div>Joined on {new Date(viewingUser.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
