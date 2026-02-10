import React, { useState } from 'react';
import { Star, Flag, Send } from 'lucide-react';
import { toast } from 'react-toastify';

const ReviewCard = ({ review, onReply, onReport }) => {
  const [replyText, setReplyText] = useState(review.providerReply || '');
  const [isReplying, setIsReplying] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      toast.error('Vui lòng nhập nội dung trả lời');
      return;
    }

    setIsReplying(true);
    try {
      await onReply(review.id, replyText);
      toast.success('Đã trả lời đánh giá');
      setReplyText('');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi trả lời');
    } finally {
      setIsReplying(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Vui lòng nhập lý do báo cáo');
      return;
    }

    try {
      await onReport(review.id, reportReason);
      toast.success('Đã gửi báo cáo');
      setShowReportDialog(false);
      setReportReason('');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi báo cáo');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      {/* Customer Info & Rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {review.customer?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.customer?.fullName || 'Khách hàng'}
            </h4>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                index < review.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Service Info */}
      {review.service && (
        <p className="text-sm text-gray-600 mb-3">
          Dịch vụ: <span className="font-medium text-gray-900">{review.service.name}</span>
        </p>
      )}

      {/* Review Content */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-gray-700 leading-relaxed">{review.content}</p>
      </div>

      {/* Provider Reply */}
      {review.providerReply && (
        <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-purple-900 mb-1">Phản hồi của bạn:</p>
          <p className="text-gray-700">{review.providerReply}</p>
        </div>
      )}

      {/* Reply Input */}
      <div className="space-y-3">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Nhập phản hồi của bạn..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowReportDialog(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Flag className="w-4 h-4" />
            <span className="text-sm font-medium">Báo cáo vi phạm</span>
          </button>

          <button
            onClick={handleSubmitReply}
            disabled={isReplying || !replyText.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            <span className="font-medium">{isReplying ? 'Đang gửi...' : 'Gửi phản hồi'}</span>
          </button>
        </div>
      </div>

      {/* Report Dialog */}
      {showReportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Báo cáo vi phạm</h3>
            
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Nhập lý do báo cáo..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReportDialog(false);
                  setReportReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReport}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Gửi báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
