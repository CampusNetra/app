-- Manual Fix for Channel Member Roles
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Set the Creator as 'owner' for each channel
UPDATE channel_members cm
JOIN channels c ON cm.channel_id = c.id
SET cm.role = 'owner'
WHERE cm.user_id = c.creator_id;

-- 2. Set all faculty and departmental admins as 'admin' in channels they belong to
UPDATE channel_members cm
JOIN users u ON cm.user_id = u.id
SET cm.role = 'admin'
WHERE u.role IN ('faculty', 'dept_admin', 'super_admin')
AND cm.role = 'member';

SET FOREIGN_KEY_CHECKS = 1;

-- Verification query
SELECT cm.id, u.name, u.role as user_role, c.name as channel_name, cm.role as member_role
FROM channel_members cm
JOIN users u ON cm.user_id = u.id
JOIN channels c ON cm.channel_id = c.id;
