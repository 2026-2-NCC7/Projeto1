import {
  Candidate, Skill, InterviewSession, InterviewQuestion,
  InterviewAnswer, AssessmentReport, ReportVersion, ReportReview,
  Job, Company, JobMatchingRanking, CandidateMatchingResult,
  CandidateComparisonResponse, HealthResponse, AuditEvent
} from '../types';
import { SEED_ASSESSMENT_REPORTS } from '../portal/mock/seedReports';

const LOCAL_STORAGE_REPORTS_KEY = 'QITECH_LOCAL_REPORTS_V1';

function getLocalReports(): AssessmentReport[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}
  try {
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(SEED_ASSESSMENT_REPORTS));
  } catch (_) {}
  return SEED_ASSESSMENT_REPORTS;
}

function saveLocalReports(reports: AssessmentReport[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
  } catch (_) {}
}

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:8000/api/v1`;
  }
  return 'http://127.0.0.1:8000/api/v1';
};

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorDetail = 'Erro na requisição à API';
    try {
      const err = await response.json();
      errorDetail = err.detail || err.message || errorDetail;
    } catch {
      errorDetail = await response.text();
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // System
  getHealth: () => request<HealthResponse>('/system/health'),
  getAuditEvents: (limit = 30) => request<AuditEvent[]>(`/system/audit-events?limit=${limit}`),

  // Skills
  listSkills: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return request<Skill[]>(`/skills?${params.toString()}`);
  },
  getSkill: (skillId: string) => request<Skill>(`/skills/${skillId}`),
  searchSkillsSemantically: (query: string, topK = 5) =>
    request<{ query: string; total_results: number; results: any[] }>(
      `/skills/search-semantic?query=${encodeURIComponent(query)}&top_k=${topK}`,
      { method: 'POST' }
    ),

  // Candidates
  listCandidates: () => request<Candidate[]>('/candidates'),
  getCandidate: (id: string) => request<Candidate>(`/candidates/${id}`),
  createCandidate: (payload: any) =>
    request<Candidate>('/candidates', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getCandidateLatestReport: (candidateId: string) =>
    request<any>(`/candidates/${candidateId}/latest-report`),

  // Interviews
  listInterviews: (candidateId?: string) => {
    const q = candidateId ? `?candidate_id=${candidateId}` : '';
    return request<InterviewSession[]>(`/interviews${q}`);
  },
  getInterview: (id: string) => request<InterviewSession>(`/interviews/${id}`),
  createInterview: (payload: { candidate_id: string; interview_type: string; job_id?: string }) =>
    request<InterviewSession>('/interviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getInterviewQuestions: (sessionId: string) =>
    request<InterviewQuestion[]>(`/interviews/${sessionId}/questions`),
  submitTextAnswer: (payload: { session_id: string; question_id: string; text: string }) =>
    request<InterviewAnswer>('/interviews/answers/text', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  submitAudioAnswer: async (sessionId: string, questionId: string, audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('question_id', questionId);
    formData.append('file', audioBlob, 'recording.webm');

    const res = await fetch(`${getApiBaseUrl()}/interviews/answers/audio`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Erro no upload de áudio' }));
      throw new Error(err.detail);
    }
    return res.json() as Promise<InterviewAnswer>;
  },
  editAnswerText: (answerId: string, editedText: string) =>
    request<InterviewAnswer>(`/interviews/answers/${answerId}`, {
      method: 'PUT',
      body: JSON.stringify({ edited_text: editedText }),
    }),
  analyzeInterview: (sessionId: string) =>
    request<{ success: boolean; session_id: string; report_id: string; version_number: number; message: string }>(
      `/interviews/${sessionId}/analyze`,
      { method: 'POST' }
    ),

  // Reports (Com Fallback Resiliente para execução em qualquer máquina)
  listReports: async (): Promise<AssessmentReport[]> => {
    try {
      const serverReports = await request<AssessmentReport[]>('/reports');
      if (Array.isArray(serverReports) && serverReports.length > 0) {
        return serverReports;
      }
    } catch (err) {
      console.warn('[QI Matchmaker] Backend remoto indisponível. Carregando laudos técnicos locais:', err);
    }
    return getLocalReports();
  },
  getReport: async (id: string): Promise<AssessmentReport> => {
    try {
      const rep = await request<AssessmentReport>(`/reports/${id}`);
      if (rep && rep.id) return rep;
    } catch (_) {}
    const local = getLocalReports();
    const found = local.find(r => r.id === id);
    if (found) return found;
    if (local.length > 0) return local[0];
    throw new Error(`Relatório com ID ${id} não encontrado.`);
  },
  getReportVersions: async (reportId: string): Promise<ReportVersion[]> => {
    try {
      const versions = await request<ReportVersion[]>(`/reports/${reportId}/versions`);
      if (Array.isArray(versions) && versions.length > 0) return versions;
    } catch (_) {}
    const rep = await api.getReport(reportId);
    return rep.versions || (rep.active_version ? [rep.active_version] : []);
  },
  submitReplica: async (reportId: string, payload: { skill_id?: string; replica_text: string }): Promise<ReportReview> => {
    try {
      return await request<ReportReview>(`/reports/${reportId}/replica`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (_) {
      const local = getLocalReports();
      const report = local.find(r => r.id === reportId);
      const reviewId = `rev-${Date.now()}`;
      const newVerNum = (report?.active_version_number || 1) + 1;
      const newVerId = `ver-${Date.now()}`;
      
      const newReview: ReportReview = {
        id: reviewId,
        report_id: reportId,
        version_id: newVerId,
        candidate_id: report?.candidate_id || 'cand-current',
        skill_id: payload.skill_id,
        replica_text: payload.replica_text,
        status: 'RECEBIDA',
        created_at: new Date().toISOString()
      };

      if (report) {
        const currentAssessments = report.active_version?.assessments || [];
        const updatedAssessments = currentAssessments.map(a => {
          if (a.skill_id === payload.skill_id) {
            return {
              ...a,
              evidence_status: 'PARCIALMENTE_EVIDENCIADA' as const,
              explanation: `${a.explanation} [Nota de Contestação]: ${payload.replica_text}`,
              requires_review: true
            };
          }
          return a;
        });

        const newVersion: ReportVersion = {
          id: newVerId,
          report_id: reportId,
          version_number: newVerNum,
          status: 'EM_REVISAO',
          summary: `Versão ${newVerNum} gerada com base no pedido de revisão humana (Art. 20 LGPD).`,
          created_at: new Date().toISOString(),
          assessments: updatedAssessments,
          reviews: [newReview]
        };

        const updatedReports = local.map(r => {
          if (r.id === reportId) {
            return {
              ...r,
              status: 'EM_REVISAO',
              active_version_number: newVerNum,
              active_version: newVersion,
              versions: [...r.versions, newVersion]
            };
          }
          return r;
        });
        saveLocalReports(updatedReports);
      }

      return newReview;
    }
  },
  consolidateReport: async (reportId: string): Promise<{ success: boolean; report_id: string; status: string; message: string }> => {
    try {
      return await request<{ success: boolean; report_id: string; status: string; message: string }>(
        `/reports/${reportId}/consolidate`,
        { method: 'POST' }
      );
    } catch (_) {
      const local = getLocalReports();
      const updatedReports = local.map(r => {
        if (r.id === reportId) {
          return { ...r, status: 'CONSOLIDADO' };
        }
        return r;
      });
      saveLocalReports(updatedReports);
      return {
        success: true,
        report_id: reportId,
        status: 'CONSOLIDADO',
        message: 'Relatório homologado com sucesso! A versão oficial foi consolidada (Art. 20 LGPD).'
      };
    }
  },

  // Jobs
  listCompanies: () => request<Company[]>('/companies'),
  createCompany: (payload: { name: string; industry?: string; description?: string }) =>
    request<Company>('/companies', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  listJobs: () => request<Job[]>('/jobs'),
  getJob: (id: string) => request<Job>(`/jobs/${id}`),
  createJob: (payload: any) =>
    request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Matching
  runJobMatching: (jobId: string) =>
    request<JobMatchingRanking>(`/matching/jobs/${jobId}/run`, { method: 'POST' }),
  getJobRanking: (jobId: string) =>
    request<JobMatchingRanking>(`/matching/jobs/${jobId}/ranking`),
  matchSingleCandidate: (candidateId: string, jobId: string) =>
    request<CandidateMatchingResult>(`/matching/candidates/${candidateId}/jobs/${jobId}`, {
      method: 'POST',
    }),
  compareCandidates: (jobId: string, candidateIds: string[]) =>
    request<CandidateComparisonResponse>('/matching/compare', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId, candidate_ids: candidateIds }),
    }),
};
