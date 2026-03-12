import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CalendarDays, Clock, History, ChevronLeft, ChevronRight, ChevronDown, ChevronRight as ChevronRightIcon, ChevronsRight, ChevronsDown, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Loader2, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ============================================================================
// SOUS-COMPOSANT : SÉLECTEUR DE DATE FANTASY
// ============================================================================
const FantasyCalendarPicker = ({ event, updateEventLocal, saveEvent, calendarData, readOnly }) => {
  const { months, daysPerWeek, defaultDaysPerMonth } = calendarData;

  if (!months || months.length === 0) {
    return <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center justify-center text-white/40 text-[10px] uppercase font-black text-center h-full min-h-[150px]">Calendrier non configuré</div>;
  }

  const currentMonthIndex = months.findIndex(m => m.name === event.month);
  const safeMonthIndex = currentMonthIndex !== -1 ? currentMonthIndex : 0;
  const currentMonth = months[safeMonthIndex];
  const maxDays = currentMonth?.days || defaultDaysPerMonth || 30;

  const handleUpdate = (updates) => {
    updateEventLocal(event.id, updates);
    saveEvent(event.id, updates);
  };

  const handlePrevMonth = () => {
    if (readOnly) return;
    if (safeMonthIndex > 0) handleUpdate({ month: months[safeMonthIndex - 1].name, day: 1 });
    else handleUpdate({ year: (event.year || 0) - 1, month: months[months.length - 1].name, day: 1 });
  };

  const handleNextMonth = () => {
    if (readOnly) return;
    if (safeMonthIndex < months.length - 1) handleUpdate({ month: months[safeMonthIndex + 1].name, day: 1 });
    else handleUpdate({ year: (event.year || 0) + 1, month: months[0].name, day: 1 });
  };

  return (
    <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-4 w-[280px] shadow-inner select-none flex flex-col">
      <div className="flex items-center justify-between mb-5 px-1">
        <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors shrink-0"><ChevronLeft size={16} /></button>
        <div className="flex items-center justify-center gap-3 flex-1">
          <span className="text-xs font-black text-teal-400 tracking-wider uppercase text-right w-24 truncate">{currentMonth?.name}</span>
          <input 
            type="number" 
            value={event.year} 
            onChange={e => updateEventLocal(event.id, { year: parseInt(e.target.value) || 0 })}
            onBlur={e => saveEvent(event.id, { year: parseInt(e.target.value) || 0 })}
            readOnly={readOnly}
            className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-teal-500 text-white font-bold text-xs w-12 text-center outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors shrink-0"><ChevronRight size={16} /></button>
      </div>

      <div className="grid gap-1.5 text-center" style={{ gridTemplateColumns: `repeat(${daysPerWeek}, minmax(0, 1fr))` }}>
        {Array.from({ length: daysPerWeek }).map((_, i) => <div key={`header-${i}`} className="text-[8px] font-black text-white/20 uppercase mb-2">J{i + 1}</div>)}
        {Array.from({ length: maxDays }).map((_, i) => {
          const dayNum = i + 1;
          const isSelected = event.day === dayNum;
          return (
            <div 
              key={`day-${dayNum}`} 
              onClick={() => !readOnly && handleUpdate({ day: dayNum })}
              className={`text-[11px] py-1.5 rounded-full transition-all flex items-center justify-center h-7 ${!readOnly && 'cursor-pointer'} ${isSelected ? 'bg-teal-500 text-black font-black shadow-[0_0_10px_rgba(45,212,191,0.4)] scale-110' : 'text-silver hover:bg-white/10 hover:text-white'}`}
            >
              {dayNum}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// COMPOSANT PRINCIPAL : MOTEUR DE CHRONOLOGIE UNIVERSEL (V4.3 CONTEXTUEL+)
// ============================================================================
export default function HistoryChronicleEditor({ worldId, entityId, entityType, readOnly = false }) {
  const [events, setEvents] = useState([]);
  const [expandedDetails, setExpandedDetails] = useState({}); 
  const [expandedChildren, setExpandedChildren] = useState({}); 
  const [calendarData, setCalendarData] = useState({ months: [], daysPerWeek: 7, defaultDaysPerMonth: 30 });
  const [isLoading, setIsLoading] = useState(true);
  const [entityDict, setEntityDict] = useState({});

  useEffect(() => {
    if (!worldId) return;
    const fetchCalendar = async () => {
      const { data: worldData } = await supabase.from('worlds').select('primary_calendar_id').eq('id', worldId).single();
      if (worldData?.primary_calendar_id) {
        const { data: calData } = await supabase.from('calendars').select('months, days_per_week, days_per_month').eq('id', worldData.primary_calendar_id).single();
        if (calData) setCalendarData({ months: calData.months || [], daysPerWeek: calData.days_per_week || 7, defaultDaysPerMonth: calData.days_per_month || 30 });
      }
    };
    fetchCalendar();
  }, [worldId]);

  useEffect(() => {
    if (!worldId) return;
    const fetchEvents = async () => {
      setIsLoading(true);
      const { data } = await supabase.from('historical_events').select('*').eq('world_id', worldId);
      if (data) setEvents(data);
      setIsLoading(false);
    };
    fetchEvents();
  }, [worldId]);

  useEffect(() => {
    if (events.length === 0) return;
    const fetchEntityNames = async () => {
      const entitiesToFetch = {};
      events.forEach(e => {
        if (e.entity_id && e.entity_id !== entityId && e.entity_type !== 'world') {
          if (!entitiesToFetch[e.entity_type]) entitiesToFetch[e.entity_type] = new Set();
          entitiesToFetch[e.entity_type].add(e.entity_id);
        }
      });
      const newDict = { ...entityDict };
      let hasChanges = false;
      for (const [type, idsSet] of Object.entries(entitiesToFetch)) {
        const ids = Array.from(idsSet).filter(id => !newDict[id]); 
        if (ids.length === 0) continue;
        let tableName = type + 's';
        if (type === 'country') tableName = 'countries';
        if (type === 'city') tableName = 'cities';
        if (type === 'deity') tableName = 'deities';
        try {
          const { data } = await supabase.from(tableName).select('id, name').in('id', ids);
          if (data) { data.forEach(item => { newDict[item.id] = { name: item.name, type: type }; hasChanges = true; }); }
        } catch (err) {}
      }
      if (hasChanges) setEntityDict(newDict);
    };
    fetchEntityNames();
  }, [events, entityId]);

  const safeEvents = Array.isArray(events) ? events : [];
  const toggleDetails = (id) => setExpandedDetails(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleChildren = (id) => setExpandedChildren(prev => ({ ...prev, [id]: !prev[id] }));

  const addEvent = async (parentId = null) => {
    const parentEvent = parentId ? safeEvents.find(e => e.id === parentId) : null;
    const newEvent = {
      world_id: worldId,
      entity_id: entityId,
      entity_type: entityType,
      parent_event_id: parentId,
      name: "Nouvel événement",
      year: parentEvent ? parentEvent.year : 0,
      month: parentEvent ? parentEvent.month : (calendarData.months[0]?.name || ""),
      day: parentEvent ? parentEvent.day : 1,
      description: "",
      event_type: parentId ? "minor" : "major"
    };
    const { data } = await supabase.from('historical_events').insert(newEvent).select().single();
    if (data) {
      setEvents(prev => [...prev, data]);
      setExpandedDetails(prev => ({ ...prev, [data.id]: true }));
      if (parentId) setExpandedChildren(prev => ({ ...prev, [parentId]: true }));
    }
  };

  const deleteEvent = async (id) => {
    setEvents(prev => prev.filter(e => e.id !== id && e.parent_event_id !== id));
    await supabase.from('historical_events').delete().eq('id', id);
  };

  const moveEvent = async (id, direction) => {
    const eventToMove = safeEvents.find(e => e.id === id);
    if (!eventToMove) return;
    const siblings = safeEvents.filter(e => e.parent_event_id === eventToMove.parent_event_id).sort((a, b) => (a.year || 0) - (b.year || 0));
    const currentIndex = siblings.findIndex(e => e.id === id);
    const eventB = siblings[direction === 'up' ? currentIndex - 1 : currentIndex + 1];
    if (!eventB || eventB.entity_id !== entityId || eventToMove.entity_id !== entityId) return;
    const tempDate = { year: eventB.year, month: eventB.month, day: eventB.day };
    updateEventLocal(eventToMove.id, tempDate);
    updateEventLocal(eventB.id, { year: eventToMove.year, month: eventToMove.month, day: eventToMove.day });
    await supabase.from('historical_events').update(tempDate).eq('id', eventToMove.id);
    await supabase.from('historical_events').update({ year: eventToMove.year, month: eventToMove.month, day: eventToMove.day }).eq('id', eventB.id);
  };

  const updateEventLocal = (id, updates) => setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  const saveEvent = async (id, updates) => await supabase.from('historical_events').update(updates).eq('id', id);

  const indentEvent = async (id) => {
    const eventToMove = safeEvents.find(e => e.id === id);
    const siblings = safeEvents.filter(e => e.parent_event_id === eventToMove.parent_event_id).sort((a,b) => (a.year||0) - (b.year||0));
    const currentIndex = siblings.findIndex(e => e.id === id);
    if (currentIndex > 0) {
      const newParent = siblings[currentIndex - 1];
      updateEventLocal(id, { parent_event_id: newParent.id });
      setExpandedChildren(prev => ({ ...prev, [newParent.id]: true }));
      await saveEvent(id, { parent_event_id: newParent.id });
    }
  };

  const outdentEvent = async (id) => {
    const eventToMove = safeEvents.find(e => e.id === id);
    if (!eventToMove || !eventToMove.parent_event_id) return;
    const currentParent = safeEvents.find(e => e.id === eventToMove.parent_event_id);
    if (currentParent) {
      updateEventLocal(id, { parent_event_id: currentParent.parent_event_id });
      await saveEvent(id, { parent_event_id: currentParent.parent_event_id });
    }
  };

  const getEntityMeta = (type) => {
    switch(type) {
      case 'world': return { icon: '🌍', label: 'Monde' };
      case 'continent': return { icon: '🗺️', label: 'Continent' };
      case 'country': return { icon: '🏴', label: 'Pays' };
      case 'city': return { icon: '📍', label: 'Cité' };
      case 'village': return { icon: '🛖', label: 'Village' };
      case 'location': return { icon: '🏞️', label: 'Lieu' };
      case 'character': return { icon: '👤', label: 'Personnage' };
      case 'item': return { icon: '🗡️', label: 'Objet' };
      case 'deity': return { icon: '✨', label: 'Divinité' };
      default: return { icon: '📎', label: 'Entité' };
    }
  };

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 size={32} className="animate-spin text-teal-500/50" /></div>;

  // ============================================================================
  // RENDER D'UN NOEUD (LIGNE OU CARTE)
  // ============================================================================
  const renderEventNode = (event, isChild = false, isReadMode = false) => {
    const isLocal = event.entity_id === entityId;
    const isExternal = !isLocal;
    const isContextual = entityType !== 'world' && isExternal; 

    const isDetailsExpanded = expandedDetails[event.id] === true; 
    const isChildrenExpanded = expandedChildren[event.id] === true; 

    const children = safeEvents.filter(e => e.parent_event_id === event.id).sort((a, b) => {
      if (a.year !== b.year) return (a.year || 0) - (b.year || 0);
      return (a.day || 1) - (b.day || 1);
    });
    const hasChildren = children.length > 0;
    
    const siblings = safeEvents.filter(e => e.parent_event_id === event.parent_event_id).sort((a, b) => (a.year || 0) - (b.year || 0));
    const currentIndex = siblings.findIndex(e => e.id === event.id);
    const canIndent = currentIndex > 0; 
    const canOutdent = !!event.parent_event_id; 

    const extMeta = isExternal ? getEntityMeta(event.entity_type) : null;
    const extName = isExternal && event.entity_type !== 'world' && entityDict[event.entity_id] ? entityDict[event.entity_id].name : null;

    // ------------------------------------------------------------------------
    // DESIGN CONTEXTUEL (GRISÉ AVEC DÉROULÉ DE DESCRIPTION)
    // ------------------------------------------------------------------------
    if (isContextual) {
      return (
        <div key={event.id} className={`relative ${isChild ? 'ml-6 mt-2' : 'mb-3'}`}>
          {hasChildren && isChildrenExpanded && (
            <div className={`absolute left-[10px] top-6 bottom-[-10px] w-px bg-white/5`}></div>
          )}
          
          <div className="flex flex-col gap-1 opacity-50 hover:opacity-100 transition-opacity group">
            <div className="flex items-center gap-3">
               <div className="text-[9px] font-black text-white/40 bg-black/40 px-2 py-1 rounded border border-white/5 whitespace-nowrap min-w-[60px] text-center shrink-0">
                 AN {event.year || 0}
               </div>
               
               <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/5 rounded-lg py-1.5 px-3">
                  <span className="text-xs grayscale">{extMeta?.icon}</span>
                  <span className="text-white/60 text-[11px] font-bold truncate">{event.name}</span>
                  
                  <div className="ml-auto flex items-center gap-3">
                    
                    {/* BOUTON INFO : DÉROULER LA DESCRIPTION GRISEE */}
                    {event.description && (
                       <button 
                         type="button" 
                         onClick={() => toggleDetails(event.id)} 
                         className={`p-1 rounded transition-colors ${isDetailsExpanded ? 'text-teal-400 bg-teal-500/10' : 'text-white/30 hover:text-white'}`}
                       >
                         <Info size={14} />
                       </button>
                    )}

                    {/* BADGE COMPTEUR VERT D'EAU */}
                    {hasChildren && !isChildrenExpanded && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF]">
                         <CalendarDays size={10} />
                         <span className="text-[10px] font-black">{children.length}</span>
                      </div>
                    )}

                    <span className="text-[8px] uppercase tracking-widest text-teal-500/40 hidden md:inline">
                       {extMeta?.label} {extName ? `- ${extName}` : ''}
                    </span>
                    
                    {!isReadMode && (
                      <button type="button" onClick={() => addEvent(event.id)} className="p-1 text-teal-500 hover:text-teal-300 hover:bg-teal-500/20 rounded transition-colors" title="Ajouter un événement local ici">
                        <Plus size={14} />
                      </button>
                    )}

                    {hasChildren && (
                       <button type="button" onClick={() => toggleChildren(event.id)} className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer">
                         {isChildrenExpanded ? <ChevronDown size={14}/> : <ChevronRightIcon size={14}/>}
                       </button>
                    )}
                  </div>
               </div>
            </div>

            {/* DESCRIPTION GRISEE PLUS PETITE */}
            {isDetailsExpanded && event.description && (
               <div className="ml-[72px] mr-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl animate-in fade-in slide-in-from-top-1 duration-300">
                  <p className="text-[10px] text-white/40 leading-relaxed italic whitespace-pre-wrap">
                    {event.description}
                  </p>
               </div>
            )}
          </div>

          {hasChildren && isChildrenExpanded && (
            <div className="mt-1">
              {children.map(child => renderEventNode(child, true, isReadMode))}
            </div>
          )}
        </div>
      );
    }

    // ------------------------------------------------------------------------
    // DESIGN COMPLET (CARTE LOCALE)
    // ------------------------------------------------------------------------
    return (
      <div key={event.id} className={`group mb-4 transition-all ${isChild ? 'ml-8 border-l-2 border-teal-500/20 pl-6 relative' : ''}`}>
        {isReadMode && hasChildren && isChildrenExpanded && (
           <div className={`absolute ${isChild ? 'left-[11px] top-8' : 'left-[19px] top-12'} bottom-[-20px] w-0.5 bg-gradient-to-b from-teal-500/40 to-transparent`}></div>
        )}

        <div className={`p-4 rounded-[2rem] border transition-all ${isChild ? 'bg-white/5 border-white/5' : 'bg-teal-500/5 border-teal-500/10 shadow-lg'}`}>
          <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              {!isReadMode && (
                <button type="button" onClick={() => toggleDetails(event.id)} className={`p-2 rounded-xl transition-all hover:bg-white/10 ${isDetailsExpanded ? 'text-teal-400 bg-teal-500/10' : 'text-white/40'}`}>
                  {isDetailsExpanded ? <ChevronDown size={18} /> : <ChevronRightIcon size={18} />}
                </button>
              )}
              <div className={`p-2 rounded-xl shrink-0 ${isChild ? 'bg-white/10 text-white/40' : 'bg-teal-500/20 text-teal-400'}`}>
                {isChild ? <Clock size={16} /> : <CalendarDays size={18} />}
              </div>
              {isReadMode && (
                <div className="flex flex-col md:hidden"><span className="text-teal-300 font-black text-xs">AN {event.year || 0}</span></div>
              )}
            </div>
            
            <div className="flex-1 w-full">
              {!isReadMode ? (
                <input
                  type="text"
                  value={event.name}
                  onChange={(e) => updateEventLocal(event.id, { name: e.target.value })}
                  onBlur={(e) => saveEvent(event.id, { name: e.target.value })}
                  placeholder={isChild ? "Bataille, Traité..." : "Nom de l'Ère..."}
                  readOnly={isExternal}
                  className="bg-transparent border-none text-white font-black text-lg placeholder:text-white/20 focus:ring-0 outline-none w-full"
                />
              ) : (
                <h4 className="text-white font-black text-lg tracking-wide">{event.name}</h4>
              )}
              
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                {(!isDetailsExpanded || isReadMode) && (
                  <span className={`text-[10px] uppercase font-black tracking-widest ${isReadMode ? 'bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 hidden md:inline' : 'text-teal-500/60'}`}>
                    AN {event.year || 0} {event.month && `• ${event.month}`} {event.day && `• JOUR ${event.day}`}
                  </span>
                )}
                
                {isExternal && (
                  <span className="px-2 py-0.5 bg-[#151725] text-silver/80 rounded text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
                    <span className="text-xs">{extMeta?.icon}</span>
                    <span className="text-teal-500/50 hidden md:inline">{extMeta?.label} :</span>
                    <span className="text-white">{extName}</span>
                  </span>
                )}

                {hasChildren && (
                  <button
                    type="button"
                    onClick={() => toggleChildren(event.id)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border transition-all ${
                      isChildrenExpanded 
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' 
                        : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {isChildrenExpanded ? <ChevronsDown size={12} /> : <ChevronsRight size={12} />}
                    {children.length} Chapitre{children.length > 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </div>

            {!isReadMode && isLocal && (
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-3 md:mt-0">
                <div className="flex items-center mr-2 bg-black/20 rounded-lg p-1 border border-white/5 gap-0.5">
                  <button type="button" onClick={() => outdentEvent(event.id)} disabled={!canOutdent} className="p-1 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"><ArrowLeft size={14} /></button>
                  <div className="flex flex-col border-l border-r border-white/5 px-0.5">
                    <button type="button" onClick={() => moveEvent(event.id, 'up')} className="p-1 text-white/40 hover:text-white hover:bg-white/10 transition-colors"><ArrowUp size={12} /></button>
                    <button type="button" onClick={() => moveEvent(event.id, 'down')} className="p-1 text-white/40 hover:text-white hover:bg-white/10 transition-colors"><ArrowDown size={12} /></button>
                  </div>
                  <button type="button" onClick={() => indentEvent(event.id)} disabled={!canIndent} className="p-1 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"><ArrowRight size={14} /></button>
                </div>
                <button type="button" onClick={() => addEvent(event.id)} className="p-2.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-xl transition-colors border border-teal-500/20"><Plus size={16} /></button>
                <button type="button" onClick={() => deleteEvent(event.id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20"><Trash2 size={16} /></button>
              </div>
            )}
          </div>

          {isReadMode && event.description && (
             <div className="mt-4 pl-[4rem] text-silver/80 text-xs leading-relaxed whitespace-pre-wrap">{event.description}</div>
          )}

          {!isReadMode && isDetailsExpanded && (
            <div className="flex flex-col xl:flex-row gap-6 mt-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-4">
               <div className="shrink-0 flex justify-center xl:justify-start">
                  <FantasyCalendarPicker event={event} updateEventLocal={updateEventLocal} saveEvent={saveEvent} calendarData={calendarData} readOnly={isExternal} />
               </div>
               <div className="flex-1">
                  <textarea
                    value={event.description}
                    onChange={(e) => updateEventLocal(event.id, { description: e.target.value })}
                    onBlur={(e) => saveEvent(event.id, { description: e.target.value })}
                    placeholder="Récit détaillé..."
                    readOnly={isExternal}
                    className="w-full h-full bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl p-5 text-xs text-silver/90 min-h-[150px] outline-none transition-all resize-none"
                  />
               </div>
            </div>
          )}
        </div>

        {hasChildren && isChildrenExpanded && (
          <div className={`${isReadMode ? 'mt-2' : ''} animate-in fade-in slide-in-from-top-4`}>
            {children.map(child => renderEventNode(child, true, isReadMode))}
          </div>
        )}
      </div>
    );
  };

  const rootEvents = safeEvents.filter(e => !e.parent_event_id).sort((a, b) => (a.year || 0) - (b.year || 0));

  return (
    <div className={`space-y-6 ${readOnly ? 'py-4' : ''}`}>
      {rootEvents.map(event => renderEventNode(event, false, readOnly))}
      {!readOnly && (
        <button type="button" onClick={() => addEvent()} className="w-full py-8 border-2 border-dashed border-white/10 hover:border-teal-500/40 rounded-[2.5rem] text-white/20 hover:text-teal-400 hover:bg-teal-500/5 transition-all flex flex-col items-center justify-center gap-3 group">
          <div className="p-4 rounded-full bg-black/40 group-hover:bg-teal-500/20 transition-all"><Plus size={28} /></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Nouveau Chapitre Racine</span>
        </button>
      )}
    </div>
  );
}