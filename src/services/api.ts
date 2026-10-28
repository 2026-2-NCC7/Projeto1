import {
  Candidate, Skill, InterviewSession, InterviewQuestion,
  InterviewAnswer, AssessmentReport, ReportVersion, ReportReview,
  Job, Company, JobMatchingRanking, CandidateMatchingResult,
  CandidateComparisonResponse, HealthResponse, AuditEvent
} from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api/v1';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
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

    const res = await fetch(`${API_BASE_URL}/interviews/answers/audio`, {
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

  // Reports
  listReports: () => request<AssessmentReport[]>('/reports'),
  getReport: (id: string) => request<AssessmentReport>(`/reports/${id}`),
  getReportVersions: (reportId: string) => request<ReportVersion[]>(`/reports/${reportId}/versions`),
  submitReplica: (reportId: string, payload: { skill_id?: string; replica_text: string }) =>
    request<ReportReview>(`/reports/${reportId}/replica`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  consolidateReport: (reportId: string) =>
    request<{ success: boolean; report_id: string; status: string; message: string }>(
      `/reports/${reportId}/consolidate`,
      { method: 'POST' }
    ),

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
