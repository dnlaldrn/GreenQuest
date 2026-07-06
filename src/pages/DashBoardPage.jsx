import { 
  LayoutDashboard, 
  UploadCloud, 
  Globe, 
  Award, 
  Trophy, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  MoreHorizontal,
  CheckCircle2,
  Clock
} from 'lucide-react';


import LoadingSpinner from "../components/LoadingSpinner";
import { useState } from 'react';
import { supabase } from "../lib/supabase";

export default function GreenQuestDashboard() {

 const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

async function signOut() {
  try {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    // If you navigate away after sign out,
    // you usually don't need setLoading(false)
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

// React renders this based on state
if (loading) {
  return <LoadingSpinner size="lg" />;
}
 
 
 

  
  


  return (
    <div className="min-h-screen bg-[#0B120F] text-slate-200 font-sans flex text-xs md:text-sm selection:bg-[#10B981] selection:text-black">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#080D0B] border-r border-[#14231C] p-4 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-4 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="text-[#0B120F] font-black text-xl">Q</span>
            </div>
            <div>
              <h1 className="font-bold text-white tracking-wide text-base leading-none">GreenQuest</h1>
              <span className="text-[10px] text-[#10B981] font-mono uppercase tracking-widest">Impact Dashboard</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <a href="#overview" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#14281E] text-[#10B981] border-l-2 border-[#10B981] font-medium transition-colors">
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </a>
            <a href="#upload" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111A16] transition-colors">
              <UploadCloud size={18} />
              <span>Upload Video</span>
            </a>
            <a href="#hub" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111A16] transition-colors">
              <Globe size={18} />
              <span>Impact Hub</span>
            </a>
            <a href="#quests" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111A16] transition-colors">
              <Award size={18} />
              <span>Quests</span>
            </a>
            <a href="#leaderboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111A16] transition-colors">
              <Trophy size={18} />
              <span>Leaderboard</span>
            </a>
          </nav>

          <hr className="border-[#14231C] my-6" />

          {/* Settings */}
          <a href="#settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111A16] transition-colors">
            <Settings size={18} />
            <span>Settings</span>
          </a>
        </div>

        {/* Sidebar Footer Widgets */}
        <div className="space-y-4">
          {/* Weekly Goal Widget */}
          <div className="bg-[#111A16] border border-[#14231C] p-3 rounded-xl">
            <div className="text-[#10B981] font-bold mb-1 text-[11px] uppercase tracking-wider">Weekly Goal</div>
            <div className="w-full bg-[#1A2E24] rounded-full h-1.5 mb-2">
              <div className="bg-[#10B981] h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: '75%' }}></div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">750 / 1000 Green Points</div>
          </div>

          {/* Profile Section */}
          <div className="flex items-center justify-between bg-[#111A16] border border-[#14231C] p-2 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#142E24] overflow-hidden border border-[#10B981]/30">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Alex Green" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-white leading-tight text-xs">Alex Green</div>
                <div className="text-[10px] text-slate-400 font-mono">Level 24 Guardian</div>
              </div>
            </div>
            <button className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg transition-colors" onClick={signOut()}>
              <LogOut size={16} onClick={signOut()} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR */}
        <header className="h-16 border-b border-[#14231C] px-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Overview</h2>
            <p className="text-xs text-slate-400">Welcome back, Guardian Alex. Your impact is growing.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search quests..." 
                className="w-full bg-[#111A16] border border-[#14231C] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#10B981] transition-colors placeholder:text-slate-600"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 bg-[#111A16] border border-[#14231C] text-slate-400 hover:text-white rounded-lg relative transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
            </button>

            {/* Upload Action Button */}
            <button className="bg-[#10B981] hover:bg-[#0ea5e9] text-[#0B120F] font-bold px-4 py-1.5 rounded-lg flex items-center gap-2 transition-colors shadow-[0_4px_12px_rgba(16,185,129,0.2)]">
              <UploadCloud size={16} />
              <span>Upload Video</span>
            </button>
          </div>
        </header>

        {/* DASHBOARD CONTENT GRID */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          
          {/* STATS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat 1: Total Points */}
            <div className="bg-[#111A16] border border-[#14231C] p-4 rounded-xl relative overflow-hidden group hover:border-[#10B981]/30 transition-all">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Total Points</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-white tracking-tight">12,450</span>
                <span className="text-[11px] font-mono text-[#10B981] font-semibold">+12%</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Rank #124 Globally</div>
              <div className="absolute right-3 bottom-3 text-slate-800/20 group-hover:text-[#10B981]/5 transition-colors pointer-events-none">
                <Award size={48} />
              </div>
            </div>

            {/* Stat 2: Current Rank */}
            <div className="bg-[#111A16] border border-[#14231C] p-4 rounded-xl relative overflow-hidden group hover:border-[#10B981]/30 transition-all">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Current Rank</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-white tracking-tight">#124</span>
                <span className="text-[11px] font-mono text-slate-400">/ 8.4k</span>
              </div>
              <div className="text-[10px] text-[#10B981] font-mono">Top 2% this month</div>
              <div className="absolute right-3 bottom-3 text-slate-800/20 group-hover:text-[#10B981]/5 transition-colors pointer-events-none">
                <Trophy size={48} />
              </div>
            </div>

            {/* Stat 3: Videos Approved */}
            <div className="bg-[#111A16] border border-[#14231C] p-4 rounded-xl relative overflow-hidden group hover:border-[#10B981]/30 transition-all">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Videos Approved</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-white tracking-tight">42</span>
                <span className="text-[11px] font-mono text-[#10B981] font-semibold">+3 new</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Lifetime verification rate 98%</div>
              <div className="absolute right-3 bottom-3 text-slate-800/20 group-hover:text-[#10B981]/5 transition-colors pointer-events-none">
                <CheckCircle2 size={48} />
              </div>
            </div>

            {/* Stat 4: Pending Review */}
            <div className="bg-[#111A16] border border-[#14231C] p-4 rounded-xl relative overflow-hidden group hover:border-[#10B981]/30 transition-all">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Pending Review</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-white tracking-tight">5</span>
              </div>
              <div className="text-[10px] text-amber-500/80 font-mono">Est. resolution 4-6 hours</div>
              <div className="absolute right-3 bottom-3 text-slate-800/20 group-hover:text-amber-500/5 transition-colors pointer-events-none">
                <Clock size={48} />
              </div>
            </div>
          </div>

          {/* MIDDLE CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Monthly Earnings Bar Chart Simulation */}
            <div className="lg:col-span-2 bg-[#111A16] border border-[#14231C] p-5 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white text-sm">Monthly Earnings</h3>
                <div className="flex bg-[#0B120F] border border-[#14231C] p-0.5 rounded-md text-[10px] font-mono">
                  <button className="px-2.5 py-1 text-slate-400 rounded hover:text-white">7D</button>
                  <button className="px-2.5 py-1 bg-[#14281E] text-[#10B981] font-bold rounded">30D</button>
                </div>
              </div>
              
              {/* Visual Simulated Bar Chart */}
              <div className="flex items-end justify-between gap-2 h-44 pt-4 px-2 font-mono text-[10px] text-slate-500">
                <div className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-[#162D21] group-hover:bg-[#1C3E2C] rounded-t transition-all" style={{ height: '35%' }}></div>
                  <span className="mt-2 uppercase text-[9px]">Jan</span>
                </div>
                <div className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-[#162D21] group-hover:bg-[#1C3E2C] rounded-t transition-all" style={{ height: '48%' }}></div>
                  <span className="mt-2 uppercase text-[9px]">Feb</span>
                </div>
                <div className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-[#162D21] group-hover:bg-[#1C3E2C] rounded-t transition-all" style={{ height: '65%' }}></div>
                  <span className="mt-2 uppercase text-[9px]">Mar</span>
                </div>
                <div className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-[#162D21] group-hover:bg-[#1C3E2C] rounded-t transition-all" style={{ height: '55%' }}></div>
                  <span className="mt-2 uppercase text-[9px]">Apr</span>
                </div>
                <div className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-[#162D21] group-hover:bg-[#1C3E2C] rounded-t transition-all" style={{ height: '80%' }}></div>
                  <span className="mt-2 uppercase text-[9px]">May</span>
                </div>
                <div className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-[#162D21] group-hover:bg-[#1C3E2C] rounded-t transition-all" style={{ height: '92%' }}></div>
                  <span className="mt-2 uppercase text-[9px]">Jun</span>
                </div>
                <div className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.3)] rounded-t transition-all" style={{ height: '100%' }}></div>
                  <span className="mt-2 uppercase text-[#10B981] font-bold text-[9px]">Jul</span>
                </div>
              </div>
            </div>

            {/* Sustainability Impact Ring Chart */}
            <div className="bg-[#111A16] border border-[#14231C] p-5 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-sm mb-0.5">Sustainability Impact</h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Resource Distribution</span>
              </div>

              {/* Radial Progress Center Ring */}
              <div className="relative flex items-center justify-center my-4">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="#162D21" strokeWidth="10" fill="transparent" />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="60" 
                    stroke="#10B981" 
                    strokeWidth="10" 
                    fill="transparent" 
                    strokeDasharray={376.8}
                    strokeDashoffset={376.8 - (376.8 * 74) / 100}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-white tracking-tighter">74%</span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Efficiency</span>
                </div>
              </div>

              {/* Chart Legend Metrics */}
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                    <span>Waste Mgmt</span>
                  </div>
                  <span className="text-white font-bold">55%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Energy Save</span>
                  </div>
                  <span className="text-white font-bold">28%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                    <span>Other</span>
                  </div>
                  <span className="text-slate-400">17%</span>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT SUBMISSIONS TABLE SECTION */}
          <div className="bg-[#111A16] border border-[#14231C] rounded-xl overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-[#14231C]">
              <h3 className="font-bold text-white text-sm">Recent Submissions</h3>
              <a href="#view-all" className="text-[#10B981] hover:underline font-bold text-xs tracking-tight">View All</a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#14231C] text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                    <th className="p-4 font-medium">Submission</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Points</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#14231C]/60 text-xs text-slate-300">
                  {/* Row 1 */}
                  <tr className="hover:bg-[#14281E]/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded bg-[#1A2E24] overflow-hidden border border-[#14231C]">
                          <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=80&auto=format&fit=crop&q=60" alt="thumbnail" className="w-full h-full object-cover grayscale brightness-75" />
                        </div>
                        <span className="font-semibold text-white">Waste Sorting #22</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-400">Recycling</td>
                    <td className="p-4 font-mono text-[#10B981] font-bold">+45 pts</td>
                    <td className="p-4 font-mono text-slate-400">Oct 12, 2024</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#142E24] text-[#10B981] border border-[#10B981]/20">
                        Approved
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-slate-500 hover:text-white transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-[#14281E]/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded bg-[#1A2E24] overflow-hidden border border-[#14231C]">
                          <img src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=80&auto=format&fit=crop&q=60" alt="thumbnail" className="w-full h-full object-cover grayscale brightness-75" />
                        </div>
                        <span className="font-semibold text-white">HVAC Optimization</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-400">Energy</td>
                    <td className="p-4 font-mono text-slate-500">Pending</td>
                    <td className="p-4 font-mono text-slate-400">Oct 14, 2024</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-amber-950/40 text-amber-500 border border-amber-500/20">
                        Reviewing
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-slate-500 hover:text-white transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <footer className="h-10 border-t border-[#14231C] px-6 flex items-center justify-between text-[10px] font-mono text-slate-600 shrink-0">
          <div>&copy; 2024 GREENQUEST AI. ACCELERATING THE GLOBAL GOALS.</div>
          <div className="space-x-4">
            <a href="#privacy" className="hover:text-slate-400 uppercase">Privacy Protocol</a>
          </div>
        </footer>
      </main>

    </div>
  );
}