export type ParticipantStatus = 'accepted' | 'declined' | 'tentative' | 'needsAction';
export type ParticipantRole = 'organizer' | 'required' | 'optional' | 'resource';

export interface Participant {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  status: ParticipantStatus;
  role: ParticipantRole;
  isOrganizer?: boolean;
  comment?: string;
}

export interface ResourceParticipant {
  id: string;
  name: string;
  type: 'room' | 'equipment';
  capacity?: number;
  building?: string;
  floor?: string;
  status: ParticipantStatus;
}
