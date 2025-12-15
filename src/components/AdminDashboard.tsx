
import React, { useState, useEffect } from 'react';
import { Proff, Subject, Chapter, ContentItem, MCQ, AccessCode } from '../types';
import { dataService } from '../services/dataService';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'codes'>('content');
  
  // Content State
  const [courses, setCourses] = useState<Proff[]>([]);
  const [activeProff, setActiveProff] = useState<string>('first-proff');
  const [editSubjectId, setEditSubjectId] = useState<string | null>(null);
  const [editChapterId, setEditChapterId] = useState<string | null>(null);

  // Content Forms State
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newContent, setNewContent] = useState<Partial<ContentItem>>({ type: 'video', title: '', url: '' });
  const [newMcq, setNewMcq] = useState<Partial<MCQ>>({ question: '', options: ['', '', '', ''], correctIndex: 0 });

  // Access Code State
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [newCodeData, setNewCodeData] = useState({
    name: '',
    type: 'PROFF', // PROFF, SUBJECT, or MULTI
    target: '' // ID (for PROFF/SUBJECT)
  });
  const [multiSelectTargets, setMultiSelectTargets] = useState<string[]>([]);
  const [lastGeneratedCode, setLastGeneratedCode] = useState<string | null>(null);
  const [lastRevealedCode, setLastRevealedCode] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    (async () => {
      await refreshData();
      // show server-down banner if set by dataService
      try { const sdown = (window as any).__AYURVEZ_SERVER_DOWN; if (sdown) setServerDown(true); } catch {}
    })();

    // Poll for updates when on codes tab and start realtime subscription
    let poll: any = null;
    if (activeTab === 'codes') {
      poll = setInterval(async () => {
        await refreshData();
        try { const sdown = (window as any).__AYURVEZ_SERVER_DOWN; setServerDown(!!sdown); } catch {}
      }, 5000);

      try {
        // Try realtime subscription (preferred)
        dataService.startRealtime(async () => {
          await refreshData();
        });
      } catch (e) { /* ignore */ }
    }
    return () => { if (poll) clearInterval(poll); dataService.stopRealtime(); };
  }, []);

  const [serverDown, setServerDown] = useState(false);

  const refreshData = async () => {
    setCourses(dataService.getData());
    const codes = await dataService.getAccessCodes();
    setAccessCodes(codes);
  };

  const saveData = (updatedCourses: Proff[]) => {
    dataService.saveData(updatedCourses);
    setCourses(updatedCourses);
  };

  // --- Helpers ---
  const getCurrentProff = () => courses.find(p => p.id === activeProff);
  const getCurrentSubject = () => getCurrentProff()?.subjects.find(s => s.id === editSubjectId);
  const getCurrentChapter = () => getCurrentSubject()?.chapters.find(c => c.id === editChapterId);

  // Helper to calculate expiry date (18 months from generation)
  const getExpiryDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "Invalid Date";
        date.setMonth(date.getMonth() + 18);
        return date.toLocaleDateString();
    } catch (e) {
        return "Error";
    }
  };

  // --- Course Status Management ---
  const toggleCourseStatus = () => {
    const updated = [...courses];
    const proff = updated.find(p => p.id === activeProff);
    if (proff) {
        proff.isLive = !proff.isLive;
        saveData(updated);
    }
  };

  // --- Subject Management ---
  const addSubject = () => {
    if (!newSubjectTitle) return;
    const updated = [...courses];
    const proff = updated.find(p => p.id === activeProff);
    if (proff) {
      proff.subjects.push({ id: `sub-${Date.now()}`, title: newSubjectTitle, chapters: [] });
      saveData(updated);
      setNewSubjectTitle('');
    }
  };

  const renameSubject = (subId: string, oldTitle: string) => {
    const newTitle = prompt("Enter new subject title:", oldTitle);
    if (!newTitle || newTitle === oldTitle) return;
    
    const updated = [...courses];
    const proff = updated.find(p => p.id === activeProff);
    const sub = proff?.subjects.find(s => s.id === subId);
    if (sub) {
        sub.title = newTitle;
        saveData(updated);
    }
  };

  const deleteSubject = (subId: string) => {
    if(!confirm("Delete this subject and all its chapters?")) return;
    const updated = [...courses];
    const proff = updated.find(p => p.id === activeProff);
    if (proff) {
      proff.subjects = proff.subjects.filter(s => s.id !== subId);
      saveData(updated);
      if(editSubjectId === subId) {
          setEditSubjectId(null);
          setEditChapterId(null);
      }
    }
  };

  // --- Chapter Management ---
  const addChapter = () => {
    if (!newChapterTitle || !editSubjectId) return;
    const updated = [...courses];
    const proff = updated.find(p => p.id === activeProff);
    const sub = proff?.subjects.find(s => s.id === editSubjectId);
    if (sub) {
      sub.chapters.push({ id: `chap-${Date.now()}`, title: newChapterTitle, content: [], mcqs: [] });
      saveData(updated);
      setNewChapterTitle('');
    }
  };

  const renameChapter = (chapId: string, oldTitle: string) => {
    const newTitle = prompt("Enter new chapter title:", oldTitle);
    if (!newTitle || newTitle === oldTitle) return;
    
    const updated = [...courses];
    const proff = updated.find(p => p.id === activeProff);
    const sub = proff?.subjects.find(s => s.id === editSubjectId);
    const chap = sub?.chapters.find(c => c.id === chapId);
    if (chap) {
        chap.title = newTitle;
        saveData(updated);
    }
  };

  const deleteChapter = (chapId: string) => {
    if(!confirm("Delete this chapter?")) return;
    const updated = [...courses];
    const proff = updated.find(p => p.id === activeProff);
    const sub = proff?.subjects.find(s => s.id === editSubjectId);
    if (sub) {
        sub.chapters = sub.chapters.filter(c => c.id !== chapId);
        saveData(updated);
        if(editChapterId === chapId) setEditChapterId(null);
    }
  };

  // --- Content Management ---
  const addContent = () => {
    if (!newContent.title || !newContent.url || !editChapterId) return;
    const updated = [...courses];
    const proff = updated.find(p => p.id === activeProff);
    const sub = proff?.subjects.find(s => s.id === editSubjectId);
    const chap = sub?.chapters.find(c => c.id === editChapterId);
    if (chap) {
      // Clean YouTube URL if needed
      const finalUrl = newContent.type === 'video' 
         ? dataService.extractYoutubeId(newContent.url!) 
         : newContent.url!;

      chap.content.push({
        id: `content-${Date.now()}`,
        type: newContent.type as any || 'video',
        title: newContent.title!,
        url: finalUrl,
        description: newContent.description || ''
      });
      saveData(updated);
      setNewContent({ type: 'video', title: '', url: '' });
    }
  };

  const deleteContent = (contentId: string) => {
    const updated = [...courses];
    const proff = updated.find(p => p.id === activeProff);
    const sub = proff?.subjects.find(s => s.id === editSubjectId);
    const chap = sub?.chapters.find(c => c.id === editChapterId);
    if (chap) {
      chap.content = chap.content.filter(c => c.id !== contentId);
      saveData(updated);
    }
  };

  // --- MCQ Management ---
  const addMcq = () => {
    if (!newMcq.question || !editChapterId) return;
    const updated = [...courses];
    const proff = updated.find(p => p.id === activeProff);
    const sub = proff?.subjects.find(s => s.id === editSubjectId);
    const chap = sub?.chapters.find(c => c.id === editChapterId);
    if (chap) {
      chap.mcqs.push({
        id: `mcq-${Date.now()}`,
        question: newMcq.question!,
        options: newMcq.options as string[],
        correctIndex: newMcq.correctIndex || 0
      });
      saveData(updated);
      setNewMcq({ question: '', options: ['', '', '', ''], correctIndex: 0 });
    }
  };

  const deleteMcq = (mcqId: string) => {
    const updated = [...courses];
    const proff = updated.find(p => p.id === activeProff);
    const sub = proff?.subjects.find(s => s.id === editSubjectId);
    const chap = sub?.chapters.find(c => c.id === editChapterId);
    if (chap) {
      chap.mcqs = chap.mcqs.filter(m => m.id !== mcqId);
      saveData(updated);
    }
  };

  // --- Access Code Actions ---
  const toggleMultiSelect = (subjectId: string) => {
    setMultiSelectTargets(prev => 
      prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId]
    );
  };

  const generateCode = async () => {
    if (!newCodeData.name) {
        alert("Please enter student name.");
        return;
    }

    let targetId = '';
    let targetName = '';

    if (newCodeData.type === 'MULTI') {
      if (multiSelectTargets.length === 0) {
        alert("Please select at least one subject.");
        return;
      }
      targetId = JSON.stringify(multiSelectTargets);
      
      const selectedNames = courses
        .flatMap(p => p.subjects)
        .filter(s => multiSelectTargets.includes(s.id))
        .map(s => s.title);
        
      targetName = selectedNames.join(', ');
    } else {
      if (!newCodeData.target) {
        alert("Please select a target.");
        return;
      }
      targetId = newCodeData.target;
      targetName = newCodeData.type === 'PROFF' 
         ? courses.find(c => c.id === newCodeData.target)?.title || 'Unknown'
         : courses.flatMap(c => c.subjects).find(s => s.id === newCodeData.target)?.title || 'Unknown';
    }

    const prefix = newCodeData.type === 'PROFF' ? 'AYUR' : newCodeData.type === 'MULTI' ? 'MIX' : 'SUB';
    const code = dataService.generateCode(prefix);

    const newAccessCode: AccessCode = {
        code,
        studentName: newCodeData.name,
        type: newCodeData.type as 'PROFF' | 'SUBJECT' | 'MULTI',
        targetId: targetId,
        targetName: targetName,
        generatedAt: new Date().toISOString(),
        isBlocked: false
    };

    const result = await dataService.saveAccessCode(newAccessCode);
    if (result && (result as any).plainCode) {
      setLastGeneratedCode((result as any).plainCode);
    }
    const fresh = await dataService.getAccessCodes();
    setAccessCodes(fresh);
    setNewCodeData({ ...newCodeData, name: '' });
    setMultiSelectTargets([]);
    setActiveTab('codes');
  };

  const copyGeneratedCode = async () => {
    if (!lastGeneratedCode) return;
    try { await navigator.clipboard.writeText(lastGeneratedCode); alert('Copied to clipboard'); }
    catch { alert(lastGeneratedCode); }
  };

  const importLocalCodes = async () => {
    if (!confirm('Import locally stored codes to Supabase (they will be hashed on the server)?')) return;
    const clearAfter = confirm('Clear localStorage codes after successful import? Click OK to clear, Cancel to keep.');
    setImporting(true);
    try {
      const res = await dataService.importLocalCodesToServer({ clearAfter });
      alert(`Imported: ${res.imported}, Failed: ${res.failed}`);
      const fresh = await dataService.getAccessCodes();
      setAccessCodes(fresh);
    } catch (e) {
      console.error(e);
      alert('Import failed; check console for details');
    } finally {
      setImporting(false);
    }
  };

    const deleteCode = async (codeToDelete: string) => {
      if(!window.confirm(`Delete access code ${codeToDelete}? User will lose access immediately.`)) return;
      await dataService.deleteAccessCode(codeToDelete);
      const fresh = await dataService.getAccessCodes();
      setAccessCodes(fresh);
    };

    const toggleBlock = async (codeToBlock: string) => {
      const updatedCodes = await dataService.toggleBlockAccessCode(codeToBlock);
      setAccessCodes([...updatedCodes]); // Create new array reference to trigger re-render
    };

    const revealCode = async (id?: string) => {
      if (!id) return alert('No id provided');
      const secret = prompt('Enter admin secret to reveal code');
      if (!secret) return;
      try {
        const res = await fetch('/api/codes/decrypt', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret }, body: JSON.stringify({ id }) });
        if (!res.ok) {
          const txt = await res.text();
          return alert('Reveal failed: ' + txt);
        }
        const json = await res.json();
        if (json && json.plain) {
          setLastRevealedCode(json.plain);
        } else alert('Reveal failed');
      } catch (e) {
        console.error(e);
        alert('Reveal failed (check console)');
      }
    };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-100 relative">
      
      {/* Mobile Tab Bar */}
      <div className="md:hidden absolute top-0 left-0 right-0 bg-gray-800 text-white flex z-20">
        <button 
          onClick={() => setActiveTab('content')} 
          className={`flex-1 py-3 text-sm font-bold ${activeTab === 'content' ? 'bg-gray-700' : ''}`}
        >
          Content
        </button>
        <button 
          onClick={() => setActiveTab('codes')} 
          className={`flex-1 py-3 text-sm font-bold ${activeTab === 'codes' ? 'bg-gray-700' : ''}`}
        >
          Student Access
        </button>
      </div>

      {/* Desktop Sidebar (Left Panel) */}
      <div className="hidden md:flex w-64 bg-gray-900 text-gray-300 flex-col border-r border-gray-800">
        <div className="p-4 border-b border-gray-800 text-white font-bold text-xl">Admin Panel</div>
        <button 
          onClick={() => setActiveTab('content')}
          className={`p-4 text-left hover:bg-gray-800 transition-colors ${activeTab === 'content' ? 'bg-gray-800 text-white border-l-4 border-ayur-green' : ''}`}
        >
          <i className="fas fa-book mr-3"></i> Manage Content
        </button>
        <button 
          onClick={() => setActiveTab('codes')}
          className={`p-4 text-left hover:bg-gray-800 transition-colors ${activeTab === 'codes' ? 'bg-gray-800 text-white border-l-4 border-ayur-saffron' : ''}`}
        >
          <i className="fas fa-users-cog mr-3"></i> Student Access
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden mt-12 md:mt-0">
        
        {activeTab === 'codes' ? (
            // --- ACCESS CODE GENERATOR VIEW ---
            <div className="flex-1 overflow-y-auto p-6">
                {serverDown && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">Server unavailable — currently using localStorage. Check network or server environment variables.</div>
                )}
                <h2 className="text-2xl font-bold text-ayur-brown mb-6">Student Access Codes</h2>
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
                    {lastGeneratedCode && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-green-800">Code generated (store this safely)</div>
                          <div className="font-mono font-bold text-lg text-ayur-brown">{lastGeneratedCode}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={copyGeneratedCode} className="px-3 py-1 bg-ayur-green text-white rounded">Copy</button>
                          <button onClick={() => setLastGeneratedCode(null)} className="px-3 py-1 bg-gray-100 rounded">Dismiss</button>
                        </div>
                      </div>
                    )}
                    {lastRevealedCode && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-yellow-800">Revealed Code (store this safely)</div>
                          <div className="font-mono font-bold text-lg text-ayur-brown">{lastRevealedCode}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={async () => { try { await navigator.clipboard.writeText(lastRevealedCode); alert('Copied'); } catch { alert(lastRevealedCode); } }} className="px-3 py-1 bg-ayur-green text-white rounded">Copy</button>
                          <button onClick={() => setLastRevealedCode(null)} className="px-3 py-1 bg-gray-100 rounded">Dismiss</button>
                        </div>
                      </div>
                    )}
                    <h3 className="font-bold text-lg mb-4 text-gray-700">Generate New Code</h3>
                    <div className="grid md:grid-cols-4 gap-4 items-start">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Student Name</label>
                            <input 
                                className="w-full border p-2 rounded" 
                                placeholder="e.g. Rahul Kumar"
                                value={newCodeData.name}
                                onChange={e => setNewCodeData({...newCodeData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Access Type</label>
                            <select 
                                className="w-full border p-2 rounded"
                                value={newCodeData.type}
                                onChange={e => setNewCodeData({...newCodeData, type: e.target.value})}
                            >
                                <option value="PROFF">Full Proff (Bundle)</option>
                                <option value="SUBJECT">Single Subject</option>
                                <option value="MULTI">Multiple Subjects</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Select Course(s)</label>
                            
                            {newCodeData.type === 'MULTI' ? (
                              <div className="w-full border p-2 rounded max-h-40 overflow-y-auto bg-gray-50 text-xs">
                                {courses.map(c => (
                                  <div key={c.id} className="mb-2">
                                    <div className="font-bold text-gray-400 border-b border-gray-200 mb-1 pb-0.5">{c.title}</div>
                                    <div className="space-y-1">
                                      {c.subjects.map(s => (
                                        <label key={s.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                                          <input 
                                            type="checkbox" 
                                            checked={multiSelectTargets.includes(s.id)} 
                                            onChange={() => toggleMultiSelect(s.id)}
                                            className="accent-ayur-green"
                                          />
                                          <span>{s.title}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <select 
                                  className="w-full border p-2 rounded"
                                  value={newCodeData.target}
                                  onChange={e => setNewCodeData({...newCodeData, target: e.target.value})}
                              >
                                  <option value="">-- Select --</option>
                                  {newCodeData.type === 'PROFF' 
                                      ? courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)
                                      : courses.map(c => (
                                          <optgroup key={c.id} label={c.title}>
                                              {c.subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                          </optgroup>
                                      ))
                                  }
                              </select>
                            )}
                        </div>
                        <div className="h-full flex items-end pb-0.5">
                           <div className="flex gap-2 w-full">
                             <button 
                               onClick={generateCode}
                               className="flex-1 bg-ayur-green text-white py-2 px-4 rounded hover:bg-green-700 font-bold shadow"
                             >
                               Generate Code
                             </button>
                             <button 
                               onClick={importLocalCodes}
                               className="px-4 py-2 bg-blue-100 text-blue-700 rounded font-bold"
                               disabled={importing}
                               title="Import codes from localStorage to Supabase (hashes stored on server)"
                             >
                               {importing ? 'Importing...' : 'Import Local'}
                             </button>
                             <button
                               onClick={() => {
                                 if (!confirm('Remove all locally stored access codes from this browser?')) return;
                                 const ok = dataService.clearLocalCodes();
                                 if (ok) { alert('Local access codes cleared'); setAccessCodes([]); } else alert('Failed to clear local codes (check console)');
                               }}
                               className="px-4 py-2 bg-red-100 text-red-700 rounded font-bold"
                               title="Clear locally stored access codes"
                             >
                               Clear Local
                             </button>
                           </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-4 font-semibold text-gray-600">Code</th>
                                <th className="p-4 font-semibold text-gray-600">Student</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Generated</th>
                                <th className="p-4 font-semibold text-gray-600">Expiry</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accessCodes.length === 0 && (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-400">No codes generated yet.</td></tr>
                            )}
                            {accessCodes.map((codeItem) => (
                                <tr key={codeItem.code} className={`border-b ${codeItem.isBlocked ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                                    <td className="p-4 font-mono font-bold text-ayur-brown">{codeItem.code}</td>
                                    <td className="p-4">
                                        {codeItem.studentName}
                                        <div className="text-xs text-gray-400">{codeItem.targetName}</div>
                                    </td>
                                    <td className="p-4">
                                        {codeItem.isBlocked ? (
                                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-bold">BLOCKED</span>
                                        ) : (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-bold">ACTIVE</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{new Date(codeItem.generatedAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-sm font-semibold text-red-500">{getExpiryDate(codeItem.generatedAt)}</td>
                                    <td className="p-4 flex gap-2">
                                        <button 
                                          onClick={() => toggleBlock(codeItem.code)} 
                                          className={`p-2 rounded-full transition-colors ${codeItem.isBlocked ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'}`}
                                          title={codeItem.isBlocked ? "Unblock Access" : "Block Access"}
                                        >
                                          <i className={`fas ${codeItem.isBlocked ? 'fa-unlock' : 'fa-ban'}`}></i>
                                        </button>
                                        <button 
                                          onClick={() => deleteCode(codeItem.code)} 
                                          className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors"
                                          title="Delete Permanently"
                                        >
                                          <i className="fas fa-trash"></i>
                                        </button>
                                        {codeItem.isEncrypted && (
                                          <button onClick={() => revealCode(codeItem.id)} className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-full hover:bg-blue-100 transition-colors" title="Reveal Code (Admins only)">
                                            <i className="fas fa-eye"></i>
                                          </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ) : (
            // --- CONTENT MANAGER VIEW ---
            <div className="flex flex-1 h-full overflow-hidden">
                {/* 1. Subject List */}
                <div className={`${editSubjectId && 'hidden md:flex'} w-full md:w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0`}>
                    <div className="p-2 border-b bg-gray-50">
                        <select 
                            className="w-full p-2 border rounded text-sm mb-2"
                            value={activeProff}
                            onChange={(e) => { setActiveProff(e.target.value); setEditSubjectId(null); setEditChapterId(null); }}
                        >
                            {courses.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                        
                        {/* Status Toggle */}
                        <div className="flex items-center justify-between bg-white border p-2 rounded">
                            <span className="text-xs font-bold text-gray-500">Public Status:</span>
                            <button 
                                onClick={toggleCourseStatus}
                                className={`text-xs px-2 py-1 rounded font-bold transition-colors ${getCurrentProff()?.isLive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                            >
                                {getCurrentProff()?.isLive ? 'LIVE' : 'COMING SOON'}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Subjects</h3>
                        {getCurrentProff()?.subjects.map(sub => (
                            <div 
                                key={sub.id} 
                                className={`flex items-center justify-between p-3 rounded mb-1 group transition-colors ${editSubjectId === sub.id ? 'bg-ayur-light-green text-ayur-green font-bold' : 'hover:bg-gray-100'}`}
                            >
                                <button onClick={() => { setEditSubjectId(sub.id); setEditChapterId(null); }} className="flex-1 text-left truncate">{sub.title}</button>
                                <div className="flex gap-1">
                                    <button onClick={() => renameSubject(sub.id, sub.title)} className="text-gray-400 hover:text-ayur-saffron p-1"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => deleteSubject(sub.id)} className="text-gray-400 hover:text-red-500 p-1"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t px-2">
                            <input className="w-full p-2 border rounded text-sm mb-2" placeholder="New Subject" value={newSubjectTitle} onChange={e => setNewSubjectTitle(e.target.value)} />
                            <button onClick={addSubject} className="w-full bg-ayur-green text-white py-1.5 rounded text-sm">Add</button>
                        </div>
                    </div>
                </div>

                {/* 2. Chapter List */}
                <div className={`${(!editSubjectId || editChapterId) && 'hidden md:flex'} w-full md:w-64 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0`}>
                    {editSubjectId ? (
                        <>
                            <div className="p-3 border-b flex items-center bg-white">
                                <button onClick={() => setEditSubjectId(null)} className="md:hidden mr-3 text-gray-500"><i className="fas fa-arrow-left"></i></button>
                                <span className="font-bold text-gray-700 truncate">{getCurrentSubject()?.title}</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2">
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">Chapters</h3>
                                {getCurrentSubject()?.chapters.map(chap => (
                                    <div 
                                        key={chap.id}
                                        className={`flex items-center justify-between p-3 rounded mb-1 text-sm group ${editChapterId === chap.id ? 'bg-white shadow border-l-4 border-ayur-green' : 'hover:bg-gray-200'}`}
                                    >
                                        <button onClick={() => setEditChapterId(chap.id)} className="flex-1 text-left">{chap.title}</button>
                                        <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => renameChapter(chap.id, chap.title)} className="text-gray-500 hover:text-ayur-saffron p-1"><i className="fas fa-edit"></i></button>
                                            <button onClick={() => deleteChapter(chap.id)} className="text-gray-500 hover:text-red-500 p-1"><i className="fas fa-trash"></i></button>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t px-2">
                                    <input className="w-full p-2 border rounded text-sm mb-2" placeholder="New Chapter" value={newChapterTitle} onChange={e => setNewChapterTitle(e.target.value)} />
                                    <button onClick={addChapter} className="w-full bg-ayur-saffron text-white py-1.5 rounded text-sm">Add</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex flex-1 items-center justify-center text-gray-400 p-4 text-center text-sm">Select Subject</div>
                    )}
                </div>

                {/* 3. Content Editor */}
                <div className={`${!editChapterId && 'hidden md:flex'} flex-1 flex flex-col bg-white overflow-hidden`}>
                    {editChapterId ? (
                        <>
                            <div className="p-3 border-b flex items-center bg-gray-50">
                                <button onClick={() => setEditChapterId(null)} className="md:hidden mr-3 text-gray-500"><i className="fas fa-arrow-left"></i></button>
                                <h2 className="font-bold text-lg truncate">{getCurrentChapter()?.title}</h2>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                                {/* Add Content */}
                                <div className="mb-8">
                                    <h3 className="font-bold text-gray-700 mb-3 border-b pb-1">Resources</h3>
                                    <div className="space-y-2 mb-4">
                                        {getCurrentChapter()?.content.map(c => (
                                            <div key={c.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <i className={`fas ${c.type === 'video' ? 'fa-video text-red-500' : 'fa-file-pdf text-blue-500'}`}></i>
                                                    <div className="truncate">
                                                        <div className="font-semibold text-sm">{c.title}</div>
                                                        <div className="text-xs text-gray-400 truncate max-w-[200px]">{c.url}</div>
                                                    </div>
                                                </div>
                                                <button onClick={() => deleteContent(c.id)} className="text-red-400 hover:text-red-600"><i className="fas fa-trash"></i></button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded border text-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                                            <select className="border p-2 rounded" value={newContent.type} onChange={e => setNewContent({...newContent, type: e.target.value as any})}><option value="video">Video (YT)</option><option value="note">Note (PDF)</option></select>
                                            <input className="border p-2 rounded md:col-span-2" placeholder="Title" value={newContent.title} onChange={e => setNewContent({...newContent, title: e.target.value})} />
                                            <input className="border p-2 rounded" placeholder="YouTube URL or PDF Link" value={newContent.url} onChange={e => setNewContent({...newContent, url: e.target.value})} />
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">* For YouTube, you can paste the full link (e.g., https://youtu.be/...) or just the ID.</p>
                                        <button onClick={addContent} className="w-full md:w-auto px-4 py-2 bg-ayur-green text-white rounded font-bold">Add Item</button>
                                    </div>
                                </div>

                                {/* Add MCQs */}
                                <div>
                                    <h3 className="font-bold text-gray-700 mb-3 border-b pb-1">MCQs</h3>
                                    <div className="space-y-4 mb-6">
                                        {getCurrentChapter()?.mcqs.map((m, idx) => (
                                            <div key={m.id} className="p-3 border rounded bg-gray-50 relative">
                                                <button onClick={() => deleteMcq(m.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><i className="fas fa-trash"></i></button>
                                                <div className="font-bold mb-1 text-sm pr-6">Q{idx+1}: {m.question}</div>
                                                <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
                                                    {m.options.map((opt, i) => <div key={i} className={i === m.correctIndex ? 'text-green-600 font-bold' : ''}>{i+1}. {opt}</div>)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded border text-sm">
                                        <input className="w-full border p-2 rounded mb-2" placeholder="Question" value={newMcq.question} onChange={e => setNewMcq({...newMcq, question: e.target.value})} />
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            {newMcq.options?.map((opt, i) => (
                                                <input key={i} className={`border p-2 rounded ${i === newMcq.correctIndex ? 'ring-1 ring-green-500' : ''}`} placeholder={`Opt ${i+1}`} value={opt} onChange={e => { const n = [...newMcq.options!]; n[i] = e.target.value; setNewMcq({...newMcq, options: n}); }} />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span>Correct Index (0-3):</span>
                                            <input type="number" min="0" max="3" className="border p-1 w-12 text-center" value={newMcq.correctIndex} onChange={e => setNewMcq({...newMcq, correctIndex: parseInt(e.target.value)})} />
                                        </div>
                                        <button onClick={addMcq} className="w-full md:w-auto px-4 py-2 bg-ayur-saffron text-white rounded font-bold">Add Question</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex flex-1 items-center justify-center text-gray-400 p-4 text-center text-sm">Select Chapter</div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
