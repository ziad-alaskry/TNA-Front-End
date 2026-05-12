import { create } from 'zustand';
import type { UserRole } from '@/lib/types/auth';

interface RegistrationFormData {
  role: UserRole;
  // Shared user fields
  username: string;
  email: string;
  password: string;
  // Visitor-specific
  full_name?: string;
  nationality?: string;
  date_of_birth?: string;
  document_type?: 'VISA' | 'IQAMA' | 'PASSPORT';
  document_number?: string;
  mobile?: string;
  // Owner-specific
  owner_type?: 'INDIVIDUAL' | 'BUSINESS';
  business_name?: string;
  commercial_registration?: string;
  tax_id?: string;
  // B2B/Entity flag used by form logic
  is_entity?: boolean;
}

interface RegistrationState {
  step: number;
  formData: RegistrationFormData;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<RegistrationFormData>) => void;
  resetRegistration: () => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  step: 1,
  formData: {
    role: 'VISITOR',
    username: '',
    email: '',
    password: '',
  },
  setStep: (step) => set({ step }),
  updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  resetRegistration: () => set({ step: 1, formData: { role: 'VISITOR', username: '', email: '', password: '' } }),
}));
