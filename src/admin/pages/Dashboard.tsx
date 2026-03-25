import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, MessageSquare, Images, Star, ArrowRight, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Reservation {
  id: string;
  nom: string;
  prenom: string;
  type_evenement: string;
  pack_choisi: string;
  date_evenement: string;
  statut: string;
  created_at: string;
}

interface Message {
  id: string;
  nom: string;
  email: string;
  message: string;
  lu: boolean;
  created_at: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    reservations: 0,
    messages: 0,
    realisations: 0,
    temoignages: 0
  });
  const [latestReservations, setLatestReservations] = useState<Reservation[]>([]);
  const [latestMessages, setLatestMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch Stats
      const [resCount, msgCount, realCount, temCount] = await Promise.all([
        supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente'),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('lu', false),
        supabase.from('realisations').select('*', { count: 'exact', head: true }),
        supabase.from('temoignages').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        reservations: resCount.count || 0,
        messages: msgCount.count || 0,
        realisations: realCount.count || 0,
        temoignages: temCount.count || 0
      });

      // Fetch Latest Data
      const [resData, msgData] = await Promise.all([
        supabase.from('reservations').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(3)
      ]);

      setLatestReservations(resData.data || []);
      setLatestMessages(msgData.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des données du dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Realtime subscriptions
    const channel = supabase.channel('dashboard_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      year: 'numeric'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E91E8C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[#F8F8F8] min-h-full -m-4 lg:-m-8 p-4 lg:p-8">
      {/* Section 1: Stats Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Card 1: Réservations en attente */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#E91E8C]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Réservations en attente</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.reservations}</h3>
            </div>
            <div className="w-12 h-12 bg-[#E91E8C]/10 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#E91E8C]" />
            </div>
          </div>
        </motion.div>

        {/* Card 2: Messages non lus */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D4AF37]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Messages non lus</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.messages}</h3>
            </div>
            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#D4AF37]" />
            </div>
          </div>
        </motion.div>

        {/* Card 3: Réalisations publiées */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#22C55E]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Réalisations publiées</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.realisations}</h3>
            </div>
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
              <Images className="w-6 h-6 text-[#22C55E]" />
            </div>
          </div>
        </motion.div>

        {/* Card 4: Témoignages */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D4AF37]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Témoignages</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.temoignages}</h3>
            </div>
            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-[#D4AF37]" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section 2: Dernières Réservations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Dernières Réservations</h2>
            <Link to="/admin/reservations" className="text-sm text-[#E91E8C] hover:text-[#D81B80] font-medium flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="p-4 font-medium">Nom</th>
                  <th className="p-4 font-medium">Type événement</th>
                  <th className="p-4 font-medium">Pack</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Statut</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {latestReservations.length > 0 ? (
                  latestReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{res.prenom} {res.nom}</td>
                      <td className="p-4 text-gray-600 capitalize">{res.type_evenement?.replace('_', ' ')}</td>
                      <td className="p-4 text-gray-600">{res.pack_choisi || '-'}</td>
                      <td className="p-4 text-gray-600">{formatDate(res.date_evenement)}</td>
                      <td className="p-4">{getStatusBadge(res.statut)}</td>
                      <td className="p-4 text-center">
                        <Link to={`/admin/reservations`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-[#E91E8C] hover:text-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Aucune réservation pour l'instant
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Section 3: Derniers Messages */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Derniers Messages</h2>
            <Link to="/admin/messages" className="text-sm text-[#E91E8C] hover:text-[#D81B80] font-medium flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="p-0 flex-1">
            {latestMessages.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {latestMessages.map((msg) => (
                  <li key={msg.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{msg.nom}</h3>
                      {!msg.lu && (
                        <span className="px-2 py-1 bg-[#E91E8C]/10 text-[#E91E8C] text-[10px] font-bold uppercase tracking-wider rounded-full">
                          Non lu
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{msg.email}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {msg.message.length > 50 ? `${msg.message.substring(0, 50)}...` : msg.message}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500 h-full flex items-center justify-center">
                Aucun message pour l'instant
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
