import { create } from 'zustand';
import { SignupRequest, UserRole } from '@/lib/types/auth';

interface RegistrationState {
  step: number;
  formData: Partial<SignupRequest>;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<SignupRequest>) => void;
  resetRegistration: () => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  step: 1,
  formData: {
    user_role: 'VISITOR',
  },
  setStep: (step) => set({ step }),
  updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  resetRegistration: () => set({ step: 1, formData: { user_role: 'VISITOR' } }),
}));
