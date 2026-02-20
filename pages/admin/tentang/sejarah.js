
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import withAdmin from '../../../utils/withAdmin';
import { getSekolahInfo, upsertSekolahInfo, getSejarah, createSejarah, updateSejarah, deleteSejarah } from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { Save, History, Plus, Edit, Trash, X, Calendar, Type, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SejarahAdmin() {
  const [info, setInfo] = useState({ history: '' });
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Timeline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [infoData, timelineData] = await Promise.all([
      getSekolahInfo(),
      getSejarah()
    ]);
    
    if (infoData) setInfo(infoData);
    if (timelineData) setTimeline(timelineData || []);
    setLoading(false);
  }

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = showToast.loading('Saving info...');
    const { error } = await upsertSekolahInfo(info);
    if (error) {
      showToast.error('Failed to update info', toastId);
    } else {
      showToast.success('Info updated!', toastId);
    }
    setSaving(false);
  };

  const openEditor = (item = null) => {
    setCurrentItem(item || { year: '', title: '', description: '', icon: 'Flag' });
    setIsEditing(true);
  };

  const closeEditor = () => {
    setIsEditing(false);
    setCurrentItem({});
  };

  const handleSaveTimeline = async (e) => {
    e.preventDefault();
    const toastId = showToast.loading('Saving timeline item...');
    
    let result;
    if (currentItem.id) {
      result = await updateSejarah(currentItem.id, currentItem);
    } else {
      result = await createSejarah(currentItem);
    }

    if (result.error) {
      showToast.error('Failed to save item', toastId);
    } else {
      showToast.success('Item saved!', toastId);
      closeEditor();
      loadData(); // Reload to refresh list
    }
  };

  const handleDeleteTimeline = async (id) => {
    if (confirm('Are you sure you want to delete this timeline item?')) {
      const toastId = showToast.loading('Deleting...');
      const { error } = await deleteSejarah(id);
      if (error) {
        showToast.error('Failed to delete', toastId);
      } else {
        showToast.success('Deleted successfully', toastId);
        loadData();
      }
    }
  };

  // Icon options available in frontend
  const iconOptions = ['Flag', 'Building', 'Award', 'TrendingUp', 'Star', 'Globe', 'CheckCircle', 'Calendar'];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sejarah Sekolah</h1>
          <p className="text-slate-500">Manage school history and timeline</p>
        </div>
        <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold border border-red-200">
              Read Only (Disabled)
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Intro Text */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit opacity-75 pointer-events-none select-none grayscale-[0.5]">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <History size={20} className="text-primary-600" /> Introduction
            </h2>
            <button 
              disabled
              className="px-4 py-2 bg-slate-300 text-white text-sm font-bold rounded-lg flex items-center gap-2 cursor-not-allowed"
            >
              <Save size={16} /> Save
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-slate-700 text-sm font-bold">History Description</label>
              <textarea 
                rows="10"
                value={info.history || ''}
                readOnly
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-500 focus:outline-none cursor-not-allowed"
                placeholder="Write the general school history introduction here..."
              />
            </div>
          </div>
        </section>

        {/* Right Column: Timeline */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm opacity-75 pointer-events-none select-none grayscale-[0.5]">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar size={20} className="text-primary-600" /> Timeline
            </h2>
            <button 
              disabled
              className="px-3 py-1.5 bg-slate-300 text-white text-sm font-bold rounded-lg flex items-center gap-2 cursor-not-allowed"
            >
              <Plus size={16} /> Add Event
            </button>
          </div>

          <div className="space-y-4">
            {timeline.length === 0 ? (
              <p className="text-slate-400 text-center py-8 italic">No timeline events yet.</p>
            ) : (
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pl-6 py-2">
                {timeline.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary-100 border-2 border-primary-600"></div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-primary-200 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-primary-600 font-bold text-sm bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">{item.year}</span>
                          <h3 className="font-bold text-slate-900 mt-1">{item.title}</h3>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Buttons removed/disabled */}
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm">{item.description}</p>
                      <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                        <span className="font-semibold">Icon:</span> {item.icon || 'Default'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">{currentItem.id ? 'Edit Event' : 'New Event'}</h3>
                <button onClick={closeEditor} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSaveTimeline} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Year</label>
                    <input 
                      type="text" 
                      value={currentItem.year || ''}
                      onChange={e => setCurrentItem({...currentItem, year: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-primary-500 focus:outline-none"
                      placeholder="e.g. 1995"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Icon</label>
                    <select 
                      value={currentItem.icon || 'Flag'}
                      onChange={e => setCurrentItem({...currentItem, icon: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-primary-500 focus:outline-none"
                    >
                      {iconOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Title</label>
                  <input 
                    type="text" 
                    value={currentItem.title || ''}
                    onChange={e => setCurrentItem({...currentItem, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-primary-500 focus:outline-none"
                    placeholder="Event Title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Description</label>
                  <textarea 
                    rows="4"
                    value={currentItem.description || ''}
                    onChange={e => setCurrentItem({...currentItem, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-primary-500 focus:outline-none"
                    placeholder="Event details..."
                    required
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={closeEditor} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold shadow-lg shadow-primary-600/20">
                    Save Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

export default withAdmin(SejarahAdmin);
