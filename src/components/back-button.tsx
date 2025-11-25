
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  return (
    <Button asChild variant="outline" size="icon">
      <Link href="/">
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Back to Home</span>
      </Link>
    </Button>
  );
}
