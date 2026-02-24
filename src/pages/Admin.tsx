import React, { useState, useEffect } from 'react';
import { Assignment } from '../types';
import { Plus, Trash2, RefreshCw, Search } from 'lucide-react';

export default function Admin() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [researchTopic, setResearchTopic] = useState('');
  const [applicationSteps, setApplicationSteps] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/assignments');
      const data = await res.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, researchTopic, applicationSteps, imageUrl }),
      });
      if (res.ok) {
        setShowAddForm(false);
        setTitle('');
        setResearchTopic('');
        setApplicationSteps('');
        setImageUrl('');
        fetchAssignments();
      }
    } catch (error) {
      console.error('Error adding assignment:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu ödevi silmek istediğinize emin misiniz?')) return;
    try {
      await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const handleReset = async (id: number) => {
    if (!confirm('Bu ödevin öğrenci kaydını sıfırlamak istediğinize emin misiniz?')) return;
    try {
      await fetch(`/api/assignments/${id}/reset`, { method: 'POST' });
      fetchAssignments();
    } catch (error) {
      console.error('Error resetting assignment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yönetim Paneli</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            Yeni Ödev Ekle
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl font-semibold mb-4">Yeni Ödev Ekle</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Araştırma Konusu</label>
                <textarea
                  required
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Uygulama Adımları</label>
                <textarea
                  required
                  value={applicationSteps}
                  onChange={(e) => setApplicationSteps(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-500">ID</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Başlık</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Durum</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Öğrenci</th>
                  <th className="px-6 py-4 font-medium text-gray-500 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500">#{assignment.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-md truncate" title={assignment.title}>
                      {assignment.title}
                    </td>
                    <td className="px-6 py-4">
                      {assignment.is_taken ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Dolu
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Müsait
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {assignment.is_taken ? (
                        <div>
                          <div className="font-medium text-gray-900">{assignment.student_name} {assignment.student_surname}</div>
                          <div className="text-xs">{assignment.student_no}</div>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {assignment.is_taken === 1 && (
                          <button
                            onClick={() => handleReset(assignment.id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Öğrenciyi Sıfırla"
                          >
                            <RefreshCw size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
