'use client';

import { useEffect, useState } from 'react';
import { Building2, Mail, Pencil, Plus, Trash2, UserRound, X } from 'lucide-react';
import { ADMIN_COMPANIES, type Company } from '@/lib/placementAdminData';
import { readCompanies, saveCompanies } from '@/lib/demoStore';
import { toast } from 'sonner';

const emptyCompany: Omit<Company, 'id'> = {
  name: '',
  industry: '',
  sector: 'product',
  contact: '',
  email: '',
  openings: 1,
};

export default function CompanyRoster() {
  const [companies, setCompanies] = useState<Company[]>(ADMIN_COMPANIES);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyCompany);

  useEffect(() => {
    setCompanies(readCompanies() ?? ADMIN_COMPANIES);
  }, []);

  const updateField = (field: keyof typeof emptyCompany, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: field === 'openings' ? Math.max(1, Number(value)) : value,
    }));
  };

  const startAdd = () => {
    setEditingId(null);
    setForm(emptyCompany);
    setFormOpen(true);
  };

  const startEdit = (company: Company) => {
    setEditingId(company.id);
    setForm({
      name: company.name,
      industry: company.industry,
      sector: company.sector,
      contact: company.contact,
      email: company.email,
      openings: company.openings,
    });
    setFormOpen(true);
  };

  const saveCompany = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.industry.trim() || !form.contact.trim() || !form.email.trim()) {
      toast.error('Complete all company fields');
      return;
    }
    const nextCompanies = editingId
      ? companies.map((company) => (company.id === editingId ? { ...company, ...form } : company))
      : [...companies, { ...form, id: `company-${Date.now()}` }];
    setCompanies(nextCompanies);
    saveCompanies(nextCompanies);
    setFormOpen(false);
    toast.success(editingId ? 'Company updated' : 'Company added');
  };

  const deleteCompany = (company: Company) => {
    if (!window.confirm(`Delete ${company.name}?`)) return;
    const nextCompanies = companies.filter((item) => item.id !== company.id);
    setCompanies(nextCompanies);
    saveCompanies(nextCompanies);
    toast.success('Company deleted');
  };

  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Companies</p>
          <h2 className="mt-2 text-2xl font-bold">Partner roster</h2>
        </div>
        <button type="button" onClick={startAdd} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Plus size={16} /> Add company
        </button>
      </div>
      {formOpen && (
        <form onSubmit={saveCompany} className="mt-6 rounded-[1.5rem] border bg-muted/50 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{editingId ? 'Edit company' : 'Add new company'}</h3>
            <button type="button" onClick={() => setFormOpen(false)} aria-label="Close company form"><X size={18} /></button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {([
              ['name', 'Company name', 'Infosphere Labs'],
              ['industry', 'Industry', 'Enterprise Software'],
              ['contact', 'Contact person', 'Aparna Rao'],
              ['email', 'Contact email', 'hiring@example.com'],
            ] as const).map(([field, label, placeholder]) => (
              <label key={field} className="text-sm font-medium">
                {label}
                <input required value={form[field]} onChange={(event) => updateField(field, event.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-xl border bg-background px-3 py-2 font-normal" />
              </label>
            ))}
            <label className="text-sm font-medium">Sector
              <select value={form.sector} onChange={(event) => updateField('sector', event.target.value)} className="mt-1 w-full rounded-xl border bg-background px-3 py-2 font-normal">
                <option value="product">Product</option><option value="service">Service</option><option value="core">Core</option><option value="consulting">Consulting</option>
              </select>
            </label>
            <label className="text-sm font-medium">Openings
              <input required type="number" min="1" value={form.openings} onChange={(event) => updateField('openings', event.target.value)} className="mt-1 w-full rounded-xl border bg-background px-3 py-2 font-normal" />
            </label>
          </div>
          <button type="submit" className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save company</button>
        </form>
      )}
      <div className="mt-6 space-y-4">
        {companies.map((company) => (
          <div key={company.id} className="rounded-[1.5rem] border p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{company.name}</p>
                <p className="text-sm text-muted-foreground">{company.industry}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">{company.sector}</span>
                <button type="button" onClick={() => startEdit(company)} title={`Edit ${company.name}`} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil size={16} /></button>
                <button type="button" onClick={() => deleteCompany(company)} title={`Delete ${company.name}`} className="rounded-lg p-2 text-muted-foreground hover:bg-danger/10 hover:text-danger"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <UserRound size={14} />
                {company.contact}
              </span>
              <span className="inline-flex items-center gap-1">
                <Mail size={14} />
                {company.email}
              </span>
              <span className="inline-flex items-center gap-1">
                <Building2 size={14} />
                {company.openings} openings
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
