import React, { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface FileUpload {
  id: string;
  file_name: string;
  created_at: string;
}

const UploadsPage: React.FC = () => {
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploads(data || []);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      setError('Ошибка при загрузке файлов');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // Upload file to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('uploads')
        .upload(`${Date.now()}-${file.name}`, file);

      if (storageError) throw storageError;

      // Create record in uploads table
      const { error: dbError } = await supabase
        .from('uploads')
        .insert([
          {
            file_name: file.name,
            file_path: storageData.path
          }
        ]);

      if (dbError) throw dbError;

      // Refresh uploads list
      fetchUploads();
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Ошибка при загрузке файла');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('uploads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setUploads(uploads.filter(upload => upload.id !== id));
    } catch (error) {
      console.error('Error deleting upload:', error);
      setError('Ошибка при удалении файла');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Загрузки</h1>
          <p className="text-sm text-gray-500">Управление загруженными файлами</p>
        </div>
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".csv,.xlsx,.xls"
          />
          <label htmlFor="file-upload">
            <Button
              variant="primary"
              leftIcon={<Upload size={18} />}
              isLoading={uploading}
              className="cursor-pointer"
              onClick={() => {}}
            >
              Загрузить файл
            </Button>
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded relative">
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <Card>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : uploads.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Нет загруженных файлов</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Имя файла
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата загрузки
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uploads.map((upload) => (
                  <tr key={upload.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText size={20} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{upload.file_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(upload.created_at), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={<Trash2 size={16} />}
                        onClick={() => handleDelete(upload.id)}
                      >
                        Удалить
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UploadsPage;