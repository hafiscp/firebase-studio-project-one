
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// The actual Firebase admin email. This is used behind the scenes.
const ADMIN_EMAIL = 'cphafis2@gmail.com';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('@dmin123');
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check for the simple username and password provided by the user.
    if (username === 'admin' && password === '@dmin123') {
      // If they match, use the actual Firebase credentials to sign in.
      signInWithEmailAndPassword(auth, ADMIN_EMAIL, password)
        .catch((err) => {
           // This might happen if the password is wrong or the user was deleted.
           console.error("Firebase sign-in error:", err);
           setError('An unexpected error occurred during login.');
        });
    } else {
      // If the credentials don't match, show an error.
      setError('Invalid credentials. Please try again.');
    }
  };
  
  if (isUserLoading) {
    return (
       <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <p>Loading...</p>
      </main>
    )
  }
  
  if (user) {
    return null; // Or a loading spinner, as the useEffect will redirect
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the CMS.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
