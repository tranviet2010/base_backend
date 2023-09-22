import { TypeTypeEnum } from 'src/shares/enums/type.enum';

export const serviceGroup = [
  {
    name: 'Sim Data',
    code: 'SD',
    desc: 'sim này cung cấp data siêu khủng ',
    type: TypeTypeEnum.service,
  },
  {
    name: 'Pocket',
    code: 'PK',
    type: TypeTypeEnum.service,
  },
  {
    name: 'Sim Call',
    code: 'SC',
    type: TypeTypeEnum.service,
  },
  {
    name: 'Sim Prepaid',
    code: 'SP',
    type: TypeTypeEnum.service,
  },
  {
    name: 'Hikari',
    code: 'HK',
    type: TypeTypeEnum.service,
  },
];

export const productGroup = [
  {
    name: 'Nhóm Sản Phẩm 1',
    code: 'SC',
    type: TypeTypeEnum.product,
  },
  {
    name: 'Nhóm Sản Phẩm 2',
    code: 'SP',
    type: TypeTypeEnum.product,
  },
  {
    name: 'Nhóm Sản Phẩm 3',
    code: 'HK',
    type: TypeTypeEnum.product,
  },
];
