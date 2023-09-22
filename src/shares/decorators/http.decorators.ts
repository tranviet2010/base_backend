import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from '../enums/user.enum';
import { ClientAtGuards } from 'src/modules/auth/guards/client-at.guard';
import { ClientRolesGuard } from 'src/modules/auth/guards/client-roles.guard';
import { ClientRole } from '../enums/client.enum';
import { UserAtGuards } from 'src/modules/auth/guards/user-at.guard';
import { UserRolesGuard } from 'src/modules/auth/guards/user-roles.guard';

export const Roles = (roles: number[]): MethodDecorator & ClassDecorator => {
  const setMetaData = SetMetadata('roles', roles);
  return setMetaData;
};

export const ClientAuth = (clientRole?: ClientRole[]): MethodDecorator & ClassDecorator => {
  return applyDecorators(UseGuards(ClientAtGuards, ClientRolesGuard), Roles(clientRole));
};

export const UserAuth = (userRole?: UserRole[]): MethodDecorator & ClassDecorator => {
  return applyDecorators(UseGuards(UserAtGuards, UserRolesGuard), Roles(userRole));
};
