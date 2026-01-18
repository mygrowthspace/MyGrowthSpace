
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Habit, UserProfile, SuggestedCard } from './types';
import Onboarding from './components/Onboarding';
import HabitCard from './components/HabitCard';
import SuggestedCardComponent from './components/SuggestedCardComponent';
import { generateSuggestedCards, analyzeHabitProgress } from './services/geminiService';
import { 
  Plus, 
  LayoutDashboard, 
  BarChart2, 
  Dumbbell, 
  Loader2, 
  X, 
  Send, 
  LogOut, 
  Award, 
  History, 
  ArrowRight,
  Trash2,
  Minimize2,
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const CATEGORIES = ['Health', 'Mindset', 'Productivity', 'Finance', 'Social'];

const App: React.FC = () => {
  const [path, setPath] = useState<'landing' | 'auth' | 'app'>('landing');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'stats'>('daily');
  
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitForm, setHabitForm] = useState<Partial<Habit>>({
    name: '', category: 'Health', daysOfWeek: [0, 1, 2, 3, 4, 5, 6], time: '08:00', description: '', isOneTime: false, specificDates: []
  });

  const [habitToDeleteId, setHabitToDeleteId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isProcessingLog, setIsProcessingLog] = useState(false);
  const [activityInput, setActivityInput] = useState('');
  const [suggestedCards, setSuggestedCards] = useState<SuggestedCard[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [isAiBarHidden, setIsAiBarHidden] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('mgs_profile');
    const savedHabits = localStorage.getItem('mgs_habits');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setPath('app');
    }
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (e) {
        setHabits([]);
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'stats' && habits.length > 0 && !aiInsight) {
      handleGetAiInsight();
    }
  }, [activeTab]);

  const handleGetAiInsight = async () => {
    setIsAnalyzing(true);
    try {
      const insight = await analyzeHabitProgress(habits);
      setAiInsight(insight);
    } catch (e) {
      setAiInsight("Physical discipline is the root of mental freedom.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveHabit = (habitPayload?: Partial<Habit>) => {
    const finalForm = habitPayload || habitForm;
    if (!finalForm.name) return;

    const newHabit: Habit = {
      id: editingHabit?.id || Math.random().toString(36).substr(2, 9),
      name: finalForm.name,
      category: finalForm.category as any || 'Mindset',
      frequency: finalForm.frequency as any || 'daily',
      daysOfWeek: finalForm.daysOfWeek && finalForm.daysOfWeek.length > 0 ? finalForm.daysOfWeek : (finalForm.isOneTime ? [] : [0, 1, 2, 3, 4, 5, 6]),
      time: finalForm.time || '08:00',
      description: finalForm.description || '',
      streak: editingHabit?.streak || 0,
      completedDates: editingHabit?.completedDates || [],
      createdAt: editingHabit?.createdAt || new Date().toISOString(),
      isOneTime: !!finalForm.isOneTime,
      specificDates: finalForm.specificDates || [],
      startDate: finalForm.startDate || new Date().toISOString().split('T')[0],
      endDate: finalForm.endDate || ''
    };

    let updatedHabits: Habit[];
    if (editingHabit) {
      updatedHabits = habits.map(h => h.id === editingHabit.id ? newHabit : h);
    } else {
      updatedHabits = [...habits, newHabit];
    }
    
    setHabits(updatedHabits);
    localStorage.setItem('mgs_habits', JSON.stringify(updatedHabits));
    
    if (newHabit.isOneTime && newHabit.specificDates?.[0]) {
      const targetDate = new Date(newHabit.specificDates[0]);
      if (!isNaN(targetDate.getTime())) {
        setSelectedDate(targetDate);
      }
    }

    setShowHabitModal(false);
    setEditingHabit(null);
  };

  const confirmDeleteHabit = () => {
    if (!habitToDeleteId) return;
    const newHabits = habits.filter(h => h.id !== habitToDeleteId);
    setHabits(newHabits);
    localStorage.setItem('mgs_habits', JSON.stringify(newHabits));
    setHabitToDeleteId(null);
    setShowHabitModal(false);
    setEditingHabit(null);
  };

  const handleLogSubmit = async () => {
    if (!activityInput.trim() || isProcessingLog) return;
    setIsProcessingLog(true);
    try { 
      const cards = await generateSuggestedCards(activityInput, habits); 
      if (cards.length > 0) {
        setSuggestedCards([...cards]); 
        setShowReviewModal(true);
        setActiveTab('daily');
      }
      setActivityInput(''); 
    } finally { 
      setIsProcessingLog(false); 
    }
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  
  const filteredHabits = useMemo(() => {
    const dayOfWeek = selectedDate.getDay();
    return habits.filter(h => {
      if (h.isOneTime) return h.specificDates?.includes(selectedDateStr);
      return Array.isArray(h.daysOfWeek) && h.daysOfWeek.includes(dayOfWeek);
    });
  }, [habits, selectedDateStr, selectedDate]);

  const dateStrip = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 3 + i);
      return d;
    });
  }, []);

  const statsData = useMemo(() => {
    if (habits.length === 0) return null;
    const trend = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().split('T')[0];
      const count = habits.filter(h => h.completedDates.includes(ds)).length;
      return { name: d.toLocaleDateString('en-US', { weekday: 'short' }), completed: count };
    });
    return { trend };
  }, [habits]);

  if (path === 'landing') {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0c] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[20%] bg-gradient-to-r from-orange-600 via-yellow-400 to-transparent rotate-[-45deg] blur-[80px] animate-pulse"></div>
           <div className="absolute top-[30%] left-[-10%] w-[120%] h-[15%] bg-gradient-to-r from-transparent via-cyan-400 to-blue-600 rotate-[-45deg] blur-[100px] animate-pulse duration-700"></div>
           <div className="absolute top-[60%] left-[-20%] w-[140%] h-[10%] bg-gradient-to-r from-blue-700 via-cyan-500 to-transparent rotate-[-45deg] blur-[120px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-12 animate-in zoom-in duration-700">
              <Dumbbell size={48} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            </div>
            
            <h1 className="text-5xl font-black text-white mb-6 tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
              My Growth Space
            </h1>
            
            <p className="text-slate-400 max-w-xs mb-16 text-lg font-medium leading-relaxed">
              Forge your character with a high-performance <span className="text-white font-black underline decoration-cyan-400 decoration-4 underline-offset-4">identity protocol</span>.
            </p>
            
            <button onClick={() => setPath('auth')} className="group relative w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white text-black py-6 rounded-3xl font-black text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all">
                <span>Engage System</span>
                <ArrowRight size={24} />
              </div>
            </button>
        </div>
      </div>
    );
  }

  if (path === 'auth') {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0c] flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-orange-900 to-blue-900 blur-3xl"></div>
        <div className="w-full max-w-sm space-y-8 animate-in slide-in-from-bottom-8 relative z-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-cyan-400 mx-auto mb-6">
                <Dumbbell size={32} />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Secure Link</h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Protocol Handshake Initiated</p>
          </div>
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="System ID (Email)" 
              className="w-full bg-white border border-slate-200 p-6 rounded-[2rem] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-cyan-500/20 shadow-sm" 
            />
            <input 
              type="password" 
              placeholder="Access Key" 
              className="w-full bg-white border border-slate-200 p-6 rounded-[2rem] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-cyan-500/20 shadow-sm" 
            />
          </div>
          <button onClick={() => setPath('app')} className="w-full bg-cyan-500 text-black py-6 rounded-[2.5rem] font-black text-xl active:scale-95 shadow-[0_10px_30px_rgba(6,182,212,0.4)] transition-all">
            Unlock Protocol
          </button>
        </div>
      </div>
    );
  }

  if (path === 'app' && !profile) {
    return <Onboarding onComplete={(p, h) => { setProfile(p); setHabits(h); setPath('app'); localStorage.setItem('mgs_profile', JSON.stringify(p)); localStorage.setItem('mgs_habits', JSON.stringify(h)); }} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center">
      
      <div className="w-full max-w-md md:max-w-xl min-h-screen flex flex-col bg-[#0f0f13] relative overflow-hidden shadow-2xl md:my-6 md:rounded-[3.5rem] md:h-[90vh]">
        
        <header className="px-8 pt-12 pb-6 flex justify-between items-end bg-[#0f0f13]/80 backdrop-blur-xl z-40 sticky top-0 border-b border-white/5">
            <div>
              <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-1">
                {activeTab === 'daily' ? "Core Protocol" : "Growth Vectors"}
              </p>
              <h1 className="text-3xl font-black text-white tracking-tighter">
                {activeTab === 'daily' ? `Identity Hub` : "Evolution"}
              </h1>
            </div>
            <button onClick={() => setPath('landing')} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
        </header>

        <div className="flex-1 px-8 space-y-8 overflow-y-auto no-scrollbar pb-[180px]">
          {activeTab === 'daily' && (
            <div className="animate-in fade-in duration-500 space-y-8">
              <div className="bg-gradient-to-br from-slate-900 to-black p-10 rounded-[3rem] border border-white/10 text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12 text-cyan-400"><Award size={120}/></div>
                 <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-cyan-400">Persona Profile</p>
                 <p className="text-xl font-bold italic leading-relaxed tracking-tight">"{profile?.identityStatement}"</p>
              </div>

              <div className="flex justify-between items-center py-2 gap-2 overflow-x-auto no-scrollbar">
                {dateStrip.map((date, idx) => {
                  const active = date.toDateString() === selectedDate.toDateString();
                  return (
                    <button 
                        key={idx} 
                        onClick={() => setSelectedDate(date)}
                        className={`min-w-[60px] py-6 rounded-[2rem] flex flex-col items-center gap-1.5 transition-all ${active ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-slate-500 border border-white/5'}`}
                    >
                        <span className={`text-[10px] font-black uppercase ${active ? 'text-black/60' : 'text-slate-600'}`}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="text-lg font-black">{date.getDate()}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <h3 className="font-black text-xl text-white">Action Protocol</h3>
                    <button onClick={() => { setEditingHabit(null); setHabitForm({name: '', category: 'Health', daysOfWeek: [0, 1, 2, 3, 4, 5, 6], time: '08:00'}); setShowHabitModal(true); }} className="w-10 h-10 bg-white/5 text-cyan-400 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all"><Plus size={24}/></button>
                </div>
                {filteredHabits.length === 0 ? (
                    <div className="p-16 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 text-center flex flex-col items-center gap-4 text-slate-500 font-bold">
                        Void Zone.
                    </div>
                ) : (
                    <div className="space-y-3">
                      {filteredHabits.map(habit => (
                          <HabitCard 
                              key={habit.id} habit={habit} selectedDateStr={selectedDateStr}
                              onToggle={(id, date) => {
                                  const newHabits = habits.map(h => {
                                      if (h.id === id) {
                                          const comp = h.completedDates.includes(date);
                                          return { ...h, completedDates: comp ? h.completedDates.filter(d => d !== date) : [...h.completedDates, date], streak: comp ? Math.max(0, h.streak - 1) : h.streak + 1 };
                                      }
                                      return h;
                                  });
                                  setHabits(newHabits); localStorage.setItem('mgs_habits', JSON.stringify(newHabits));
                              }}
                              onDelete={(id) => { setHabitToDeleteId(id); setEditingHabit(habits.find(h => h.id === id) || null); setShowHabitModal(true); }}
                              onEdit={(h) => { setEditingHabit(h); setHabitForm(h); setShowHabitModal(true); }}
                          />
                      ))}
                    </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="animate-in fade-in duration-500 space-y-8">
               <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-sm">
                  <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-6">Synchronization Rhythm</p>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={statsData?.trend || []}>
                        <defs><linearGradient id="colorMom" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                        <XAxis dataKey="name" hide /><YAxis hide /><Tooltip contentStyle={{borderRadius: '24px', background: '#0f0f13', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 900}} />
                        <Area type="monotone" dataKey="completed" stroke="#06b6d4" strokeWidth={6} fill="url(#colorMom)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>
               <div className="bg-cyan-500 p-10 rounded-[3.5rem] text-black shadow-xl flex flex-col gap-8 relative overflow-hidden">
                  <BrainCircuit className="absolute top-0 right-0 p-8 opacity-20" size={140} />
                  <div className="flex items-center gap-3"><Dumbbell size={24} /><span className="text-[10px] font-black uppercase tracking-widest">Neural Insights</span></div>
                  {isAnalyzing ? <Loader2 className="animate-spin text-black" /> : <p className="text-2xl font-bold italic leading-relaxed tracking-tight">"{aiInsight || "Training is the only way."}"</p>}
               </div>
            </div>
          )}
        </div>

        {/* AI PILL */}
        <div className="absolute bottom-[100px] left-0 right-0 z-50 px-6 pointer-events-none transition-all duration-500">
          {isAiBarHidden ? (
            <div className="flex justify-end pointer-events-auto animate-in slide-in-from-right-4">
              <button 
                onClick={() => setIsAiBarHidden(false)}
                className="w-16 h-16 bg-cyan-500 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center text-black hover:scale-110 transition-transform"
              >
                <Dumbbell size={28} />
              </button>
            </div>
          ) : (
            <div className="w-full h-24 bg-white/10 backdrop-blur-3xl rounded-[3rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] border border-white/10 p-3 pointer-events-auto flex items-center gap-3 animate-in fade-in zoom-in-95">
              <button 
                onClick={() => setIsHistoryVisible(true)}
                className="w-14 h-14 rounded-[2rem] bg-white/5 text-cyan-400 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <History size={20} />
              </button>
              
              <div className="flex-1 h-full">
                <input 
                  type="text"
                  value={activityInput}
                  onChange={(e) => setActivityInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogSubmit()}
                  placeholder="Feed protocol data..."
                  className="w-full h-full bg-transparent px-4 font-bold text-white placeholder:text-slate-600 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pr-2">
                <button 
                  disabled={!activityInput.trim() || isProcessingLog}
                  onClick={handleLogSubmit}
                  className="w-14 h-14 bg-cyan-500 text-black rounded-[2rem] flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-20"
                >
                  {isProcessingLog ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
                <button onClick={() => setIsAiBarHidden(true)} className="w-10 h-10 text-slate-500 hover:text-slate-400">
                  <Minimize2 size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* REVIEW MODAL */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-end justify-center">
             <div className="bg-[#0f0f13] w-full max-w-lg rounded-t-[4rem] p-10 shadow-2xl animate-in slide-in-from-bottom-full duration-500 flex flex-col max-h-[80vh] border-t border-white/10">
               <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter">New Vectors</h3>
                    <p className="text-xs text-cyan-400 font-black uppercase tracking-widest mt-1">{suggestedCards.length} potential upgrades</p>
                  </div>
                  <button onClick={() => setShowReviewModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400"><X size={24}/></button>
               </div>
               
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-8">
                  {suggestedCards.map(card => (
                    <div key={card.id} className="bg-white/5 border border-white/10 p-8 rounded-[3rem] shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Dumbbell size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Optimization Path</span>
                      </div>
                      <h4 className="text-xl font-black text-white leading-tight">{card.title}</h4>
                      <p className="text-slate-400 font-medium leading-relaxed">{card.description}</p>
                      <button 
                        onClick={() => {
                          const payload = card.suggestedAction?.payload;
                          if (payload) {
                            handleSaveHabit(payload);
                          }
                          const remaining = suggestedCards.filter(sc => sc.id !== card.id);
                          setSuggestedCards(remaining);
                          if (remaining.length === 0) {
                            setShowReviewModal(false);
                            setIsAiBarHidden(true);
                          }
                        }}
                        className="w-full bg-cyan-500 text-black py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-cyan-500/20"
                      >
                        <CheckCircle2 size={24} />
                        <span>Integrate to Core</span>
                      </button>
                    </div>
                  ))}
               </div>
             </div>
          </div>
        )}

        {/* NAV */}
        <nav className="absolute bottom-0 left-0 right-0 h-24 bg-[#0a0a0c]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-center gap-32 px-10 pb-10 z-[60] md:rounded-b-[3.5rem]">
          <button onClick={() => setActiveTab('daily')} className={`p-4 transition-all ${activeTab === 'daily' ? 'text-cyan-400 scale-125' : 'text-slate-700'}`}>
            <LayoutDashboard size={32} strokeWidth={2.5}/>
          </button>
          <button onClick={() => setActiveTab('stats')} className={`p-4 transition-all ${activeTab === 'stats' ? 'text-cyan-400 scale-125' : 'text-slate-700'}`}>
            <BarChart2 size={32} strokeWidth={2.5}/>
          </button>
        </nav>

        {/* HABIT MODAL */}
        {showHabitModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-end sm:items-center justify-center px-4">
            <div className="bg-[#0f0f13] w-full max-w-lg p-10 rounded-t-[4rem] sm:rounded-[4rem] shadow-2xl animate-in slide-in-from-bottom-full overflow-y-auto max-h-[85vh] border border-white/10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-white tracking-tighter">{editingHabit ? "Refine Protocol" : "Blueprint"}</h3>
                <button onClick={() => { setShowHabitModal(false); setEditingHabit(null); }} className="bg-white/5 p-4 border border-white/10 rounded-2xl text-slate-400 hover:text-red-500 transition-colors"><X size={24}/></button>
              </div>
              <div className="space-y-10">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block px-2">Action Label</label>
                    <input className="w-full bg-white/5 border border-white/10 p-8 rounded-[2.5rem] font-black text-2xl text-white outline-none focus:ring-8 focus:ring-cyan-500/10 transition-all" value={habitForm.name} onChange={e => setHabitForm({...habitForm, name: e.target.value})} placeholder="Dumbbell Training" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <select className="bg-white/5 p-6 rounded-[2rem] font-bold text-white border border-white/10 outline-none" value={habitForm.category} onChange={e => setHabitForm({...habitForm, category: e.target.value as any})}>
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0f0f13]">{c}</option>)}
                  </select>
                  <input type="time" className="bg-white/5 p-6 rounded-[2rem] font-bold text-white border border-white/10 outline-none" value={habitForm.time} onChange={e => setHabitForm({...habitForm, time: e.target.value})} />
                </div>
                {editingHabit && <button onClick={confirmDeleteHabit} className="w-full py-8 text-red-500 font-black border-4 border-dashed border-red-500/20 rounded-[3rem] flex items-center justify-center gap-3"><Trash2 size={24}/> Decommission</button>}
                <button onClick={() => handleSaveHabit()} className="w-full bg-cyan-500 text-black py-8 rounded-[3rem] font-black text-2xl active:scale-95 shadow-2xl">Deploy</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
