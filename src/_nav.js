import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilClipboard,
  cilDescription,
  cilFile,
  cilListRich,
  cilNotes,
  cilSpeedometer,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // {
  //   component: CNavItem,
  //   name: 'BẢNG ĐIỀU KHIỂN',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  // },

  {
    component: CNavGroup,
    name: 'THÔNG TIN QUẢN TRỊ',
    to: '/admin',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Thông tin admin',
        to: '/admin/ThongTinAdmin',
      },

      {
        component: CNavItem,
        name: 'Quản lý nhóm kinh doanh',
        to: '/admin/QuanLiPhongBan',
      },
      {
        component: CNavItem,
        name: 'Quản lý tài khoản admin',
        to: '/admin/QuanLiTaiKhoanAdmin',
      },
      // {
      //   component: CNavItem,
      //   name: 'Thêm quyền hạn',
      //   to: '/admin/ThemQuyenHan',
      // },
      {
        component: CNavItem,
        name: 'Lịch sử hoạt động admin',
        to: '/admin/LichSuHoatDong',
      },
    ],
  },

  {
    component: CNavItem,
    name: 'QUẢN LÝ KHÁCH HÀNG',
    to: '/dataTracking',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },

  // {
  //   component: CNavItem,
  //   name: 'MÔ TẢ CÔNG VIỆC',
  //   to: '/mo-ta-cong-viec',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'HƯỚNG DẪN CÔNG VIỆC',
  //   to: '/huong-dan',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'BIỂU MẪU',
  //   to: '/bieu-mau',
  //   icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'QUY ĐỊNH',
  //   to: '/quy-dinh',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'DANH MỤC',
  //   to: '/danh-muc',
  //   icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  // },

  // {
  //   component: CNavGroup,
  //   name: 'HỒ SƠ',
  //   to: '/ho-so',
  //   icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Sổ tay chất lượng',
  //       to: '/ho-so/so-tay-chat-luong',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Tài liệu ngoài',
  //       to: '/ho-so/tai-lieu-ngoai',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Chăm sóc khách hàng',
  //       to: '/ho-so/cham-soc-khach-hang',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Chính sách chất lượng',
  //       to: '/ho-so/chinh-sach-chat-luong',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Chứng nhận',
  //       to: '/ho-so/chung-nhan',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'danh-gia-chat-luong',
  //       to: '/ho-so/danh-gia-chat-luong',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Đánh giá lựa chọn nhà cung cấp',
  //       to: '/ho-so/danh-gia-nha-cung-cap',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Đánh giá nội bộ',
  //       to: '/ho-so/danh-gia-noi-bo',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Danh mục hồ sơ',
  //       to: '/ho-so/danh-muc-ho-so',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Danh mục tài liệu',
  //       to: '/ho-so/danh-muc-tai-lieu',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Đào tạo',
  //       to: '/ho-so/dao-tao',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Hồ sơ năng lực',
  //       to: '/ho-so/ho-so-nang-luc',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Khiếu nại khách hàng',
  //       to: '/ho-so/khieu-nai-khach-hang',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Kiểm định',
  //       to: '/ho-so/kiem-dinh',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Phân tích rủi ro',
  //       to: '/ho-so/phan-tich-rui-ro',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Sơ đồ tổ chức',
  //       to: '/ho-so/so-do-to-chuc',
  //     },
  //   ],
  // },

  ///////////////////////////////////////////////////////////////////////////////////////

  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav
