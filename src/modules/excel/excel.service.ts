import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as xlsx from 'xlsx';
import * as Excel from 'exceljs';

import { CreateServiceGroupDto } from './dto/create-service-by-excel.dto';
import { CreateErrorInfoDto } from './dto/error-info.dto';
import { ERROR } from 'src/shares/message/excel.message';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { ServiceInfo, ServiceInfoDocument } from '../service-info/schemas/service-info.schema';
import { BuyType } from 'src/shares/enums/service-info.enum';

import { Type, TypeDocument } from '../type/schemas/type.schema';
import { Group, GroupDocument } from '../group/schemas/group.schema';
import { Unit, UnitDocument } from '../unit/schema/unit.schema';
import { Capacity } from '../capacity/schemas/capacity.schema';
import { Contract, ContractDocument } from '../contract/schema/contracts.schema';
import { TypeUse, TypeUseDocument } from '../type-use/schemas/type-use.schema';
import { Device, DeviceDocument } from '../device/schemas/device.schema';
import { Supplier, SupplierDocument } from '../supplier/schemas/supplier.schema';
import { Producer, ProducerDocument } from '../producer/schemas/producer.schema';

export enum TypeInputExcel {
  month = 'Gia hạn',
  full = 'Thanh toán một lần',
}

@Injectable()
export class ExcelService {
  constructor(
    @InjectModel(Type.name) private typeModel: Model<TypeDocument>,
    @InjectModel(ServiceInfo.name) private serviceModel: Model<ServiceInfoDocument>,
    @InjectModel(Group.name) private GroupModel: Model<GroupDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    @InjectModel(Capacity.name) private capacityModel: Model<Capacity>,
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    @InjectModel(TypeUse.name) private typeServiceUserModel: Model<TypeUseDocument>,
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    @InjectModel(Producer.name) private producerModel: Model<ProducerDocument>,
  ) {}

