import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// TAB QUẢN TRỊ

const AdminInfo = React.lazy(() => import('./views/admin/AdminInfo'))
const AdminGroup = React.lazy(() => import('./views/admin/AdminGroup'))
const AdminList = React.lazy(() => import('./views/admin/AdminList'))
const AdminLog = React.lazy(() => import('./views/admin/AdminLog'))

// permission group
const PermissionGroup = React.lazy(() => import('./views/admin/PermissionGroup'))
const EditPermission = React.lazy(() => import('./views/admin/EditPermissions'))

// process tab
const ProcessList = React.lazy(() => import('./views/process/ProcessList'))

// deparment category
const DepartmentCategory = React.lazy(() => import('./views/department/DepartmentCategory.js'))
// customer tab

const routes = [
  { path: '/', exact: true, name: 'Home', elements: ProcessList },

  // { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },

  { path: '/admin', name: 'Admin', element: AdminInfo, exact: true },
  { path: '/admin/ThongTinAdmin', name: 'AdminInfo', element: AdminInfo },
  {
    path: '/admin/QuanLiPhongBan',
    name: 'Procress List',
    element: DepartmentCategory,
    exact: true,
  },
  { path: '/admin/QuanLiNhomAdmin', name: 'AdminGroup', element: AdminGroup },
  { path: '/admin/QuanLiTaiKhoanAdmin', name: 'AdminList', element: AdminList },
  { path: '/admin/LichSuHoatDong', name: 'AdminLog', element: AdminLog },

  {
    path: '/admin/ThemQuyenHan',
    name: 'PermissionGroup',
    element: PermissionGroup,
    exact: true,
  },

  {
    path: '/admin/groups/edit',
    name: 'EditPermission',
    element: EditPermission,
    exact: true,
  },

  { path: '/dataTracking', name: 'Procress List', element: ProcessList, exact: true },
]

export default routes
