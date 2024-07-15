import * as mongoose from 'mongoose';
import { Team } from './team.interface';
import { Director } from './director.interface';
import { Contact } from './contact.interface';
import { About } from './about.interface';
import { Hero } from './hero.interface';

export interface Mda extends mongoose.Document {
  name: string;
  admin: mongoose.Types.ObjectId;
  is_suspended: boolean;
  is_deleted: boolean;
  team: Team[];
  director: Director;
  contact: Contact;
  about: About;
  hero: Hero,
  readonly createdAt: Date;
  updatedAt: Date;
}
