import { useState, useEffect } from 'react';
import { Assignment } from '../types';
import AssignmentCard from '../components/AssignmentCard';
import AssignmentModal from '../components/AssignmentModal';
import { Search, BookOpen } from 'lucide-react';

export default function Home() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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

  const handleTakeAssignment = async (id: number, name: string, surname: string, no: string) => {
    const res = await fetch(`/api/assignments/${id}/take`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentName: name, studentSurname: surname, studentNo: no }),
    });

    if (res.ok) {
      await fetchAssignments();
      // Update selected assignment to reflect changes immediately in modal if needed, 
      // but usually we close modal or show success.
      // Let's re-fetch the specific assignment to update the modal view if we keep it open,
      // but for now we will just refresh the list.
    } else {
      throw new Error('Failed to take assignment');
    }
  };

  const filteredAssignments = assignments.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.research_topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-full mb-6">
              <BookOpen className="text-indigo-600 w-6 h-6" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-6">
              Ödev Konusu Seçim Portalı
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Aşağıdaki listeden ilginizi çeken bir araştırma konusunu seçin ve detayları inceleyerek ödevi üzerinize alın.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                placeholder="Konu veya içerik ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onClick={() => setSelectedAssignment(assignment)}
              />
            ))}
          </div>
        )}
        
        {!loading && filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun ödev bulunamadı.</p>
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm text-gray-500">
          <p>&copy; 2024 Ödev Yönetim Sistemi</p>
          <a href="/admin" className="hover:text-indigo-600 transition-colors">Yönetici Girişi</a>
        </div>
      </footer>

      <AssignmentModal
        assignment={selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        onTake={handleTakeAssignment}
      />
    </div>
  );
}

