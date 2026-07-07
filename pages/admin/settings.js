import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { User, Lock, Camera, Save, Key } from 'lucide-react';
import { showToast } from '../../utils/toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'Administrator',
    email: 'smkparamitha2@gmail.com',
    phone: '',
    photo: '/favicon.jpg'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast.success('Profile berhasil diupdate');
    } catch (error) {
      showToast.error('Gagal mengupdate profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast.error('Password baru tidak cocok');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast.error('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast.success('Password berhasil diubah');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showToast.error('Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1E1E8F] mb-6">Pengaturan Akun</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-[#1E1E8F] border-b-2 border-[#1E1E8F]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User size={18} className="inline mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'password'
                ? 'text-[#1E1E8F] border-b-2 border-[#1E1E8F]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Lock size={18} className="inline mr-2" />
            Password
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-black/7 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Informasi Profile</h2>
            
            <form onSubmit={handleProfileSave} className="space-y-6">
              {/* Photo Upload */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={profileData.photo}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-100"
                  />
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-2 bg-[#1E1E8F] text-white rounded-full hover:bg-[#1E1E8F]/90 transition-colors"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Foto Profile</p>
                  <p className="text-xs text-slate-500">JPG, PNG atau GIF. Maksimal 2MB.</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E1E8F] focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E1E8F] focus:border-transparent"
                  placeholder="Masukkan email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E1E8F] focus:border-transparent"
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-[#1E1E8F] text-white rounded-lg hover:bg-[#1E1E8F]/90 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-xl border border-black/7 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Ubah Password</h2>
            
            <form onSubmit={handlePasswordSave} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password Saat Ini</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E1E8F] focus:border-transparent"
                  placeholder="Masukkan password saat ini"
                  required
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password Baru</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E1E8F] focus:border-transparent"
                  placeholder="Masukkan password baru"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Minimal 6 karakter</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E1E8F] focus:border-transparent"
                  placeholder="Konfirmasi password baru"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-[#1E1E8F] text-white rounded-lg hover:bg-[#1E1E8F]/90 transition-colors disabled:opacity-50"
              >
                <Key size={18} />
                {loading ? 'Mengubah...' : 'Ubah Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
