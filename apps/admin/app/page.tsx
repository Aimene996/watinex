"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";
import {
  type Registration,
  type RegistrationImage,
  type RegistrationStatus,
  type ServiceType,
  type Locale,
  NICHE_OPTIONS,
  nicheLabel,
  statusLabel,
  relativeAge,
} from "./lib";

import Sidebar from "./components/Sidebar";
import StatsStrip from "./components/StatsStrip";
import FilterBar from "./components/FilterBar";
import RegistrationTable from "./components/RegistrationTable";
import DetailDrawer from "./components/DetailDrawer";
import SkeletonTable from "./components/SkeletonTable";

const PAGE_SIZE = 15;

const AVATAR_PALETTE = [
  "bg-teal-50 text-teal-700",
  "bg-blue-50 text-blue-700",
  "bg-purple-50 text-purple-700",
  "bg-orange-50 text-orange-700",
  "bg-amber-50 text-amber-700",
  "bg-pink-50 text-pink-700",
  "bg-emerald-50 text-emerald-700",
  "bg-rose-50 text-rose-700",
];

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((s) => s[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

const avatarColor = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
};

const stitchStatusPill = (s: RegistrationStatus) => {
  switch (s) {
    case "NEW": return "bg-blue-50 text-blue-700";
    case "CONTACTED": return "bg-amber-50 text-amber-700";
    case "CONFIRMED": return "bg-teal-50 text-teal-700";
    case "REJECTED": return "bg-red-50 text-red-700";
  }
};

const nicheIcon = (n?: string) => {
  switch (n) {
    case "electronics": return "devices";
    case "clothing": return "apparel";
    case "home": return "chair";
    case "auto": return "directions_car";
    case "beauty": return "spa";
    case "toys": return "toys";
    case "sports": return "sports_soccer";
    default: return "category";
  }
};

const cleanNicheLabel = (n: string, locale: Locale) =>
  nicheLabel(n, locale).replace(/^[^\p{L}]+/u, "").trim();

const serviceIcon = (s: ServiceType) =>
  s === "SHIPPING" ? "local_shipping" : "search";

const serviceTextLabel = (s: ServiceType) =>
  s === "SHIPPING" ? "الشحن" : "التوريد";

const formatShortDate = (iso: string, locale: Locale) =>
  new Date(iso).toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-FR", { month: "short", day: "2-digit", year: "numeric" });
type CreatedConfirmatriceResult = {
  email: string;
  password: string;
  niche: string | null;
  saved: boolean;
  saveError: string | null;
};
type ConfirmatriceCredential = {
  id: string;
  auth_user_id: string;
  email: string;
  temporary_password: string;
  niche: string;
  experience_level: "beginner" | "professional" | null;
  created_at: string;
  created_by_admin_email: string | null;
};

const maskPassword = (value: string) => {
  if (!value) return "";
  return "•".repeat(Math.max(8, Math.min(12, value.length)));
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"dashboard" | "registrations" | "analytics" | "pdf" | "confirmatrices" | "settings">("dashboard");
  const [authed, setAuthed] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [viewerRole, setViewerRole] = useState<"admin" | "confirmatrice">("admin");
  const [viewerNiches, setViewerNiches] = useState<string[]>([]);
  const [viewerExperienceLevel, setViewerExperienceLevel] = useState<"beginner" | "professional" | null>(null);

  // Data
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registrationImages, setRegistrationImages] = useState<RegistrationImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | "">("");
  const [serviceFilter, setServiceFilter] = useState<ServiceType | "">("");
  const [nicheFilter, setNicheFilter] = useState("");
  const [importedFilter, setImportedFilter] = useState<"" | "yes" | "no">("");
  /** Admin PDF tab: show leads by first-time vs experienced importer (imported_before). */
  const [pdfNewOldFilter, setPdfNewOldFilter] = useState<"" | "new" | "old">("");
  const [pdfDateFrom, setPdfDateFrom] = useState("");
  const [pdfDateTo, setPdfDateTo] = useState("");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState<Locale>("ar");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // UI state
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmatrices, setConfirmatrices] = useState<ConfirmatriceCredential[]>([]);
  const [confirmatriceBusy, setConfirmatriceBusy] = useState(false);
  const [confirmatriceNotice, setConfirmatriceNotice] = useState<string | null>(null);
  const [confirmatriceError, setConfirmatriceError] = useState<string | null>(null);
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createExperienceLevel, setCreateExperienceLevel] = useState<"" | "beginner" | "professional">("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNiche, setEditNiche] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editExperienceLevel, setEditExperienceLevel] = useState<"beginner" | "professional">("beginner");

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthed(true);
        setAdminEmail(session.user.email ?? "");
        const metadata = session.user.user_metadata as {
          role?: string;
          niches?: string[];
          experienceLevel?: "beginner" | "professional";
        } | undefined;
        const role = metadata?.role === "confirmatrice" ? "confirmatrice" : "admin";
        setViewerRole(role);
        setViewerNiches(Array.isArray(metadata?.niches) ? metadata.niches : []);
        setViewerExperienceLevel(
          metadata?.experienceLevel === "professional" || metadata?.experienceLevel === "beginner"
            ? metadata.experienceLevel
            : null,
        );
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 400);
    return () => clearTimeout(t);
  }, [q]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, serviceFilter, nicheFilter, importedFilter, debouncedQ]);

  // Load registrations
  const loadData = useCallback(async () => {
    if (!authed) return;
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter) query = query.eq("status", statusFilter);
      if (serviceFilter) query = query.eq("service_type", serviceFilter);
      if (nicheFilter) query = query.contains("niche", [nicheFilter]);
      if (viewerRole === "confirmatrice" && viewerNiches.length > 0) {
        query = query.overlaps("niche", viewerNiches);
      }
      if (viewerRole === "confirmatrice" && viewerExperienceLevel) {
        query = query.eq("imported_before", viewerExperienceLevel === "professional");
      }
      if (importedFilter === "yes") query = query.eq("imported_before", true);
      if (importedFilter === "no") query = query.eq("imported_before", false);
      if (debouncedQ) {
        query = query.or(`full_name.ilike.%${debouncedQ}%,phone.ilike.%${debouncedQ}%,email.ilike.%${debouncedQ}%`);
      }

      const { data, error: fetchErr } = await query;
      if (fetchErr) throw fetchErr;
      setRegistrations((data as Registration[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [authed, statusFilter, serviceFilter, nicheFilter, importedFilter, debouncedQ, viewerRole, viewerNiches, viewerExperienceLevel]);

  useEffect(() => { loadData(); }, [loadData]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(registrations.length / PAGE_SIZE));
  const paginatedRegistrations = useMemo(
    () => registrations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [registrations, currentPage],
  );

  const selected = useMemo(
    () => registrations.find((r) => r.id === selectedId) ?? null,
    [registrations, selectedId],
  );

  const pdfScreenRegistrations = useMemo(() => {
    const cap = (list: Registration[]) => list.slice(0, 50);
    if (viewerRole !== "admin") return cap(registrations);
    if (pdfNewOldFilter === "new") return cap(registrations.filter((r) => !r.imported_before));
    if (pdfNewOldFilter === "old") {
      return cap(
        registrations.filter((r) => {
          if (!r.imported_before) return false;
          if (!pdfDateFrom && !pdfDateTo) return true;
          const created = new Date(r.created_at);
          if (Number.isNaN(created.getTime())) return false;
          const fromTime = pdfDateFrom ? new Date(`${pdfDateFrom}T00:00:00`).getTime() : null;
          const toTime = pdfDateTo ? new Date(`${pdfDateTo}T23:59:59.999`).getTime() : null;
          if (fromTime !== null && created.getTime() < fromTime) return false;
          if (toTime !== null && created.getTime() > toTime) return false;
          return true;
        }),
      );
    }
    return [];
  }, [registrations, viewerRole, pdfNewOldFilter, pdfDateFrom, pdfDateTo]);

  const recentRegistrations = useMemo(
    () => registrations.slice(0, 8),
    [registrations],
  );

  const activeFiltersCount = useMemo(
    () => [statusFilter, serviceFilter, nicheFilter, importedFilter, debouncedQ].filter(Boolean).length,
    [statusFilter, serviceFilter, nicheFilter, importedFilter, debouncedQ],
  );

  // Stats
  const stats = useMemo(() => {
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    return {
      total: registrations.length,
      newToday: registrations.filter(r => r.status === "NEW" && new Date(r.created_at) >= todayStart).length,
      pending: registrations.filter(r => r.status === "NEW" || r.status === "CONTACTED").length,
      confirmed: registrations.filter(r => r.status === "CONFIRMED").length,
      rejected: registrations.filter(r => r.status === "REJECTED").length,
    };
  }, [registrations]);

  // Update status
  const updateStatus = async (id: string, newStatus: RegistrationStatus) => {
    setSaving(true);
    const { error: updateErr } = await supabase
      .from("registrations")
      .update({ status: newStatus })
      .eq("id", id);
    setSaving(false);
    if (!updateErr) loadData();
  };

  // Save notes
  const saveNotes = async (id: string, notes: string) => {
    setSaving(true);
    const { error: updateErr } = await supabase
      .from("registrations")
      .update({ admin_notes: notes })
      .eq("id", id);
    setSaving(false);
    if (!updateErr) loadData();
  };

  const loadRegistrationImages = useCallback(async (registrationId: string) => {
    const { data, error: fetchErr } = await supabase
      .from("registration_images")
      .select("id, registration_id, image_data_url, created_at")
      .eq("registration_id", registrationId)
      .order("created_at", { ascending: false });

    if (fetchErr) throw fetchErr;
    setRegistrationImages((prev) => {
      const others = prev.filter((item) => item.registration_id !== registrationId);
      return [...(data as RegistrationImage[] ?? []), ...others];
    });
  }, []);

  const uploadRegistrationImage = async (registrationId: string, file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      throw new Error("Image too large. Maximum size is 4MB.");
    }
    setImageBusy(true);
    try {
      const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
      const safeExtension = extension.replace(/[^a-z0-9]/g, "") || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExtension}`;
      const storagePath = `${registrationId}/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from("registration-images")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (uploadErr) {
        throw new Error(uploadErr.message || "Failed to upload image to storage.");
      }

      const { data: publicData } = supabase.storage
        .from("registration-images")
        .getPublicUrl(storagePath);
      const publicUrl = publicData.publicUrl;
      if (!publicUrl) {
        throw new Error("Failed to get image public URL.");
      }

      const { error: insertErr } = await supabase.from("registration_images").insert({
        registration_id: registrationId,
        image_data_url: publicUrl,
      });
      if (insertErr) throw insertErr;
      await loadRegistrationImages(registrationId);
    } finally {
      setImageBusy(false);
    }
  };

  useEffect(() => {
    if (!selectedId) return;
    loadRegistrationImages(selectedId).catch(() => {
      setError("Failed to load registration images.");
    });
  }, [selectedId, loadRegistrationImages]);

  const generateRegistrationPdf = async (
    registration: Registration,
    _notes: string,
    _images: RegistrationImage[],
  ) => {
    router.push(`/pdf-preview/${registration.id}`);
  };

  const getAccessToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error("Your session expired. Please sign in again.");
    return token;
  };

  const loadConfirmatrices = useCallback(async () => {
    if (!authed || viewerRole !== "admin") return;
    setConfirmatriceBusy(true);
    setConfirmatriceError(null);
    try {
      const token = await getAccessToken();
      const response = await fetch("/api/confirmatrices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((payload as { error?: string }).error ?? "Failed to load confirmatrices.");
      }
      setConfirmatrices((payload as { items?: ConfirmatriceCredential[] }).items ?? []);
    } catch (err) {
      setConfirmatriceError(err instanceof Error ? err.message : "Failed to load confirmatrices.");
    } finally {
      setConfirmatriceBusy(false);
    }
  }, [authed, viewerRole]);

  useEffect(() => {
    if (activeSection === "confirmatrices") {
      loadConfirmatrices();
    }
  }, [activeSection, loadConfirmatrices]);

  // Create confirmatrice
  const createConfirmatrice = async (
    email: string,
    password: string,
    experienceLevel: "beginner" | "professional",
  ): Promise<CreatedConfirmatriceResult> => {
    const token = await getAccessToken();

    const response = await fetch("/api/confirmatrices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password, experienceLevel }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error((payload as { error?: string })?.error ?? "Failed to create confirmatrice account.");
    }

    const credentials = (payload as {
      credentials?: {
        email?: string;
        password?: string;
        niche?: string | null;
        saved?: boolean;
        saveError?: string | null;
      };
    }).credentials;

    return {
      email: credentials?.email ?? email,
      password: credentials?.password ?? password,
      niche: credentials?.niche ?? null,
      saved: credentials?.saved ?? false,
      saveError: credentials?.saveError ?? null,
    };
  };

  const handleCreateConfirmatrice = async () => {
    if (!createEmail || !createPassword || !createExperienceLevel) {
      setConfirmatriceError("Email, password and experience level are required.");
      return;
    }
    setConfirmatriceBusy(true);
    setConfirmatriceError(null);
    setConfirmatriceNotice(null);
    try {
      const created = await createConfirmatrice(createEmail, createPassword, createExperienceLevel);
      setCreateEmail("");
      setCreatePassword("");
      setCreateExperienceLevel("");
      setConfirmatriceNotice(
        created.saved
          ? `Created ${created.email} and saved credentials.`
          : `Created ${created.email}. Credentials save warning: ${created.saveError ?? "unknown error"}`,
      );
      await loadConfirmatrices();
    } catch (err) {
      setConfirmatriceError(err instanceof Error ? err.message : "Failed to create confirmatrice.");
    } finally {
      setConfirmatriceBusy(false);
    }
  };

  const startEditing = (item: ConfirmatriceCredential) => {
    setEditingId(item.id);
    setEditNiche(item.niche);
    setEditPassword(item.temporary_password);
    setEditExperienceLevel(item.experience_level === "professional" ? "professional" : "beginner");
  };

  const saveEdit = async (item: ConfirmatriceCredential) => {
    setConfirmatriceBusy(true);
    setConfirmatriceError(null);
    setConfirmatriceNotice(null);
    try {
      const token = await getAccessToken();
      const response = await fetch("/api/confirmatrices", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: item.id,
          authUserId: item.auth_user_id,
          niche: editNiche,
          password: editPassword,
          experienceLevel: editExperienceLevel,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((payload as { error?: string }).error ?? "Failed to update confirmatrice.");
      }
      setEditingId(null);
      setEditNiche("");
      setEditPassword("");
      setEditExperienceLevel("beginner");
      setConfirmatriceNotice(`Updated ${item.email}.`);
      await loadConfirmatrices();
    } catch (err) {
      setConfirmatriceError(err instanceof Error ? err.message : "Failed to update confirmatrice.");
    } finally {
      setConfirmatriceBusy(false);
    }
  };

  const handleDeleteConfirmatrice = async (item: ConfirmatriceCredential) => {
    const shouldDelete = window.confirm(
      `Delete ${item.email} permanently?\n\nThis action cannot be undone.`,
    );
    if (!shouldDelete) return;

    setConfirmatriceBusy(true);
    setConfirmatriceError(null);
    setConfirmatriceNotice(null);
    try {
      const token = await getAccessToken();
      const response = await fetch("/api/confirmatrices", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: item.id,
          authUserId: item.auth_user_id,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((payload as { error?: string }).error ?? "Failed to delete confirmatrice.");
      }
      if (editingId === item.id) {
        setEditingId(null);
        setEditNiche("");
        setEditPassword("");
        setEditExperienceLevel("beginner");
      }
      setConfirmatriceNotice(`Deleted ${item.email} permanently.`);
      await loadConfirmatrices();
    } catch (err) {
      setConfirmatriceError(err instanceof Error ? err.message : "Failed to delete confirmatrice.");
    } finally {
      setConfirmatriceBusy(false);
    }
  };

  const copyCredentials = async (item: ConfirmatriceCredential) => {
    const levelLabel = item.experience_level === "professional"
      ? "Professional (imported before: yes)"
      : "Beginner (imported before: no)";
    const content = `Email: ${item.email}\nPassword: ${item.temporary_password}\nNiche: ${item.niche ? nicheLabel(item.niche, language) : "All niches"}\nExperience: ${levelLabel}`;
    try {
      await navigator.clipboard.writeText(content);
      setConfirmatriceNotice(`Copied credentials for ${item.email}.`);
    } catch {
      setConfirmatriceError("Clipboard copy failed.");
    }
  };

  // Sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === "ar" ? "rtl" : "ltr";
    html.dataset.theme = themeMode;
  }, [language, themeMode]);

  const text = useMemo(() => {
    const dict = {
      ar: {
        brand: "Import Admin",
        queue: "قائمة التسجيلات",
        dashboard: "لوحة القيادة",
        registrations: "التسجيلات",
        analytics: "التحليلات",
        pdf: "PDF العملاء",
        settings: "الإعدادات",
        search: "ابحث بالاسم أو البريد أو الهاتف...",
        filter: "تصفية",
        refresh: "تحديث",
        recentSubmissions: "كل التسجيلات",
        showing: "عرض",
        of: "من",
        today: "اليوم",
        noData: "لا توجد تسجيلات",
        detailsTitle: "تفاصيل التسجيل",
        notes: "ملاحظات الإدارة",
        saveNotes: "حفظ الملاحظات",
        signingOut: "تسجيل الخروج",
        language: "اللغة",
        theme: "المظهر",
        dark: "داكن",
        light: "فاتح",
        createConfirmatrice: "إنشاء حساب مؤكدة",
        confirmatriceHint: "إنشاء حساب وصول محدود لمجال واحد.",
        confirmatriceEmail: "البريد الإلكتروني",
        confirmatricePassword: "كلمة مرور مؤقتة",
        confirmatriceNiche: "المجال المسموح",
        chooseNiche: "اختر مجالا",
        createAccount: "إنشاء الحساب",
        confirmatriceAccounts: "حسابات المؤكدات",
        copyCredentials: "نسخ بيانات الدخول",
        saveChanges: "حفظ التغييرات",
        comingSoon: "هذا القسم سيتوفر قريبا.",
        pdfFilterNew: "جدد",
        pdfFilterOld: "قدامى",
        pdfPickFilter: "اختر «جدد» أو «قدامى» لعرض قائمة PDF.",
        pdfDateFrom: "من تاريخ",
        pdfDateTo: "إلى تاريخ",
        pdfDateClear: "مسح التاريخ",
      },
      fr: {
        brand: "Import Admin",
        queue: "File des inscriptions",
        dashboard: "Tableau de bord",
        registrations: "Inscriptions",
        analytics: "Analytique",
        pdf: "PDF Clients",
        settings: "Paramètres",
        search: "Rechercher par nom, email ou téléphone...",
        filter: "Filtrer",
        refresh: "Actualiser",
        recentSubmissions: "Toutes les inscriptions",
        showing: "Affichage",
        of: "sur",
        today: "aujourd'hui",
        noData: "Aucune inscription trouvée",
        detailsTitle: "Détails de l'inscription",
        notes: "Notes admin",
        saveNotes: "Enregistrer",
        signingOut: "Se déconnecter",
        language: "Langue",
        theme: "Thème",
        dark: "Sombre",
        light: "Clair",
        createConfirmatrice: "Créer confirmatrice",
        confirmatriceHint: "Créer un accès limité à une seule niche.",
        confirmatriceEmail: "Email",
        confirmatricePassword: "Mot de passe temporaire",
        confirmatriceNiche: "Niche autorisée",
        chooseNiche: "Choisir une niche",
        createAccount: "Créer le compte",
        confirmatriceAccounts: "Comptes confirmatrice",
        copyCredentials: "Copier les identifiants",
        saveChanges: "Enregistrer",
        comingSoon: "Cette section arrive bientôt.",
        pdfFilterNew: "Nouveaux",
        pdfFilterOld: "Anciens",
        pdfPickFilter: "Choisissez « Nouveaux » ou « Anciens » pour afficher la liste des PDF.",
        pdfDateFrom: "Du",
        pdfDateTo: "Au",
        pdfDateClear: "Effacer dates",
      },
    } as const;
    return dict[language];
  }, [language]);

  if (!authed) return null;

  const isDark = themeMode === "dark";
  const isRtl = language === "ar";

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#080d19] text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {/* Sidebar */}
      <Sidebar
        adminEmail={adminEmail}
        onSignOut={handleSignOut}
        isAdmin={viewerRole === "admin"}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        text={text}
        themeMode={themeMode}
        locale={language}
      />

      {/* Main content */}
      <main className={isRtl ? "md:mr-[260px]" : "md:ml-[260px]"}>
        {/* Top bar */}
        <header className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-lg md:px-6 ${
          isDark ? "border-slate-800/60 bg-[#080d19]/80" : "border-slate-200 bg-white/80"
        }`}>
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg md:hidden ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h1 className="text-base font-bold tracking-tight">
                {activeSection === "dashboard" ? text.dashboard :
                  activeSection === "registrations" ? text.registrations :
                    activeSection === "analytics" ? text.analytics :
                      activeSection === "pdf" ? text.pdf :
                        activeSection === "confirmatrices" ? text.createConfirmatrice : text.settings}
              </h1>
              <p className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {language === "ar" ? "إدارة ومتابعة عملاء الاستيراد" : "Gérez et suivez vos prospects import"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Locale)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium outline-none transition-colors ${
                isDark ? "border-slate-700/60 bg-slate-900/60 text-slate-300" : "border-slate-200 bg-white text-slate-600"
              }`}
              aria-label={text.language}
            >
              <option value="ar">🇩🇿 AR</option>
              <option value="fr">🇫🇷 FR</option>
            </select>
            <button
              type="button"
              onClick={() => setThemeMode((prev) => (prev === "dark" ? "light" : "dark"))}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                isDark ? "border-slate-700/60 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"
              }`}
              aria-label={text.theme}
            >
              <span className="material-symbols-outlined text-base">
                {themeMode === "dark" ? "dark_mode" : "light_mode"}
              </span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="space-y-5 px-4 py-5 md:px-6">
          {activeSection === "dashboard" && (
            <>
              <StatsStrip stats={stats} themeMode={themeMode} locale={language} />
              <FilterBar
                q={q}
                onQChange={setQ}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                serviceFilter={serviceFilter}
                onServiceChange={setServiceFilter}
                nicheFilter={nicheFilter}
                onNicheChange={setNicheFilter}
                importedFilter={importedFilter}
                onImportedChange={setImportedFilter}
                activeFiltersCount={activeFiltersCount}
                onRefresh={loadData}
                loading={loading}
                text={text}
                themeMode={themeMode}
                locale={language}
              />
            </>
          )}

          {activeSection === "dashboard" && (
            <section className={`rounded-2xl border ${isDark ? "border-slate-800/50 bg-slate-900/40" : "border-slate-200 bg-white"}`}>
              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDark ? "border-slate-800/50" : "border-slate-200"}`}>
                <h2 className="text-sm font-semibold">{text.recentSubmissions}</h2>
                <button
                  type="button"
                  onClick={() => setActiveSection("registrations")}
                  className={`text-xs font-medium ${isDark ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-500"}`}
                >
                  {text.registrations}
                </button>
              </div>
              <RegistrationTable
                registrations={recentRegistrations}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
                onGeneratePdf={(id) => router.push(`/pdf-preview/${id}`)}
                themeMode={themeMode}
                text={text}
                locale={language}
              />
            </section>
          )}

          {activeSection === "registrations" && (() => {
            const cardCls = isDark
              ? "border-slate-800/60 bg-slate-900/50"
              : "border-slate-200 bg-white";
            const subTextCls = isDark ? "text-slate-400" : "text-slate-500";
            const newTodayDelta = Math.max(0, stats.newToday);
            const pendingUrgent = registrations.filter(
              (r) => r.status === "NEW" && (Date.now() - new Date(r.created_at).getTime()) > 86_400_000
            ).length;
            const conversionRate = stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0;
            const totalEntries = registrations.length;
            const fromIdx = totalEntries === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
            const toIdx = Math.min(currentPage * PAGE_SIZE, totalEntries);

            const visiblePages = (() => {
              if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
              const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
              return Array.from({ length: 5 }, (_, i) => start + i);
            })();

            const dailyVelocity = (() => {
              const days = Array.from({ length: 8 }, (_, i) => {
                const d = new Date();
                d.setHours(0, 0, 0, 0);
                d.setDate(d.getDate() - (7 - i));
                return d;
              });
              return days.map((d) => {
                const next = new Date(d);
                next.setDate(d.getDate() + 1);
                const count = registrations.filter((r) => {
                  const t = new Date(r.created_at).getTime();
                  return t >= d.getTime() && t < next.getTime();
                }).length;
                return count;
              });
            })();
            const maxVelocity = Math.max(1, ...dailyVelocity);

            return (
              <>
                {/* KPI Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className={`rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md ${cardCls}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-[12px] font-semibold uppercase tracking-wider mb-1 ${subTextCls}`}>{language === "ar" ? "إجمالي العملاء" : "Total des prospects"}</p>
                        <h3 className="text-3xl font-bold tracking-tight">{stats.total.toLocaleString(language === "ar" ? "ar-DZ" : "fr-FR")}</h3>
                      </div>
                      <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
                        <span className="material-symbols-outlined">trending_up</span>
                      </div>
                    </div>
                    <p className={`mt-4 text-[13px] ${subTextCls}`}>
                      <span className="font-semibold text-teal-600">+12%</span> {language === "ar" ? "مقارنة بالشهر الماضي" : "vs le mois dernier"}
                    </p>
                  </div>

                  <div className={`rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md ${cardCls}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-[12px] font-semibold uppercase tracking-wider mb-1 ${subTextCls}`}>{language === "ar" ? "جديد اليوم" : "Nouveaux aujourd'hui"}</p>
                        <h3 className="text-3xl font-bold tracking-tight">{newTodayDelta.toLocaleString(language === "ar" ? "ar-DZ" : "fr-FR")}</h3>
                      </div>
                      <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                        <span className="material-symbols-outlined">bolt</span>
                      </div>
                    </div>
                    <p className={`mt-4 text-[13px] ${subTextCls}`}>
                      <span className="font-semibold text-blue-600">+{Math.max(1, Math.floor(newTodayDelta / 8))}</span> {language === "ar" ? "منذ الساعة الماضية" : "depuis la dernière heure"}
                    </p>
                  </div>

                  <div className={`rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md ${cardCls}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-[12px] font-semibold uppercase tracking-wider mb-1 ${subTextCls}`}>{language === "ar" ? "متابعة" : "Suivi"}</p>
                        <h3 className="text-3xl font-bold tracking-tight">{stats.pending.toLocaleString(language === "ar" ? "ar-DZ" : "fr-FR")}</h3>
                      </div>
                      <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                        <span className="material-symbols-outlined">call</span>
                      </div>
                    </div>
                    <p className={`mt-4 text-[13px] ${subTextCls}`}>
                      <span className="font-semibold text-amber-600">{pendingUrgent}</span> {language === "ar" ? "تتطلب متابعة عاجلة" : "en attente urgente"}
                    </p>
                  </div>

                  <div className={`rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md ${cardCls}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-[12px] font-semibold uppercase tracking-wider mb-1 ${subTextCls}`}>{language === "ar" ? "مؤكد" : "Confirmés"}</p>
                        <h3 className="text-3xl font-bold tracking-tight">{stats.confirmed.toLocaleString(language === "ar" ? "ar-DZ" : "fr-FR")}</h3>
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                        <span className="material-symbols-outlined">check_circle</span>
                      </div>
                    </div>
                    <p className={`mt-4 text-[13px] ${subTextCls}`}>
                      <span className="font-semibold text-emerald-600">{conversionRate}%</span> {language === "ar" ? "معدل التحويل" : "taux de conversion"}
                    </p>
                  </div>
                </div>

                {/* Table card */}
                <div className={`overflow-hidden rounded-xl border shadow-sm ${cardCls}`}>
                  {/* Filter row */}
                  <div className={`flex flex-wrap items-center justify-between gap-4 border-b p-6 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="relative">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value as RegistrationStatus | "")}
                          className={`appearance-none rounded-lg border px-4 py-2 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${isDark ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-200 bg-slate-50 text-slate-700"} ${isRtl ? "pl-10 text-right" : "pr-10 text-left"}`}
                        >
                          <option value="">{language === "ar" ? "الحالة: الكل" : "Statut: Tous"}</option>
                          <option value="NEW">{language === "ar" ? "جديد" : "Nouveau"}</option>
                          <option value="CONTACTED">{language === "ar" ? "تم التواصل" : "Contacté"}</option>
                          <option value="CONFIRMED">{language === "ar" ? "مؤكد" : "Confirmé"}</option>
                          <option value="REJECTED">{language === "ar" ? "مرفوض" : "Rejeté"}</option>
                        </select>
                        <span className={`material-symbols-outlined pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? "left-2" : "right-2"}`}>expand_more</span>
                      </div>
                      <div className="relative">
                        <select
                          value={serviceFilter}
                          onChange={(e) => setServiceFilter(e.target.value as ServiceType | "")}
                          className={`appearance-none rounded-lg border px-4 py-2 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${isDark ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-200 bg-slate-50 text-slate-700"} ${isRtl ? "pl-10 text-right" : "pr-10 text-left"}`}
                        >
                          <option value="">{language === "ar" ? "الخدمة: الكل" : "Service: Tous"}</option>
                          <option value="SHIPPING">{language === "ar" ? "الشحن" : "Expédition"}</option>
                          <option value="SOURCING">{language === "ar" ? "التوريد" : "Approvisionnement"}</option>
                        </select>
                        <span className={`material-symbols-outlined pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? "left-2" : "right-2"}`}>expand_more</span>
                      </div>
                      <div className="relative">
                        <select
                          value={nicheFilter}
                          onChange={(e) => setNicheFilter(e.target.value)}
                          className={`appearance-none rounded-lg border px-4 py-2 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${isDark ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-200 bg-slate-50 text-slate-700"} ${isRtl ? "pl-10 text-right" : "pr-10 text-left"}`}
                        >
                          <option value="">{language === "ar" ? "المجال: الكل" : "Niche: Toutes"}</option>
                          {NICHE_OPTIONS.map((option) => (
                            <option key={option} value={option}>{cleanNicheLabel(option, language)}</option>
                          ))}
                        </select>
                        <span className={`material-symbols-outlined pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? "left-2" : "right-2"}`}>expand_more</span>
                      </div>
                      <div className="relative">
                        <span className={`material-symbols-outlined pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? "right-3" : "left-3"}`}>search</span>
                        <input
                          type="text"
                          value={q}
                          onChange={(e) => setQ(e.target.value)}
                          placeholder={language === "ar" ? "ابحث في السجلات..." : "Rechercher dans les inscriptions..."}
                          className={`w-56 rounded-lg border py-2 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${isDark ? "border-slate-700 bg-slate-900 text-slate-200 placeholder:text-slate-500" : "border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400"} ${isRtl ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"}`}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={loadData}
                      className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95"
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
                      {language === "ar" ? "تسجيل جديد" : "Nouvelle inscription"}
                    </button>
                  </div>

                  {/* Table */}
                  {loading ? (
                    <div className="p-6">
                      <SkeletonTable themeMode={themeMode} />
                    </div>
                  ) : paginatedRegistrations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16">
                      <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-slate-800/60" : "bg-slate-100"}`}>
                        <span className="material-symbols-outlined text-3xl text-slate-400">inbox</span>
                      </div>
                      <p className={`text-sm font-medium ${subTextCls}`}>{text.noData}</p>
                      <p className={`mt-1 text-xs ${subTextCls}`}>{language === "ar" ? "جرّب تعديل الفلاتر أو البحث" : "Essayez de modifier vos filtres ou votre recherche"}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}>
                        <thead className={isDark ? "bg-slate-900/80" : "bg-slate-50"}>
                          <tr>
                            <th className={`border-b px-6 py-3 text-[11px] font-semibold uppercase tracking-wider ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>{language === "ar" ? "الاسم" : "Nom"}</th>
                            <th className={`border-b px-6 py-3 text-[11px] font-semibold uppercase tracking-wider ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>{language === "ar" ? "معلومات التواصل" : "Contact"}</th>
                            <th className={`border-b px-6 py-3 text-[11px] font-semibold uppercase tracking-wider ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>{language === "ar" ? "الخدمة" : "Service"}</th>
                            <th className={`border-b px-6 py-3 text-[11px] font-semibold uppercase tracking-wider ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>{language === "ar" ? "المجال" : "Niche"}</th>
                            <th className={`border-b px-6 py-3 text-[11px] font-semibold uppercase tracking-wider ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>{language === "ar" ? "الحالة" : "Statut"}</th>
                            <th className={`border-b px-6 py-3 text-[11px] font-semibold uppercase tracking-wider ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>{language === "ar" ? "ملاحظات" : "Notes"}</th>
                            <th className={`border-b px-6 py-3 text-[11px] font-semibold uppercase tracking-wider ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>{language === "ar" ? "التاريخ" : "Date"}</th>
                            <th className={`border-b px-6 py-3 text-[11px] font-semibold uppercase tracking-wider ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"} ${isRtl ? "text-left" : "text-right"}`}>{language === "ar" ? "إجراءات" : "Actions"}</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
                          {paginatedRegistrations.map((reg) => {
                            const initials = getInitials(reg.full_name);
                            const avatarCls = avatarColor(reg.id);
                            const primaryNiche = reg.niche[0];
                            return (
                              <tr
                                key={reg.id}
                                onClick={() => setSelectedId(reg.id)}
                                className={`group cursor-pointer transition-colors ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}`}
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${avatarCls}`}>
                                      {initials}
                                    </div>
                                    <span className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{reg.full_name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className={`text-[13px] ${isDark ? "text-slate-200" : "text-slate-700"}`}>{reg.email}</div>
                                  <div className={`text-[11px] ${subTextCls}`}>{reg.phone}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className={`flex items-center gap-2 text-[13px] ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                                    <span className="material-symbols-outlined text-[18px] text-teal-600">{serviceIcon(reg.service_type)}</span>
                                    {serviceTextLabel(reg.service_type)}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  {primaryNiche ? (
                                    <div className={`flex items-center gap-2 text-[13px] ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                                      <span className="material-symbols-outlined text-[18px] text-slate-500">{nicheIcon(primaryNiche)}</span>
                                      {cleanNicheLabel(primaryNiche, language)}
                                      {reg.niche.length > 1 && (
                                        <span className={`text-[11px] ${subTextCls}`}>+{reg.niche.length - 1}</span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className={subTextCls}>—</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${stitchStatusPill(reg.status)}`}>
                                    {statusLabel(reg.status, language)}
                                  </span>
                                </td>
                                <td className={`max-w-[220px] px-6 py-4 text-[12px] ${subTextCls}`}>
                                  <span className="line-clamp-2">
                                    {(reg.admin_notes ?? "").trim() || "—"}
                                  </span>
                                </td>
                                <td className={`px-6 py-4 text-[13px] ${subTextCls}`}>
                                  {formatShortDate(reg.created_at, language)}
                                </td>
                                <td className={`px-6 py-4 ${isRtl ? "text-left" : "text-right"}`}>
                                  <div className={`inline-flex items-center gap-1 ${isRtl ? "flex-row-reverse" : ""}`}>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/pdf-preview/${reg.id}`);
                                      }}
                                      className={`rounded-lg p-2 opacity-0 transition-opacity group-hover:opacity-100 ${
                                        isDark ? "text-blue-300 hover:bg-slate-800" : "text-blue-700 hover:bg-blue-100"
                                      }`}
                                      aria-label={language === "ar" ? "توليد PDF" : "Generate PDF"}
                                    >
                                      <span className="material-symbols-outlined">picture_as_pdf</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); setSelectedId(reg.id); }}
                                      className={`rounded-lg p-2 opacity-0 transition-opacity group-hover:opacity-100 ${isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}
                                    >
                                      <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pagination */}
                  {!loading && totalEntries > 0 && (
                    <div className={`flex items-center justify-between border-t p-6 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                      <p className={`text-[13px] ${subTextCls}`}>
                        {language === "ar"
                          ? `عرض ${fromIdx} إلى ${toIdx} من ${totalEntries.toLocaleString("ar-DZ")} سجل`
                          : `Affichage ${fromIdx} à ${toIdx} sur ${totalEntries.toLocaleString("fr-FR")} éléments`}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={currentPage <= 1}
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={`rounded-lg border p-2 text-slate-500 transition-colors disabled:opacity-50 ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}
                        >
                          <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        {visiblePages.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setCurrentPage(p)}
                            className={`min-w-[36px] rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                              p === currentPage
                                ? "bg-teal-600 text-white shadow-sm"
                                : isDark
                                  ? "border border-slate-700 text-slate-200 hover:bg-slate-800"
                                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        <button
                          type="button"
                          disabled={currentPage >= totalPages}
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className={`rounded-lg border p-2 text-slate-500 transition-colors disabled:opacity-50 ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}
                        >
                          <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom bento — Velocity + Import Summary */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <div className={`rounded-xl border p-6 shadow-sm lg:col-span-2 ${cardCls}`}>
                    <div className="mb-6 flex items-center justify-between">
                      <h4 className="text-lg font-semibold tracking-tight">{language === "ar" ? "سرعة التسجيلات" : "Vitesse des inscriptions"}</h4>
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-600">
                          <span className="h-2 w-2 rounded-full bg-teal-500" /> {language === "ar" ? "مؤكد" : "Confirmé"}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <span className="h-2 w-2 rounded-full bg-slate-300" /> {language === "ar" ? "قيد الانتظار" : "En attente"}
                        </span>
                      </div>
                    </div>
                    <div className={`flex h-48 w-full items-end justify-between gap-2 rounded-lg px-4 py-2 ${isDark ? "bg-slate-900/40" : "bg-slate-50"}`}>
                      {dailyVelocity.map((count, idx) => {
                        const heightPct = Math.max(8, Math.round((count / maxVelocity) * 92));
                        const isPeak = count === maxVelocity;
                        const tone = isPeak
                          ? "bg-teal-600"
                          : idx % 2 === 0
                            ? "bg-teal-300"
                            : "bg-teal-400";
                        return (
                          <div
                            key={idx}
                            className={`w-full rounded-t-sm transition-all ${tone}`}
                            style={{ height: `${heightPct}%` }}
                            title={`${count} registrations`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl bg-slate-900 p-6 text-white shadow-xl">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl" />
                    <div className="relative">
                      <h4 className="mb-2 text-lg font-semibold tracking-tight">{language === "ar" ? "ملخص الاستيراد" : "Résumé d'import"}</h4>
                      <p className="text-[13px] text-slate-400">
                        {language === "ar"
                          ? "ملخصك الأسبوعي لأفضل المجالات وطلبات الخدمة جاهز."
                          : "Votre résumé hebdomadaire des meilleures niches et demandes de service est prêt."}
                      </p>
                      <div className="mt-8 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">{language === "ar" ? "جاهزية التصدير" : "Prêt pour l'export"}</span>
                          <span className="text-teal-400">{conversionRate}%</span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-teal-500" style={{ width: `${conversionRate}%` }} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSection("analytics")}
                        className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 py-2 text-sm font-semibold transition-colors hover:bg-slate-700"
                      >
                        {language === "ar" ? "عرض التقرير الكامل" : "Voir le rapport complet"}
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

          {activeSection === "analytics" && (() => {
            const cardCls = isDark
              ? "border-slate-800/60 bg-slate-900/50"
              : "border-slate-200 bg-white";
            const subTextCls = isDark ? "text-slate-400" : "text-slate-500";
            const conversion = stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0;
            const rejectionRate = stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0;

            const dailyVelocity = (() => {
              const days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setHours(0, 0, 0, 0);
                d.setDate(d.getDate() - (6 - i));
                return d;
              });
              return days.map((d) => {
                const next = new Date(d);
                next.setDate(d.getDate() + 1);
                const count = registrations.filter((r) => {
                  const t = new Date(r.created_at).getTime();
                  return t >= d.getTime() && t < next.getTime();
                }).length;
                return { day: d.toLocaleDateString(language === "ar" ? "ar-DZ" : "fr-FR", { weekday: "short" }), count };
              });
            })();
            const maxDay = Math.max(1, ...dailyVelocity.map((d) => d.count));
            const peakDay = dailyVelocity.reduce((acc, d) => (d.count > acc.count ? d : acc), dailyVelocity[0]);

            const recentEvents = registrations.slice(0, 4);
            const queueRows = registrations.slice(0, 3);

            const queueStatusFor = (s: RegistrationStatus) => {
              switch (s) {
                case "CONFIRMED":
                  return { label: "Completed", pill: "bg-teal-50 text-teal-700", efficiency: 95 + Math.floor(Math.random() * 4), tone: "text-teal-600" };
                case "CONTACTED":
                  return { label: "Processing", pill: "bg-blue-50 text-blue-700", efficiency: 80 + Math.floor(Math.random() * 10), tone: "text-slate-700" };
                case "REJECTED":
                  return { label: "Rejected", pill: "bg-red-50 text-red-700", efficiency: 10 + Math.floor(Math.random() * 12), tone: "text-red-600" };
                default:
                  return { label: "Queued", pill: "bg-amber-50 text-amber-700", efficiency: 60 + Math.floor(Math.random() * 15), tone: "text-amber-600" };
              }
            };

            const eventIconFor = (s: RegistrationStatus) => {
              switch (s) {
                case "CONFIRMED":
                  return { icon: "check_circle", bg: "bg-teal-50", color: "text-teal-600", label: language === "ar" ? "تمت الموافقة على التسجيل" : "Inscription approuvée" };
                case "REJECTED":
                  return { icon: "cancel", bg: "bg-red-50", color: "text-red-600", label: language === "ar" ? "تم رفض التسجيل" : "Inscription rejetée" };
                case "CONTACTED":
                  return { icon: "call", bg: "bg-amber-50", color: "text-amber-600", label: language === "ar" ? "تم التواصل مع العميل" : "Prospect contacté" };
                default:
                  return { icon: "person_add", bg: "bg-blue-50", color: "text-blue-600", label: language === "ar" ? "تسجيل جديد" : "Nouvelle inscription" };
              }
            };

            const conversionSpark = [30, 45, 38, 55, 50, 62, 70];
            const rejectionSpark = [60, 50, 45, 38, 30, 25, 18];

            return (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">{language === "ar" ? "أداء النظام" : "Performance système"}</h2>
                    <p className={`mt-1 text-[14px] ${subTextCls}`}>
                      {language === "ar" ? "مراقبة فورية للتحويل وكفاءة العمليات." : "Suivi en temps réel de la conversion et du débit opérationnel."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`rounded-lg border px-4 py-2 text-[12px] font-semibold uppercase tracking-wider transition-colors ${
                        isDark
                          ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {language === "ar" ? "تحميل التقرير" : "Télécharger le rapport"}
                    </button>
                    <button
                      type="button"
                      onClick={loadData}
                      className="rounded-lg bg-teal-600 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-teal-700"
                    >
                      {language === "ar" ? "تحديث البيانات" : "Actualiser les données"}
                    </button>
                  </div>
                </div>

                {/* 12-col bento metric grid */}
                <div className="grid grid-cols-12 gap-6">
                  {/* Conversion */}
                  <div className={`col-span-12 rounded-xl border p-6 shadow-sm transition-colors hover:border-teal-500 md:col-span-4 ${cardCls}`}>
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <p className={`text-[12px] font-semibold uppercase tracking-wider ${subTextCls}`}>Conversion</p>
                        <h3 className="mt-1 text-3xl font-bold tracking-tight">{conversion}%</h3>
                      </div>
                      <div className="rounded-lg bg-teal-50 p-2">
                        <span className="material-symbols-outlined text-teal-600">trending_up</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-teal-600">
                      <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                      <span className="text-[13px] font-semibold">+2.4% vs last month</span>
                    </div>
                    <div className={`mt-6 flex h-12 w-full items-end gap-1 overflow-hidden rounded-lg px-2 pb-1 ${isDark ? "bg-slate-900/60" : "bg-slate-50"}`}>
                      {conversionSpark.map((h, idx) => (
                        <div key={idx} className={`w-full rounded-t-sm ${idx === conversionSpark.length - 1 ? "bg-teal-600" : "bg-teal-200"}`} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>

                  {/* Rejection */}
                  <div className={`col-span-12 rounded-xl border p-6 shadow-sm transition-colors hover:border-teal-500 md:col-span-4 ${cardCls}`}>
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <p className={`text-[12px] font-semibold uppercase tracking-wider ${subTextCls}`}>{language === "ar" ? "معدل الرفض" : "Taux de rejet"}</p>
                        <h3 className="mt-1 text-3xl font-bold tracking-tight">{rejectionRate}%</h3>
                      </div>
                      <div className="rounded-lg bg-red-50 p-2">
                        <span className="material-symbols-outlined text-red-600">warning</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                      <span className="text-[13px] font-semibold">{language === "ar" ? "تحسن كفاءة -0.8%" : "gain d'efficacité -0.8%"}</span>
                    </div>
                    <div className={`mt-6 flex h-12 w-full items-end gap-1 overflow-hidden rounded-lg px-2 pb-1 ${isDark ? "bg-slate-900/60" : "bg-slate-50"}`}>
                      {rejectionSpark.map((h, idx) => (
                        <div key={idx} className="w-full rounded-t-sm bg-red-400" style={{ height: `${h}%`, opacity: 0.3 + idx * 0.1 }} />
                      ))}
                    </div>
                  </div>

                  {/* Pending */}
                  <div className={`col-span-12 rounded-xl border p-6 shadow-sm transition-colors hover:border-teal-500 md:col-span-4 ${cardCls}`}>
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <p className={`text-[12px] font-semibold uppercase tracking-wider ${subTextCls}`}>{language === "ar" ? "المتابعات المعلقة" : "Suivis en attente"}</p>
                        <h3 className="mt-1 text-3xl font-bold tracking-tight">{stats.pending}</h3>
                      </div>
                      <div className="rounded-lg bg-blue-50 p-2">
                        <span className="material-symbols-outlined text-blue-600">schedule</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      <span className="text-[13px] font-semibold">{language === "ar" ? `مستوى الأولوية: ${stats.pending > 10 ? "مرتفع" : "عادي"}` : `Niveau de priorité: ${stats.pending > 10 ? "Élevé" : "Normal"}`}</span>
                    </div>
                    <div className={`mt-6 flex h-12 items-center justify-between rounded-lg px-4 ${isDark ? "bg-slate-900/60" : "bg-slate-50"}`}>
                      <div className="flex -space-x-2">
                        {recentEvents.slice(0, 3).map((r) => (
                          <div key={r.id} className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold ${avatarColor(r.id)}`}>
                            {getInitials(r.full_name)}
                          </div>
                        ))}
                        {stats.pending > 3 && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[8px] font-bold text-slate-600">
                            +{stats.pending - 3}
                          </div>
                        )}
                      </div>
                      <span className={`text-[13px] ${subTextCls}`}>{language === "ar" ? "متوسط الرد: 14د" : "Réponse moyenne: 14 min"}</span>
                    </div>
                  </div>

                  {/* Chart 8/4 */}
                  <div className={`col-span-12 overflow-hidden rounded-xl border shadow-sm lg:col-span-8 ${cardCls}`}>
                    <div className={`flex items-center justify-between border-b p-6 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                      <h4 className="text-lg font-semibold tracking-tight">{language === "ar" ? "سرعة التسجيلات" : "Vitesse des inscriptions"}</h4>
                      <select className={`rounded-lg border-none px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-teal-500/20 ${isDark ? "bg-slate-900 text-slate-200" : "bg-slate-50 text-slate-700"}`}>
                        <option>{language === "ar" ? "آخر 7 أيام" : "7 derniers jours"}</option>
                        <option>{language === "ar" ? "آخر 30 يوم" : "30 derniers jours"}</option>
                      </select>
                    </div>
                    <div className="flex h-64 flex-col justify-between p-6">
                      <div className="relative w-full flex-1">
                        <div className="absolute inset-0 flex items-end justify-between gap-4 px-4">
                          {dailyVelocity.map((d, idx) => {
                            const heightPct = Math.max(20, Math.round((d.count / maxDay) * 95));
                            const isPeak = d.count === maxDay && d.count > 0;
                            return (
                              <div
                                key={idx}
                                className={`relative w-full rounded-t-lg ${isPeak ? "bg-teal-600" : idx % 2 === 0 ? "bg-teal-200/60" : "bg-teal-300/40"}`}
                                style={{ height: `${heightPct}%` }}
                              >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-teal-600">
                                  {d.count}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className={`mt-4 flex justify-between border-t pt-4 px-4 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                        {dailyVelocity.map((d, idx) => (
                          <span key={idx} className={`text-[13px] ${subTextCls}`}>{d.day}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className={`col-span-12 flex flex-col overflow-hidden rounded-xl border shadow-sm lg:col-span-4 ${cardCls}`}>
                    <div className={`border-b p-6 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                      <h4 className="text-lg font-semibold tracking-tight">{language === "ar" ? "النشاط الأخير" : "Activité récente"}</h4>
                    </div>
                    <div className="flex-1 space-y-4 overflow-y-auto p-6">
                      {recentEvents.length === 0 ? (
                        <p className={`text-[13px] ${subTextCls}`}>{language === "ar" ? "لا يوجد نشاط حديث بعد." : "Aucune activité récente pour l'instant."}</p>
                      ) : (
                        recentEvents.map((r) => {
                          const ev = eventIconFor(r.status);
                          return (
                            <div key={r.id} className="flex gap-4">
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${ev.bg}`}>
                                <span className={`material-symbols-outlined text-[16px] ${ev.color}`}>{ev.icon}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-[14px] font-semibold">{ev.label}</p>
                                <p className={`truncate text-[13px] ${subTextCls}`}>{r.full_name} · {r.email}</p>
                                <p className="mt-1 text-[11px] text-slate-400">{relativeAge(r.created_at, language)}</p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSection("registrations")}
                      className={`w-full border-t p-4 text-[12px] font-semibold uppercase tracking-wider text-teal-600 transition-colors ${isDark ? "border-slate-800 bg-slate-900/60 hover:bg-slate-800" : "border-slate-100 bg-slate-50 hover:bg-slate-100"}`}
                    >
                      {language === "ar" ? "عرض كل السجلات" : "Voir tous les journaux"}
                    </button>
                  </div>
                </div>

                {/* Detail table */}
                <div className={`overflow-hidden rounded-xl border shadow-sm ${cardCls}`}>
                  <div className={`flex items-center justify-between p-6 ${isDark ? "bg-slate-900/60" : "bg-slate-50"}`}>
                    <h4 className="text-lg font-semibold tracking-tight">{language === "ar" ? "حالة قائمة الاستيراد" : "Statut de la file d'import"}</h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={`rounded-lg border p-2 transition-colors ${isDark ? "border-slate-700 bg-slate-900 hover:bg-slate-800" : "border-slate-200 bg-white hover:shadow-sm"}`}
                      >
                        <span className="material-symbols-outlined">filter_list</span>
                      </button>
                      <button
                        type="button"
                        className={`rounded-lg border p-2 transition-colors ${isDark ? "border-slate-700 bg-slate-900 hover:bg-slate-800" : "border-slate-200 bg-white hover:shadow-sm"}`}
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}>
                      <thead>
                        <tr className={`border-b ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                          <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider">{language === "ar" ? "المرجع" : "Référence"}</th>
                          <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider">{language === "ar" ? "المصدر" : "Source"}</th>
                          <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider">{language === "ar" ? "الحالة" : "Statut"}</th>
                          <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider">{language === "ar" ? "الكفاءة" : "Efficacité"}</th>
                          <th className={`px-6 py-3 text-[11px] font-semibold uppercase tracking-wider ${isRtl ? "text-left" : "text-right"}`}>{language === "ar" ? "إجراء" : "Action"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {queueRows.length === 0 ? (
                          <tr>
                            <td colSpan={5} className={`px-6 py-12 text-center text-[14px] ${subTextCls}`}>{language === "ar" ? "لا توجد عمليات استيراد في القائمة." : "Aucun import dans la file."}</td>
                          </tr>
                        ) : (
                          queueRows.map((r, idx) => {
                            const q = queueStatusFor(r.status);
                            return (
                              <tr key={r.id} className={`border-b transition-colors ${isDark ? "border-slate-800/40 hover:bg-slate-800/40" : "border-slate-50 hover:bg-slate-50"}`}>
                                <td className="px-6 py-4 text-[14px] font-medium">IMP-{new Date(r.created_at).getFullYear()}-{String(idx + 1).padStart(3, "0")}</td>
                                <td className={`px-6 py-4 text-[14px] ${isDark ? "text-slate-200" : "text-slate-700"}`}>{r.full_name}</td>
                                <td className="px-6 py-4">
                                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${q.pill}`}>{q.label}</span>
                                </td>
                                <td className={`px-6 py-4 text-[14px] font-bold ${q.tone}`}>{q.efficiency}.{Math.floor(Math.random() * 9)}%</td>
                                <td className={`px-6 py-4 ${isRtl ? "text-left" : "text-right"}`}>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedId(r.id)}
                                    className="text-[13px] font-medium text-teal-600 hover:underline"
                                  >
                                    {language === "ar" ? "تفاصيل" : "Détails"}
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {peakDay && peakDay.count > 0 && (
                  <p className={`text-[12px] ${subTextCls}`}>
                    {language === "ar"
                      ? <>ذروة هذا الأسبوع: <span className="font-semibold text-teal-600">{peakDay.day}</span> بعدد {peakDay.count} تسجيلات.</>
                      : <>Jour de pic cette semaine: <span className="font-semibold text-teal-600">{peakDay.day}</span> avec {peakDay.count} inscriptions.</>}
                  </p>
                )}
              </div>
            );
          })()}

          {activeSection === "settings" && (
            <section className={`rounded-2xl border p-5 ${isDark ? "border-slate-800/50 bg-slate-900/40" : "border-slate-200 bg-white"}`}>
              <h2 className="text-sm font-semibold">{text.settings}</h2>
              <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{text.comingSoon}</p>
            </section>
          )}

          {activeSection === "pdf" && (
            <section className={`rounded-2xl border ${isDark ? "border-slate-800/50 bg-slate-900/40" : "border-slate-200 bg-white"}`}>
              <div className={`flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${isDark ? "border-slate-800/50" : "border-slate-200"}`}>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold">{language === "ar" ? "شاشة PDF العملاء" : "Client PDF Screen"}</h2>
                  <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    {viewerRole === "admin" && !pdfNewOldFilter
                      ? text.pdfPickFilter
                      : language === "ar"
                        ? "اختر العميل ثم افتح شاشة PDF للطباعة أو التحميل."
                        : "Pick a lead then open the PDF screen to print/download."}
                  </p>
                </div>
                <div className={`flex flex-wrap items-center gap-2 ${isRtl ? "sm:flex-row-reverse" : ""}`}>
                  {viewerRole === "admin" && (
                    <div className={`flex rounded-lg border p-0.5 ${isDark ? "border-slate-700 bg-slate-900/60" : "border-slate-200 bg-slate-50"}`}>
                      <button
                        type="button"
                        onClick={() => setPdfNewOldFilter((prev) => (prev === "new" ? "" : "new"))}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                          pdfNewOldFilter === "new"
                            ? isDark
                              ? "bg-teal-600 text-white"
                              : "bg-white text-teal-700 shadow-sm"
                            : isDark
                              ? "text-slate-400 hover:text-slate-200"
                              : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {text.pdfFilterNew}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPdfNewOldFilter((prev) => (prev === "old" ? "" : "old"))}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                          pdfNewOldFilter === "old"
                            ? isDark
                              ? "bg-teal-600 text-white"
                              : "bg-white text-teal-700 shadow-sm"
                            : isDark
                              ? "text-slate-400 hover:text-slate-200"
                              : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {text.pdfFilterOld}
                      </button>
                    </div>
                  )}
                  {viewerRole === "admin" && pdfNewOldFilter === "old" && (
                    <div className={`flex items-center gap-2 rounded-lg border px-2 py-1 ${isDark ? "border-slate-700 bg-slate-900/60" : "border-slate-200 bg-white"}`}>
                      <label className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {text.pdfDateFrom}
                      </label>
                      <input
                        type="date"
                        value={pdfDateFrom}
                        onChange={(e) => setPdfDateFrom(e.target.value)}
                        className={`rounded-md border px-2 py-1 text-xs outline-none ${isDark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-700"}`}
                      />
                      <label className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {text.pdfDateTo}
                      </label>
                      <input
                        type="date"
                        value={pdfDateTo}
                        onChange={(e) => setPdfDateTo(e.target.value)}
                        className={`rounded-md border px-2 py-1 text-xs outline-none ${isDark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-700"}`}
                      />
                      {(pdfDateFrom || pdfDateTo) && (
                        <button
                          type="button"
                          onClick={() => {
                            setPdfDateFrom("");
                            setPdfDateTo("");
                          }}
                          className={`rounded-md border px-2 py-1 text-[11px] font-medium ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                        >
                          {text.pdfDateClear}
                        </button>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={loadData}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                  >
                    {text.refresh}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}>
                  <thead className={isDark ? "bg-slate-900/80" : "bg-slate-50"}>
                    <tr>
                      <th className={`border-b px-4 py-3 text-[11px] font-semibold uppercase tracking-wider ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                        {language === "ar" ? "الاسم" : "Name"}
                      </th>
                      <th className={`border-b px-4 py-3 text-[11px] font-semibold uppercase tracking-wider ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                        {language === "ar" ? "الهاتف" : "Phone"}
                      </th>
                      <th className={`border-b px-4 py-3 text-[11px] font-semibold uppercase tracking-wider ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                        {language === "ar" ? "ملاحظات" : "Notes"}
                      </th>
                      <th className={`border-b px-4 py-3 text-[11px] font-semibold uppercase tracking-wider ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"} ${isRtl ? "text-left" : "text-right"}`}>
                        PDF
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
                    {pdfScreenRegistrations.map((reg) => (
                      <tr key={reg.id} className={isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}>
                        <td className="px-4 py-3 text-sm font-medium">{reg.full_name}</td>
                        <td className={`px-4 py-3 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{reg.phone}</td>
                        <td className={`max-w-[340px] px-4 py-3 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          <span className="line-clamp-2">{(reg.admin_notes ?? "").trim() || "—"}</span>
                        </td>
                        <td className={`px-4 py-3 ${isRtl ? "text-left" : "text-right"}`}>
                          <button
                            type="button"
                            onClick={() => router.push(`/pdf-preview/${reg.id}`)}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            {language === "ar" ? "فتح PDF" : "Open PDF"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pdfScreenRegistrations.length === 0 && (
                      <tr>
                        <td colSpan={4} className={`px-4 py-8 text-center text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {viewerRole === "admin" && !pdfNewOldFilter ? text.pdfPickFilter : text.noData}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeSection === "confirmatrices" && viewerRole === "admin" && (() => {
            const cardCls = isDark
              ? "border-slate-800/60 bg-slate-900/50"
              : "border-slate-200 bg-white";
            const subTextCls = isDark ? "text-slate-400" : "text-slate-500";
            const inputCls = isDark
              ? "border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500"
              : "border-slate-200 bg-white text-slate-700 placeholder:text-slate-400";
            const labelCls = `mb-2 block text-[12px] font-semibold uppercase tracking-wider ${subTextCls}`;
            const totalUsers = confirmatrices.length;

            return (
              <section className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Confirmatrices Management</h2>
                  <p className={`mt-1 text-[14px] ${subTextCls}`}>
                    Manage specialist accounts and assign their niches.
                  </p>
                </div>

                <div className="grid grid-cols-12 gap-6">
                  {/* Sticky Create card */}
                  <div className="col-span-12 lg:col-span-4">
                    <div className={`sticky top-24 rounded-xl border p-6 shadow-sm ${cardCls}`}>
                      <h3 className="mb-6 text-lg font-semibold tracking-tight">{text.createConfirmatrice}</h3>
                      <div className="space-y-5">
                        <div>
                          <label className={labelCls}>{text.confirmatriceEmail} Address</label>
                          <input
                            type="email"
                            value={createEmail}
                            onChange={(e) => setCreateEmail(e.target.value)}
                            placeholder="e.g. sarah.j@import.com"
                            className={`w-full rounded-lg border px-4 py-2.5 text-[14px] transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${inputCls}`}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>{text.confirmatricePassword}</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={createPassword}
                              onChange={(e) => setCreatePassword(e.target.value)}
                              placeholder="Set a temporary password"
                              className={`w-full rounded-lg border px-4 py-2.5 text-[14px] transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${inputCls} ${isRtl ? "pl-10 text-right" : "pr-10 text-left"}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const generated = Math.random().toString(36).slice(2, 10) + "!" + Math.floor(10 + Math.random() * 89);
                                setCreatePassword(generated);
                              }}
                              title="Generate password"
                              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 ${isRtl ? "left-3" : "right-3"}`}
                            >
                              <span className="material-symbols-outlined">refresh</span>
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Experience Scope</label>
                          <select
                            value={createExperienceLevel}
                            onChange={(e) => setCreateExperienceLevel(e.target.value as "" | "beginner" | "professional")}
                            className={`w-full appearance-none rounded-lg border px-4 py-2.5 text-[14px] transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${inputCls}`}
                          >
                            <option value="">Choose level</option>
                            <option value="beginner">Beginner (imported before: No)</option>
                            <option value="professional">Professional (imported before: Yes)</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={handleCreateConfirmatrice}
                          disabled={confirmatriceBusy}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
                          {confirmatriceBusy ? "Please wait..." : text.createAccount}
                        </button>
                        <button
                          type="button"
                          onClick={() => loadConfirmatrices()}
                          className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-[13px] font-medium transition-colors ${
                            isDark ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">refresh</span>
                          {text.refresh}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="col-span-12 space-y-6 lg:col-span-8">
                    <div className={`overflow-hidden rounded-xl border shadow-sm ${cardCls}`}>
                      <div className={`flex items-center justify-between border-b px-6 py-4 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                        <h3 className="text-lg font-semibold tracking-tight">{text.confirmatriceAccounts}</h3>
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                          {totalUsers} Total {totalUsers === 1 ? "User" : "Users"}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}>
                          <thead className={isDark ? "bg-slate-900/60" : "bg-slate-50/50"}>
                            <tr>
                              <th className={`px-6 py-4 text-[11px] font-semibold uppercase tracking-wider ${subTextCls}`}>Email</th>
                              <th className={`px-6 py-4 text-[11px] font-semibold uppercase tracking-wider ${subTextCls}`}>Password</th>
                              <th className={`px-6 py-4 text-[11px] font-semibold uppercase tracking-wider ${subTextCls}`}>Niche</th>
                              <th className={`px-6 py-4 text-[11px] font-semibold uppercase tracking-wider ${subTextCls}`}>Experience</th>
                              <th className={`px-6 py-4 text-[11px] font-semibold uppercase tracking-wider ${subTextCls}`}>Created Date</th>
                              <th className={`px-6 py-4 text-[11px] font-semibold uppercase tracking-wider ${subTextCls} ${isRtl ? "text-left" : "text-right"}`}>Actions</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
                            {confirmatrices.length === 0 && !confirmatriceBusy ? (
                              <tr>
                                <td colSpan={6} className={`px-6 py-12 text-center text-[14px] ${subTextCls}`}>
                                  No confirmatrice accounts saved yet.
                                </td>
                              </tr>
                            ) : (
                              confirmatrices.map((item) => {
                                const isEditing = editingId === item.id;
                                const initials = getInitials(item.email.split("@")[0].replace(/[._-]/g, " "));
                                const avatarCls = avatarColor(item.id);
                                return (
                                  <tr key={item.id} className={`group transition-colors ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/50"}`}>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${avatarCls}`}>
                                          {initials}
                                        </div>
                                        <span className={`text-[14px] font-medium ${isDark ? "text-slate-100" : "text-slate-900"}`}>{item.email}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={editPassword}
                                          onChange={(e) => setEditPassword(e.target.value)}
                                          className={`w-44 rounded-lg border px-3 py-1.5 text-[13px] focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${inputCls}`}
                                        />
                                      ) : (
                                        <div className="group/pass relative flex cursor-pointer items-center gap-2">
                                          <span
                                            className="select-none text-slate-300 group-hover/pass:hidden"
                                            onClick={() => copyCredentials(item)}
                                          >
                                            • • • • • • • •
                                          </span>
                                          <span
                                            className={`hidden font-mono text-[13px] group-hover/pass:inline ${isDark ? "text-slate-100" : "text-slate-900"}`}
                                            onClick={() => copyCredentials(item)}
                                          >
                                            {item.temporary_password}
                                          </span>
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4">
                                      {isEditing ? (
                                        <select
                                          value={editNiche}
                                          onChange={(e) => setEditNiche(e.target.value)}
                                          className={`rounded-lg border px-3 py-1.5 text-[13px] focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${inputCls}`}
                                        >
                                          {NICHE_OPTIONS.map((option) => (
                                            <option key={option} value={option}>{cleanNicheLabel(option, language)}</option>
                                          ))}
                                        </select>
                                      ) : (
                                        <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${isDark ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
                                          {item.niche ? cleanNicheLabel(item.niche, language) : "All niches"}
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4">
                                      {isEditing ? (
                                        <select
                                          value={editExperienceLevel}
                                          onChange={(e) => setEditExperienceLevel(e.target.value as "beginner" | "professional")}
                                          className={`rounded-lg border px-3 py-1.5 text-[13px] focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${inputCls}`}
                                        >
                                          <option value="beginner">Beginner</option>
                                          <option value="professional">Professional</option>
                                        </select>
                                      ) : (
                                        <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${item.experience_level === "professional"
                                          ? "bg-blue-100 text-blue-700"
                                          : isDark ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
                                          {item.experience_level === "professional" ? "Professional" : "Beginner"}
                                        </span>
                                      )}
                                    </td>
                                    <td className={`px-6 py-4 text-[14px] ${subTextCls}`}>
                                      {formatShortDate(item.created_at, language)}
                                    </td>
                                    <td className={`px-6 py-4 ${isRtl ? "text-left" : "text-right"}`}>
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => copyCredentials(item)}
                                          title={text.copyCredentials}
                                          className={`rounded-md p-1.5 transition-colors ${isDark ? "text-slate-400 hover:bg-slate-800 hover:text-teal-400" : "text-slate-400 hover:bg-slate-100 hover:text-teal-600"}`}
                                        >
                                          <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                        </button>
                                        {isEditing ? (
                                          <button
                                            type="button"
                                            onClick={() => saveEdit(item)}
                                            disabled={confirmatriceBusy}
                                            className="rounded-md bg-teal-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                                          >
                                            {text.saveChanges}
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => startEditing(item)}
                                            title="Edit Account"
                                            className={`rounded-md p-1.5 transition-colors ${isDark ? "text-slate-400 hover:bg-slate-800 hover:text-teal-400" : "text-slate-400 hover:bg-slate-100 hover:text-teal-600"}`}
                                          >
                                            <span className="material-symbols-outlined text-[18px]">edit_square</span>
                                          </button>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteConfirmatrice(item)}
                                          disabled={confirmatriceBusy}
                                          title="Delete Account Permanently"
                                          className={`rounded-md p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? "text-red-300 hover:bg-red-900/30 hover:text-red-200" : "text-red-500 hover:bg-red-50 hover:text-red-700"}`}
                                        >
                                          <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                      {confirmatrices.length > 0 && (
                        <div className={`flex items-center justify-between border-t px-6 py-4 ${isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-slate-50/50"}`}>
                          <span className={`text-[13px] ${subTextCls}`}>
                            Showing {confirmatrices.length} of {totalUsers} {totalUsers === 1 ? "account" : "accounts"}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled
                              className={`rounded border px-3 py-1.5 text-xs font-medium opacity-50 ${isDark ? "border-slate-700" : "border-slate-200"}`}
                            >
                              Previous
                            </button>
                            <button
                              type="button"
                              className={`rounded border px-3 py-1.5 text-xs font-bold shadow-sm ${isDark ? "border-teal-500 bg-slate-900 text-teal-400" : "border-teal-600 bg-white text-teal-600"}`}
                            >
                              1
                            </button>
                            <button
                              type="button"
                              disabled
                              className={`rounded border px-3 py-1.5 text-xs font-medium opacity-50 ${isDark ? "border-slate-700" : "border-slate-200"}`}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className={`rounded-xl border p-6 ${isDark ? "border-teal-700/30 bg-teal-950/20" : "border-teal-200/60 bg-teal-50/40"}`}>
                        <div className="mb-2 flex items-center gap-3 text-teal-600">
                          <span className="material-symbols-outlined">shield_person</span>
                          <span className="text-lg font-semibold tracking-tight">Security Tip</span>
                        </div>
                        <p className={`text-[13px] ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          Passwords are masked for security. Hover over the masked text to quickly reveal the credential for copying.
                        </p>
                      </div>
                      <div className={`rounded-xl border p-6 ${isDark ? "border-blue-700/30 bg-blue-950/20" : "border-blue-200/60 bg-blue-50/40"}`}>
                        <div className="mb-2 flex items-center gap-3 text-blue-600">
                          <span className="material-symbols-outlined">info</span>
                          <span className="text-lg font-semibold tracking-tight">Niche Limits</span>
                        </div>
                        <p className={`text-[13px] ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          Each Confirmatrice can currently be assigned to only one niche to maintain data integrity and workflow focus.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* Error */}
          {(error || confirmatriceError || confirmatriceNotice) && (
            <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
              confirmatriceNotice
                ? (isDark ? "border-emerald-700/40 bg-emerald-950/30 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-700")
                : (isDark ? "border-red-700/40 bg-red-950/30 text-red-200" : "border-red-200 bg-red-50 text-red-700")
            }`}>
              <span className="material-symbols-outlined text-base">
                {confirmatriceNotice ? "check_circle" : "error"}
              </span>
              {confirmatriceNotice ?? confirmatriceError ?? error}
            </div>
          )}
        </div>
      </main>

      {/* Detail Drawer */}
      <DetailDrawer
        registration={selected}
        images={registrationImages}
        imageBusy={imageBusy}
        onClose={() => setSelectedId(null)}
        onStatusChange={updateStatus}
        onSaveNotes={saveNotes}
        onUploadImage={uploadRegistrationImage}
        onGeneratePdf={generateRegistrationPdf}
        saving={saving}
        themeMode={themeMode}
        text={text}
        locale={language}
      />

    </div>
  );
}
