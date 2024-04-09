/* eslint-disable */
import { JwtPayload } from '../../../../src/types/common.type';

export const mockUser: JwtPayload = {
  id: 'mocked-user-id',
  email: 'mocked-founder@example.com',
  type: 'FOUNDER', // User type is FOUNDER
};

export const sessionData = {
  name: 'mocked name',
  location: 'mocked location',
  sessionDate: '2022-01-01',
  sessionTime: '10:00',
  sessionDuration: '1 hour',

  sessionId: 'c5d57dec-1425-4272-ac09-4aebd7fb52ef',
  coach: 'Ceb',
  noofTeams: 3,
  maxPlayers: 30,
  maxperTeam: 10,
  sessionType: 'TOURNAMENT',
  teams: [
    { teamName: 'Team D', color: 'Red' },
    { teamName: 'Team E', color: 'Blue' },
  ],
  rates: [
    {
      packageName: '4 Session Tourney',
      cashRate: 250,
      onlineRate: 300,
      sessionCount: 1,
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    },
    {
      packageName: '5 Session Tourney',
      cashRate: 500,
      onlineRate: 550,
      sessionCount: 2,
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
    },
    {
      packageName: '6 Session Tourney',
      cashRate: 700,
      onlineRate: 750,
      sessionCount: 5,
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum`,
    },
  ],
};
