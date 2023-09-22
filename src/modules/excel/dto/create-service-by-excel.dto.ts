export class CreateServiceGroupDto {
  // tên dịch vụ cột đầu tiên // string
  __EMPTY: string; // hình ảnh không xử lý tạm để trống
  __EMPTY_1: string; // gia hạn | thanh toán một lần  example:  Gia hạn || Thanh toán một lần  --> type
  __EMPTY_2: string; // nhóm dịch vụ   --> service-group  name -->   service_group_id
  __EMPTY_3: string; // dung lượng     --> capacity -->  name --> capacity_id
  __EMPTY_4: string; // hợp đồng        --> contract --> name   --> contract_id
  __EMPTY_5: string; // sử dụng cho    -->  type_server_use --> name --> type_service_use_id
  __EMPTY_6: string; // thiết bị đi kèm   --> devices -->  name ngăn cắt bởi dấu |
  __EMPTY_7: number; // phí saihakko
  __EMPTY_8: number; // phí khác
  __EMPTY_9: string; // ghi chú                desc

  // sản xuất  producer_info
  __EMPTY_10: string; // nhà sản xuất          name  --> supplier_id
  __EMPTY_11: string; // nơi sản xuất          service_production_location

  // giá nhập  buying_info
  __EMPTY_12: number; // tiền cọc              deposit
  __EMPTY_13: number; // phí kích hoạt         activation_fee
  __EMPTY_14: number; // phí mở mạng           network_opening_fee
  __EMPTY_15: number; // giá sim đi kèm        extra_sim_fee
  __EMPTY_16: number; // giá thiết bị đi kèm
  __EMPTY_17: number; // khác                  other_fee
  __EMPTY_18: number; // tổng                  total

  // giá bán  selling_info
  __EMPTY_19: number; // tiền cọc              deposit
  __EMPTY_20: number; // phí kích hoạt         activation_fee
  __EMPTY_21: number; // phí mở mạng           network_opening_fee
  __EMPTY_22: number; // giá sim đi kèm        extra_sim_fee
  __EMPTY_23: number; // giá thiết bị đi kèm
  __EMPTY_24: number; // khác                  other_fee
  __EMPTY_25: number; // tổng                  total

  // giá nhập đơn vị quy đổi  buying_fee
  __EMPTY_26: number; // cước       price
  __EMPTY_27: string; // đơn vị    --> name     unit_id

  // giá bán đơn vị quy đổi  selling_fee
  __EMPTY_28: number; // cước    -->    price
  __EMPTY_29: string; // đơn vị  --> name   unit_id
  row: number;
}
