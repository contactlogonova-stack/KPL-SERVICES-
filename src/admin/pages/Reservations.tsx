import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Calendar, Eye, Trash2, X, 
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Reservation {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  type_evenement: string;
  pack_choisi: string;
  date_evenement: string;
  statut: string;
  prix_estime?: number;
  created_at: string;
}

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('reservations')
        .select('*', { count: 'exact' });

      // Apply filters
      if (statusFilter !== 'all') {
        query = query.eq('statut', statusFilter);
      }
      if (typeFilter !== 'all') {
        query = query.eq('type_evenement', typeFilter);
      }
      if (searchTerm) {
        query = query.or(`nom.ilike.%${searchTerm}%,prenom.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      query = query.order('created_at', { ascending: false }).range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setReservations(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();

    // Realtime subscription
    const channel = supabase.channel('reservations_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        fetchReservations(); // Refresh data on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentPage, statusFilter, typeFilter, searchTerm]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ statut: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state for immediate feedback
      setReservations(reservations.map(res => 
        res.id === id ? { ...res, statut: newStatus } : res
      ));
      
      if (selectedReservation?.id === id) {
        setSelectedReservation({ ...selectedReservation, statut: newStatus });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;

    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setReservations(reservations.filter(res => res.id !== id));
      setTotalCount(prev => prev - 1);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">En attente</span>;
      case 'confirmee':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">Confirmée</span>;
      case 'terminee':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Terminée</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{statut}</span>;
    }
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Réservations</h1>
        <div className="text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          {totalCount} réservation(s) trouvée(s)
        </div>
      </div>

      {/* Section 1: Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
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
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="confirmee">Confirmée</option>
          <option value="terminee">Terminée</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none bg-white"
        >
          <option value="all">Tous les événements</option>
          <option value="anniversaire_femme">Anniversaire Femme</option>
          <option value="anniversaire_homme">Anniversaire Homme</option>
          <option value="mariage">Mariage</option>
        </select>
      </div>

      {/* Section 2: Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Nom</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Événement</th>
                <th className="p-4 font-medium">Pack & Prix</th>
                <th className="p-4 font-medium">Date prévue</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E91E8C]"></div>
                    </div>
                  </td>
                </tr>
              ) : reservations.length > 0 ? (
                reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{res.prenom} {res.nom}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-800">{res.telephone}</p>
                      <p className="text-xs text-gray-500">{res.email}</p>
                    </td>
                    <td className="p-4 text-gray-600 capitalize">
                      {res.type_evenement?.replace('_', ' ')}
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-800">{res.pack_choisi || '-'}</p>
                      <p className="text-xs font-medium text-[#E91E8C]">{res.prix_estime ? `${res.prix_estime} €` : '-'}</p>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {formatDate(res.date_evenement)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(res.statut)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedReservation(res)}
                          className="p-2 text-gray-400 hover:text-[#E91E8C] hover:bg-[#E91E8C]/10 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        
                        <select
                          value={res.statut}
                          onChange={(e) => handleStatusChange(res.id, e.target.value)}
                          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 focus:ring-2 focus:ring-[#E91E8C] outline-none cursor-pointer"
                        >
                          <option value="en_attente">En attente</option>
                          <option value="confirmee">Confirmée</option>
                          <option value="terminee">Terminée</option>
                        </select>

                        <button 
                          onClick={() => handleDelete(res.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Calendar className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium">Aucune réservation pour l'instant</p>
                      <p className="text-sm mt-1">Modifiez vos filtres ou attendez de nouvelles réservations.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
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
      </div>

      {/* Modal Détails */}
      <AnimatePresence>
        {selectedReservation && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReservation(null)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Détails de la réservation</h2>
                <button 
                  onClick={() => setSelectedReservation(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Client</h3>
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium text-gray-800">{selectedReservation.prenom} {selectedReservation.nom}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-800">{selectedReservation.telephone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{selectedReservation.email}</p>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Événement</h3>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium text-gray-800 capitalize">{selectedReservation.type_evenement?.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pack choisi</p>
                      <p className="font-medium text-gray-800">{selectedReservation.pack_choisi || 'Sur mesure'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prix estimé</p>
                      <p className="font-medium text-[#E91E8C]">{selectedReservation.prix_estime ? `${selectedReservation.prix_estime} €` : 'Sur devis'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Date de l'événement</p>
                    <p className="font-medium text-gray-800">{formatDate(selectedReservation.date_evenement)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de soumission</p>
                    <p className="font-medium text-gray-800">{formatDate(selectedReservation.created_at)}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 flex items-center justify-between bg-gray-50 -mx-6 -mb-6 p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">Statut actuel :</span>
                    {getStatusBadge(selectedReservation.statut)}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Changer :</span>
                    <select
                      value={selectedReservation.statut}
                      onChange={(e) => handleStatusChange(selectedReservation.id, e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E91E8C] outline-none font-medium text-gray-700"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="confirmee">Confirmée</option>
                      <option value="terminee">Terminée</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
