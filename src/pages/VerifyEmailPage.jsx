import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { verifyEmailToken } from '../services/authService'; // Nhớ import đúng đường dẫn

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('Đang xác thực...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Đường dẫn không hợp lệ hoặc thiếu token.');
            return;
        }
        
        const verify = async () => {
            try {
                // Gọi API xác thực
                await verifyEmailToken(token);
                setStatus('success');
                setMessage('Email của bạn đã được xác thực thành công! Giờ bạn có thể nhận mã ưu đãi.');
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.error || 'Xác thực thất bại. Link có thể đã hết hạn.');
            }
        };
        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                
                {/* TRẠNG THÁI LOADING */}
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-gray-800">Đang xác thực...</h2>
                        <p className="text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
                    </div>
                )}

                {/* TRẠNG THÁI THÀNH CÔNG */}
                {status === 'success' && (
                    <div className="flex flex-col items-center animate-scaleIn">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thành công! 🎉</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        
                        <button 
                            onClick={() => navigate('/')}
                            className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-all"
                        >
                            Về trang chủ
                        </button>
                    </div>
                )}

                {/* TRẠNG THÁI LỖI */}
                {status === 'error' && (
                    <div className="flex flex-col items-center animate-scaleIn">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Xác thực thất bại</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        
                        <button 
                            onClick={() => navigate('/')}
                            className="flex items-center justify-center gap-2 text-gray-600 hover:text-purple-600 font-semibold"
                        >
                            <ArrowLeft className="w-4 h-4" /> Về trang chủ
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default VerifyEmailPage;