import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAdmin from '../../utils/withAdmin';
import { getTestimonial, saveTestimonial, deleteTestimonial } from '../../services/api';
import { showToast } from '../../utils/toast';
import { Plus, Trash, X, Save, Edit, User } from 'lucide-react';
import SmartImage from '../../components/SmartImage';
import ImageUploader from '../../components/ImageUploader';

function TestimonialAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getTestimonial();
    if (data) setItems(data);
    setLoading(false);
  }

  const handleCreate = () => {
    setEditing('new');
    setFormData({ name: '', role: '', message: '', image_url: '' });
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setFormData(item);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { error } = await saveTestimonial(formData);
      if (error) throw error;
      showToast.success('Saved successfully');
      setEditing(null);
      loadData();
    } catch (error) {
      console.error(error);
      showToast.error(error.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this item?')) {
      const { error } = await deleteTestimonial(id);
      if (error) {
        console.error(error);
        showToast.error('Failed to delete');
        return;
      }
      showToast.success('Deleted successfully');
      loadData();
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Testimonials</h1>
          <p className="text-slate-500">What people say about us</p>
        </div>
        <button onClick={handleCreate} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 text-sm shadow-lg shadow-primary-600/30 transition-all transform hover:-translate-y-0.5">
          <Plus size={16} /> Add New
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">{editing === 'new' ? 'New Testimonial' : 'Edit Testimonial'}</h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 p-1 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-slate-700 text-sm font-bold">Name</label>
                  <input 
                    type="text" 
                    value={formData.name || ''} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-700 text-sm font-bold">Role (e.g. Alumni 2023)</label>
                  <input 
                    type="text" 
                    value={formData.role || ''} 
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                    placeholder="Student / Parent / Alumni"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">Message</label>
                <textarea 
                  rows="4"
                  value={formData.message || ''} 
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="Share their experience..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold block mb-2">Photo (Optional)</label>
                <ImageUploader 
                  currentImage={formData.image_url} 
                  onUploadComplete={(url) => setFormData({...formData, image_url: url})} 
                  aspectRatio={1} 
                  bucket="testimonial" 
                  folder="" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-lg shadow-primary-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading testimonials...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 relative border border-slate-200">
                  <SmartImage src={item.image_url} fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                  <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full inline-block">{item.role}</p>
                </div>
              </div>
              
              <div className="relative">
                <p className="text-slate-600 text-sm line-clamp-3 italic mb-4">&quot;{item.message}&quot;</p>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(item)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {items.length === 0 && (
            <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500 mb-4">No testimonials yet.</p>
              <button onClick={handleCreate} className="text-primary-600 font-bold hover:underline">Add your first testimonial</button>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

export default withAdmin(TestimonialAdmin);
