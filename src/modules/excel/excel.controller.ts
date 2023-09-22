import { Controller, Post, UploadedFile, UseInterceptors, Get, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ExcelService } from './excel.service';
import * as fs from 'fs';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';

@ApiTags('Excel')
@Controller('excel')
export class ExcelController {
  constructor(private excelService: ExcelService) { }

  @Post()
  @ApiOperation({ summary: 'Upload and process Excel file' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Excel file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response): Promise<void> {
    return this.excelService.createService(file, res);
  }

  @Get('download-file-example')
  @ApiOperation({ summary: 'Get file excel example' })
  async downloadExcel(@Res() res: Response): Promise<void> {
    const filePath = 'src/modules/excel/file/service-excel.xlsx';
    const fileName = 'example-excel.xlsx';

    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.set('Content-Disposition', `attachment; filename=${fileName}`);

    fs.createReadStream(filePath).pipe(res);
  }
}
