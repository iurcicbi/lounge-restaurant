import Image from 'next/image';

type ImageFrameProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function ImageFrame({ src, alt, className = '', priority = false, sizes = '(max-width: 768px) 100vw, 50vw' }: ImageFrameProps) {
  return (
    <div className={`relative overflow-hidden bg-noir-card ${className}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover transition duration-700" />
      <div className="image-vignette pointer-events-none absolute inset-0" />
    </div>
  );
}
