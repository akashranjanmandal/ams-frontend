"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { useToast } from "@/components/Toast";
import { SectionTitle, Spinner, Empty } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { fmtMoney } from "@/lib/format";

interface Asset { id: number; asset_type: string; description: string; value: number; }
interface Liab { id: number; liability_type: string; description: string; amount: number; creditor: string; }

export default function AssetsPage() {
  const { data: assets, reload: reloadA } = useApi<Asset[]>("/api/assets/mine");
  const { data: liabs, reload: reloadL } = useApi<Liab[]>("/api/liabilities/mine");
  const { push } = useToast();
  const [modal, setModal] = useState<"asset" | "liab" | null>(null);
  const [busy, setBusy] = useState(false);
  const [a, setA] = useState({ asset_type: "", description: "", value: 0 });
  const [l, setL] = useState({ liability_type: "", description: "", amount: 0, creditor: "" });

  async function addAsset(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try { await api.post("/api/assets", a); push("success", "Asset added."); setModal(null); setA({ asset_type: "", description: "", value: 0 }); reloadA(); }
    catch (err) { push("error", err instanceof ApiError ? err.message : "Failed"); }
    finally { setBusy(false); }
  }
  async function addLiab(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try { await api.post("/api/liabilities", l); push("success", "Liability added."); setModal(null); setL({ liability_type: "", description: "", amount: 0, creditor: "" }); reloadL(); }
    catch (err) { push("error", err instanceof ApiError ? err.message : "Failed"); }
    finally { setBusy(false); }
  }
  async function del(kind: "assets" | "liabilities", id: number) {
    try { await api.del(`/api/${kind}/${id}`); push("info", "Removed."); kind === "assets" ? reloadA() : reloadL(); }
    catch { push("error", "Failed to remove"); }
  }

  return (
    <div>
      <SectionTitle title="Assets & Liability" subtitle="Declare your assets and liabilities." />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assets */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[var(--color-green-deep)]">Assets</h3>
            <button onClick={() => setModal("asset")} className="btn btn-ghost !py-2 !px-4 text-sm"><Plus size={16} /> Add</button>
          </div>
          {!assets?.length ? <Empty message="No assets declared" /> : (
            <ul className="space-y-2">
              {assets.map((x) => (
                <li key={x.id} className="flex items-center justify-between rounded-xl border border-[var(--color-line)] p-3">
                  <div>
                    <p className="font-semibold text-[var(--color-ink)]">{x.asset_type}</p>
                    <p className="text-sm text-[var(--color-ink-faint)]">{x.description || "—"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[var(--color-ink)]">{fmtMoney(x.value)}</span>
                    <button onClick={() => del("assets", x.id)} className="text-[var(--color-danger)] hover:opacity-70"><Trash2 size={17} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Liabilities */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[var(--color-green-deep)]">Liabilities</h3>
            <button onClick={() => setModal("liab")} className="btn btn-ghost !py-2 !px-4 text-sm"><Plus size={16} /> Add</button>
          </div>
          {!liabs?.length ? <Empty message="No liabilities declared" /> : (
            <ul className="space-y-2">
              {liabs.map((x) => (
                <li key={x.id} className="flex items-center justify-between rounded-xl border border-[var(--color-line)] p-3">
                  <div>
                    <p className="font-semibold text-[var(--color-ink)]">{x.liability_type}</p>
                    <p className="text-sm text-[var(--color-ink-faint)]">{x.creditor || x.description || "—"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[var(--color-ink)]">{fmtMoney(x.amount)}</span>
                    <button onClick={() => del("liabilities", x.id)} className="text-[var(--color-danger)] hover:opacity-70"><Trash2 size={17} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal open={modal === "asset"} onClose={() => setModal(null)} title="Add Asset">
        <form onSubmit={addAsset} className="space-y-4">
          <div><label className="label">Asset Type</label><input className="input" placeholder="e.g. Land, Vehicle" value={a.asset_type} onChange={(e) => setA({ ...a, asset_type: e.target.value })} required /></div>
          <div><label className="label">Description</label><input className="input" value={a.description} onChange={(e) => setA({ ...a, description: e.target.value })} /></div>
          <div><label className="label">Value (₹)</label><input type="number" className="input" value={a.value} onChange={(e) => setA({ ...a, value: +e.target.value })} /></div>
          <button className="btn btn-primary w-full" disabled={busy}>{busy ? <Spinner /> : "Add Asset"}</button>
        </form>
      </Modal>

      <Modal open={modal === "liab"} onClose={() => setModal(null)} title="Add Liability">
        <form onSubmit={addLiab} className="space-y-4">
          <div><label className="label">Liability Type</label><input className="input" placeholder="e.g. Home Loan" value={l.liability_type} onChange={(e) => setL({ ...l, liability_type: e.target.value })} required /></div>
          <div><label className="label">Creditor</label><input className="input" value={l.creditor} onChange={(e) => setL({ ...l, creditor: e.target.value })} /></div>
          <div><label className="label">Amount (₹)</label><input type="number" className="input" value={l.amount} onChange={(e) => setL({ ...l, amount: +e.target.value })} /></div>
          <button className="btn btn-primary w-full" disabled={busy}>{busy ? <Spinner /> : "Add Liability"}</button>
        </form>
      </Modal>
    </div>
  );
}
