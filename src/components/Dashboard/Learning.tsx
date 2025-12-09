import { useState, useEffect } from 'react';
import { BookOpen, Award, TrendingUp, Download, Upload, FileText, File, Image, Music, Video, Archive, Code } from 'lucide-react';
import { getAllFiles, uploadFile, downloadFile, type FileInfo } from '../../controllers/filesController';

const Learning = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const data = await getAllFiles();
      setFiles(data);
      setError(null);
    } catch (err) {
      setError('Failed to load learning resources');
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  const processFileUpload = async (file: File) => {
    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 50MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      await uploadFile(file);
      await fetchFiles();
      alert(`File "${file.name}" uploaded successfully!`);
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.message || 'Failed to upload file');
      alert(`Failed to upload file: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    await processFileUpload(file);
    event.target.value = ''; // Reset input
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await processFileUpload(file);
    }
  };

  const handleDownload = async (filename: string) => {
    try {
      setError(null);
      await downloadFile(filename);
    } catch (err: any) {
      console.error('Error downloading file:', err);
      setError(err.message || 'Failed to download file');
      alert(`Failed to download file: ${err.message || 'Unknown error'}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return FileText;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return Image;
      case 'mp3':
      case 'wav':
      case 'ogg':
      case 'flac':
        return Music;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'mkv':
      case 'webm':
        return Video;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return Archive;
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
      case 'html':
      case 'css':
      case 'json':
        return Code;
      default:
        return File;
    }
  };

  const getFileColor = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'pdf':
        return 'from-red-500 to-red-600';
      case 'doc':
      case 'docx':
        return 'from-blue-500 to-blue-600';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return 'from-purple-500 to-purple-600';
      case 'mp3':
      case 'wav':
      case 'ogg':
      case 'flac':
        return 'from-pink-500 to-pink-600';
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'mkv':
      case 'webm':
        return 'from-indigo-500 to-indigo-600';
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return 'from-amber-500 to-amber-600';
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
      case 'html':
      case 'css':
      case 'json':
        return 'from-green-500 to-green-600';
      default:
        return 'from-cyan-500 to-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
            Learning & Development
          </h1>
          <p className="text-slate-400 mt-2">Access and share learning resources and materials</p>
        </div>
        <label className={`${
          uploading 
            ? 'bg-slate-600 cursor-not-allowed' 
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 cursor-pointer'
        } px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30`}>
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload size={20} />
              Upload Resource
            </>
          )}
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            accept="*/*"
          />
        </label>
      </div>

      {/* Error Message */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
          <div className="flex-1">
            <p className="text-red-300 font-medium">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-300 hover:text-red-200 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-cyan-500/10 border border-cyan-500/50 rounded-lg p-4 flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
          <p className="text-cyan-300 font-medium">Uploading file, please wait...</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Resources</p>
              <p className="text-2xl font-bold text-emerald-400 mt-2">{files.length}</p>
            </div>
            <BookOpen className="w-12 h-12 text-emerald-400/30" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Size</p>
              <p className="text-2xl font-bold text-cyan-400 mt-2">
                {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}
              </p>
            </div>
            <Award className="w-12 h-12 text-cyan-400/30" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Recent Uploads</p>
              <p className="text-2xl font-bold text-blue-400 mt-2">
                {files.filter(f => {
                  const uploadDate = new Date(f.uploaded_at);
                  const dayAgo = new Date();
                  dayAgo.setDate(dayAgo.getDate() - 1);
                  return uploadDate > dayAgo;
                }).length}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-400/30" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading resources...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
          <p className="text-red-300">{error}</p>
          <button 
            onClick={fetchFiles}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      ) : files.length === 0 ? (
        <div 
          className={`bg-gradient-to-br from-slate-800 to-slate-900 border-2 ${
            isDragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-700 border-dashed'
          } rounded-lg p-12 text-center transition-all`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className={`w-16 h-16 ${isDragging ? 'text-cyan-400' : 'text-slate-500'} mx-auto mb-4 transition-colors`} />
          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragging ? 'Drop file here' : 'No Resources Yet'}
          </h3>
          <p className="text-slate-400 mb-6">
            {isDragging ? 'Release to upload' : 'Drag and drop a file here, or click the Upload button'}
          </p>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4">
            <input
              type="text"
              placeholder="Search files by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          
          {/* Drag and Drop Zone */}
          {files.length > 0 && (
            <div 
              className={`border-2 ${
                isDragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-700 border-dashed'
              } rounded-lg p-8 text-center transition-all`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className={`w-12 h-12 ${isDragging ? 'text-cyan-400' : 'text-slate-500'} mx-auto mb-2 transition-colors`} />
              <p className={`${isDragging ? 'text-cyan-300' : 'text-slate-400'} transition-colors`}>
                {isDragging ? 'Drop file here to upload' : 'Drag and drop files here to upload'}
              </p>
            </div>
          )}

          {/* Files Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files
              .filter(file => 
                file.filename.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((file, index) => {
                const FileIcon = getFileIcon(file.filename);
                const colorClass = getFileColor(file.filename);
                
                return (
                  <div
                    key={file.file_id || index}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <FileIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate mb-1" title={file.filename}>
                          {file.filename}
                        </h3>
                        <div className="space-y-1 text-sm text-slate-400">
                          {file.size > 0 && <p>Size: {formatFileSize(file.size)}</p>}
                          <p>Uploaded: {new Date(file.uploaded_at).toLocaleDateString()}</p>
                          {file.uploaded_by && file.uploaded_by !== 'unknown' && (
                            <p>By: {file.uploaded_by}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDownload(file.filename)}
                          className="mt-4 w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 hover:text-cyan-300 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default Learning;
