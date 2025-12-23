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
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'srashtiparmar1234@gmail.com' && password === 'harshgaurav') {
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('loggedInUser', email);
      router.push('/');
    } else if (email && password) {
      // For any other user, we just check if fields are not empty for this mock setup
      localStorage.setItem('userRole', 'customer');
       // This could be improved to find a specific user, but for now we'll set a generic customer
      localStorage.setItem('loggedInUser', email);
      router.push('/memberships');
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Credentials',
        description: 'Please check your email and password.',
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
            Login
          </Button>
        </form>
      </CardContent>
      <div className="mt-4 p-6 pt-0 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="underline text-primary">
          Sign up
        </Link>
      </div>
    </Card>
    </div>
  );
}
