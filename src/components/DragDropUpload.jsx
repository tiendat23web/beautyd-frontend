import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

const DragDropUpload = ({ 
  label, 
  accept = { 'image/*': [], 'application/pdf': [] },
  maxSize = 5242880, // 5MB
  onFilesChange,
  files = [],
  multiple = false
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    onFilesChange(acceptedFiles);
  }, [onFilesChange]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple
  });

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const getFileIcon = (file) => {
    if (file.type?.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8 text-purple-500" />;
    }
    return <FileText className="w-8 h-8 text-purple-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
            <Upload className="w-8 h-8 text-purple-600" />
          </div>
          
          {isDragActive ? (
            <p className="text-purple-600 font-medium">Thả file vào đây...</p>
          ) : (
            <>
              <div>
                <p className="text-gray-700 font-medium">
                  Kéo thả file vào đây hoặc{' '}
                  <span className="text-purple-600">chọn file</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Hỗ trợ: Ảnh (JPG, PNG) hoặc PDF. Tối đa {formatFileSize(maxSize)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">File không hợp lệ:</p>
          {fileRejections.map(({ file, errors }) => (
            <p key={file.name} className="text-xs text-red-600 mt-1">
              {file.name} - {errors[0]?.message}
            </p>
          ))}
        </div>
      )}

      {/* Preview Files */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">File đã chọn:</p>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              {file.type?.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-12 h-12 rounded object-cover"
                />
              ) : (
                getFileIcon(file)
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 hover:bg-red-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;
