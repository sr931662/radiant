import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Upload, Image } from 'lucide-react'
import {
  getAdminAlbums, createAlbum, updateAlbum, deleteAlbum,
  uploadMedia, deleteMedia,
} from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'

export default function AdminGallery() {
  const qc = useQueryClient()
  const [albumModal, setAlbumModal] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [uploadAlbum, setUploadAlbum] = useState(null)
  const [mediaAlbum, setMediaAlbum] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { register, handleSubmit, reset, setValue } = useForm()

  const { data: albums = [], isLoading } = useQuery({
    queryKey: ['admin-albums'],
    queryFn: getAdminAlbums,
  })

  const saveMutation = useMutation({
    mutationFn: (d) => isNew ? createAlbum(d) : updateAlbum(albumModal.id, d),
    onSuccess: () => {
      toast.success(isNew ? 'Album created!' : 'Album updated!')
      qc.invalidateQueries({ queryKey: ['admin-albums'] })
      setAlbumModal(null); reset()
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed.'),
  })

  const deleteAlbumMutation = useMutation({
    mutationFn: (id) => deleteAlbum(id),
    onSuccess: () => { toast.success('Album deleted.'); qc.invalidateQueries({ queryKey: ['admin-albums'] }) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed.'),
  })

  const deleteMediaMutation = useMutation({
    mutationFn: (id) => deleteMedia(id),
    onSuccess: () => { toast.success('Media deleted.'); qc.invalidateQueries({ queryKey: ['admin-albums'] }) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed.'),
  })

  async function handleUpload(e) {
    const files = Array.from(e.target.files)
    if (!files.length || !uploadAlbum) return
    setUploading(true)
    try {
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('album_id', uploadAlbum.id)
        await uploadMedia(fd)
      }
      toast.success(`${files.length} file(s) uploaded.`)
      qc.invalidateQueries({ queryKey: ['admin-albums'] })
      setUploadAlbum(null)
    } catch {
      toast.error('Upload failed.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function openEdit(album) {
    setIsNew(false); setAlbumModal(album)
    setValue('title', album.title)
    setValue('description', album.description || '')
    setValue('cover_image', album.cover_image || '')
    setValue('is_public', album.is_public ?? true)
  }

  function openNew() {
    setIsNew(true); setAlbumModal({})
    reset({ is_public: true })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Gallery</h1>
        <button onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.25rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> New Album
        </button>
      </div>

      {isLoading ? <Spinner center /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
          {albums.map((album) => (
            <div key={album.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {album.cover_image ? (
                <img src={album.cover_image} alt={album.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: 160, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image size={40} color="#cbd5e1" />
                </div>
              )}
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{album.title}</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                      {album.media?.length ?? 0} items · {album.is_public ? 'Public' : 'Private'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => openEdit(album)} style={{ padding: '4px 8px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Pencil size={13} /></button>
                    <button onClick={() => { if (window.confirm('Delete album and all media?')) deleteAlbumMutation.mutate(album.id) }} style={{ padding: '4px 8px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={13} /></button>
                  </div>
                </div>
                {album.description && <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>{album.description}</p>}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setUploadAlbum(album)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '0.45rem', background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                  >
                    <Upload size={13} /> Upload Media
                  </button>
                  {(album.media?.length ?? 0) > 0 && (
                    <button
                      onClick={() => setMediaAlbum(mediaAlbum?.id === album.id ? null : album)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '0.45rem', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      <Image size={13} /> View Media
                    </button>
                  )}
                </div>
              </div>

              {mediaAlbum?.id === album.id && (
                <div style={{ borderTop: '1px solid #f1f5f9', padding: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(70px,1fr))', gap: '6px' }}>
                  {album.media?.map((m) => (
                    <div key={m.id} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden' }}>
                      {m.media_type === 'VIDEO' ? (
                        <video src={m.url} style={{ width: '100%', height: 60, objectFit: 'cover' }} />
                      ) : (
                        <img src={m.thumbnail_url || m.url} alt="" style={{ width: '100%', height: 60, objectFit: 'cover' }} />
                      )}
                      <button
                        onClick={() => { if (window.confirm('Delete this media?')) deleteMediaMutation.mutate(m.id) }}
                        style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: '3px', padding: '2px 4px', cursor: 'pointer', color: 'white', lineHeight: 1 }}
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {albums.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No albums yet. Create one!</div>
          )}
        </div>
      )}

      {/* Upload modal */}
      <Modal open={!!uploadAlbum} onClose={() => setUploadAlbum(null)} title={`Upload to "${uploadAlbum?.title}"`}>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>Select image or video files to upload.</p>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleUpload}
          disabled={uploading}
          style={{ display: 'block', marginBottom: '1rem' }}
        />
        {uploading && <div style={{ textAlign: 'center', color: '#2563eb', fontWeight: 600 }}>Uploading…</div>}
      </Modal>

      {/* Album create/edit modal */}
      <Modal open={!!albumModal} onClose={() => { setAlbumModal(null); reset() }} title={isNew ? 'New Album' : 'Edit Album'}>
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))}>
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Title *</label>
            <input {...register('title', { required: true })} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Description</label>
            <textarea {...register('description')} rows={3} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Cover Image URL</label>
            <input {...register('cover_image')} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
              <input type="checkbox" {...register('is_public')} /> Make Album Public
            </label>
          </div>
          <button type="submit" disabled={saveMutation.isPending} style={{ width: '100%', padding: '0.7rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            {saveMutation.isPending ? 'Saving…' : isNew ? 'Create Album' : 'Update Album'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
