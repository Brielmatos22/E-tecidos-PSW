export function hasPermission(user, permission) {
  return Boolean(user?.permissoes?.includes(permission));
}