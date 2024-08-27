import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './services/project.service';
import { MdaModule } from '../mda/mda.module';
import { AuthModule } from '../auth/auth.module';
import { UserSchema } from '../user/schemas/user.schema';
import { MdaSchema } from '../mda/schemas/mda.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './schemas/project.schema';
import { MiscClass } from 'src/common/services/misc.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Project', schema: ProjectSchema },
      { name: 'Mda', schema: MdaSchema },
      { name: 'User', schema: UserSchema },
    ]),
    MdaModule,
    AuthModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, MiscClass],
})
export class ProjectModule {}
