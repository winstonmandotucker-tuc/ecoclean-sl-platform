import React, { useState, useMemo, useRef } from 'react';
import { 
  Camera, Filter, Search, Download, Trash2, Eye, Upload, Image as ImageIcon, 
  CheckCircle2, Folder, ListFilter, AlertCircle, FileText, Calendar 
} from 'lucide-react';
import { StaffTask } from '../../lib/staffData';

interface EvidenceManagementProps {
  tasks: StaffTask[];
  onUploadGeneralEvidence: (file: File, taskId:string) => Promise<void>;
}

export default function EvidenceManagement({ tasks, onUploadGeneralEvidence }: EvidenceManagementProps) {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Before' | 'After'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; taskId: string; date: string } | null>(null);
  const fileInput=useRef<HTMLInputElement>(null);
  const [uploading,setUploading]=useState(false);
  const [error,setError]=useState('');

  // Compile all photos from task records
  const allPhotos = useMemo(() => {
    const list: { url: string; type: 'Before' | 'After'; taskId: string; taskTitle: string; refCode: string; date: string; location: string }[] = [];

    tasks.forEach(task => {
      task.photosBefore.forEach(url => {
        list.push({
          url,
          type: 'Before',
          taskId: task.id,
          taskTitle: task.title,
          refCode: task.referenceNumber,
          date: task.date,
          location: task.location
        });
      });

      task.photosAfter.forEach(url => {
        list.push({
          url,
          type: 'After',
          taskId: task.id,
          taskTitle: task.title,
          refCode: task.referenceNumber,
          date: 'Completed just now',
          location: task.location
        });
      });
    });

    return list;
  }, [tasks]);

  // Filter photos
  const filteredPhotos = useMemo(() => {
    return allPhotos.filter(p => {
      const matchesFilter = activeFilter === 'All' || p.type === activeFilter;
      const matchesSearch = p.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.taskId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [allPhotos, activeFilter, searchQuery]);

  const handleUpload=async(files:FileList|null)=>{const file=files?.[0];if(!file)return;const task=tasks.find(item=>item.status!=='Completed');if(!task){setError('No active assignment is available for this evidence.');return;}setUploading(true);setError('');try{await onUploadGeneralEvidence(file,task.id);}catch(cause){setError(cause instanceof Error?cause.message:'Evidence could not be uploaded.');}finally{setUploading(false);if(fileInput.current)fileInput.current.value='';}};

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Geotagged Evidence Locker</h2>
          <p className="text-xs text-gray-400 mt-1">Review, audit, and preview secure before/after photographic proof files.</p>
        </div>

        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="hidden" onChange={event=>void handleUpload(event.target.files)}/>
        <button
          onClick={()=>fileInput.current?.click()}
          disabled={uploading}
          className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>{uploading?'Uploading…':'Upload General Photo'}</span>
        </button>
      </div>
      {error&&<div role="alert" className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-xl text-xs font-semibold">{error}</div>}

      {/* Filter and control grid bar */}
      <div className="bg-white rounded-3xl border border-gray-250/80 p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search photos by Task ID, title, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:bg-white focus:border-brand-primary text-gray-800"
          />
        </div>

        {/* Filters */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-stretch md:self-auto">
          {(['All', 'Before', 'After'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 md:flex-initial text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeFilter === filter 
                  ? 'bg-white text-brand-primary shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {filter === 'All' ? 'All Proof' : filter === 'Before' ? 'Before Cleanup' : 'After Cleanup'}
            </button>
          ))}
        </div>

      </div>

      {/* Grid gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPhotos.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-3.5">
            <ImageIcon className="w-12 h-12 text-gray-350 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-gray-800">No photos cataloged</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                No active photo attachments found matching your active filter. Perform task executions and upload cleanup logs to seed this library.
              </p>
            </div>
          </div>
        ) : (
          filteredPhotos.map((photo, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl border border-gray-150/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Photo Frame */}
              <div className="aspect-video w-full bg-gray-100 relative overflow-hidden shadow-inner border-b border-gray-100">
                <img 
                  src={photo.url} 
                  alt={photo.taskTitle} 
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Proof badge */}
                <span className={`absolute top-3 left-3 text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase tracking-wider text-white shadow-sm ${
                  photo.type === 'Before' ? 'bg-red-600' : 'bg-emerald-600'
                }`}>
                  {photo.type}
                </span>

                {/* Hover action overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setSelectedPhoto({ url: photo.url, title: photo.taskTitle, taskId: photo.taskId, date: photo.date })}
                    className="p-2 bg-white hover:bg-brand-accent/20 hover:text-brand-primary text-gray-800 rounded-xl transition-all cursor-pointer shadow"
                    title="Preview photo"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <a
                    href={photo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white hover:bg-brand-accent/20 hover:text-brand-primary text-gray-800 rounded-xl transition-all cursor-pointer shadow"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Photo Metadata Footer */}
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold bg-gray-50 border px-1.5 py-0.5 rounded text-gray-500">
                      {photo.taskId}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono truncate">{photo.refCode}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 mt-1 truncate leading-tight">
                    {photo.taskTitle}
                  </h4>
                  <p className="text-[11px] text-gray-400 truncate mt-1">📍 {photo.location}</p>
                </div>

                <div className="pt-2 border-t border-gray-50 text-[10px] text-gray-400 font-mono flex items-center justify-between">
                  <span>Logged:</span>
                  <span>{photo.date}</span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Full Preview Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          />
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 relative z-10 border border-gray-150 shadow-2xl space-y-4">
            
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative border">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex justify-between items-center px-2">
              <div>
                <h3 className="text-sm font-bold text-gray-800 leading-snug">{selectedPhoto.title}</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">Task ID: {selectedPhoto.taskId} &bull; Timestamp: {selectedPhoto.date}</p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
