import React, { useState, useEffect, useRef } from 'react';
import { operationalStore } from '../../lib/operationalStore';
import { MapPin, Camera, Images, Send, FileText, X, Compass } from 'lucide-react';
import { DISTRICTS, MUNICIPALITIES, WASTE_CATEGORIES, PRIORITIES, Report, GPSCoordinates } from '../../lib/citizenData';
import {VoiceInput} from '../VoiceAccessibility';

const DISTRICT_CENTROIDS: Record<string, GPSCoordinates> = {
  'Bo District':{lat:7.9647,lng:-11.7383},'Bombali District':{lat:9.1250,lng:-12.0500},'Bonthe District':{lat:7.5328,lng:-12.5019},
  'Falaba District':{lat:9.7250,lng:-11.1750},'Kailahun District':{lat:8.2789,lng:-10.5730},'Kambia District':{lat:9.1250,lng:-12.9180},
  'Karene District':{lat:9.5000,lng:-12.2500},'Kenema District':{lat:7.8767,lng:-11.1875},'Koinadugu District':{lat:9.5000,lng:-11.5000},
  'Kono District':{lat:8.6439,lng:-10.9717},'Moyamba District':{lat:8.1586,lng:-12.4317},'Port Loko District':{lat:8.7661,lng:-12.7869},
  'Pujehun District':{lat:7.3581,lng:-11.7208},'Tonkolili District':{lat:8.6667,lng:-11.6667},
  'Western Area Urban':{lat:8.4840,lng:-13.2299},'Western Area Rural':{lat:8.3389,lng:-13.0714}
};

interface ReportWasteProps {
  onSubmit: (report: Omit<Report, 'id' | 'referenceNumber' | 'status' | 'date'> & {evidenceFiles?:File[]}) => Promise<void>;
  onCancel: () => void;
}

