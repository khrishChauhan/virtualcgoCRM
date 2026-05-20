import { Router, Request, Response } from 'express';
import { verifyToken, allowRoles } from '../middleware/auth.middleware';
import { ApiResponse } from '../utils/ApiResponse';

/**
 * PROTECTED ROUTES DEMO
 * ─────────────────────
 * These routes demonstrate the RBAC middleware pattern.
 * In Phase 4, each resource (leads, tasks, users) will have its own router.
 *
 * Middleware chain pattern:
 *   verifyToken          → validates JWT, attaches req.user
 *   allowRoles(...)      → checks req.user.role against allowed list
 *   routeHandler         → executes business logic
 */
const protectedRouter = Router();

// ─── All authenticated users ─────────────────────────────────────────────────

/**
 * @route   GET /api/v1/protected/dashboard
 * @access  All roles
 */
protectedRouter.get(
  '/dashboard',
  verifyToken,
  (req: Request, res: Response) => {
    res.json(
      ApiResponse.success(
        { message: `Welcome ${req.user?.role}! You are authenticated.` },
        'Dashboard access granted'
      )
    );
  }
);

// ─── Sales Admin + Super Admin ────────────────────────────────────────────────

/**
 * @route   GET /api/v1/protected/leads
 * @access  SUPER_ADMIN, SALES_ADMIN
 */
protectedRouter.get(
  '/leads',
  verifyToken,
  allowRoles('SUPER_ADMIN', 'SALES_ADMIN'),
  (_req: Request, res: Response) => {
    res.json(
      ApiResponse.success(
        { message: 'Lead list will be returned here in Phase 4.' },
        'Leads access granted'
      )
    );
  }
);

// ─── Tech Admin + Super Admin ─────────────────────────────────────────────────

/**
 * @route   GET /api/v1/protected/tasks
 * @access  SUPER_ADMIN, TECH_ADMIN
 */
protectedRouter.get(
  '/tasks',
  verifyToken,
  allowRoles('SUPER_ADMIN', 'TECH_ADMIN'),
  (_req: Request, res: Response) => {
    res.json(
      ApiResponse.success(
        { message: 'Task management will be returned here in Phase 4.' },
        'Tasks access granted'
      )
    );
  }
);

// ─── Staff + Tech Admin + Super Admin ────────────────────────────────────────

/**
 * @route   GET /api/v1/protected/my-tasks
 * @access  SUPER_ADMIN, TECH_ADMIN, STAFF
 */
protectedRouter.get(
  '/my-tasks',
  verifyToken,
  allowRoles('SUPER_ADMIN', 'TECH_ADMIN', 'STAFF'),
  (req: Request, res: Response) => {
    res.json(
      ApiResponse.success(
        { message: `Tasks assigned to ${req.user?.email} will appear here.` },
        'My tasks access granted'
      )
    );
  }
);

// ─── Super Admin only ─────────────────────────────────────────────────────────

/**
 * @route   GET /api/v1/protected/admin
 * @access  SUPER_ADMIN only
 */
protectedRouter.get(
  '/admin',
  verifyToken,
  allowRoles('SUPER_ADMIN'),
  (_req: Request, res: Response) => {
    res.json(
      ApiResponse.success(
        { message: 'System-wide admin panel. All data accessible.' },
        'Super admin access granted'
      )
    );
  }
);

export default protectedRouter;
