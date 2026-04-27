"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { formatDate, type Registration, type RegistrationImage } from "../../lib";

export default function PdfPreviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [images, setImages] = useState<RegistrationImage[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      setRegistration(null);
      setImages([]);
      try {
        const [{ data: regData, error: regErr }, { data: imgData, error: imgErr }] = await Promise.all([
          supabase
            .from("registrations")
            .select("*")
            .eq("id", id)
            .maybeSingle(),
          supabase
            .from("registration_images")
            .select("id, registration_id, image_data_url, created_at")
            .eq("registration_id", id)
            .order("created_at", { ascending: true }),
        ]);

        if (regErr) throw regErr;
        if (imgErr) throw imgErr;
        if (!regData) throw new Error("Registration not found.");

        setRegistration(regData as Registration);
        setImages((imgData as RegistrationImage[]) ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load PDF preview.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const importedLabel = useMemo(
    () => (registration?.imported_before ? "Yes" : "No"),
    [registration],
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-6 text-slate-700">
        Loading PDF preview...
      </main>
    );
  }

  if (error || !registration) {
    return (
      <main className="min-h-screen bg-slate-100 p-6 text-slate-700">
        <p className="mb-4 text-red-600">{error ?? "Failed to load registration."}</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
        >
          Back
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-5 py-4 print:hidden">
          <h1 className="text-lg font-bold text-slate-800">Client PDF Preview</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Print / Save PDF
            </button>
          </div>
        </div>

        <article className="space-y-6 p-6 text-slate-800">
          <header>
            <h2 className="text-2xl font-bold">Lead Summary</h2>
            <p className="mt-1 text-sm text-slate-500">ID: {registration.id}</p>
          </header>

          <section className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <p><strong>Name:</strong> {registration.full_name}</p>
            <p><strong>Phone:</strong> {registration.phone}</p>
            <p><strong>Email:</strong> {registration.email}</p>
            <p><strong>Date:</strong> {formatDate(registration.created_at, "fr")}</p>
            <p><strong>Imported Before:</strong> {importedLabel}</p>
            <p><strong>Service:</strong> {registration.service_type}</p>
            <p><strong>Status:</strong> {registration.status}</p>
          </section>

          <section>
            <h3 className="mb-2 text-base font-semibold">Notes</h3>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 whitespace-pre-wrap">
              {(registration.admin_notes ?? "").trim() || "No notes."}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-base font-semibold">Images ({images.length})</h3>
            {images.length === 0 ? (
              <p className="text-sm text-slate-500">No images uploaded.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {images.map((image) => (
                  <div key={image.id} className="overflow-hidden rounded-lg border border-slate-200">
                    <img src={image.image_data_url} alt="lead attachment" className="h-56 w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </section>
        </article>
      </div>
    </main>
  );
}
