import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../lib/translations';
import { AlertTriangle, CheckCircle2, Eye } from 'lucide-react';
import { formatTimeAgo } from '../../lib/utils';
import type { Report } from '../../../shared/types';

interface ExtendedReport extends Report {
  reporter_name?: string;
  reporter_phone?: string;
  reported_name?: string;
  reported_phone?: string;
}

export default function AdminReports() {
  const [reports, setReports] = useState<ExtendedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotifications();
  const { lang } = useLanguage();

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports');
      setReports(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/reports/${id}`, { status });
      addToast(t('adminUpdated', lang), t('adminReportMarked', lang, { status }), 'success');
      fetchReports();
    } catch {
      addToast(t('error', lang), t('adminFailedUpdateReport', lang), 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('adminReportsComplaints', lang)}</h1>

      {reports.length === 0 ? (
        <div className="card text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">{t('adminNoReports', lang)}</h3>
          <p className="text-gray-500 mt-1">{t('adminAllClear', lang)}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className={`card ${
              report.status === 'pending' ? 'border-l-4 border-l-red-400' :
              report.status === 'reviewed' ? 'border-l-4 border-l-amber-400' :
              'border-l-4 border-l-green-400'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      report.status === 'pending' ? 'text-red-500' : 'text-gray-400'
                    }`} />
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'pending' ? 'bg-red-100 text-red-700' :
                      report.status === 'reviewed' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {t('status' + report.status.charAt(0).toUpperCase() + report.status.slice(1), lang)}
                    </span>
                    <span className="text-xs text-gray-400">{formatTimeAgo(report.created_at, lang)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">{t('adminReporter', lang)}</p>
                  <p className="font-semibold">{report.reporter_name}</p>
                  <p className="text-xs text-gray-400">{report.reporter_phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">{t('adminReportedUser', lang)}</p>
                  <p className="font-semibold">{report.reported_name}</p>
                  <p className="text-xs text-gray-400">{report.reported_phone}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <p className="text-sm font-medium text-gray-700">{t('adminReason', lang)}: {report.reason}</p>
                {report.description && (
                  <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                )}
              </div>

              {report.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(report.id, 'reviewed')}
                    className="btn-secondary py-2 px-4 text-sm flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" /> {t('adminMarkReviewed', lang)}
                  </button>
                  <button
                    onClick={() => updateStatus(report.id, 'resolved')}
                    className="btn-primary py-2 px-4 text-sm flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> {t('adminResolve', lang)}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
