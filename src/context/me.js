import { createContext, useContext } from 'react'

// The signed-in user as /auth/me returns it: id, email, role, isAdmin, company.
// Provided by ProtectedRoute, so it is set on every signed-in page.
export const MeContext = createContext(null)

export const useMe = () => useContext(MeContext)

export const isOwner = (me) => me?.role === 'owner'

// Same rule as the API: owners change any record, foremen only their own.
export const canEditRecord = (me, record) => isOwner(me) || record?.userId === me?.id

// Only same-site paths, so a crafted ?next= cannot send people elsewhere.
export const safeNextPath = (next) =>
  typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : null
