import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export function BrandLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/hoosing-anywhere.png"
      alt="Hoosing Anywhere"
      width={563}
      height={153}
      priority={priority}
      className={cn('h-auto w-36', className)}
    />
  );
}
