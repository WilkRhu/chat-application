export function extractUserFields(user) {
  return {
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    status: user.status,
    role: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
