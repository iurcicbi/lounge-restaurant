import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  compact?: boolean;
  className?: string;
};

export function Logo({ compact = false, className = '' }: LogoProps) {
  return (
    <Link href="/" aria-label="Noir Lounge — torna alla home" className={`inline-flex items-center ${className}`}>
      <Image
        src="/noir-mark.svg"
        alt="Noir Lounge"
        width={compact ? 112 : 148}
        height={compact ? 25 : 34}
        priority
        className="h-auto w-auto"
      />
    </Link>
  );
}
