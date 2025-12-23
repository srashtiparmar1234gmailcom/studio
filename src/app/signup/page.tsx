'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllUsers, assignMembership, membershipPlans } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      toast({
        variant: "destructive",
        title: "No Plan Selected",
        description: "Please select a membership plan to continue.",
      });
      return;
    }

    const allUsers = getAllUsers();

    if (allUsers.some(u => u.email === email)) {
      toast({
        variant: "destructive",
        title: "User Exists",
        description: "An account with this email already exists.",
      });
      return;
    }

    const newUser = {
      id: `usr_${new Date().getTime()}`,
      name,
      email,
      phone,
      password,
      role: 'customer' as const,
      avatarUrl: `https://picsum.photos/seed/${email}/40/40`,
      createdAt: new Date(),
    };

    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    assignMembership(newUser.id, selectedPlan);
    
    localStorage.setItem('userRole', 'customer');
    localStorage.setItem('loggedInUser', email);
    localStorage.setItem('userDetails', JSON.stringify(newUser));
    
    toast({
      title: "Account Created",
      description: "Your account has been created successfully.",
    });

    router.push('/memberships');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input id="full-name" placeholder="Tony Hawk" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="123-456-7890" required value={phone} onChange={(e) => setPhone(e.target.value)}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="plan">Membership Plan</Label>
               <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {membershipPlans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name} - ₹{plan.price}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
              Create an account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline text-primary">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
