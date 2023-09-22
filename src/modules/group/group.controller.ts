import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupService } from './group.service';
import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Group } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { GetGroupDto } from './dto/get-group.dto';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  @ApiOperation({ summary: 'Get all group' })
  async findGroup(@Query() query: GetGroupDto): Promise<ResPagingDto<Group[]>> {
    return this.groupService.findGroup(query);
  }

  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @Post()
  @ApiOperation({ summary: '[ ADMIN ] create group ' })
  async createGroup(@Body() body: CreateGroupDto): Promise<void> {
    await this.groupService.createServiceGroup(body);
  }

  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @Patch('/:id')
  @ApiOperation({ summary: '[ ADMIN ] update group by id' })
  async updateGroup(@Param() param: IdDto, @Body() body: UpdateGroupDto): Promise<void> {
    await this.groupService.updateServiceGroup(param.id, body);
  }

  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @Delete('/:id')
  @ApiOperation({ summary: '[ ADMIN ] delete group by id' })
  async deleteGroup(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.groupService.deleteServiceGroup(param.id, userId);
  }
}
