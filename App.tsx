/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  AlertTriangle, 
  Check, 
  AlertCircle, 
  Layers, 
  Activity, 
  Hash, 
  Layout, 
  Copy,
  Eye,
  Edit2,
  X,
  Play,
  RotateCcw,
  Code,
  Box,
  Component,
  MousePointer2,
  Maximize
} from 'lucide-react';

// Types
type ScanStatus = 'idle' | 'scanning' | 'complete';

const App: React.FC = () => {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [designUrl, setDesignUrl] = useState('');
  const [inspectItem, setInspectItem] = useState<string | null>(null);
  
  // Fake scanning logic
  const startScan = () => {
    if (!designUrl.trim()) return;
    setStatus('scanning');
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setStatus('complete'), 500);
          return 100;
        }
        return next;
      });
    }, 400);
  };

  const handleScanAgain = () => {
    setStatus('idle');
    setDesignUrl('');
    setProgress(0);
    setInspectItem(null);
  };

  const openInspector = (name: string) => {
    setInspectItem(name);
  };

  // Mock data generator for inspector
  const getInspectorData = (name: string) => {
    const isComponent = ['Modal', 'Tab Bar', 'Card Header', 'Primary Button', 'Sidebar'].some(n => name.includes(n));
    
    // Dynamic styles based on component name for the fake preview
    let width = '100%';
    let height = '64px';
    let layerName = `${name} / Default`;
    let fill = isComponent ? '#1E1E1E' : '#2C2C2C';
    
    if (name.includes('Modal')) { width = '320px'; height = '180px'; layerName = 'Modal / Desktop'; }
    else if (name.includes('Button')) { width = '120px'; height = '48px'; fill = '#0C8CE9'; }
    else if (name.includes('Tab')) { width = '360px'; height = '56px'; }
    else if (name.includes('Card')) { width = '280px'; height = '140px'; }
    else if (name.includes('Sidebar')) { width = '240px'; height = '300px'; }
    else if (name.includes('Tag')) { width = '80px'; height = '24px'; fill = '#E6E6E6'; }

    return {
      width,
      height,
      fill,
      layerName,
      matches: Math.floor(Math.random() * 20) + 80
    };
  };

  const inspectorData = inspectItem ? getInspectorData(inspectItem) : null;

  return (
    <div className="flex flex-col h-screen w-full max-w-[400px] mx-auto bg-figma-bg text-figma-text border-l border-figma-border shadow-2xl overflow-hidden text-[11px] font-normal selection:bg-figma-blue selection:text-white relative font-sans">
      
      {/* HEADER */}
      <header className="flex-none p-4 border-b border-figma-divider bg-figma-bg z-20">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[13px] font-bold tracking-tight text-white">Audit Scan Summary</h1>
          <button className="p-1 hover:bg-figma-hover rounded text-figma-muted hover:text-white transition-colors">
            <Copy size={12} />
          </button>
        </div>
        <div className="flex items-center justify-between text-figma-muted">
          <span>Scan completed — Apr 26, 2025 at 14:23</span>
          <span className="opacity-50">v2.31</span>
        </div>
      </header>

      {/* CONTENT SCROLLABLE */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-figma-bg">
        
        {/* IDLE STATE */}
        {status === 'idle' && (
          <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="space-y-2">
                <label className="block text-figma-text font-medium">Paste Design System URL</label>
                <input 
                  type="text" 
                  value={designUrl}
                  onChange={(e) => setDesignUrl(e.target.value)}
                  placeholder="https://www.figma.com/file/..."
                  className="w-full bg-figma-panel border border-figma-border rounded p-2 text-white placeholder-figma-muted focus:border-figma-blue focus:ring-1 focus:ring-figma-blue outline-none transition-all"
                />
             </div>
             
             <div className="bg-figma-panel/50 p-3 rounded border border-figma-border border-dashed text-figma-muted text-center space-y-2">
                <p>Ready to analyze components, text styles, and layout consistency.</p>
             </div>

             <button 
                onClick={startScan}
                disabled={!designUrl}
                className={`w-full py-2 px-4 rounded text-white font-medium flex items-center justify-center gap-2 transition-colors ${designUrl ? 'bg-figma-blue hover:bg-figma-blueHover' : 'bg-figma-border cursor-not-allowed opacity-50'}`}
             >
               <Play size={12} fill="currentColor" />
               Start Scan
             </button>
          </div>
        )}

        {/* SCANNING STATE */}
        {status === 'scanning' && (
           <div className="p-8 flex flex-col items-center justify-center h-full space-y-6 text-center animate-in fade-in duration-300">
              <div className="relative w-12 h-12">
                 <div className="absolute inset-0 border-2 border-figma-border rounded-full"></div>
                 <div className="absolute inset-0 border-2 border-figma-blue rounded-full border-t-transparent animate-spin"></div>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs text-figma-muted font-medium">
                  <span>Scanning...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1 bg-figma-panel rounded-full overflow-hidden">
                   <div className="h-full bg-figma-blue transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-figma-muted text-[10px] pt-2">Analyzing components, layouts, tokens...</p>
              </div>
           </div>
        )}

        {/* RESULTS STATE */}
        {status === 'complete' && (
          <div className="p-0 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            
            {/* KPI GRID */}
            <div className="grid grid-cols-2 gap-2 p-4 pb-2">
              <KpiCard icon={Activity} label="Consistency" value="82%" color="text-emerald-400" />
              <KpiCard icon={Layout} label="Patterns" value="142" />
              <KpiCard icon={AlertTriangle} label="Outliers" value="12" color="text-amber-400" />
              <KpiCard icon={Hash} label="Token Issues" value="23" color="text-rose-400" />
            </div>

            {/* QUICK ACTIONS BAR */}
            <div className="px-4 py-2 flex items-center justify-end border-b border-transparent">
               <button 
                  onClick={handleScanAgain}
                  className="text-[10px] text-figma-blue hover:text-white hover:underline flex items-center gap-1 transition-colors"
               >
                 <RotateCcw size={10} />
                 <span>Start New Scan</span>
               </button>
            </div>

            <Divider />

            {/* SECTIONS */}
            <Section title="Suggested Patterns" count={12} defaultOpen>
              <PatternRow name="Modal" count={118} onView={() => openInspector('Modal')} />
              <PatternRow name="Tab Bar" count={83} onView={() => openInspector('Tab Bar')} />
              <PatternRow name="Card Header" count={45} onView={() => openInspector('Card Header')} />
              <PatternRow name="Toast Notification" count={32} onView={() => openInspector('Toast Notification')} />
              <PatternRow name="Sidebar Nav" count={28} onView={() => openInspector('Sidebar Nav')} />
              <PatternRow name="Date Picker" count={15} onView={() => openInspector('Date Picker')} />
              <PatternRow name="Primary Button" count={124} onView={() => openInspector('Primary Button')} />
              <PatternRow name="Input Field" count={92} onView={() => openInspector('Input Field')} />
              <PatternRow name="Avatar Group" count={18} onView={() => openInspector('Avatar Group')} />
              <PatternRow name="Breadcrumbs" count={14} onView={() => openInspector('Breadcrumbs')} />
              <PatternRow name="Toggle Switch" count={11} onView={() => openInspector('Toggle Switch')} />
              <PatternRow name="Filter Chip" count={23} onView={() => openInspector('Filter Chip')} />
            </Section>

            <Divider />

            <Section title="Outliers" count={8} warning>
               <OutlierRow name="Tag Component" uses={5} level="warning" onView={() => openInspector('Tag Component')} />
               <OutlierRow name="Video Player" uses={2} level="critical" onView={() => openInspector('Video Player')} />
               <OutlierRow name="Deprecated Button" uses={14} level="warning" onView={() => openInspector('Deprecated Button')} />
               <OutlierRow name="Legacy Dropdown" uses={8} level="warning" onView={() => openInspector('Legacy Dropdown')} />
               <OutlierRow name="Custom Toggle" uses={3} level="critical" onView={() => openInspector('Custom Toggle')} />
               <OutlierRow name="Old Card Layout" uses={11} level="warning" onView={() => openInspector('Old Card Layout')} />
               <OutlierRow name="Ghost Button (v1)" uses={4} level="warning" onView={() => openInspector('Ghost Button (v1)')} />
               <OutlierRow name="Unstyled Tooltip" uses={7} level="critical" onView={() => openInspector('Unstyled Tooltip')} />
               <OutlierRow name="Banner (Old)" uses={2} level="warning" onView={() => openInspector('Banner (Old)')} />
            </Section>

            <Divider />

            <Section title="Token Issues" count={9} warning>
               <TokenRow count={3} type="color" label="color mismatches" />
               <TokenRow count={4} type="spacing" label="spacing inconsistencies" />
               <TokenRow count={8} type="text" label="typography overrides" />
               <TokenRow count={2} type="effect" label="shadow values" />
               <TokenRow count={6} type="radius" label="radius mix-ups" />
               <TokenRow count={12} type="color" label="hex codes detected" />
               <TokenRow count={5} type="text" label="line-height errors" />
               <TokenRow count={1} type="spacing" label="negative margin usage" />
            </Section>

          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="flex-none p-4 bg-figma-bg border-t border-figma-divider flex items-center justify-between gap-2 absolute bottom-0 w-full z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.5)]">
        {status === 'complete' ? (
          <>
            <button 
              onClick={handleScanAgain}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-figma-border hover:border-figma-text text-figma-muted hover:text-white transition-colors text-[10px] font-medium"
              title="Start New Scan"
            >
              <RotateCcw size={10} />
              <span>Scan Again</span>
            </button>
            <div className="flex items-center gap-2">
              <button 
                className="px-3 py-1.5 rounded border border-transparent hover:bg-figma-hover text-figma-text font-medium transition-colors"
              >
                Save Draft
              </button>
              <button className="px-3 py-1.5 bg-figma-blue hover:bg-figma-blueHover text-white rounded font-medium shadow-sm transition-colors">
                Approve
              </button>
            </div>
          </>
        ) : (
           <div className="text-[10px] text-figma-muted w-full text-center">
              Figma Plugin SDK v1.0.4
           </div>
        )}
      </footer>

      {/* COMPONENT PREVIEW MODAL (INSPECTOR) */}
      {inspectItem && (
        <div className="absolute inset-0 z-50 bg-figma-bg/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
          <div className="flex-none p-3 border-b border-figma-divider flex items-center justify-between bg-figma-bg">
            <div className="flex items-center gap-2">
               <Layers size={14} className="text-figma-blue" />
               <span className="font-bold text-white text-xs">Inspector: {inspectItem}</span>
            </div>
            <button 
              onClick={() => setInspectItem(null)}
              className="p-1 hover:bg-figma-hover rounded text-figma-muted hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {/* VISUAL PREVIEW AREA */}
             <div className="w-full h-48 bg-[#2C2C2C] border border-figma-border rounded-lg relative overflow-hidden flex items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333), linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
                 
                 {/* Fake Component Representation */}
                 <div 
                   className="relative bg-figma-bg rounded shadow-2xl border border-figma-border p-4 space-y-3 transform transition-all duration-300 flex flex-col justify-center"
                   style={{ 
                     width: inspectorData?.width, 
                     height: inspectorData?.height,
                     transform: 'scale(0.85)',
                     backgroundColor: inspectorData?.fill === '#1E1E1E' ? '#1E1E1E' : inspectorData?.fill
                   }}
                 >
                    {/* Abstract representation of UI inside the box */}
                    <div className="flex justify-between items-center border-b border-figma-divider pb-2 mb-2 w-full">
                       <div className="h-1.5 w-12 bg-white rounded-full opacity-60"></div>
                       <div className="h-1.5 w-1.5 bg-rose-500 rounded-full"></div>
                    </div>
                    <div className="space-y-2 w-full">
                       <div className="h-1 w-full bg-figma-border rounded-full opacity-40"></div>
                       <div className="h-1 w-3/4 bg-figma-border rounded-full opacity-40"></div>
                    </div>
                 </div>
                 
                 {/* Dimensions Overlay */}
                 <div className="absolute bottom-2 right-2 text-[9px] font-mono text-figma-muted bg-black/50 px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/10">
                   <Maximize size={8} />
                   {inspectorData?.width} x {inspectorData?.height}
                 </div>
             </div>

             {/* DETAILS */}
             <div className="space-y-3">
               <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Code size={12} className="text-figma-muted" />
                  <span>Dev Properties</span>
               </div>
               
               <div className="bg-figma-panel rounded p-3 text-[10px] font-mono text-figma-muted border border-figma-border space-y-1">
                  <div className="flex justify-between border-b border-figma-divider pb-1 mb-1">
                    <span className="text-purple-400">layer</span> 
                    <span className="text-white">"{inspectorData?.layerName}"</span>
                  </div>
                  <div className="flex justify-between"><span className="text-purple-400">width</span> <span className="text-emerald-400">{inspectorData?.width}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">fill</span> <span className="text-orange-400">{inspectorData?.fill}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">padding</span> <span className="text-emerald-400">24px</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">radius</span> <span className="text-emerald-400">8px</span></div>
               </div>

                {/* CSS PREVIEW */}
               <div className="space-y-2 pt-1">
                   <div className="flex items-center justify-between text-[10px] font-semibold text-figma-muted">
                      <span>CSS Preview</span>
                      <Copy size={10} className="hover:text-white cursor-pointer" />
                   </div>
                   <div className="bg-[#1e1e1e] p-2 rounded border border-figma-border text-[9px] font-mono text-blue-300 overflow-x-auto">
                      <div className="opacity-50 text-gray-500">// {inspectItem} styles</div>
                      <div>.<span className="text-yellow-400">{inspectItem?.replace(/\s+/g, '-').toLowerCase()}</span> {'{'}</div>
                      <div className="pl-2"><span className="text-purple-400">background-color</span>: <span className="text-orange-400">{inspectorData?.fill}</span>;</div>
                      <div className="pl-2"><span className="text-purple-400">border-radius</span>: <span className="text-orange-400">8px</span>;</div>
                      <div className="pl-2"><span className="text-purple-400">padding</span>: <span className="text-orange-400">24px</span>;</div>
                      <div>{'}'}</div>
                   </div>
               </div>
               
               <div className="flex items-center gap-2 text-xs font-semibold text-white pt-2">
                  <AlertCircle size={12} className="text-amber-400" />
                  <span>Audit Findings</span>
               </div>
               <div className="bg-amber-900/20 border border-amber-900/50 rounded p-2 text-figma-muted text-[10px] leading-relaxed flex gap-2">
                  <div className="pt-0.5"><AlertCircle size={10} className="text-amber-400" /></div>
                  <div>
                    This component matches the <span className="text-white font-medium">System {inspectItem}</span> pattern ({inspectorData?.matches}% similarity) but uses a detached instance instead of the master component.
                  </div>
               </div>
             </div>
          </div>
          
          <div className="p-3 border-t border-figma-divider bg-figma-bg flex gap-2">
             <button onClick={() => setInspectItem(null)} className="flex-1 py-1.5 bg-figma-panel hover:bg-figma-hover border border-figma-border rounded text-white text-[10px] font-medium transition-colors">
                Ignore
             </button>
             <button className="flex-1 py-1.5 bg-figma-blue hover:bg-figma-blueHover text-white rounded text-[10px] font-medium transition-colors shadow-lg shadow-blue-900/20">
                Apply Fix
             </button>
          </div>
        </div>
      )}

    </div>
  );
};

// --- Subcomponents ---

const Divider = () => <div className="h-px bg-figma-divider w-full my-2" />;

const KpiCard: React.FC<{ icon: any, label: string, value: string, color?: string }> = ({ icon: Icon, label, value, color = 'text-white' }) => (
  <div className="bg-figma-panel border border-figma-border rounded-md p-3 flex flex-col gap-2 hover:border-figma-hover transition-colors group cursor-default">
    <div className="flex items-center justify-between">
       <span className="text-[10px] text-figma-muted uppercase tracking-wider">{label}</span>
       <Icon size={12} className="text-figma-muted group-hover:text-white transition-colors" />
    </div>
    <span className={`text-lg font-bold ${color}`}>{value}</span>
  </div>
);

const Section: React.FC<{ title: string, count: number, children: React.ReactNode, defaultOpen?: boolean, warning?: boolean }> = ({ title, count, children, defaultOpen = false, warning }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-figma-hover transition-colors group"
      >
        <div className="flex items-center gap-2">
           {isOpen ? <ChevronDown size={12} className="text-figma-muted group-hover:text-white" /> : <ChevronRight size={12} className="text-figma-muted group-hover:text-white" />}
           <span className="font-bold text-figma-text group-hover:text-white text-[11px]">{title}</span>
        </div>
        <div className="flex items-center gap-2">
           {warning && <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>}
           <span className="bg-figma-panel text-figma-muted text-[9px] px-1.5 py-0.5 rounded-full border border-figma-border">{count}</span>
        </div>
      </button>
      {isOpen && (
        <div className="px-4 py-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

const PatternRow: React.FC<{ name: string, count: number, onView?: () => void }> = ({ name, count, onView }) => (
  <div className="flex items-center justify-between py-1.5 group">
     <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-figma-panel border border-figma-border rounded flex items-center justify-center text-figma-muted">
           <Component size={8} />
        </div>
        <span className="text-figma-text">{name}</span>
        <span className="text-figma-muted text-[9px]">— {count} uses</span>
     </div>
     <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
        <IconButton icon={Check} tooltip="Approve" />
        <IconButton icon={Edit2} tooltip="Edit" />
        <IconButton icon={Eye} tooltip="View" onClick={onView} />
     </div>
  </div>
);

const OutlierRow: React.FC<{ name: string, uses: number, level: 'warning' | 'critical', onView?: () => void }> = ({ name, uses, level, onView }) => (
  <div className="flex items-center justify-between py-1.5 group">
     <div className="flex items-center gap-2">
        {level === 'critical' 
          ? <AlertCircle size={12} className="text-rose-400" />
          : <AlertTriangle size={12} className="text-amber-400" />
        }
        <span className="text-figma-text">{name}</span>
        <span className="text-figma-muted text-[9px]">{uses} uses</span>
     </div>
     <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
        <IconButton icon={Check} tooltip="Approve" />
        <IconButton icon={MousePointer2} tooltip="Select" />
        <IconButton icon={Eye} tooltip="Inspector" onClick={onView} />
     </div>
  </div>
);

const TokenRow: React.FC<{ count: number, type: 'color' | 'spacing' | 'text' | 'effect' | 'radius', label: string }> = ({ count, type, label }) => {
  let colorClass = 'bg-gray-400';
  if (type === 'color') colorClass = 'bg-rose-400';
  if (type === 'spacing') colorClass = 'bg-purple-400';
  if (type === 'text') colorClass = 'bg-blue-400';
  if (type === 'effect') colorClass = 'bg-amber-400';
  if (type === 'radius') colorClass = 'bg-emerald-400';

  return (
    <div className="flex items-center justify-between py-2 pl-2 pr-1 bg-figma-panel/30 border border-transparent hover:border-figma-border rounded transition-colors group">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`}></div>
        <span className="text-figma-text"><span className="font-bold">{count}</span> {label}</span>
      </div>
      <div className="flex gap-2 text-[10px]">
         <button className="text-figma-muted hover:text-white underline decoration-figma-border underline-offset-2">Review</button>
         <button className="text-figma-blue hover:text-figma-blueHover font-medium">Fix All</button>
      </div>
    </div>
  );
};

const IconButton: React.FC<{ icon: any, tooltip: string, onClick?: () => void }> = ({ icon: Icon, tooltip, onClick }) => (
  <button 
    onClick={onClick}
    className="p-1 hover:bg-figma-hover rounded text-figma-muted hover:text-white transition-colors" 
    title={tooltip}
  >
     <Icon size={10} />
  </button>
);

export default App;