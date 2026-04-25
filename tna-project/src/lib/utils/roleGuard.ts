/**
 * RoleGuard utility
 * Validates if the current user has the required roles to access a resource.
 */
export function hasRole(userRole: string | null | undefined, allowedRoles: string[]): boolean {
    if (!userRole) return false;
    if (allowedRoles.length === 0) return true; // Open to everyone if no roles specified
    // Normalize to lowercase for comparison
    return allowedRoles.map(r => r.toLowerCase()).includes(userRole.toLowerCase());
}