export default function ReportWaste({ onSubmit, onCancel }: ReportWasteProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(WASTE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [municipality, setMunicipality] = useState('');
  const [ward, setWard] = useState('Ward 301');
  const [zone, setZone] = useState('Zone 1 (Aberdeen)');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [gps, setGps] = useState<GPSCoordinates | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError,setGpsError]=useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [evidenceFiles,setEvidenceFiles]=useState<File[]>([]);
  const cameraInput=useRef<HTMLInputElement>(null);
  const galleryInput=useRef<HTMLInputElement>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Update municipality options based on selected district
  useEffect(() => {
    const list = MUNICIPALITIES[district];
    if (list && list.length > 0) {
      setMunicipality(list[0]);
    } else {
      setMunicipality('');
    }
  }, [district]);

  // Capture the citizen's real browser/device coordinates.
  const handleDetectGPS = () => {
    setGpsError('');
    if(!navigator.geolocation){setGpsError('Device GPS is unavailable. Your report will use an approximate district map point together with your written address.');return;}
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(position=>{setGps({lat:Number(position.coords.latitude.toFixed(6)),lng:Number(position.coords.longitude.toFixed(6))});setIsDetectingGps(false);},()=>{setGpsError('Device GPS permission is unavailable. Submission remains enabled and will use an approximate district map point plus your written street or landmark.');setIsDetectingGps(false);},{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  };

  const handlePhotoUpload = (files:FileList|null) => {if(!files)return;const accepted=Array.from(files).filter(file=>['image/jpeg','image/png','image/webp'].includes(file.type)&&file.size<=8*1024*1024).slice(0,5-evidenceFiles.length);setEvidenceFiles(current=>[...current,...accepted]);setPhotos(current=>[...current,...accepted.map(file=>URL.createObjectURL(file))]);};

  const handleSaveDraft = () => {
    const draft = {
      title,
      category,
      description,
      location,
      district,
      municipality,
      ward,
      zone,
      priority,
      photos,
      gps
    };
    operationalStore.setItem('ecoclean_citizen_draft_report', JSON.stringify(draft));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const loadDraft = () => {
    const stored = operationalStore.getItem('ecoclean_citizen_draft_report');
    if (stored) {
      try {
        const draft = JSON.parse(stored);
        setTitle(draft.title || '');
        setCategory(draft.category || WASTE_CATEGORIES[0]);
        setDescription(draft.description || '');
        setLocation(draft.location || '');
        setDistrict(draft.district || DISTRICTS[0]);
        setWard(draft.ward || 'Ward 301');
        setZone(draft.zone || 'Zone 1 (Aberdeen)');
        setPriority(draft.priority || 'Medium');
        setPhotos(draft.photos || []);
        setGps(draft.gps);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!title.trim() || !description.trim() || !location.trim()) {
      setSubmitError('Add a title, a description, and the waste location before submitting.');
      return;
    }
    // Mobile browsers may deny geolocation even when the written address is valid.
    // In that case store an explicitly approximate district map point; crews use the
    // submitted street/landmark as the authoritative pickup location.
    const effectiveGps=gps||DISTRICT_CENTROIDS[district]||DISTRICT_CENTROIDS['Western Area Urban'];

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        category,
        description,
        location,
        district,
        municipality,
        ward,
        zone,
        priority,
        photos: photos.length > 0 ? photos : ['/assets/demo-waste.svg'],
        gps:effectiveGps,
        evidenceFiles
      });
      // A draft is removed only after MariaDB and any evidence uploads confirm success.
      operationalStore.removeItem('ecoclean_citizen_draft_report');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'The report could not be submitted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasDraft = !!operationalStore.getItem('ecoclean_citizen_draft_report');

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto" id="report-waste-form">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div>
          <span className="bg-brand-primary/10 border border-brand-primary/15 text-brand-primary text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Step 1 of 2: Information Intake
          </span>
          <h2 className="text-xl font-extrabold text-gray-900 mt-2">Report a Waste Issue</h2>
          <p className="text-xs text-gray-400 mt-1">
            Provide precise details to help municipal cleanup crews respond efficiently.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasDraft && (
            <button
              type="button"
              onClick={loadDraft}
              className="text-xs font-bold text-brand-primary bg-brand-accent/20 hover:bg-brand-accent/40 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Load Saved Draft</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">Issue Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Overflowing trash skip, blocked market gutter"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-2xl py-3.5 px-4 text-xs font-medium text-gray-800 transition-all focus:outline-none"
            />
            <VoiceInput label="Speak issue title" onAccept={(english)=>setTitle(english.slice(0,190))}/>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">Waste Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-2xl py-3.5 px-4 text-xs font-medium text-gray-800 transition-all focus:outline-none cursor-pointer"
            >
              {WASTE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase">Detailed Description *</label>
          <textarea
            rows={4}
            required
            placeholder="Describe what kind of waste it is, the approximate size/volume, smells, public blockage, or anything that helps crews prepare."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-2xl py-3.5 px-4 text-xs font-medium text-gray-800 transition-all focus:outline-none"
          />
          <VoiceInput label="Describe issue by voice" onAccept={(english)=>setDescription(current=>current?`${current}\n${english}`:english)}/>
        </div>

        {/* Administrative Jurisdiction */}
        <div className="bg-gray-50/50 border border-gray-200/60 p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-primary" />
            <span>Regional Administrative Jurisdiction</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">District *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-brand-primary rounded-xl p-2.5 text-xs text-gray-800 cursor-pointer"
              >
                {DISTRICTS.map((dst) => (
                  <option key={dst} value={dst}>
                    {dst}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">Municipality *</label>
              <input
                type="text"
                readOnly
                value={municipality}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">Ward / Constituency *</label>
              <input
                type="text"
                required
                placeholder="e.g., Ward 301"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-brand-primary rounded-xl p-2.5 text-xs text-gray-800"
              />
              <VoiceInput label="Speak landmark" onAccept={(english)=>setLocation(english)}/>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">Zone *</label>
              <input
                type="text"
                required
                placeholder="e.g., Zone 1"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-brand-primary rounded-xl p-2.5 text-xs text-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">Specific Street Address / Landmark *</label>
              <input
                type="text"
                required
                placeholder="e.g., 24 Kroo Town Road, right next to the vegetable market"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-brand-primary rounded-xl p-2.5 text-xs text-gray-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">Response Priority *</label>
              <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1">
                {PRIORITIES.map((pri) => (
                  <button
                    key={pri}
                    type="button"
                    onClick={() => setPriority(pri)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      priority === pri
                        ? pri === 'High'
                          ? 'bg-red-500 text-white shadow-sm'
                          : pri === 'Medium'
                          ? 'bg-brand-primary text-white shadow-sm'
                          : 'bg-gray-500 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {pri}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Attachments & GPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Camera and gallery evidence */}
          <div className="space-y-3 bg-gray-50/50 border border-gray-200/60 p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-brand-primary" />
              <span>Photo Evidence</span>
            </h3>

            <p className="text-[11px] text-gray-400 leading-relaxed">
              Take a new photograph with your device camera or select existing evidence from your gallery. Up to five verified images may be attached.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <input ref={cameraInput} type="file" accept="image/*" capture="environment" className="hidden" onChange={e=>{handlePhotoUpload(e.target.files);e.currentTarget.value='';}}/>
              <input ref={galleryInput} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={e=>{handlePhotoUpload(e.target.files);e.currentTarget.value='';}}/>
              <button
                type="button"
                onClick={()=>cameraInput.current?.click()}
                className="border-2 border-dashed border-gray-200 hover:border-brand-primary/50 bg-white p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer hover:bg-emerald-50/10 group"
              >
                <div className="w-9 h-9 rounded-full bg-brand-primary/5 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-bold text-gray-700">Take a Photo</span>
                <span className="text-[9px] text-gray-400">Open rear camera</span>
              </button>

              <button
                type="button"
                onClick={()=>galleryInput.current?.click()}
                className="border-2 border-dashed border-gray-200 hover:border-brand-primary/50 bg-white p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer hover:bg-emerald-50/10 group"
              >
                <div className="w-9 h-9 rounded-full bg-brand-primary/5 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Images className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-bold text-gray-700">Choose from Gallery</span>
                <span className="text-[9px] text-gray-400">JPG, PNG or WebP • 8 MB</span>
              </button>
            </div>

            {/* List of uploaded items */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 mt-2">
                {photos.map((ph, idx) => (
                  <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                    <img src={ph} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {URL.revokeObjectURL(ph);setPhotos(photos.filter((_, i) => i !== idx));setEvidenceFiles(evidenceFiles.filter((_,i)=>i!==idx));}}
                      className="absolute top-0.5 right-0.5 bg-black/50 hover:bg-black text-white rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GPS Simulator */}
          <div className="space-y-3 bg-gray-50/50 border border-gray-200/60 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Compass className="w-4 h-4 text-brand-primary" />
                <span>GPS Location Tagging</span>
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Use device GPS when available. If permission is unavailable, submission remains enabled with your written landmark and an approximate district map point.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white border border-gray-200/60 p-3 rounded-xl mt-2">
              <div className="flex-1 min-w-0">
                {gps ? (
                  <div className="font-mono text-xs text-brand-primary font-bold">
                    <span>Latitude: {gps.lat}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span>Longitude: {gps.lng}</span>
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs italic flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse" />
                    No coordinates locked.
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isDetectingGps}
                className="bg-brand-accent/30 hover:bg-brand-accent/50 text-brand-primary font-bold text-xs px-3.5 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Compass className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingGps ? 'Detecting...' : gps ? 'Re-detect GPS' : 'Lock GPS Location'}</span>
              </button>
            </div>
          </div>
        </div>

        {submitError && (
          <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
            {submitError}
          </div>
        )}
        {gpsError&&<div role="alert" className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">{gpsError}</div>}

        {/* Buttons / Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-200 py-3 px-5 rounded-xl transition-all cursor-pointer"
          >
            Cancel Report
          </button>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="text-xs font-bold text-brand-primary hover:text-brand-success bg-brand-accent/15 hover:bg-brand-accent/30 border border-brand-accent/30 py-3 px-5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Save Draft</span>
              {draftSaved && <span className="text-[10px] bg-brand-success text-white px-1.5 py-0.5 rounded font-mono">Saved</span>}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="text-xs font-bold text-white bg-brand-primary hover:bg-brand-secondary disabled:bg-gray-300 disabled:cursor-wait py-3 px-7 rounded-xl transition-all shadow-md shadow-brand-primary/10 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting Report…' : 'Submit Waste Report'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
