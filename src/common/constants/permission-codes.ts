export const PERMISSION_CODES = {
  // Home
  HOME_VIEW: 'home:view',

  // Organization
  ORG_VIEW: 'org:view',
  ORG_COMPANY_VIEW: 'org:company:view',
  ORG_COMPANY_CREATE: 'org:company:create',
  ORG_COMPANY_UPDATE: 'org:company:update',
  ORG_BRANCH_VIEW: 'org:branch:view',
  ORG_BRANCH_CREATE: 'org:branch:create',
  ORG_BRANCH_UPDATE: 'org:branch:update',
  ORG_DEPARTMENT_VIEW: 'org:department:view',
  ORG_DEPARTMENT_CREATE: 'org:department:create',
  ORG_DEPARTMENT_UPDATE: 'org:department:update',
  ORG_PART_VIEW: 'org:part:view',
  ORG_PART_CREATE: 'org:part:create',
  ORG_PART_UPDATE: 'org:part:update',
  ORG_PART_MASTER_CREATE: 'org:part_master:create',
  ORG_PART_MASTER_UPDATE: 'org:part_master:update',
  ORG_PART_MASTER_VIEW: 'org:part_master:view',
  ORG_POSITION_VIEW: 'org:position:view',
  ORG_POSITION_CREATE: 'org:position:create',
  ORG_POSITION_UPDATE: 'org:position:update',
  ORG_POSITION_MASTER_CREATE: 'org:position_master:create',
  ORG_POSITION_MASTER_UPDATE: 'org:position_master:update',
  ORG_POSITION_MASTER_VIEW: 'org:position_master:view',

  // Human Resource
  HR_VIEW: 'hr:view',
  HR_EMPLOYEE_VIEW: 'hr:employee:view',
  HR_EMPLOYEE_CREATE: 'hr:employee:create',
  HR_EMPLOYEE_UPDATE: 'hr:employee:update',
  HR_CONTRACT_VIEW: 'hr:contract:view',
  HR_CONTRACT_TYPE_VIEW: 'hr:contract_type:view',
  HR_CONTRACT_TYPE_CREATE: 'hr:contract_type:create',
  HR_CONTRACT_TYPE_UPDATE: 'hr:contract_type:update',
  HR_CONTRACT_CREATE: 'hr:contract:create',
  HR_CONTRACT_UPDATE: 'hr:contract:update',
  HR_REVIEW_RENEWAL_VIEW: 'hr:review_renewal:view',
  HR_REVIEW_RENEWAL_CREATE: 'hr:review_renewal:create',
  HR_REVIEW_RENEWAL_UPDATE: 'hr:review_renewal:update',
  HR_TRANSFER_VIEW: 'hr:transfer:view',
  HR_TRANSFER_CREATE: 'hr:transfer:create',
  HR_TRANSFER_UPDATE: 'hr:transfer:update',

  // Operate Manager
  OPERATE_VIEW: 'operate:view',
  OPERATE_TIMEKEEPING_STANDARD_VIEW: 'operate:timekeeping_standard:view',
  OPERATE_TIMEKEEPING_STANDARD_CREATE: 'operate:timekeeping_standard:create',
  OPERATE_TIMEKEEPING_STANDARD_UPDATE: 'operate:timekeeping_standard:update',
  OPERATE_TIMEKEEPING_VIEW: 'operate:timekeeping:view',
  OPERATE_TIMEKEEPING_MANAGE: 'operate:timekeeping:manage',
  OPERATE_ATTENDANCE_COMPLAINT_VIEW: 'operate:attendance_complaint:view',
  OPERATE_OVERTIME_VIEW: 'operate:overtime:view',
  OPERATE_LEAVE_VIEW: 'operate:leave:view',
  OPERATE_DAY_OFF_CONFIG_VIEW: 'operate:day_off_config:view',
  OPERATE_DAY_OFF_CONFIG_CREATE: 'operate:day_off_config:create',
  OPERATE_DAY_OFF_CONFIG_UPDATE: 'operate:day_off_config:update',
  OPERATE_PUBLIC_HOLIDAY_VIEW: 'operate:public_holiday:view',
  OPERATE_PUBLIC_HOLIDAY_CREATE: 'operate:public_holiday:create',
  OPERATE_PUBLIC_HOLIDAY_UPDATE: 'operate:public_holiday:update',
  OPERATE_LEAVE_ALLOCATION_VIEW: 'operate:leave_allocation:view',
  OPERATE_SHIFT_VIEW: 'operate:shift:view',
  OPERATE_SHIFT_CREATE: 'operate:shift:create',
  OPERATE_SHIFT_UPDATE: 'operate:shift:update',
  OPERATE_WORK_SCHEDULE_CREATE: 'operate:work_schedule:create',
  OPERATE_WORK_SCHEDULE_UPDATE: 'operate:work_schedule:update',
  OPERATE_WORK_SCHEDULE_VIEW: 'operate:work_schedule:view',

  // Payroll
  PAYROLL_VIEW: 'payroll:view',
  PAYROLL_SALARY_VIEW: 'payroll:salary:view',
  PAYROLL_SALARY_CREATE: 'payroll:salary:create',
  PAYROLL_SALARY_UPDATE: 'payroll:salary:update',
  PAYROLL_ALLOWANCE_VIEW: 'payroll:allowance:view',
  PAYROLL_ADVANCE_VIEW: 'payroll:advance:view',
  PAYROLL_ADJUSTMENT_VIEW: 'payroll:adjustment:view',
  PAYROLL_CONFIG_VIEW: 'payroll:config:view',
  PAYROLL_CONFIG_CREATE: 'payroll:config:create',
  PAYROLL_CONFIG_UPDATE: 'payroll:config:update',

  // Recruitment
  RECRUITMENT_VIEW: 'recruitment:view',
  RECRUITMENT_HEADCOUNT_VIEW: 'recruitment:headcount:view',
  RECRUITMENT_SOURCE_VIEW: 'recruitment:source:view',
  RECRUITMENT_SOURCE_MANAGE: 'recruitment:source:manage',
  RECRUITMENT_CRITERIA_VIEW: 'recruitment:criteria:view',
  RECRUITMENT_CRITERIA_MANAGE: 'recruitment:criteria:manage',
  RECRUITMENT_JD_VIEW: 'recruitment:jd:view',
  RECRUITMENT_JD_CREATE: 'recruitment:jd:create',
  RECRUITMENT_JD_UPDATE: 'recruitment:jd:update',
  RECRUITMENT_REQUEST_VIEW: 'recruitment:request:view',
  RECRUITMENT_REQUEST_CREATE: 'recruitment:request:create',
  RECRUITMENT_REQUEST_UPDATE: 'recruitment:request:update',
  RECRUITMENT_PLAN_VIEW: 'recruitment:plan:view',
  RECRUITMENT_PLAN_CREATE: 'recruitment:plan:create',
  RECRUITMENT_PLAN_UPDATE: 'recruitment:plan:update',
  RECRUITMENT_PIPELINE_VIEW: 'recruitment:pipeline:view',
  RECRUITMENT_CANDIDATE_VIEW: 'recruitment:candidate:view',
  RECRUITMENT_CANDIDATE_CREATE: 'recruitment:candidate:create',
  RECRUITMENT_CANDIDATE_UPDATE: 'recruitment:candidate:update',
  RECRUITMENT_INTERVIEW_VIEW: 'recruitment:interview:view',

  // Discipline
  DISCIPLINE_VIEW: 'discipline:view',
  DISCIPLINE_TYPE_VIEW: 'discipline:type:view',
  DISCIPLINE_TYPE_MANAGE: 'discipline:type:manage',
  DISCIPLINE_VIOLATION_VIEW: 'discipline:violation:view',
  DISCIPLINE_VIOLATION_CREATE: 'discipline:violation:create',
  DISCIPLINE_VIOLATION_UPDATE: 'discipline:violation:update',

  // Performance
  PERFORMANCE_VIEW: 'performance:view',
  PERFORMANCE_COMPETENCY_VIEW: 'performance:competency:view',
  PERFORMANCE_COMPETENCY_MANAGE: 'performance:competency:manage',
  PERFORMANCE_CYCLE_VIEW: 'performance:cycle:view',
  PERFORMANCE_CYCLE_CREATE: 'performance:cycle:create',
  PERFORMANCE_CYCLE_UPDATE: 'performance:cycle:update',
  PERFORMANCE_GOAL_VIEW: 'performance:goal:view',
  PERFORMANCE_GOAL_MANAGE: 'performance:goal:manage',
  PERFORMANCE_RESULT_VIEW: 'performance:result:view',
  PERFORMANCE_RESULT_MANAGE: 'performance:result:manage',
  PERFORMANCE_360_VIEW: 'performance:360:view',
  PERFORMANCE_360_MANAGE: 'performance:360:manage',

  // Training
  TRAINING_VIEW: 'training:view',
  TRAINING_COURSE_VIEW: 'training:course:view',
  TRAINING_COURSE_CREATE: 'training:course:create',
  TRAINING_COURSE_UPDATE: 'training:course:update',
  TRAINING_ENROLLMENT_VIEW: 'training:enrollment:view',
  TRAINING_ENROLLMENT_MANAGE: 'training:enrollment:manage',
  TRAINING_RESULT_VIEW: 'training:result:view',
  TRAINING_RESULT_MANAGE: 'training:result:manage',

  // Asset
  ASSET_VIEW: 'asset:view',
  ASSET_INVENTORY_VIEW: 'asset:inventory:view',
  ASSET_INVENTORY_MANAGE: 'asset:inventory:manage',
  ASSET_INVENTORY_CREATE: 'asset:inventory:create',
  ASSET_INVENTORY_UPDATE: 'asset:inventory:update',
  ASSET_MANAGE: 'asset:manage',

  // Workflow
  WORKFLOW_VIEW: 'workflow:view',
  WORKFLOW_INBOX: 'workflow:inbox',
  WORKFLOW_MANAGE: 'workflow:manage',

  // Roles & Security
  ROLE_VIEW: 'role:view',
  USER_VIEW: 'user:view',
  ROLE_MANAGE: 'role:manage',

  // System Settings
  SYSTEM_SETTINGS_VIEW: 'system_settings:view',
  ACTION_LOG_VIEW: 'action_log:view',
  SYSTEM_SETTINGS_MANAGE: 'system_settings:manage',

  // Integrations
  INTEGRATIONS_VIEW: 'integrations:view',

  // Reports
  COMPLIANCE_VIEW: 'compliance:view',
  REPORT_SCHEDULE_VIEW: 'report_schedule:view',
  REPORT_SCHEDULE_MANAGE: 'report_schedule:manage',
} as const;

export type PermissionCode = (typeof PERMISSION_CODES)[keyof typeof PERMISSION_CODES];
