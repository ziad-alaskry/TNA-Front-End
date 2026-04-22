import { create } from 'zustand';

export type AccountCategory = 'individual' | 'business' | null;
export type UserSubType = 'visitor' | 'owner' | 'logistics' | 'gov' | null;

export interface PersonalData {
    fullName: string;
    docType: 'passport' | 'national_id' | 'iqama';
    docNumber: string;
    dateOfBirth: string;
    mobile: string;
}

interface RegistrationState {
    accountCategory: AccountCategory;
    userSubType: UserSubType;
    personalData: PersonalData | null;
    setRegistrationData: (data: Partial<Omit<RegistrationState, 'setRegistrationData' | 'resetRegistration'>>) => void;
    resetRegistration: () => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
    accountCategory: null,
    userSubType: null,
    personalData: null,
    setRegistrationData: (data) => set((state) => ({ ...state, ...data })),
    resetRegistration: () => set({ accountCategory: null, userSubType: null, personalData: null }),
}));
