'use client';

import { CldImage } from 'next-cloudinary';
import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  onRemoveImage?: (index: number) => void;
}

/**
 * Komponen galeri untuk menampilkan gambar yang sudah diupload ke Cloudinary
 * 
 * Fitur:
 * - Grid preview gambar
 * - Hover effect
 * - Opsi hapus gambar (jika onRemoveImage disediakan)
 */
export default function ImageGallery({ images, onRemoveImage }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="text-center py-8 bg-surface rounded-xl border-2 border-dashed border-border">
        <svg className="mx-auto h-12 w-12 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-2 text-sm text-text-secondary">Belum ada gambar yang diupload</p>
        <p className="text-xs text-text-tertiary">Upload gambar menggunakan widget di atas</p>
      </div>
    );
  }

  return (
    <div>
      {/* Grid Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((imageUrl, index) => {
          // Ekstrak public ID dari URL Cloudinary
          // Format URL: https://res.cloudinary.com/{cloud}/image/upload/{version}/{public_id}.{ext}
          const publicId = imageUrl.includes('res.cloudinary.com')
            ? imageUrl.split('/upload/')[1]?.split('/').slice(1).join('/').replace(/\.[^.]+$/, '')
            : null;

          return (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden bg-surface border border-border cursor-pointer"
              onClick={() => setSelectedImage(imageUrl)}
            >
              {publicId ? (
                <CldImage
                  src={publicId}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ) : (
                // Fallback: gunakan URL langsung jika bukan dari Cloudinary
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

              {/* Remove button */}
              {onRemoveImage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage(index);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-md"
                  title="Hapus gambar"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/20"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
