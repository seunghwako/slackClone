import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { Channels } from 'src/entities/Channels';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      WorkspaceMembers,
      Workspaces,
      ChannelMembers,
      Channels,
    ]),
  ],
  providers: [WorkspacesService],
  controllers: [WorkspacesController],
})
export class WorkspacesModule {}
