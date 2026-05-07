import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { sampleLeads, sampleClients } from './pixorra-data';

export type Lead = {
  id: string;
  name: string;
  business: string;
  city: string;
  stage: 'new' | 'demo' | 'neg' | 'won' | 'lost';
  value: number;
  hot: boolean;
  when: string;
  phone: string;
  notes?: string;
};

export type Client = {
  id: string;
  name: string;
  owner: string;
  city: string;
  value: number;
  paid: number;
  status: 'active' | 'completed' | 'hold';
  day: number;
};

export type Reminder = {
  id: string;
  title: string;
  date: string; // ISO
  done: boolean;
  tag?: string;
};

type Store = {
  leads: Lead[];
  clients: Client[];
  reminders: Reminder[];
  addLead: (l: Omit<Lead, 'id' | 'when'>) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addClient: (c: Omit<Client, 'id'>) => void;
  updateClient: (id: string, patch: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addReminder: (r: Omit<Reminder, 'id' | 'done'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
};

const Ctx = createContext<Store | null>(null);

const KEY = 'pixorra-store-v1';

function load<T>(slot: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${KEY}:${slot}`);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch { return fallback; }
}
function save<T>(slot: string, value: T) {
  try { localStorage.setItem(`${KEY}:${slot}`, JSON.stringify(value)); } catch {}
}

const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>(() => load('leads', sampleLeads as Lead[]));
  const [clients, setClients] = useState<Client[]>(() => load('clients', sampleClients as Client[]));
  const [reminders, setReminders] = useState<Reminder[]>(() => load('reminders', [
    { id: 'r1', title: 'Call back Rajat — Mehra Fitness', date: new Date(Date.now() + 3600_000).toISOString(), done: false, tag: 'call' },
    { id: 'r2', title: 'Send Day 6 preview to Bloom Salon', date: new Date(Date.now() + 7200_000).toISOString(), done: false, tag: 'demo' },
    { id: 'r3', title: 'Razorpay link to Karan Singh', date: new Date(Date.now() + 86400_000).toISOString(), done: false, tag: 'payment' },
  ]));

  useEffect(() => save('leads', leads), [leads]);
  useEffect(() => save('clients', clients), [clients]);
  useEffect(() => save('reminders', reminders), [reminders]);

  const addLead = useCallback((l: Omit<Lead, 'id' | 'when'>) => {
    setLeads(p => [{ ...l, id: 'L-' + uid(), when: 'just now' }, ...p]);
  }, []);
  const updateLead = useCallback((id: string, patch: Partial<Lead>) => {
    setLeads(p => p.map(l => l.id === id ? { ...l, ...patch } : l));
  }, []);
  const deleteLead = useCallback((id: string) => setLeads(p => p.filter(l => l.id !== id)), []);

  const addClient = useCallback((c: Omit<Client, 'id'>) => {
    setClients(p => [{ ...c, id: 'C-' + uid() }, ...p]);
  }, []);
  const updateClient = useCallback((id: string, patch: Partial<Client>) => {
    setClients(p => p.map(c => c.id === id ? { ...c, ...patch } : c));
  }, []);
  const deleteClient = useCallback((id: string) => setClients(p => p.filter(c => c.id !== id)), []);

  const addReminder = useCallback((r: Omit<Reminder, 'id' | 'done'>) => {
    setReminders(p => [{ ...r, id: uid(), done: false }, ...p]);
  }, []);
  const toggleReminder = useCallback((id: string) =>
    setReminders(p => p.map(r => r.id === id ? { ...r, done: !r.done } : r)), []);
  const deleteReminder = useCallback((id: string) => setReminders(p => p.filter(r => r.id !== id)), []);

  return (
    <Ctx.Provider value={{
      leads, clients, reminders,
      addLead, updateLead, deleteLead,
      addClient, updateClient, deleteClient,
      addReminder, toggleReminder, deleteReminder,
    }}>{children}</Ctx.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
