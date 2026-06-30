import {
  Mail,
  MapPin,
  ShoppingCart,
  Tablet,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  type LucideProps,
} from "lucide-react";

type IconProps = { size?: number; className?: string };

function FacebookIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 22v-8.5h2.85l.43-3.32H13.5V8.1c0-.96.27-1.62 1.65-1.62h1.76V3.56C16.6 3.5 15.4 3.4 14 3.4c-2.78 0-4.68 1.7-4.68 4.82v2.96H6.46v3.32H9.32V22z" />
    </svg>
  );
}

function TikTokIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-3.05-1.36V14a4.6 4.6 0 1 1-4.6-4.6c.27 0 .54.02.8.07v2.4a2.2 2.2 0 1 0 1.6 2.13V2h2.25a4.28 4.28 0 0 0 3 3.93z" />
    </svg>
  );
}

function XIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.9 2H22l-7.4 8.46L22.6 22h-6.9l-5.4-7.05L4.1 22H1l7.9-9.03L1.4 2h6.9l4.9 6.4z" />
    </svg>
  );
}

function YoutubeIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.5 7.6s-.22-1.57-.9-2.26c-.86-.9-1.83-.9-2.27-.96C16.1 4.1 12 4.1 12 4.1h-.01s-4.1 0-7.32.28c-.45.06-1.41.06-2.27.96-.68.69-.9 2.26-.9 2.26S1.2 9.45 1.2 11.3v1.4c0 1.85.3 3.7.3 3.7s.22 1.57.9 2.26c.86.9 1.98.87 2.49.97 1.8.17 7.11.27 7.11.27s4.1-.01 7.32-.28c.45-.06 1.41-.06 2.27-.96.68-.69.9-2.26.9-2.26s.3-1.85.3-3.7v-1.4c0-1.85-.3-3.7-.3-3.7zM9.7 14.9V8.7l5.9 3.1z" />
    </svg>
  );
}

export const iconRegistry = {
  mail: Mail,
  mapPin: MapPin,
  facebook: FacebookIcon,
  shoppingCart: ShoppingCart,
  tablet: Tablet,
  bookOpen: BookOpen,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  tiktok: TikTokIcon,
  x: XIcon,
  youtube: YoutubeIcon,
} satisfies Record<string, React.ComponentType<LucideProps> | React.ComponentType<IconProps>>;

export type IconName = keyof typeof iconRegistry;

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Component = iconRegistry[name as IconName];
  if (!Component) return null;
  return <Component size={size} className={className} />;
}
