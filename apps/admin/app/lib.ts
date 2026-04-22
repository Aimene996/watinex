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

export const STATUSES: RegistrationStatus[] = ['NEW', 'CONTACTED', 'CONFIRMED', 'REJECTED'];
export const SERVICE_TYPES: ServiceType[] = ['SHIPPING', 'SOURCING'];

export const NICHE_OPTIONS = [
  'electronics', 'clothing', 'home', 'auto', 'beauty', 'toys', 'sports', 'other',
] as const;

// ── Display helpers ────────────────────────────────────────────────

export function statusLabel(s: RegistrationStatus): string {
  switch (s) {
    case 'NEW': return 'New';
    case 'CONTACTED': return 'Contacted';
    case 'CONFIRMED': return 'Confirmed';
    case 'REJECTED': return 'Rejected';
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

export function serviceLabel(s: ServiceType): string {
  return s === 'SHIPPING' ? '🚢 Shipping' : '🔍 Sourcing';
}

export function serviceColor(s: ServiceType): string {
  return s === 'SHIPPING'
    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    : 'bg-violet-500/20 text-violet-300 border-violet-500/30';
}

export function nicheLabel(n: string): string {
  const map: Record<string, string> = {
    electronics: '⚡ Electronics',
    clothing: '👕 Clothing',
    home: '🏠 Home Goods',
    auto: '🚗 Auto Parts',
    beauty: '💄 Beauty',
    toys: '🧸 Toys',
    sports: '⚽ Sports',
    other: '📦 Other',
  };
  return map[n] ?? n;
}

// ── Time helpers ───────────────────────────────────────────────────

export function relativeAge(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
