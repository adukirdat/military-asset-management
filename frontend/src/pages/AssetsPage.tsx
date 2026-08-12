import { isAxiosError } from 'axios';
import { Box, Plus, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { createAsset, deleteAsset, getAssets, updateAsset } from '../api/assets';
import { getBases } from '../api/bases';
import { getEquipmentTypes } from '../api/equipmentTypes';
import { Permission } from '../config/permissions';
import { useAuth } from '../context/AuthContext';
import { assetStatusLabels, type Asset, type AssetStatus } from '../types/asset';
import type { Base } from '../types/base';
import type { EquipmentType } from '../types/equipmentType';

const statuses: AssetStatus[] = ['ACTIVE', 'ASSIGNED', 'IN_TRANSIT', 'MAINTENANCE', 'RETIRED'];
type AssetForm = { assetTag: string; equipmentTypeId: string; baseId: string; status: AssetStatus };

function errorMessage(error: unknown, action: 'load' | 'save' | 'delete'): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 403) return 'You do not have permission to perform this action.';
    if (error.response?.status === 404) return 'This asset no longer exists.';
    if (error.response?.status === 409) return action === 'delete' ? 'This asset cannot be deleted because it is referenced by existing records.' : 'An asset with this asset tag already exists.';
  }
  return action === 'load' ? 'Unable to load assets. Please try again.' : 'Unable to complete the asset request. Please try again.';
}

