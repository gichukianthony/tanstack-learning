
export const Role = {
    USER: 'user',
    ADMIN: 'admin',
    SUPERADMIN: 'superadmin',
    MECHANIC: 'mechanic',
}
export type Role = typeof Role[keyof typeof Role];