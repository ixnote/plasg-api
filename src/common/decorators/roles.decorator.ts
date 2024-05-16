import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../constants/enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);