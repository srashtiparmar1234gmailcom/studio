'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
} from '@/components/ui/dialog';
import { membershipPlans } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Hourglass, CalendarDays, CalendarMonth } from 'lucide-react';
import { ShredTrackLogo } from '@/components/icons';
import Link from 'next/link';

const planIcons = {
  Hourly: <Hourglass className="h-8 w-8 text-primary" />,
  Weekly: <CalendarDays className="h-8 w-8 text-primary" />,
  Monthly: <CalendarMonth className="h-8 w-8 text-primary" />,
};

const qrCodeImage = PlaceHolderImages.find(img => img.id === 'qr-code');

export default function MembershipsPage() {
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Choose Your Ride
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Pick a plan that fits your style. All plans are based on visit days, not calendar days. Skate more, worry less.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {membershipPlans.map((plan) => (
            <Card key={plan.id} className="flex flex-col transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-primary/20">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  {planIcons[plan.type]}
                </div>
                <CardTitle className="text-2xl font-headline">{plan.name} Plan</CardTitle>
                <CardDescription>
                  ₹{plan.price} for {plan.validityDays} {plan.validityDays > 1 ? 'visit days' : 'hour'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-center text-muted-foreground">
                  Perfect for {plan.type === 'Hourly' ? 'a quick session' : plan.type === 'Weekly' ? 'regular skaters' : 'die-hard enthusiasts'}. Your days never expire if you don't visit.
                </p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg py-6">
                      Purchase
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="font-headline text-2xl">Pay with QR Code</DialogTitle>
                      <DialogDescription>
                        Scan the QR code with your UPI app to purchase the {plan.name} plan for ₹{plan.price}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex justify-center">
                      {qrCodeImage && (
                        <Image
                          src={qrCodeImage.imageUrl}
                          alt="Payment QR Code"
                          width={300}
                          height={300}
                          className="rounded-lg border-4 border-primary"
                          data-ai-hint={qrCodeImage.imageHint}
                        />
                      )}
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      After payment, your membership will be activated by an admin.
                    </p>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
