export type PriceCatalogType = 'TNA_ISSUANCE' | 'RENTAL_DAILY' | 'RENTAL_MONTHLY' | 'RENTAL_YEARLY' | 'SERVICE_FEE' | 'DELIVERY_FEE' | 'LATE_FEE';

export interface PriceRule {
  rule_id: string;
  condition: {
    type: 'REGION' | 'PROPERTY_TYPE' | 'DURATION' | 'VOLUME' | 'TIME';
    operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'BETWEEN';
    value: string | number | string[];
  };
  adjustment_type: 'FLAT' | 'PERCENTAGE' | 'MULTIPLIER';
  adjustment_value: number;
  priority: number;
}

export interface PriceCatalogEntry {
  catalog_id: string;
  item_type: PriceCatalogType;
  item_name: string;
  description_ar: string;
  description_en: string;
  base_price: number;
  currency: string;
  pricing_rules?: PriceRule[];
  platform_fee_percentage: number;
  authority_share_percentage: number;
  is_active: boolean;
  effective_from: string;
  effective_until?: string;
  created_at: string;
  updated_at: string;
}

export interface PriceCatalogResponse {
  data: PriceCatalogEntry[];
}

export interface UpdatePriceEntryRequest {
  base_price?: number;
  pricing_rules?: PriceRule[];
  is_active?: boolean;
  effective_from?: string;
  effective_until?: string;
}