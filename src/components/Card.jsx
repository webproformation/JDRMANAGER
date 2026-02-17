import { Eye, Edit2, Trash2 } from 'lucide-react';

export default function Card({ item, onView, onEdit, onDelete, imageField = 'image_url', nameField = 'name', descriptionField = 'description' }) {
  return (
    <div className="group bg-soft-white rounded-2xl shadow-lg overflow-hidden border border-arcane border-opacity-20 transition-all duration-300 hover:shadow-2xl hover:shadow-arcane hover:-translate-y-1">
      {/* Image section with title overlay */}
      <div className="relative h-56 overflow-hidden">
        {item[imageField] ? (
          <img
            src={item[imageField]}
            alt={item[nameField]}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-arcane to-night"></div>
        )}

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        {/* Title overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            {item[nameField]}
          </h3>
        </div>
      </div>

      {/* White content section */}
      <div className="p-5 bg-white">
        {item[descriptionField] && (
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-4">
            {item[descriptionField]}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(item);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            <Eye size={18} />
            <span className="text-sm font-medium">Voir</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-2 bg-white text-cyan-light border border-cyan-light border-opacity-50 rounded-lg hover:bg-cyan-light hover:bg-opacity-10 transition-all"
            aria-label="Modifier"
          >
            <Edit2 size={18} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="p-2 bg-white text-red-500 border border-red-300 rounded-lg hover:bg-red-50 transition-all"
            aria-label="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
