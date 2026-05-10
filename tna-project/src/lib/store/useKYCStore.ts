import { create } from 'zustand';
import type { KYCVerification, KYCStatus, KYCVerificationResponse } from '../types/kyc';
import { kycApi } from '../api/kyc';

interface KYCState {
  verifications: KYCVerification[];
  currentStatus: KYCStatus | null;
  loading: boolean;
  error: string | null;
  fetchVerifications: () => Promise<void>;
  fetchKYCStatus: (visitor_id: string) => Promise<void>;
  submitDocuments: (visitor_id: string, documents: Array<{ doc_type: string; file_base64: string; filename: string }>) => Promise<void>;
  updateVerification: (id: string, data: { status?: KYCStatus; notes?: string }) => Promise<void>;
  getVerificationByUserId: (userId: string) => KYCVerification | undefined;
}

export const useKYCStore = create<KYCState>()((set, get) => ({
  verifications: [],
  currentStatus: null,
  loading: false,
  error: null,

  fetchVerifications: async () => {
    set({ loading: true, error: null });
    try {
      // This endpoint would need to be implemented in backend; using mock for now
      const response: KYCVerificationResponse = {
        data: {
          verification_id: 'kyc-001',
          user_id: 'visitor-01',
          overall_status: 'PENDING',
          documents: [],
          verification_score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      };
      set({ verifications: [response.data], loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch KYC data', loading: false });
    }
  },

  fetchKYCStatus: async (visitor_id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await kycApi.getKYCStatus(visitor_id);
      set({ currentStatus: data.overall_status as KYCStatus, verifications: [data], loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch KYC status', loading: false });
    }
  },

  submitDocuments: async (visitor_id: string, documents: Array<{ doc_type: string; file_base64: string; filename: string }>) => {
    set({ loading: true, error: null });
    try {
      const response = await kycApi.submitDocuments({ visitor_id, documents });
      set({ verifications: [response.data], currentStatus: response.data.overall_status as KYCStatus, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to submit documents', loading: false });
      throw err;
    }
  },

  updateVerification: async (id, data) => {
    try {
      // TODO: Implement API call when available
      set(state => ({
        verifications: state.verifications.map(ver =>
          ver.verification_id === id
            ? { ...ver, ...data, updated_at: new Date().toISOString() }
            : ver
        )
      }));
    } catch (err) {
      set({ error: 'Failed to update KYC verification' });
    }
  },

  getVerificationByUserId: (userId) => {
    return get().verifications.find(v => v.user_id === userId);
  },
}));
