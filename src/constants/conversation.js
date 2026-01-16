const ConversationRoles = Object.freeze({
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
});

export const ALL_CONVERSATION_ROLES = Object.values(ConversationRoles);
export const DEFAULT_CONVERSATION_ROLE = ConversationRoles.MEMBER;
export const MANAGE_PARTICIPANT_ROLES = [
  ConversationRoles.OWNER,
  ConversationRoles.ADMIN,
];
export const CONVERSATION_ROLES = ConversationRoles;
export const ADD_PARTICIPANT_PERMISSION = {
  [CONVERSATION_ROLES.OWNER]: [
    CONVERSATION_ROLES.ADMIN,
    CONVERSATION_ROLES.MEMBER,
  ],
  [CONVERSATION_ROLES.ADMIN]: [
    CONVERSATION_ROLES.MEMBER,
  ],
  [CONVERSATION_ROLES.MEMBER]: [],
};
export const CONVERSATION_TYPES = ['group', 'direct'];
