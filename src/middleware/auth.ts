import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { getOrCreateUser } from '../db/users.ts';
import { db } from '../db/index.ts';
import { roles } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
    [key: string]: any;
  };
  dbUser?: {
    id: number;
    uid: string;
    email: string;
    name: string;
    phone: string | null;
    roleId: number;
    disabled: boolean;
    role?: {
      id: number;
      name: string;
      permissions: string[];
    };
  };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    // Synchronize to PostgreSQL and get the dbUser
    const dbUserObj = await getOrCreateUser(decodedToken.uid, decodedToken.email || '', decodedToken.name || '');
    
    if (dbUserObj.disabled) {
      return res.status(403).json({ error: 'Your account has been disabled by an administrator.' });
    }

    // Fetch user's role and permissions
    const userRole = await db.select().from(roles).where(eq(roles.id, dbUserObj.roleId));
    
    req.dbUser = {
      ...dbUserObj,
      role: userRole.length > 0 ? {
        id: userRole[0].id,
        name: userRole[0].name,
        permissions: JSON.parse(userRole[0].permissions),
      } : undefined,
    };

    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

// Helper middleware to restrict access to specific roles
export const requireRoles = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.dbUser || !req.dbUser.role) {
      return res.status(403).json({ error: 'Forbidden: Role information missing' });
    }

    const userRoleName = req.dbUser.role.name;
    if (!allowedRoles.includes(userRoleName)) {
      return res.status(403).json({ 
        error: `Forbidden: This resource requires one of these roles: ${allowedRoles.join(', ')}. Current role: ${userRoleName}` 
      });
    }

    next();
  };
};
