export const mockGovQueue = [
  {
    request_id: 'req-pending-1',
    visitor_name: 'Abdullah Al-Ghamdi',
    nationality: 'Saudi Arabia',
    submitted_at: '2024-05-01T10:00:00Z',
    mode: 'MODERATED',
    visitor_id_number: '1092837465',
    status: 'PENDING_REVIEW',
    supporting_documents: ['id_copy', 'passport_entry'],
  },
  {
    request_id: 'req-auto-1',
    visitor_name: 'John Doe',
    nationality: 'USA',
    submitted_at: '2024-05-02T11:00:00Z',
    mode: 'AUTONOMOUS',
    visitor_id_number: '2093847561',
    status: 'AUTO_APPROVED',
  },
  {
    request_id: 'req-pending-2',
    visitor_name: 'Sara Ahmed',
    nationality: 'Egypt',
    submitted_at: '2024-05-03T09:30:00Z',
    mode: 'MODERATED',
    visitor_id_number: '1092837465',
    status: 'PENDING_REVIEW',
  },
  {
    request_id: 'req-pending-3',
    visitor_name: 'Michael Smith',
    nationality: 'UK',
    submitted_at: '2024-05-04T15:20:00Z',
    mode: 'MODERATED',
    visitor_id_number: '1092837465',
    status: 'PENDING_REVIEW',
  },
  {
    request_id: 'req-pending-4',
    visitor_name: 'Fatima Zahra',
    nationality: 'Morocco',
    submitted_at: '2024-05-05T08:15:00Z',
    mode: 'MODERATED',
    visitor_id_number: '1092837465',
    status: 'PENDING_REVIEW',
  },
];

export const mockSubAddressQueue = [
  {
    sub_address_id: 'sub-001',
    owner_name: 'Mohammed Al-Saud',
    owner_type: 'INDIVIDUAL',
    full_address: '1234 King Fahd Road, Al Olaya District, Riyadh',
    suffix_code: 'A-01',
    label: 'Unit 1',
    submitted_at: '2024-05-01T14:30:00Z',
    status: 'PENDING',
  },
  {
    sub_address_id: 'sub-002',
    owner_name: 'Al Rajhi Bank',
    owner_type: 'BUSINESS',
    full_address: '8472 Prince Mohammed Bin Fahd Road, Al Khobar',
    suffix_code: 'B-05',
    label: 'Branch Office',
    submitted_at: '2024-05-02T09:15:00Z',
    status: 'PENDING',
  },
  {
    sub_address_id: 'sub-003',
    owner_name: 'Noura Al-Mansouri',
    owner_type: 'INDIVIDUAL',
    full_address: '5678 King Abdulaziz Road, Jeddah',
    suffix_code: 'C-12',
    label: 'Apartment 3',
    submitted_at: '2024-05-03T16:45:00Z',
    status: 'PENDING',
  },
];

export const mockTNARequestDetails: Record<string, any> = {
  'req-pending-1': {
    request_id: 'req-pending-1',
    visitor: { name: 'Abdullah Al-Ghamdi', nationality: 'Saudi Arabia', national_id: '1092837465', visa_status: 'VALID' },
    eligibility: { visa_valid: true, iqama_valid: true, max_tnas_reached: false, risk_score: 'LOW' },
    documents: [{ type: 'passport_entry', status: 'UPLOADED' }, { type: 'id_copy', status: 'UPLOADED' }],
  },
  'req-pending-2': {
    request_id: 'req-pending-2',
    visitor: { name: 'Sara Ahmed', nationality: 'Egypt', national_id: '1092837465', visa_status: 'VALID' },
    eligibility: { visa_valid: true, iqama_valid: true, max_tnas_reached: false, risk_score: 'MEDIUM' },
    documents: [{ type: 'passport_entry', status: 'UPLOADED' }, { type: 'residence_permit', status: 'UPLOADED' }],
  },
  'req-pending-3': {
    request_id: 'req-pending-3',
    visitor: { name: 'Michael Smith', nationality: 'UK', national_id: '1092837465', visa_status: 'VALID' },
    eligibility: { visa_valid: true, iqama_valid: false, max_tnas_reached: false, risk_score: 'HIGH' },
    documents: [{ type: 'passport_entry', status: 'UPLOADED' }, { type: 'id_copy', status: 'PENDING' }],
  },
  'req-pending-4': {
    request_id: 'req-pending-4',
    visitor: { name: 'Fatima Zahra', nationality: 'Morocco', national_id: '1092837465', visa_status: 'EXPIRED' },
    eligibility: { visa_valid: false, iqama_valid: true, max_tnas_reached: false, risk_score: 'LOW' },
    documents: [{ type: 'passport_entry', status: 'PENDING' }, { type: 'id_copy', status: 'UPLOADED' }],
  },
};

export const mockSubAddressDetails: Record<string, any> = {
  'sub-001': {
    sub_address_id: 'sub-001',
    owner: {
      name: 'Mohammed Al-Saud',
      owner_type: 'INDIVIDUAL',
      national_id: '1092837465',
      is_verified: true,
    },
    national_address: {
      full_address: '1234 King Fahd Road, Al Olaya District, Riyadh',
      ownership_proof_status: 'VERIFIED',
      title_deed_reference: 'Deed-2024-12345',
      na_certificate_url: '/docs/na-cert-001.pdf',
    },
    sub_address: {
      suffix_code: 'A-01',
      label: 'Unit 1',
      description: 'Ground floor apartment',
    },
  },
};

export const mockGovAdjustments = [
  {
    adjustment_id: 'adj-001',
    adjustment_type: 'OWNER_CORRECTION',
    amount: 150.00,
    reason: 'Incorrect fee calculation on binding BIND-123',
    initiated_by: 'Gov User',
    created_at: '2024-05-01T10:30:00Z',
    status: 'PENDING',
    approval_required: true,
  },
  {
    adjustment_id: 'adj-002',
    adjustment_type: 'SYSTEM_ERROR',
    amount: -75.50,
    reason: 'Duplicate charge refund',
    initiated_by: 'System',
    created_at: '2024-05-02T15:20:00Z',
    status: 'APPROVED',
    approval_required: false,
  },
];

export const issuancePolicyConfig = {
    issuance_mode: 'MODERATED',
    max_active_tnas_per_visitor: 3,
    auto_approve_if_visa_valid: true,
    auto_approve_if_iqama_valid: true,
    route_to_review_if_max_exceeded: true,
};

export const mockRegionStats = [
  {
    region: 'Riyadh',
    count: 124,
    trend: 'up' as const,
    trendPercent: 12,
  },
  {
    region: 'Jeddah',
    count: 89,
    trend: 'down' as const,
    trendPercent: 3,
  },
  {
    region: 'Dammam',
    count: 67,
    trend: 'up' as const,
    trendPercent: 8,
  },
  {
    region: 'Makkah',
    count: 94,
    trend: 'up' as const,
    trendPercent: 15,
  },
];