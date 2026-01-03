
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Tag } from 'lucide-react';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
  highlightTerms?: string[];
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, highlightTerms = [] }) => {
  const highlightText = (text: string) => {
    if (!highlightTerms.length || !text) return text;
    
    // Sort terms by length descending to avoid partial matches interfering with longer ones
    const sortedTerms = [...highlightTerms].sort((a, b) => b.length - a.length);
    const regex = new RegExp(`(${sortedTerms.join('|')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-sky-100 text-sky-900 font-bold px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <Link to={`/business/${business.id}`} className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="relative aspect-[16/10]">
        <img 
          src={business.imageUrl} 
          alt={business.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
        />
        {business.deal && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center shadow-lg">
            <Tag className="w-3 h-3 mr-1" />
            Special Deal
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
           <span className="text-stone-200 text-xs font-medium bg-white/10 backdrop-blur-md px-2 py-0.5 rounded uppercase tracking-wider">
             {business.category}
           </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-sky-950 group-hover:text-sky-700 transition-colors">
            {highlightText(business.name)}
          </h3>
          <div className="flex items-center text-amber-500 font-bold text-sm">
            <Star className="w-4 h-4 fill-current mr-1" />
            {business.rating}
          </div>
        </div>
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-sky-700" />
          {business.city}, {business.region}
        </div>
        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
          {highlightText(business.description)}
        </p>
      </div>
    </Link>
  );
};

export default BusinessCard;
