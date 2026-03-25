import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MessageSquare, Trash2, X, 
  ChevronLeft, ChevronRight, CheckCircle2, Mail, MailOpen
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  nom: string;
  email: string;
  message: string;
  lu: boolean;
  created_at: string;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('messages')
        .select('*', { count: 'exact' });

      // Apply filters
      if (statusFilter === 'unread') {
        query = query.eq('lu', false);
      } else if (statusFilter === 'read') {
        query = query.eq('lu', true);
      }
      
      if (searchTerm) {
        query = query.or(`nom.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      query = query.order('created_at', { ascending: false }).range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setMessages(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Realtime subscription
    const channel = supabase.channel('messages_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentPage, statusFilter, searchTerm]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ lu: true })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, lu: true } : msg
      ));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, lu: true });
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!window.confirm('Marquer tous les messages comme lus ?')) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ lu: true })
        .eq('lu', false);

      if (error) throw error;
      
      fetchMessages();
    } catch (error) {
      console.error('Erreur lors du marquage de tous les messages:', error);
      alert('Erreur lors de la mise à jour.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setMessages(messages.filter(msg => msg.id !== id));
      setTotalCount(prev => prev - 1);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  const openMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.lu) {
      handleMarkAsRead(msg.id);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 bg-[#F8F8F8] min-h-full -m-4 lg:-m-8 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Boîte de réception</h1>
          <div className="text-sm text-gray-500 font-medium bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
            {totalCount} message(s)
          </div>
        </div>
        
        <button
          onClick={handleMarkAllAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-[#E91E8C]" />
          Tout marquer comme lu
        </button>
      </div>

      {/* Section 1: Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none bg-white"
        >
          <option value="all">Tous les messages</option>
          <option value="unread">Non lus</option>
          <option value="read">Lus</option>
        </select>
      </div>

      {/* Section 2: Messages List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E91E8C]"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => openMessage(msg)}
              className={`p-4 md:p-6 rounded-xl shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                msg.lu 
                  ? 'bg-white border-gray-100' 
                  : 'bg-[#E91E8C]/[0.02] border-[#E91E8C]/20'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.lu ? 'bg-gray-100 text-gray-500' : 'bg-[#E91E8C]/10 text-[#E91E8C]'}`}>
                    {msg.lu ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className={`font-bold ${msg.lu ? 'text-gray-700' : 'text-gray-900'}`}>{msg.nom}</h3>
                    <p className="text-sm text-gray-500">{msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-start md:self-auto">
                  <span className="text-xs text-gray-400 font-medium">
                    {formatDate(msg.created_at)}
                  </span>
                  {!msg.lu && (
                    <span className="px-2.5 py-1 bg-[#E91E8C] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Non lu
                    </span>
                  )}
                </div>
              </div>
              <div className="pl-0 md:pl-13 mt-2">
                <p className={`text-sm line-clamp-2 ${msg.lu ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                  {msg.message.length > 80 ? `${msg.message.substring(0, 80)}...` : msg.message}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun message pour l'instant</p>
              <p className="text-sm mt-1">Modifiez vos filtres ou attendez de nouveaux messages.</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-500">
            Page <span className="font-medium text-gray-800">{currentPage}</span> sur <span className="font-medium text-gray-800">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      <AnimatePresence>
        {selectedMessage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MailOpen className="w-5 h-5 text-gray-400" />
                  Lecture du message
                </h2>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E91E8C]/10 text-[#E91E8C] rounded-full flex items-center justify-center text-xl font-bold uppercase">
                      {selectedMessage.nom.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{selectedMessage.nom}</h3>
                      <a href={`mailto:${selectedMessage.email}`} className="text-[#E91E8C] hover:underline text-sm">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1.5 rounded-lg">
                    {formatDate(selectedMessage.created_at)}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                <button 
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
                
                <div className="flex gap-3">
                  {!selectedMessage.lu && (
                    <button 
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm"
                    >
                      Marquer comme lu
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 bg-[#E91E8C] text-white hover:bg-[#D81B80] rounded-lg transition-colors font-medium text-sm"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
