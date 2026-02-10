import React, { useState, useEffect } from 'react';
import { X, Check, FileText, Image as ImageIcon, MapPin, Mail } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { getPendingKYC, approveKYC, rejectKYC } from '../../services/adminService';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ConfirmModal';

const AdminKYCPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    fetchPendingKYC();
  }, []);

  const fetchPendingKYC = async () => {
    try {
      setLoading(true);
      const data = await getPendingKYC();
      // GIỮ NGUYÊN logic gộp tài liệu theo user của ông
      const grouped = {};
      data.documents.forEach(doc => {
        if (!grouped[doc.userId]) {
          grouped[doc.userId] = { user: doc.user, documents: [] };
        }
        grouped[doc.userId].documents.push(doc);
      });
      const list = Object.values(grouped);
      setDocuments(list);
      if (list.length > 0) setSelectedProvider(list[0]);
    } catch (error) {
      toast.error('Không thể tải danh sách KYC');
    } finally {
      setLoading(false);
    }
  };

  // GIỮ NGUYÊN các hàm xử lý của ông
  const openApproveModal = (doc) => { setSelectedDoc(doc); setShowApproveModal(true); };
  const openRejectModal = (doc) => { setSelectedDoc(doc); setShowRejectModal(true); };

  const handleApprove = async () => {
    try {
      await approveKYC(selectedDoc.id);
      toast.success('Đã duyệt tài liệu');
      setShowApproveModal(false);
      fetchPendingKYC();
    } catch (error) { toast.error('Lỗi khi duyệt'); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return toast.error('Cần lý do từ chối');
    try {
      await rejectKYC(selectedDoc.id, rejectReason);
      toast.success('Đã từ chối');
      setShowRejectModal(false);
      setRejectReason('');
      fetchPendingKYC();
    } catch (error) { toast.error('Lỗi thao tác'); }
  };

  const getDocTypeLabel = (type) => {
    const labels = { 'CITIZEN_ID_FRONT': 'CCCD Mặt trước', 'CITIZEN_ID_BACK': 'CCCD Mặt sau', 'BUSINESS_LICENSE': 'Giấy phép KD' };
    return labels[type] || type;
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-screen"><div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
             <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Phê duyệt hồ sơ KYC</h1>
             <p className="text-gray-500 font-medium italic">Thẩm định hồ sơ pháp lý của đối tác cung cấp dịch vụ</p>
          </div>
          <div className="px-6 py-2 bg-red-50 text-red-600 rounded-full font-black text-sm border-2 border-red-100">{documents.length} HỒ SƠ ĐỢI DUYỆT</div>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white rounded-[40px] border-2 border-gray-50 p-24 text-center">
            <FileText className="w-24 h-24 text-gray-100 mx-auto mb-6" />
            <p className="text-gray-400 font-black text-2xl uppercase">Hệ thống đang sạch yêu cầu</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4 max-h-[800px] overflow-y-auto no-scrollbar pr-2">
              {documents.map((item) => (
                <div key={item.user.id} onClick={() => setSelectedProvider(item)} className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all relative overflow-hidden ${selectedProvider?.user.id === item.user.id ? 'border-red-600 bg-red-50/50 shadow-xl' : 'border-gray-100 bg-white hover:border-red-200'}`}>
                  <div className="flex items-center gap-4 relative z-10">
                     <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-400 uppercase">{item.user.fullName.charAt(0)}</div>
                     <div><h3 className="font-black text-gray-900 leading-none">{item.user.fullName}</h3><p className="text-[11px] font-bold text-purple-600 uppercase mt-1.5">{item.user.businessName}</p></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between relative z-10"><span className="text-[10px] font-black bg-gray-900 text-white px-3 py-1 rounded-full uppercase">{item.documents.length} tài liệu</span></div>
                  {selectedProvider?.user.id === item.user.id && <div className="absolute right-[-10px] top-[-10px] w-12 h-12 bg-red-600 rotate-45" />}
                </div>
              ))}
            </div>

            <div className="lg:col-span-8">
              {selectedProvider && (
                <div className="bg-white rounded-[40px] border-2 border-gray-50 p-10 shadow-2xl space-y-8 animate-in slide-in-from-right duration-500">
                  <div className="border-b-2 border-gray-50 pb-8 space-y-4">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">{selectedProvider.user.fullName}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-gray-600 font-bold"><Mail className="w-5 h-5 text-red-500" /> {selectedProvider.user.email}</div>
                      <div className="flex items-center gap-3 text-gray-600 font-bold"><MapPin className="w-5 h-5 text-red-500" /> {selectedProvider.user.businessAddress}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-8">
                    {selectedProvider.documents.map((doc) => (
                      <div key={doc.id} className="bg-gray-50/50 rounded-[32px] p-8 border-2 border-gray-100 group">
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-4">
                              <div className="p-4 bg-white rounded-2xl shadow-sm"><ImageIcon className="text-red-600" /></div>
                              <div><h4 className="font-black text-gray-900 uppercase">{getDocTypeLabel(doc.type)}</h4><p className="text-xs font-bold text-gray-400">Gửi lúc {new Date(doc.createdAt).toLocaleString('vi-VN')}</p></div>
                           </div>
                           <span className="px-4 py-1.5 bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase rounded-full">Pending</span>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl mb-6 shadow-lg"><img src={doc.fileUrl} alt={doc.type} className="w-full h-[400px] object-contain bg-white group-hover:scale-105 transition-transform duration-700" /></div>
                        <div className="flex gap-4">
                           <button onClick={() => openApproveModal(doc)} className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all uppercase text-sm tracking-tighter">DUYỆT</button>
                           <button onClick={() => openRejectModal(doc)} className="flex-1 py-4 bg-white text-red-600 border-2 border-red-50 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all uppercase text-sm tracking-tighter">TỪ CHỐI</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <ConfirmModal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} onConfirm={handleApprove} title="XÁC NHẬN PHÊ DUYỆT" message="Ông có chắc chắn hồ sơ này hợp lệ không?" confirmText="DUYỆT NGAY" cancelText="HỦY" confirmColor="green" type="success" />

        {showRejectModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border-4 border-red-50">
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 uppercase">Từ chối hồ sơ</h3>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Nhập lý do chi tiết..." rows="4" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-medium mb-6" />
              <div className="flex gap-4">
                <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }} className="flex-1 py-4 text-gray-400 font-black uppercase text-sm">Hủy bỏ</button>
                <button onClick={handleReject} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg hover:bg-red-700 transition-all uppercase text-sm">XÁC NHẬN</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminKYCPage;