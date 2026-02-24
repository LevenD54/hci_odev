import React from 'react';
import { Assignment } from '../types';
import { motion } from 'motion/react';
import { CheckCircle, XCircle } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  onClick: () => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full transition-colors ${
        assignment.is_taken ? 'opacity-75' : 'hover:border-indigo-200 hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={assignment.image_url || 'https://picsum.photos/800/600'}
          alt={assignment.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2">
          {assignment.is_taken ? (
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <XCircle size={14} /> Dolu
            </span>
          ) : (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <CheckCircle size={14} /> Müsait
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
          {assignment.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
          {assignment.research_topic}
        </p>
        {assignment.is_taken ? (
          <div className="mt-auto pt-3 border-t border-gray-100 text-xs text-gray-400">
            {assignment.student_name} {assignment.student_surname} tarafından alındı
          </div>
        ) : (
          <div className="mt-auto pt-3 border-t border-gray-100 text-xs text-indigo-600 font-medium">
            Detayları İncele &rarr;
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AssignmentCard;
