import { ExchangeType } from 'src/shares/enums/exchange.enum';
import { ProductStatusEnum } from 'src/shares/enums/product.enum';

export const productInfoData = [
  {
    status: ProductStatusEnum.ACTIVE,
    name: 'sản phẩm 1',
    code: '11111',
    desc: 'mô tả sản phẩm 1',
    producer_info: {
      product_production_location: 'Viet Nam',
    },
    selling_fee: 2000,
    attributes: [
      {
        name: 'thuộc tính 1',
        value: '1111111',
      },
      {
        name: 'thuộc tính 2',
        value: '222222',
      },
      {
        name: 'thuộc tính 3',
        value: '3333333333',
      },
      {
        name: 'thuộc tính 4',
        value: '444444',
      },
    ],
    selling_exchanges: [
      {
        price: 2000,
        exchange_type: ExchangeType.eq,
        quantity: 200,
        unit_id: '',
      },
    ],
    image_url: [
      'photo-1618005198920-f0cb6201c115_2023-07-17T02%3A10%3A15.712Z.avif',
      'photo-1638643391904-9b551ba91eaa_2023-07-17T02:10:55.794Z.avif',
      'photo-1639628735078-ed2f038a193e_2023-07-17T02:11:13.068Z.avif',
      'photo-1636622433525-127afdf3662d_2023-07-17T02:11:53.212Z.avif',
      'photo-1637858868799-7f26a0640eb6_2023-07-17T02:12:04.555Z.avif',
    ],
    currency: 'JPY',
  },
];