export function AssetsPage() {
  const { user, hasPermission } = useAuth();
  const isAdmin = hasPermission(Permission.SYSTEM_ADMIN);
  const canManage = hasPermission(Permission.ASSET_MANAGEMENT);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [types, setTypes] = useState<EquipmentType[]>([]);
  const [bases, setBases] = useState<Base[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AssetStatus | ''>('');
  const [equipmentTypeId, setEquipmentTypeId] = useState('');
  const [baseId, setBaseId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [typesError, setTypesError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Asset | null | undefined>(undefined);
  const [form, setForm] = useState<AssetForm>({ assetTag: '', equipmentTypeId: '', baseId: '', status: 'ACTIVE' });
  const [saving, setSaving] = useState(false);

  const loadAssets = useCallback(async () => {
    try {
      setError(null);
      setAssets(await getAssets({ search: search.trim() || undefined, status: status || undefined, equipmentTypeId: equipmentTypeId || undefined, baseId: isAdmin ? baseId || undefined : undefined }));
    } catch (requestError) { setError(errorMessage(requestError, 'load')); }
  }, [baseId, equipmentTypeId, isAdmin, search, status]);

  const loadTypes = useCallback(async () => {
    try { setTypesError(null); setTypes(await getEquipmentTypes()); }
    catch { setTypesError('Unable to load equipment types. Please try again.'); }
  }, []);

  useEffect(() => { void loadAssets(); }, [loadAssets]);
  useEffect(() => { void loadTypes(); }, [loadTypes]);
  useEffect(() => { if (isAdmin) void getBases().then(setBases).catch(() => setError('Unable to load bases. Please try again.')); }, [isAdmin]);

  function openForm(asset?: Asset) {
    setForm(asset ? { assetTag: asset.assetTag, equipmentTypeId: asset.equipmentType.id, baseId: asset.base.id, status: asset.status } : { assetTag: '', equipmentTypeId: types[0]?.id ?? '', baseId: isAdmin ? bases[0]?.id ?? '' : user?.baseId ?? '', status: 'ACTIVE' });
    setEditing(asset ?? null);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.assetTag.trim() || !form.equipmentTypeId || !form.baseId) { setError('Asset tag, equipment type, and base are required.'); return; }
    setSaving(true);
    try {
      const input = { ...form, assetTag: form.assetTag.trim() };
      if (editing) await updateAsset(editing.id, input); else await createAsset(input);
      setEditing(undefined);
      await loadAssets();
    } catch (requestError) { setError(errorMessage(requestError, 'save')); }
    finally { setSaving(false); }
  }

  async function remove(asset: Asset) {
    if (!confirm(`Delete ${asset.assetTag}? Linked assets cannot be deleted.`)) return;
    try { await deleteAsset(asset.id); await loadAssets(); }
    catch (requestError) { setError(errorMessage(requestError, 'delete')); }
  }

  return <main className="min-h-screen p-4 sm:p-6"><section className="mx-auto max-w-7xl"><header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5"><div><h1 className="flex items-center gap-3 text-2xl font-semibold"><Box className="text-emerald-300" />Assets</h1><p className="mt-2 text-sm text-slate-400">Physical equipment registered to operational bases.</p></div>{canManage && <button className="rounded bg-emerald-500 px-4 py-2 font-medium text-slate-950" type="button" onClick={() => openForm()}><Plus className="mr-1 inline" size={16} />Add asset</button>}</header>{error && <p className="mt-4 rounded border border-red-500/40 p-3 text-red-200" role="alert">{error}</p>}{typesError && <p className="mt-4 rounded border border-amber-500/40 p-3 text-amber-100" role="alert">{typesError} <button className="underline" type="button" onClick={() => void loadTypes()}>Retry</button></p>}<div className="mt-5 flex flex-wrap gap-3"><input className="rounded border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Search asset tag" value={search} onChange={(event) => setSearch(event.target.value)} /><select aria-label="Filter by status" className="rounded border border-slate-600 bg-slate-900 px-3 py-2" value={status} onChange={(event) => setStatus(event.target.value as AssetStatus | '')}><option value="">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{assetStatusLabels[item]}</option>)}</select><select aria-label="Filter by equipment type" className="rounded border border-slate-600 bg-slate-900 px-3 py-2" value={equipmentTypeId} disabled={Boolean(typesError)} onChange={(event) => setEquipmentTypeId(event.target.value)}><option value="">{types.length ? 'All equipment types' : 'No equipment types available'}</option>{types.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>{isAdmin && <select aria-label="Filter by base" className="rounded border border-slate-600 bg-slate-900 px-3 py-2" value={baseId} onChange={(event) => setBaseId(event.target.value)}><option value="">All bases</option>{bases.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>}<button className="border border-slate-600 px-3 py-2" type="button" onClick={() => { setSearch(''); setStatus(''); setEquipmentTypeId(''); setBaseId(''); }}>Clear filters</button></div><div className="mt-5 overflow-x-auto border border-slate-700"><table className="w-full min-w-[700px] text-sm"><thead className="bg-slate-800"><tr><th className="p-3 text-left">Asset tag</th><th className="text-left">Equipment type</th><th className="text-left">Base</th><th className="text-left">Status</th>{canManage && <th>Actions</th>}</tr></thead><tbody>{assets.map((asset) => <tr className="border-t border-slate-800" key={asset.id}><td className="p-3">{asset.assetTag}</td><td>{asset.equipmentType.name} · {asset.equipmentType.category}</td><td>{asset.base.name}</td><td>{assetStatusLabels[asset.status]}</td>{canManage && <td><button type="button" onClick={() => openForm(asset)}>Edit</button>{isAdmin && <button className="ml-3 text-red-300" onClick={() => void remove(asset)} type="button" aria-label={`Delete ${asset.assetTag}`}><Trash2 size={16} /></button>}</td>}</tr>)}</tbody></table>{!assets.length && <p className="p-8 text-center text-slate-400">No assets match your filters.</p>}</div></section>{editing !== undefined && <div className="fixed inset-0 grid place-items-center bg-slate-950/75 p-4"><form className="w-full max-w-md space-y-4 rounded bg-slate-900 p-6" onSubmit={save}><button className="float-right" type="button" onClick={() => setEditing(undefined)} aria-label="Close asset form"><X /></button><h2>{editing ? 'Edit asset' : 'Add asset'}</h2><input className="w-full rounded border border-slate-600 bg-slate-950 p-2" placeholder="Asset tag" maxLength={120} value={form.assetTag} onChange={(event) => setForm({ ...form, assetTag: event.target.value })} /><select className="w-full rounded border border-slate-600 bg-slate-950 p-2" value={form.equipmentTypeId} onChange={(event) => setForm({ ...form, equipmentTypeId: event.target.value })}>{types.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.category}</option>)}</select>{isAdmin ? <select className="w-full rounded border border-slate-600 bg-slate-950 p-2" value={form.baseId} onChange={(event) => setForm({ ...form, baseId: event.target.value })}>{bases.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select> : <p className="text-sm text-slate-400">Assigned base: {user?.baseId ?? 'None'}</p>}<select className="w-full rounded border border-slate-600 bg-slate-950 p-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AssetStatus })}>{statuses.map((item) => <option key={item} value={item}>{assetStatusLabels[item]}</option>)}</select><button disabled={saving} className="w-full rounded bg-emerald-500 p-2 text-slate-950" type="submit">{saving ? 'Saving…' : 'Save asset'}</button></form></div>}</main>;
}
