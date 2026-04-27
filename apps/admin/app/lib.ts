// Shared types, constants, and helpers for the admin UI (Supabase edition)

export type RegistrationStatus = 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'REJECTED';
export type ServiceType = 'SHIPPING' | 'SOURCING';

export type Registration = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  imported_before: boolean;
  niche: string[];
  service_type: ServiceType;
  status: RegistrationStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type RegistrationImage = {
  id: string;
  registration_id: string;
  image_data_url: string;
  created_at: string;
};

export const STATUSES: RegistrationStatus[] = ['NEW', 'CONTACTED', 'CONFIRMED', 'REJECTED'];
export const SERVICE_TYPES: ServiceType[] = ['SHIPPING', 'SOURCING'];

export const NICHE_OPTIONS = [
  'electronics', 'clothing', 'home', 'auto', 'beauty', 'toys', 'sports', 'other',
] as const;

export type Locale = "ar" | "fr";

// ── Display helpers ────────────────────────────────────────────────

export function statusLabel(s: RegistrationStatus, locale: Locale = "ar"): string {
  if (locale === "fr") {
    switch (s) {
      case 'NEW': return 'Nouveau';
      case 'CONTACTED': return 'Contacté';
      case 'CONFIRMED': return 'Confirmé';
      case 'REJECTED': return 'Rejeté';
    }
  }
  switch (s) {
    case 'NEW': return 'جديد';
    case 'CONTACTED': return 'تم التواصل';
    case 'CONFIRMED': return 'مؤكد';
    case 'REJECTED': return 'مرفوض';
  }
}

export function statusColor(s: RegistrationStatus): string {
  switch (s) {
    case 'NEW': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'CONTACTED': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case 'CONFIRMED': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'REJECTED': return 'bg-red-500/20 text-red-300 border-red-500/30';
  }
}

export function serviceLabel(s: ServiceType, locale: Locale = "ar"): string {
  if (locale === "fr") {
    return s === 'SHIPPING' ? '🚢 Expédition' : '🔍 Sourcing';
  }
  return s === 'SHIPPING' ? '🚢 الشحن' : '🔍 التوريد';
}

export function serviceColor(s: ServiceType): string {
  return s === 'SHIPPING'
    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    : 'bg-violet-500/20 text-violet-300 border-violet-500/30';
}

export function nicheLabel(n: string, locale: Locale = "ar"): string {
  const mapAr: Record<string, string> = {
    electronics: '⚡ إلكترونيات',
    clothing: '👕 ملابس',
    home: '🏠 مستلزمات المنزل',
    auto: '🚗 قطع غيار السيارات',
    beauty: '💄 تجميل',
    toys: '🧸 ألعاب',
    sports: '⚽ رياضة',
    other: '📦 أخرى',
  };
  const mapFr: Record<string, string> = {
    electronics: '⚡ Électronique',
    clothing: '👕 Vêtements',
    home: '🏠 Maison',
    auto: '🚗 Auto',
    beauty: '💄 Beauté',
    toys: '🧸 Jouets',
    sports: '⚽ Sport',
    other: '📦 Autre',
  };
  return (locale === "fr" ? mapFr[n] : mapAr[n]) ?? n;
}

// ── Time helpers ───────────────────────────────────────────────────

export function relativeAge(dateStr: string, locale: Locale = "ar"): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60000);
  if (locale === "fr") {
    if (mins < 1) return 'à l’instant';
    if (mins < 60) return `il y a ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `il y a ${hrs} h`;
    const days = Math.floor(hrs / 24);
    return `il y a ${days} j`;
  }
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} د`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} س`;
  const days = Math.floor(hrs / 24);
  return `منذ ${days} ي`;
}

export function formatDate(dateStr: string, locale: Locale = "ar"): string {
  return new Date(dateStr).toLocaleString(locale === "fr" ? "fr-FR" : "ar-DZ", {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
