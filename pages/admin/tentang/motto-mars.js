import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import withAdmin from '../../../utils/withAdmin';
import { getMottoMars, upsertMottoMars } from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { Save, Music, Heart, Plus, Trash2, Mic2 } from 'lucide-react';

function MottoMarsAdmin() {
  const [data, setData] = useState({
    pink_values: [],
    jitu_values: [],
    mars_lyrics: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const result = await getMottoMars();
      if (result) {
        // Ensure arrays are initialized
        setData({
          ...result,
          pink_values: Array.isArray(result.pink_values) ? result.pink_values : [],
          jitu_values: Array.isArray(result.jitu_values) ? result.jitu_values : [],
          mars_lyrics: Array.isArray(result.mars_lyrics) ? result.mars_lyrics : []
        });
      } else {
        // Initialize with defaults if empty
        setData({
          pink_values: [
            { char: 'P', title: 'Profesional', desc: 'Memiliki kompetensi dan keahlian tinggi dalam bidangnya.' },
            { char: 'I', title: 'Inovatif', desc: 'Selalu menciptakan pembaruan dan solusi kreatif.' },
            { char: 'N', title: 'Nasionalis', desc: 'Menunjung tinggi nilai-nilai kebangsaan dan cinta tanah air.' },
            { char: 'K', title: 'Kompeten', desc: 'Mampu bersaing dan menyelesaikan tugas dengan sangat baik.' },
          ],
          jitu_values: [
            { char: 'J', title: 'Jujur', desc: 'Berintegritas, transparan, dan dapat dipercaya dalam tindakan.' },
            { char: 'I', title: 'Iman', desc: 'Berlandaskan ketakwaan kepada Tuhan Yang Maha Esa.' },
            { char: 'T', title: 'Tangguh', desc: 'Kuat mental, pantang menyerah, dan siap menghadapi tantangan.' },
            { char: 'U', title: 'Unggul', desc: 'Selalu berusaha menjadi yang terbaik dan berprestasi.' },
          ],
          mars_lyrics: [
            { verse: 1, text: ["Singsingkan lengan bajumu", "Tataplah masa depanmu", "SMK Paramitha 2", "Wadah insan cendekia"] }
          ]
        });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = showToast.loading('Saving changes...');

    const { error } = await upsertMottoMars(data);

    if (error) {
      console.error(error);
      showToast.error('Failed to update settings', toastId);
    } else {
      showToast.success('Settings updated!', toastId);
    }
    setSaving(false);
  };

  const updateValue = (type, index, field, value) => {
    const list = [...data[type]];
    list[index] = { ...list[index], [field]: value };
    setData({ ...data, [type]: list });
  };

  const addValue = (type) => {
    setData({ ...data, [type]: [...data[type], { char: '', title: '', desc: '' }] });
  };

  const removeValue = (type, index) => {
    const list = data[type].filter((_, i) => i !== index);
    setData({ ...data, [type]: list });
  };

  // Lyrics handlers
  const updateVerse = (index, text) => {
    const list = [...data.mars_lyrics];
    // Convert textarea lines to array
    const lines = text.split('\n');
    list[index] = { ...list[index], text: lines };
    setData({ ...data, mars_lyrics: list });
  };

  const updateVerseNum = (index, val) => {
    const list = [...data.mars_lyrics];
    list[index] = { ...list[index], verse: val };
    setData({ ...data, mars_lyrics: list });
  };

  const addVerse = () => {
    setData({ 
      ...data, 
      mars_lyrics: [...data.mars_lyrics, { verse: data.mars_lyrics.length + 1, text: [] }] 
    });
  };

  const removeVerse = (index) => {
    const list = data.mars_lyrics.filter((_, i) => i !== index);
    setData({ ...data, mars_lyrics: list });
  };

  if (loading) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Motto & Mars</h1>
          <p className="text-slate-500">Manage PINK JITU values and Mars lyrics</p>
        </div>
        <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold border border-red-200">
              Read Only (Disabled)
            </span>
        </div>
      </div>

      <div className="space-y-8">
        {/* PINK VALUES */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm opacity-75 pointer-events-none select-none grayscale-[0.5]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Heart size={20} className="text-pink-500" /> PINK Values
            </h2>
            <button disabled className="text-sm text-slate-400 font-bold cursor-not-allowed">+ Add Item</button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {data.pink_values.map((item, index) => (
              <div key={index} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="w-16">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Char</label>
                  <input 
                    value={item.char} 
                    readOnly
                    disabled
                    className="w-full text-center font-bold text-xl p-2 rounded border border-slate-200 cursor-not-allowed"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Title</label>
                    <input 
                      value={item.title} 
                      readOnly
                      disabled
                      className="w-full p-2 rounded border border-slate-200 font-bold cursor-not-allowed"
                      placeholder="Title"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Description</label>
                    <textarea 
                      value={item.desc} 
                      readOnly
                      disabled
                      className="w-full p-2 rounded border border-slate-200 text-sm cursor-not-allowed"
                      rows="2"
                      placeholder="Description"
                    />
                  </div>
                </div>
                <button disabled className="text-slate-300 p-2 rounded cursor-not-allowed">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* JITU VALUES */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm opacity-75 pointer-events-none select-none grayscale-[0.5]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Heart size={20} className="text-blue-600" /> JITU Values
            </h2>
            <button disabled className="text-sm text-slate-400 font-bold cursor-not-allowed">+ Add Item</button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {data.jitu_values.map((item, index) => (
              <div key={index} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="w-16">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Char</label>
                  <input 
                    value={item.char} 
                    readOnly
                    disabled
                    className="w-full text-center font-bold text-xl p-2 rounded border border-slate-200 cursor-not-allowed"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Title</label>
                    <input 
                      value={item.title} 
                      readOnly
                      disabled
                      className="w-full p-2 rounded border border-slate-200 font-bold cursor-not-allowed"
                      placeholder="Title"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Description</label>
                    <textarea 
                      value={item.desc} 
                      readOnly
                      disabled
                      className="w-full p-2 rounded border border-slate-200 text-sm cursor-not-allowed"
                      rows="2"
                      placeholder="Description"
                    />
                  </div>
                </div>
                <button disabled className="text-slate-300 p-2 rounded cursor-not-allowed">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* MARS LYRICS */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm opacity-75 pointer-events-none select-none grayscale-[0.5]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Music size={20} className="text-primary-600" /> Mars Lyrics
            </h2>
            <button disabled className="text-sm text-slate-400 font-bold cursor-not-allowed">+ Add Verse</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.mars_lyrics.map((verse, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative group">
                <button 
                  disabled 
                  className="absolute top-2 right-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed"
                >
                  <Trash2 size={16} />
                </button>
                <div className="mb-2">
                  <label className="text-xs font-bold text-slate-500 block mb-1">Verse Label</label>
                  <input 
                    value={verse.verse} 
                    readOnly
                    disabled
                    className="w-full p-2 rounded border border-slate-200 text-sm font-bold cursor-not-allowed"
                    placeholder="e.g. 1, 2, Reff"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Lyrics (one line per row)</label>
                  <textarea 
                    value={Array.isArray(verse.text) ? verse.text.join('\n') : verse.text} 
                    readOnly
                    disabled
                    className="w-full p-2 rounded border border-slate-200 text-sm font-serif leading-relaxed cursor-not-allowed"
                    rows="6"
                    placeholder="Lyrics here..."
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(MottoMarsAdmin);
