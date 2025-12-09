import { GATEWAY_BASE_URL, getAuthHeaders } from '../lib/api';

export interface FileInfo {
  filename: string;
  size: number;
  uploaded_at: string;
  uploaded_by: string;
  file_id?: string;
  url?: string;
}

export const uploadFile = async (file: File): Promise<FileInfo> => {
  try {
    const token = localStorage.getItem('jwt_token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${GATEWAY_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || `Failed to upload file: ${response.status}`);
    }

    return {
      filename: data.filename,
      size: file.size,
      uploaded_at: new Date().toISOString(),
      uploaded_by: data.user_email || localStorage.getItem('user_email') || 'unknown',
    };
  } catch (error) {
    console.error('Upload file error:', error);
    throw error;
  }
};

export const getAllFiles = async (): Promise<FileInfo[]> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/files`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || `Failed to fetch files: ${response.status}`);
    }

    // Convert the simple filename array to FileInfo objects
    const files = data.files || [];
    return files.map((filename: string) => ({
      filename: filename,
      size: 0, // Size not provided by API
      uploaded_at: new Date().toISOString(),
      uploaded_by: 'unknown',
    }));
  } catch (error) {
    console.error('Get all files error:', error);
    throw error;
  }
};

export const downloadFile = async (filename: string): Promise<void> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/files/${encodeURIComponent(filename)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt_token') || ''}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to download file: ${response.status}`);
    }

    // Get the blob from response
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download file error:', error);
    throw error;
  }
};

export const getFileUrl = (filename: string): string => {
  return `${GATEWAY_BASE_URL}/files/${encodeURIComponent(filename)}`;
};
