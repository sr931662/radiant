import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Upload, Image } from 'lucide-react'
import { getAdminAlbums, createAlbum, updateAlbum, deleteAlbum, uploadMedia, deleteMedia } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import s from './admin.module.css'

export default function AdminGallery() {
  const qc = useQueryClient()
  const [albumModal, setAlbumModal] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [uploadAlbum, setUploadAlbum] = useState(null)
  const [mediaAlbum, setMediaAlbum] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { register, handleSubmit, reset, setValue } = useForm()

  const { data: albums = [], isLoading } = useQuery({ queryKey: ['admin-albums'], queryFn: getAdminAlbums })

  const saveMutation = useMutation({
    mutationFn: (d) => isNew ? createAlbum(d) : updateAlbum(albumModal.id, d),
    onSuccess: () => { toast.success(isNew ? 'Album created!' : 'Album updated!'); qc.invalidateQueries({ queryKey: ['admin-albums'] }); setAlbumModal(null); reset() },
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
    } catch { toast.error('Upload failed.') }
    finally { setUploading(false); e.target.value = '' }
  }

  function openEdit(album) {
    setIsNew(false); setAlbumModal(album)
    ;['title', 'description', 'cover_image', 'tag'].forEach((f) => setValue(f, album[f] ?? ''))
  }

  function openNew() { setIsNew(true); setAlbumModal({}); reset() }

  return (
    <div>
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Gallery</h1>
          <p className={s.pageSub}>{albums.length} albums</p>
        </div>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={openNew}><Plus size={14} /> New Album</button>
      </div>

      {isLoading ? <Spinner center /> : (
        albums.length === 0 ? (
          <div className={s.card}>
            <div className={s.emptyState}>
              <div className={s.emptyStateIcon}><Image size={24} /></div>
              <p className={s.emptyStateText}>No albums yet</p>
              <p className={s.emptyStateSub}>Create your first gallery album</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
            {albums.map((album) => (
              <div key={album.id} className={s.card}>
                {album.cover_image ? (
                  <img src={album.cover_image} alt={album.title} style={{ width: '100%', height: 168, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: 168, background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image size={44} color="#cbd5e1" />
                  </div>
                )}
                <div style={{ padding: '1rem 1.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{album.title}</h3>
                      <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                        {album.media_count ?? album.media?.length ?? 0} items{album.tag ? ` · ${album.tag}` : ''}
                      </p>
                    </div>
                    <div className={s.actionBtns}>
                      <button className={`${s.btn} ${s.btnEdit} ${s.btnIconOnly}`} onClick={() => openEdit(album)}><Pencil size={13} /></button>
                      <button className={`${s.btn} ${s.btnDanger} ${s.btnIconOnly}`} onClick={() => { if (window.confirm('Delete album and all media?')) deleteAlbumMutation.mutate(album.id) }}><Trash2 size={13} /></button>
                    </div>
                  </div>
                  {album.description && <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>{album.description}</p>}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className={`${s.btn} ${s.btnSuccess}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setUploadAlbum(album)}>
                      <Upload size={13} /> Upload
                    </button>
                    {(album.media_count ?? album.media?.length ?? 0) > 0 && (
                      <button className={`${s.btn} ${s.btnGhost}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMediaAlbum(mediaAlbum?.id === album.id ? null : album)}>
                        <Image size={13} /> {mediaAlbum?.id === album.id ? 'Hide' : 'Media'}
                      </button>
                    )}
                  </div>
                </div>

                {mediaAlbum?.id === album.id && (
                  <div style={{ borderTop: '1px solid #f1f5f9', padding: '0.75rem 1.1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: '6px' }}>
                    {album.media?.map((m) => (
                      <div key={m.id} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden' }}>
                        {m.type === 'VIDEO'
                          ? <video src={m.url} style={{ width: '100%', height: 62, objectFit: 'cover' }} />
                          : <img src={m.url} alt="" style={{ width: '100%', height: 62, objectFit: 'cover' }} />
                        }
                        <button
                          onClick={() => { if (window.confirm('Delete?')) deleteMediaMutation.mutate(m.id) }}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(220,38,38,0.85)', border: 'none', borderRadius: '3px', padding: '2px 4px', cursor: 'pointer', color: 'white', lineHeight: 1, display: 'flex' }}
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      <Modal open={!!uploadAlbum} onClose={() => setUploadAlbum(null)} title={`Upload to "${uploadAlbum?.title}"`}>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>Select image or video files to upload.</p>
        <input type="file" multiple accept="image/*,video/*" onChange={handleUpload} disabled={uploading} style={{ display: 'block', marginBottom: '1rem' }} />
        {uploading && <p style={{ textAlign: 'center', color: '#4f46e5', fontWeight: 600 }}>Uploading…</p>}
      </Modal>

      <Modal open={!!albumModal} onClose={() => { setAlbumModal(null); reset() }} title={isNew ? 'New Album' : 'Edit Album'}>
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))}>
          <div className={s.formGroup}><label className={s.formLabel}>Title *</label><input {...register('title', { required: true })} className={s.formInput} /></div>
          <div className={s.formGroup}><label className={s.formLabel}>Description</label><textarea {...register('description')} className={s.formTextarea} rows={3} /></div>
          <div className={s.formGroup}><label className={s.formLabel}>Cover Image URL</label><input {...register('cover_image')} className={s.formInput} /></div>
          <div className={s.formGroup}><label className={s.formLabel}>Tag</label><input {...register('tag')} className={s.formInput} placeholder="Events, Programs, Field Stories…" /></div>
          <button type="submit" className={s.formSubmit} disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving…' : isNew ? 'Create Album' : 'Update Album'}</button>
        </form>
      </Modal>
    </div>
  )
}
