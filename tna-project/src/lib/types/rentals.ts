/**
 * Rent Contract types
 * Aligned with data model v2.1 `rent_contracts` table
 */

export type RentalPeriodType = 'DAILY' | 'MONTHLY' | 'YEARLY';
export type RentContractStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface RentContract {
  rent_contract_id: string;
  binding_id: string;
  tna_id: string;
  sub_address_id: string;
  gross_amount: number;
  platform_fee_percentage: number;
  platform_fee_amount: number;
  authority_share_percentage: number;
  authority_share_amount: number;
  net_owner_amount: number;
  rental_period_type: RentalPeriodType;
  rental_duration: number;
  start_at: string; // ISO date
  end_at: string;   // ISO date
  status: RentContractStatus;
  created_at: string;
  updated_at: string;
}

export interface RentContractResponse {
  data: RentContract;
}

export interface RentQuoteParams {
  tna_id: string;
  sub_address_id: string;
  rental_period_type: RentalPeriodType;
  rental_duration: number;
}

export interface RentQuote {
  gross_amount: number;
  platform_fee_percentage: number;
  platform_fee_amount: number;
  authority_share_percentage: number;
  authority_share_amount: number;
  net_owner_amount: number;
  message?: string;
}
