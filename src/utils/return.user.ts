export function extractUserFields(user) {
  return {
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    status: user.status,
    roles: user.roles,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
