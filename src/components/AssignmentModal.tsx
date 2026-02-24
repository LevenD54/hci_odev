import React, { useState } from 'react';
import { Assignment } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, BookOpen, Layers } from 'lucide-react';

interface AssignmentModalProps {
  assignment: Assignment | null;
  onClose: () => void;
  onTake: (id: number, name: string, surname: string, no: string) => Promise<void>;
}

export default function AssignmentModal({ assignment, onClose, onTake }: AssignmentModalProps) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [no, setNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!assignment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onTake(assignment.id, name, surname, no);
      onClose();
    } catch (err) {
      setError('Ödev alınırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {assignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="h-48 sm:h-64 shrink-0 relative">
              <img
                src={assignment.image_url || 'https://picsum.photos/800/600'}
                alt={assignment.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 text-white">
                <h2 className="text-xl sm:text-2xl font-bold leading-tight">{assignment.title}</h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 p-2 bg-indigo-50 text-indigo-600 rounded-lg h-fit">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Araştırma Konusu</h3>
                    <p className="text-gray-600 leading-relaxed">{assignment.research_topic}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 p-2 bg-emerald-50 text-emerald-600 rounded-lg h-fit">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Uygulama Adımları</h3>
                    <p className="text-gray-600 leading-relaxed">{assignment.application_steps}</p>
                  </div>
                </div>
              </div>

              {!assignment.is_taken ? (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                    <User size={20} className="text-indigo-600" />
                    <h3>Bu Ödevi Al</h3>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                          placeholder="Adınız"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                        <input
                          type="text"
                          required
                          value={surname}
                          onChange={(e) => setSurname(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                          placeholder="Soyadınız"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenci No</label>
                      <input
                        type="text"
                        required
                        value={no}
                        onChange={(e) => setNo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="Öğrenci Numaranız"
                      />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'İşleniyor...' : 'Ödevi Onayla ve Al'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                  <p className="text-red-800 font-medium">Bu ödev {assignment.student_name} {assignment.student_surname} ({assignment.student_no}) tarafından alınmıştır.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
