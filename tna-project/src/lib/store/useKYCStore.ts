import { create } from 'zustand';
import { KYCVerification, KYCVerificationResponse, KYCUpdateRequest } from '@/lib/types/kyc';

interface KYCState {
  verifications: KYCVerification[];
  loading: boolean;
  error: string | null;
  fetchVerifications: () => Promise<void>;
  updateVerification: (id: string, data: KYCUpdateRequest) => Promise<void>;
  getVerificationByUserId: (userId: string) => KYCVerification | undefined;
}

export const useKYCStore = create<KYCState>()((set, get) => ({
  verifications: [],
  loading: false,
  error: null,
  
  fetchVerifications: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Implement API call
      const response: KYCVerificationResponse = { data: { 
        verification_id: 'kyc-001',
        user_id: 'visitor-01',
        overall_status: 'APPROVED',
        documents: [],
        verification_score: 95,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } };
      set({ verifications: [response.data], loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch KYC data', loading: false });
    }
  },
  
  updateVerification: async (id, data) => {
    try {
      // TODO: Implement API call
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
