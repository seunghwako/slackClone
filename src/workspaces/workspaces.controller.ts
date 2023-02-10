import { ApiTags } from '@nestjs/swagger';
/* eslint-disable @typescript-eslint/no-empty-function */
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/common/decorator/user.decorator';
import { Users } from 'src/entities/Users';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDTO } from './dto/create-workspace.dto';

@ApiTags('Workspace')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Get()
  getMyWorkspaces(@User() user: Users) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  @Post()
  createWorkspaces(@User() user: Users, @Body() body: CreateWorkspaceDTO) {
    return this.workspacesService.createWorkspace(
      body.workspace,
      body.url,
      user.id,
    );
  }

  @Get(':url/members')
  getAllMembersFromWorkspace(@Param('url') url: string) {
    return this.workspacesService.getWorkspaceMembers(url);
  }

  @Post(':url/members')
  inviteMembersToWorkspace() {}

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @Get(':url/members/:id')
  getMemberInfoInWorkspace() {}
}
