import { User } from 'src/modules/user/interfaces/user.interface';

export interface IAuthorizedRequest extends Request {
  user?: User;
}
