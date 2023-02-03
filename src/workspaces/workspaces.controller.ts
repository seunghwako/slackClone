import { ApiTags } from '@nestjs/swagger';
/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Delete, Get, Post } from '@nestjs/common';

@ApiTags('Workspace')
@Controller('api/workspaces')
export class WorkspacesController {
  @Get()
  getMyWorkspaces() {}

  @Post()
  createWorkspaces() {}

  @Get(':url/members')
  getAllMembersFromWorkspace() {}

  @Post(':url/members')
  inviteMembersToWorkspace() {}

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @Get(':url/members/:id')
  getMemberInfoInWorkspace() {}
}
