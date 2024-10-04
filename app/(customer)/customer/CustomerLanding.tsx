"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useSession } from '../SessionProvider';

const CustomerLandingPage = () => {
  const session  = useSession();

  if (session?.user.role !== 'CUSTOMER') {
    return <div>Access denied. This page is for customers only.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Instant Purchase Power: Unlock the Speed of Our Quick Order Page Today!
      </h1>
      
      <Button variant="default" className="bg-green-500 hover:bg-green-600 text-white mb-4">
        Quick Order
      </Button>
      
      <div className="flex justify-between mb-4">
        <Button variant="outline">Previous Orders</Button>
        <Button variant="outline">Account Info</Button>
        <Button variant="outline">Address Info</Button>
        <Button variant="outline">View Price List</Button>
        <Button variant="outline">Product Images</Button>
      </div>
      
      <Card className="mb-4">
        <CardContent>
          <p className="text-sm">
            Hello {session.user.displayName} (not {session.user.displayName}?{' '}
            <a href="/api/auth/signout" className="text-blue-500 hover:underline">
              Log out
            </a>
            )
          </p>
          <p className="text-sm mt-2">
            From your account dashboard you can view your{' '}
            <a href="/orders" className="text-blue-500 hover:underline">
              recent orders
            </a>
            , manage your{' '}
            <a href="/addresses" className="text-blue-500 hover:underline">
              shipping and billing addresses
            </a>
            , and{' '}
            <a href="/account" className="text-blue-500 hover:underline">
              edit your password and account details
            </a>
            .
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-lg font-semibold">
              Orders are to be collected{' '}
              <span className="text-red-500 font-bold">24 hours</span> after
              payment received.
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            <li>We do not offer a courier service.</li>
            <li>We do not offer any branding.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerLandingPage;