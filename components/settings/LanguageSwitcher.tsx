import { Link } from 'next-intl';
import { withPageAuth } from '@supabase/ssr';


export default function LanguageSwitcher() {
  return (
    <div className="flex gap-2">
      <Link href="/" locale="en">English</Link>
      <Link href="/" locale="fr">Français</Link>
      <Link href="/" locale="ar">العربية</Link>
    </div>
  );
} 
