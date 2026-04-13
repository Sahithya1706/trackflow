import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  MoreHorizontal, 
  Plus, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Paperclip,
  User as UserIcon,
  Calendar,
  Check
} from 'lucide-react';

const priorityColors = {
  Low: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  High: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  Critical: 'text-red-500 bg-red-500/10 border-red-500/20',
};

const TicketCard = ({ ticket, index, onOpen, isSelected, onToggleSelect, openMenuId, setOpenMenuId, onEdit, onDelete }) => {
  return (
    <Draggable draggableId={ticket._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-slate-800 border border-slate-700/50 p-4 rounded-2xl mb-4 cursor-pointer transition-all duration-300 group hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 ${
            snapshot.isDragging ? 'ring-2 ring-primary shadow-2xl scale-[1.02] rotate-1 z-[100]' : ''
          } ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
               <div 
                 onClick={(e) => { e.stopPropagation(); onToggleSelect(ticket._id); }}
                 className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'border-slate-600 bg-slate-900 group-hover:border-slate-500'}`}
               >
                  {isSelected && <Check size={10} className="text-white" />}
               </div>
               <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.1em] border ${priorityColors[ticket.priority] || priorityColors.Medium}`}>
                 {ticket.priority}
               </span>
            </div>
            <div className="relative">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setOpenMenuId(openMenuId === ticket._id ? null : ticket._id);
                }}
                className="text-slate-600 hover:text-white p-1 rounded transition-colors"
              >
                <MoreHorizontal size={14} />
              </button>
              
              {openMenuId === ticket._id && (
                <div 
                  onClick={e => e.stopPropagation()}
                  className="absolute right-0 top-6 bg-slate-900 border border-slate-700/80 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50 w-36 overflow-hidden animate-in fade-in zoom-in duration-200"
                >
                  <button 
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    onClick={() => { setOpenMenuId(null); onEdit(ticket); }}
                  >
                    Edit Ticket
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors"
                    onClick={() => { setOpenMenuId(null); onDelete(ticket._id); }}
                  >
                    Delete Ticket
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div onClick={() => onOpen(ticket)}>
            <h4 className="text-white font-bold text-sm leading-tight mb-2 group-hover:text-primary transition-colors">
              {ticket.title}
            </h4>
            
            <p className="text-slate-500 text-[11px] font-medium line-clamp-2 leading-relaxed mb-4">
              {ticket.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  <Calendar size={10} />
                  <span>{new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
                {ticket.attachments?.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
                    <Paperclip size={10} />
                    <span>{ticket.attachments.length}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden">
                    {ticket.assignee ? (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                        {ticket.assignee.name?.charAt(0)}
                      </div>
                    ) : (
                      <UserIcon size={12} className="text-slate-600" />
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const KanbanBoard = ({ tickets, onDragEnd, onOpenTicket, onAddTicket, selectedTickets, onToggleSelect, onEditTicket, onDeleteTicket }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const columns = {
    'To Do': tickets.filter(t => t.status === 'To Do'),
    'In Progress': tickets.filter(t => t.status === 'In Progress'),
    'Done': tickets.filter(t => t.status === 'Done'),
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-full pb-10 overflow-x-auto no-scrollbar scroll-smooth px-1">
        {Object.entries(columns).map(([columnId, columnTickets]) => (
          <div key={columnId} className="flex flex-col w-full sm:min-w-[300px] sm:max-w-[300px] lg:min-w-[320px] lg:max-w-[320px] h-full sm:shrink-0">
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  columnId === 'To Do' ? 'bg-slate-400' : 
                  columnId === 'In Progress' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{columnId}</h3>
                <span className="bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-700/50">
                  {columnTickets.length}
                </span>
              </div>
              <button 
                onClick={() => onAddTicket(columnId)}
                className="w-7 h-7 flex items-center justify-center bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 hover:border-primary/30 transition-all"
              >
                <Plus size={14} />
              </button>
            </div>

            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 overflow-y-auto no-scrollbar rounded-2xl p-1 transition-all duration-300 min-h-[50px] ${
                    snapshot.isDraggingOver ? 'bg-slate-800/20 ring-1 ring-inset ring-slate-700/30' : ''
                  }`}
                >
                  {columnTickets.map((ticket, index) => (
                    <TicketCard 
                      key={ticket._id} 
                      ticket={ticket} 
                      index={index} 
                      onOpen={onOpenTicket}
                      isSelected={selectedTickets.includes(ticket._id)}
                      onToggleSelect={onToggleSelect}
                      openMenuId={openMenuId}
                      setOpenMenuId={setOpenMenuId}
                      onEdit={onEditTicket}
                      onDelete={onDeleteTicket}
                    />
                  ))}
                  {provided.placeholder}
                  
                  {columnTickets.length === 0 && !snapshot.isDraggingOver && (
                    <div className="h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-700">
                      <p className="text-[10px] font-bold uppercase tracking-widest">No tickets here</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
