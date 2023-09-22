export class MapProductInfoDto {
  _id: string;
  product_type_id: string;
  product_type_name: string;
  status: string;
  name: string;
  code: string;
  group_name: string;
  group_id: string;
  type_product_use_id: string;
  type_product_use_name: string;
  unit_id: string;
  unit_name: string;
  producer_info: {
    producer_id: string;
    producer_name: string;
    product_production_location: string;
  };
  selling_exchanges: {
    price: string;
    unit_id: string;
    unit_name: string;
    exchange_type: string;
    quantity: string;
  }[];
  selling_fee: string;
  histories: {
    info: any;
    create_by?: string;
    update_by?: string;
    delete_by?: string;
    created_at: string;
  }[];
  deleted: boolean;
  image_url: string[];
  desc: string;
  currency: string;
  createdAt: string;
  attributes: {
    name: string;
    value: string;
  }[];
}
