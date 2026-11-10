import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Upload, Camera, Maximize2 } from 'lucide-react';
import { GalleryPhoto } from '../types/wedding.ts';
import { addGalleryPhoto } from '../services/weddingStorage.ts';

interface PhotoGallerySectionProps {
  photos: GalleryPhoto[];
  onPhotosUpdated: () => void;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  photos,
  onPhotosUpdated,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'brautpaar' | 'location' | 'trauung' | 'feier' | 'details'>('feier');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Alle Fotografien' },
    { id: 'brautpaar', label: 'Thomas & Katharina' },
    { id: 'location', label: 'Schlossgut & Park' },
    { id: 'trauung', label: 'Die Trauung' },
    { id: 'feier', label: 'Feier & Dinner' },
    { id: 'details', label: 'Details & Drinks' },
  ];

  const filteredPhotos = activeCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredPhotos.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewDataUrl) return;

    addGalleryPhoto({
      url: previewDataUrl,
      title: uploadTitle.trim() || 'Gäste-Schnappschuss',
      caption: uploadCaption.trim() || 'Mit Liebe geteilt für Thomas & Katharina.',
      category: uploadCategory,
      aspectRatio: 'landscape',
    });

    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadCaption('');
    setPreviewDataUrl(null);
    onPhotosUpdated();
  };

  return (
    <section id="gallery" className="scroll-mt-24 py-20 lg:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-mood-wine block mb-2">
              Bildergalerie
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-wedding font-normal tracking-tight text-stone-900">
              Momente & Impressionen
            </h2>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-mood-wine bg-white border border-[#C7BC86] rounded-full hover:bg-mood-blush/30 transition-colors shadow-2xs cursor-pointer"
          >
            <Camera className="w-4 h-4 text-mood-wine" />
            <span>Foto zum Hochzeitsalbum hinzufügen</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-mood-wine text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:text-mood-wine border border-stone-200 hover:border-mood-champagne'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => {
            const isWide = index === 0 || index === 2 || index === 3;
            const isVid = photo.mediaType === 'video' || photo.url.endsWith('.mp4') || photo.url.endsWith('.webm');
            return (
              <div
                key={photo.id}
                onClick={() => setActiveLightboxIndex(index)}
                className={`group relative overflow-hidden rounded-2xl bg-stone-900 cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300 border border-stone-200/90 ${
                  isWide ? 'lg:col-span-2 aspect-16/9' : 'aspect-4/3'
                }`}
              >
                {isVid ? (
                  <video
                    src={photo.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                )}

                {/* Video Indicator Badge */}
                {isVid && (
                  <div className="absolute top-3 left-3 bg-stone-950/75 backdrop-blur-xs text-[#FAD7D5] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/20 z-10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>Video (MP4)</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a060d]/90 via-[#2a060d]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#C7BC86] font-semibold mb-1">
                        {photo.category.toUpperCase()}
                      </p>
                      <h4 className="text-lg font-serif-wedding font-semibold text-white">
                        {photo.title}
                      </h4>
                      <p className="text-xs text-stone-200 line-clamp-1 font-light mt-0.5">
                        {photo.caption}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox Modal with Image & Video Support */}
        {activeLightboxIndex !== null && filteredPhotos[activeLightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-[#140205]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
            {/* Top Bar */}
            <div className="flex items-center justify-between text-white z-10">
              <span className="text-xs tracking-widest text-stone-300 font-mono">
                {filteredPhotos[activeLightboxIndex].mediaType === 'video' || filteredPhotos[activeLightboxIndex].url.endsWith('.mp4') ? 'Video' : 'Foto'} {activeLightboxIndex + 1} von {filteredPhotos.length}
              </span>
              <button
                onClick={() => setActiveLightboxIndex(null)}
                className="p-2 text-stone-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Vorschau schließen"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Media (Image or Video) */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxIndex(
                    (activeLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
                  );
                }}
                className="absolute left-2 sm:left-4 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors z-10"
                aria-label="Vorheriges Bild / Video"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {filteredPhotos[activeLightboxIndex].mediaType === 'video' || filteredPhotos[activeLightboxIndex].url.endsWith('.mp4') || filteredPhotos[activeLightboxIndex].url.endsWith('.webm') ? (
                <video
                  src={filteredPhotos[activeLightboxIndex].url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[75vh] max-w-full rounded-lg shadow-2xl"
                />
              ) : (
                <img
                  src={filteredPhotos[activeLightboxIndex].url}
                  alt={filteredPhotos[activeLightboxIndex].title}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
                />
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxIndex((activeLightboxIndex + 1) % filteredPhotos.length);
                }}
                className="absolute right-2 sm:right-4 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors z-10"
                aria-label="Nächstes Bild / Video"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Caption */}
            <div className="text-center text-white max-w-2xl mx-auto z-10">
              <h3 className="text-xl font-serif-wedding font-semibold mb-1 text-white">
                {filteredPhotos[activeLightboxIndex].title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 font-light">
                {filteredPhotos[activeLightboxIndex].caption}
              </p>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-mood-wine" />
                  <h3 className="text-xl font-serif-wedding font-semibold text-stone-900">
                    Ein Hochzeitsfoto teilen
                  </h3>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4 mt-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    Foto auswählen (JPG, PNG, WebP)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="block w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-mood-blush/40 file:text-mood-wine hover:file:bg-mood-blush cursor-pointer"
                  />
                </div>

                {previewDataUrl && (
                  <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                    <img
                      src={previewDataUrl}
                      alt="Upload Vorschau"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Titel des Fotos / Moment
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="z.B. Glückwünsche im Schlossgarten"
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Kategorie
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40 bg-white"
                  >
                    <option value="feier">Feier & Dinner</option>
                    <option value="trauung">Trauung</option>
                    <option value="details">Details & Drinks</option>
                    <option value="brautpaar">Thomas & Katharina</option>
                    <option value="location">Schlossgut & Park</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Beschreibung / Notiz
                  </label>
                  <textarea
                    rows={2}
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    placeholder="Schreibt eine kurze Nachricht oder wer auf dem Foto zu sehen ist..."
                    className="w-full px-4 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-mood-wine hover:bg-mood-wine/90 rounded-full transition-colors cursor-pointer"
                  >
                    Foto zum Album hinzufügen
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