  async exportToExcel(data: any[], res: Response, nameFile: string): Promise<void> {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    data.forEach((item) => {
      const row = [];
      headers.forEach((header) => {
        row.push(item[header]);
      });
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=${nameFile}.xlsx`,
    });

    res.send(buffer);
  }

  async createService(file: Express.Multer.File, res: Response): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const data: CreateServiceGroupDto[] = [];
    const dataExcelInput = [];

    workbook.SheetNames.forEach((sheetName: string) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      jsonData.forEach((row: any, rowIndex: number) => {
        data.push({ ...row, row: rowIndex + 1 });
      });
    });

    const { errorInfo, validService } = await this.validateExcelService(data);

    // create service
    await this.serviceModel.create(validService);

    workbook.SheetNames.forEach((sheetName: string) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      errorInfo.forEach((error: any) => {
        const rowData = jsonData[error.row - 1];
        const newRowData = ['', 'false', error.info, JSON.stringify(error.desc)];

        newRowData.forEach((value, index) => {
          const key = '__EMPTY_31'[index];
          rowData[key] = value;
        });
      });

      dataExcelInput.push(...jsonData);
    });

    const sheet = xlsx.utils.json_to_sheet(dataExcelInput);
    xlsx.utils.book_append_sheet(workbook, sheet, 'Sheet 2');

    const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=example.xlsx',
    });

    res.send(excelBuffer);
  }

  formatString(input: string): string {
    return input?.toString().toLowerCase().trim();
  }

  isEmptyObject(obj): boolean {
    return JSON.stringify(obj) === '{}';
  }

  async validateExcelService(
    data: CreateServiceGroupDto[],
  ): Promise<{ errorInfo: CreateErrorInfoDto[]; validService: ServiceInfo[] }> {
    const errorInfo: CreateErrorInfoDto[] = [];
    const validService: ServiceInfo[] = [];

    if (!this.isValidTypeService(data)) {
      throw new BadRequestException();
    }

    const keyNameAndTypeService = this.getTypeServiceKeyName(data);

    await Promise.all(
      data.slice(2).map(async (_) => {
        const desc: string[] = [];

        const typeService = await this.getTypeService(keyNameAndTypeService);
        if (!typeService) {
          desc.push(ERROR.TYPE_SERVICE_NOT_FOUND);
        } else if (!this.isEmptyObject(typeService)) {
          desc.push(ERROR.TYPE_SERVICE_NOT_FOUND_IN_DB);
        }

        const nameService = _[keyNameAndTypeService];
        if (!nameService) {
          desc.push(ERROR.NAME_SERVICE_NOT_FOUND);
        }

        const type = _?.__EMPTY_1;
        let type_ = BuyType.MONTHLY;

        if (!type) {
          desc.push(ERROR.TYPE_NOT_FOUND);
        } else {
          switch (type) {
            case TypeInputExcel.month:
              type_ = BuyType.MONTHLY;
              break;
            case TypeInputExcel.full:
              type_ = BuyType.FULL;
              break;
            default:
              desc.push(ERROR.TYPE_NOT_FOUND);
          }
        }

        const serviceGroupName = this.formatString(_?.__EMPTY_2);
        const serviceGroup = await this.getServiceGroup(serviceGroupName);
        if (!serviceGroup) {
          desc.push(ERROR.SERVICE_GROUP_NOT_FOUND);
        } else if (!this.isEmptyObject(serviceGroup)) {
          desc.push(ERROR.SERVICE_GROUP_NOT_FOUND_IN_DB);
        }

        const capaCityName = this.formatString(_?.__EMPTY_3);
        const capacity = await this.getCapacity(capaCityName);
        if (!capacity) {
          desc.push(ERROR.CAPACITY_NOT_FOUND);
        } else if (!this.isEmptyObject(capacity)) {
          desc.push(ERROR.CAPACITY_NOT_FOUND_IN_DB);
        }

        const contractName = this.formatString(_?.__EMPTY_4);
        const contract = await this.getContract(contractName);
        if (!contract) {
          desc.push(ERROR.CONTRACT_NOT_FOUND);
        } else if (!this.isEmptyObject(contract)) {
          desc.push(ERROR.CONTRACT_NOT_FOUND_IN_DB);
        }

        const typeServiceUseName = this.formatString(_?.__EMPTY_5);
        const typeServiceUse = await this.getTypeServiceUse(typeServiceUseName);
        if (!typeServiceUse) {
          desc.push(ERROR.TYPE_SERVICE_USE_NOT_FOUND);
        } else if (!this.isEmptyObject(typeServiceUse)) {
          desc.push(ERROR.TYPE_SERVICE_USE_NOT_FOUND_IN_DB);
        }

        const supplierName = this.formatString(_?.__EMPTY_10);
        const producer = await this.getProducers(supplierName);
        if (!producer) {
          desc.push(ERROR.PRODUCER_USE_NOT_FOUND);
        }
        if (!_?.__EMPTY_11) {
          desc.push(ERROR.PRODUCER_USE_NOT_FOUND);
        }

        const buying_fee_price = _?.__EMPTY_26;
        const buying_fee_unit_name = this.formatString(_?.__EMPTY_27);
        let unitBuyingFee = new Unit();
        if (!buying_fee_unit_name) {
          desc.push(ERROR.BUYING_FEE_NOT_FOUND);
        } else {
          unitBuyingFee = await this.getUnit(buying_fee_unit_name);
          if (!this.isEmptyObject(unitBuyingFee)) {
            desc.push(ERROR.BUYING_FEE_NOT_FOUND_IN_DB);
          }
        }
        if (!buying_fee_price) {
          desc.push(ERROR.BUYING_FEE_PRICE_NOT_FOUND);
        }

        const selling_fee_price = _?.__EMPTY_28;
        const selling_fee_unit_name = this.formatString(_?.__EMPTY_29);
        let unitSellingFee = new Unit();
        if (!selling_fee_unit_name) {
          desc.push(ERROR.SELLING_FEE_NOT_FOUND);
        } else {
          unitSellingFee = await this.getUnit(selling_fee_unit_name);
          if (!this.isEmptyObject(unitSellingFee)) {
            desc.push(ERROR.SELLING_FEE_NOT_FOUND_IN_DB);
          }
        }
        if (!selling_fee_price) {
          desc.push(ERROR.SELLING_FEE_PRICE_NOT_FOUND);
        }

        const otherFee = _?.__EMPTY_8;
        const service_production_location = _?.__EMPTY_11;

        // const buying_info_deposit = _?.__EMPTY_12 || 0;
        // const buying_info_activation_fee = _?.__EMPTY_13 || 0;
        // const buying_info_network_opening_fee = _?.__EMPTY_14 || 0;
        // const buying_info_extra_sim_fee = _?.__EMPTY_15 || 0;
        // const buying_info_other_fee = _?.__EMPTY_17 || 0;
        // const buying_total =
        //   buying_info_deposit +
        //   buying_info_activation_fee +
        //   buying_info_network_opening_fee +
        //   buying_info_extra_sim_fee +
        //   buying_info_other_fee +
        //   total_buying_device;

        const selling_info_deposit = _?.__EMPTY_19 || 0;
        const selling_info_activation_fee = _?.__EMPTY_20 || 0;
        const selling_info_network_opening_fee = _?.__EMPTY_21 || 0;
        // const selling_info_extra_sim_fee = _?.__EMPTY_22 || 0;
        const selling_info_other_fee = _?.__EMPTY_24 || 0;
        const selling_total =
          selling_info_deposit +
          selling_info_activation_fee +
          selling_info_network_opening_fee +
          // selling_info_extra_sim_fee +
          selling_info_other_fee;

        const desc_ = _?.__EMPTY_9;

        if (desc.length > 0) {
          errorInfo.push({
            desc,
            info: _[keyNameAndTypeService],
            row: _?.row,
          });
        } else {
          validService.push({
            code: producer.code + serviceGroup.code + capacity.name,
            type_service_id: typeService['_id'],
            name: keyNameAndTypeService,
            type: type_,
            service_group_id: serviceGroup['_id'],
            capacity_id: capacity['_id'],
            contract_id: contract['_id'],
            type_service_use_id: typeService['_id'],
            producer_info: {
              producer_id: producer['_id'],
              service_production_location,
            },
            other_fees: [
              {
                name: '',
                price: otherFee,
              },
            ],

            selling_fee: {
              unit_id: unitSellingFee['_id'],
              price: selling_fee_price,
            },
            selling_info: {
              deposit: selling_info_deposit,
              activation_fee: selling_info_activation_fee,
              network_opening_fee: selling_info_network_opening_fee,
              other_fee: selling_info_other_fee,
              total: selling_total,
            },
            desc: desc_,
            selling_exchanges: [],
            attributes: [
              {
                name: 'test',
                value: '123',
              },
            ],
          });
        }
      }),
    );

    return {
      errorInfo,
      validService,
    };
  }

  // Helper Functions

  private isValidTypeService(data: CreateServiceGroupDto[]): boolean {
    return Object.keys(data[0])[0] && !Object.keys(data[0])[0]?.includes('__EMPTY');
  }

  private getTypeServiceKeyName(data: CreateServiceGroupDto[]): string {
    return Object.keys(data[0])[0];
  }

  private async getTypeService(keyNameAndTypeService: string): Promise<Type> {
    if (!keyNameAndTypeService) return null;

    return await this.typeModel
      .findOne({
        $expr: { $eq: [{ $toLower: '$name' }, this.formatString(keyNameAndTypeService)] },
      })
      .exec();
  }

  private async getServiceGroup(serviceGroupName: string): Promise<Group> {
    if (!serviceGroupName) return null;

    return await this.GroupModel.findOne({
      $expr: { $eq: [{ $toLower: '$name' }, serviceGroupName] },
    }).exec();
  }

  private async getCapacity(capacityName: string): Promise<Capacity> {
    if (!capacityName) return null;

    return await this.capacityModel
      .findOne({
        $expr: { $eq: [{ $toLower: '$name' }, capacityName] },
      })
      .exec();
  }

  private async getContract(contractName: string): Promise<Contract> {
    if (!contractName) return null;

    return await this.contractModel
      .findOne({
        $expr: { $eq: [{ $toLower: '$name' }, contractName] },
      })
      .exec();
  }

  private async getTypeServiceUse(typeServiceUseName: string): Promise<TypeUse> {
    if (!typeServiceUseName) return null;

    return await this.typeServiceUserModel
      .findOne({
        $expr: { $eq: [{ $toLower: '$name' }, typeServiceUseName] },
      })
      .exec();
  }

  private async getDevices(deviceNames: string[]): Promise<Device[]> {
    if (!deviceNames || deviceNames.length === 0) return [];

    const formattedDeviceNames = deviceNames.map((name) => this.formatString(name));
    return await Promise.all(
      formattedDeviceNames.map(async (name) => {
        const device = await this.deviceModel
          .findOne({
            $expr: { $eq: [{ $toLower: '$name' }, name] },
          })
          .exec();

        if (!device) {
          throw new Error(`Device ${name} not found in the database`);
        }

        return device;
      }),
    );
  }

  private calculateDevicePrices(
    devices: Device[],
  ): {
    total_selling_device: number;
    total_buying_device: number;
  } {
    let total_selling_device = 0;
    let total_buying_device = 0;

    for (const device of devices) {
      total_selling_device += Number(device.selling_price);
      total_buying_device += Number(device.buying_price);
    }

    return {
      total_selling_device,
      total_buying_device,
    };
  }

  private async getProducers(producerName: string): Promise<Supplier> {
    if (!producerName) return null;

    return await this.producerModel.findOne({
      $expr: { $eq: [{ $toLower: '$name' }, producerName] },
    });
  }

  private async getUnit(unitName: string): Promise<Unit> {
    if (!unitName) return null;

    return await this.unitModel.findOne({
      $expr: { $eq: [{ $toLower: '$name' }, unitName] },
    });
  }
}
