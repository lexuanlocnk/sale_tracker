import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CRow,
  CFormSelect,
  CTable,
  CFormCheck,
  CSpinner,
} from '@coreui/react'
import './css/adminList.css'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import DeletedModal from '../../components/deletedModal/DeletedModal'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { axiosClient, imageBaseUrl } from '../../axiosConfig'
import moment from 'moment/moment'
import { toast } from 'react-toastify'

function AdminList() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  const [dataRole, setDataRole] = useState([])
  const [adminListData, setAdminListData] = useState([])
  const [pagination, setPagination] = useState({})
  const [roleChoosen, setRoleChoosen] = useState('')
  const [departmentChoosen, setDepartmentChoosene] = useState('')

  // loading button
  const [isLoadingButton, setIsLoadingButton] = useState(false)

  // selected checkbox
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const [isCollapse, setIsCollapse] = useState(false)

  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // upload image and show image
  const [selectedFile, setSelectedFile] = useState('')
  const [file, setFile] = useState([])

  // form formik value
  const initialValues = {
    username: '',
    password: '',
    email: '',
    displayName: '',
    role: '',
    groups: '',
  }

  const validationSchema = Yup.object({
    username: Yup.string().required('Tên đăng nhập là bắt buộc.'),
    // password: Yup.string().required('Mật khẩu là bắt buộc.'),
    email: Yup.string().email('Địa chỉ email không hợp lệ.').required('Email là bắt buộc.'),
    displayName: Yup.string().required('Tên hiển thị là bắt buộc.'),
  })

  useEffect(() => {
    if (sub === 'add') {
      setIsEditing(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } else if (sub === 'edit' && id) {
      setIsEditing(true)
    }
  }, [location.search])

  const fetchDataById = async (setValues) => {
    try {
      const response = await axiosClient.get(`/admin/${id}`)
      const data = response.data.admin_detail

      if (data && response.data.status === true) {
        setValues({
          username: data.username,
          email: data.email,
          displayName: data.display_name,
          role: data?.is_manager,
          groups: data?.business_group_id,
        })
        setSelectedFile(data.avatar)
      } else {
        console.error('No data found for the given ID.')
      }
    } catch (error) {
      console.error('Fetch data id admin is error', error.message)
    }
  }

  const fetchDataGroups = async () => {
    try {
      const response = await axiosClient.get(`/group`)

      if (response.data && response.data.status === true) {
        setDataRole(response.data.data)
      }
    } catch (error) {
      console.error('Fetch role adminstrator data is error', error)
    }
  }

  useEffect(() => {
    fetchDataGroups()
  }, [])

  const fetchAdminListData = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(
        `/admin?data=${dataSearch}&page=${pageNumber}&group_id=${roleChoosen}`,
      )

      if (response.data && response.data.status === true) {
        setAdminListData(response.data.data)
        setPagination(response.data.pagination)
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch admin list data is error', error)
    }
  }

  useEffect(() => {
    fetchAdminListData()
  }, [pageNumber, roleChoosen])

  const handleSubmit = async (values, { resetForm }) => {
    if (isEditing) {
      //call api update data
      try {
        setIsLoadingButton(true)
        const response = await axiosClient.put(`/admin/${id}`, {
          username: values.username,
          password: values.password,
          email: values.email,
          display_name: values.displayName,
          is_manager: values.role,
          business_group_id: values.groups,
        })
        if (response.data.status === true) {
          toast.success('Cập nhật thông tin admin thành công!')
          resetForm()
          fetchAdminListData()
          navigate('/admin/QuanLiTaiKhoanAdmin')
        }

        if (response.data.status === false && response.data.mess == 'no permission') {
          toast.warn('Bạn không có quyền thực hiện tác vụ này!')
        }
      } catch (error) {
        console.error('Put data admin is error', error)
      } finally {
        setIsLoadingButton(false)
      }
    } else {
      //call api post new data
      try {
        setIsLoadingButton(true)
        const response = await axiosClient.post('/admin', {
          username: values.username,
          password: values.password,
          email: values.email,
          display_name: values.displayName,
          is_manager: values.role,
          business_group_id: values.groups,
        })

        if (response.data.status === true) {
          toast.success('Thêm mới thông tin admin thành công!')
          resetForm()
          navigate('/admin/QuanLiTaiKhoanAdmin?sub=add')
          fetchAdminListData()
        }

        if (response.data.status === false && response.data.mess == 'no permission') {
          toast.warn('Bạn không có quyền thực hiện tác vụ này!')
        }
      } catch (error) {
        console.error('Post data admin is error', error)
      } finally {
        setIsLoadingButton(false)
      }
    }
  }

  const handleAddNewClick = () => {
    navigate('/admin/QuanLiTaiKhoanAdmin?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/admin/QuanLiTaiKhoanAdmin?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`/admin/information/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchAdminListData()
      }
    } catch (error) {
      console.error('Delete admin id is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  // search Data
  const handleSearch = (keyword) => {
    fetchAdminListData(keyword)
  }

  const handleDeleteAll = async () => {
    // alert('Chức năng đang thực hiện...')

    try {
      const response = await axiosClient.post(`/profile/delete`, {
        ids: selectedCheckbox,
        _method: 'DELETE',
      })

      if (response.data.status === true) {
        toast.success('Xóa các mục đã chọn thành công!')
        fetchAdminListData()
        setSelectedCheckbox([])
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    }
  }

  //set img avatar
  function onFileChange(e) {
    const files = e.target.files
    const selectedFiles = []
    const fileUrls = []

    Array.from(files).forEach((file) => {
      // Create a URL for the file
      fileUrls.push(URL.createObjectURL(file))

      // Read the file as base64
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = (event) => {
        selectedFiles.push(event.target.result)
        // Set base64 data after all files have been read
        if (selectedFiles.length === files.length) {
          setSelectedFile(selectedFiles)
        }
      }
    })

    // Set file URLs for immediate preview
    setFile(fileUrls)
  }

  // pagination data
  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1
    if (newPage < 2) {
      setPageNumber(newPage)
      window.scrollTo(0, 0)
      return
    }
    window.scrollTo(0, 0)
    setPageNumber(newPage)
  }

  const items =
    adminListData && adminListData?.length > 0
      ? adminListData.map((item) => ({
          id: (
            <CFormCheck
              id={item.id}
              checked={selectedCheckbox.includes(item.id)}
              value={item.id}
              onChange={(e) => {
                const idx = item.id
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox([...selectedCheckbox, idx])
                } else {
                  setSelectedCheckbox(selectedCheckbox.filter((id) => id !== idx))
                }
              }}
            />
          ),
          username: <div className="blue-txt">{item.username}</div>,
          displayName: item.display_name,
          group: item.business_group_name,
          actions: (
            <div>
              <button
                onClick={() => handleEditClick(item.id)}
                className="button-action mr-2 bg-info"
              >
                <CIcon icon={cilColorBorder} className="text-white" />
              </button>
              <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(item?.id)
                }}
                className="button-action bg-danger"
              >
                <CIcon icon={cilTrash} className="text-white" />
              </button>
            </div>
          ),
          _cellProps: { id: { scope: 'row' } },
        }))
      : []

  const columns = [
    {
      key: 'id',
      label: (
        <CFormCheck
          aria-label="Select all"
          checked={isAllCheckbox}
          onChange={(e) => {
            const isChecked = e.target.checked
            setIsAllCheckbox(isChecked)
            if (isChecked) {
              const allIds = adminListData?.data.map((item) => item.id) || []
              setSelectedCheckbox(allIds)
            } else {
              setSelectedCheckbox([])
            }
          }}
        />
      ),
      _props: { scope: 'col' },
    },
    {
      key: 'username',
      label: 'Tên đăng nhập',
      _props: { scope: 'col' },
    },
    {
      key: 'displayName',
      label: 'Tên hiển thị',
      _props: { scope: 'col' },
    },
    {
      key: 'group',
      label: 'Nhóm kinh doanh',
      _props: { scope: 'col' },
    },
    // {
    //   key: 'visited',
    //   label: 'Đăng nhập gần đây',
    //   _props: { scope: 'col' },
    // },
    {
      key: 'actions',
      label: 'Tác vụ',
      _props: { scope: 'col' },
    },
  ]

  return (
    <CContainer>
      {!isPermissionCheck ? (
        <h5>
          <div>Bạn không đủ quyền để thao tác trên danh mục quản trị này.</div>
          <div className="mt-4">
            Vui lòng quay lại trang chủ <Link to={'/dashboard'}>(Nhấn vào để quay lại)</Link>
          </div>
        </h5>
      ) : (
        <>
          <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />
          <CRow className="mb-3">
            <CCol md={6}>
              <h2>QUẢN LÝ TÀI KHOẢN AMDIN</h2>
            </CCol>
            <CCol md={6}>
              <div className="d-flex justify-content-end">
                <CButton
                  onClick={handleAddNewClick}
                  color="primary"
                  type="submit"
                  size="sm"
                  className="button-add"
                >
                  Thêm mới
                </CButton>
                <CButton color="primary" type="submit" size="sm">
                  Danh sách
                </CButton>
              </div>
            </CCol>
          </CRow>

          <CRow>
            {/* Form add/ edit */}
            <CCol md={4}>
              <h6>{!isEditing ? 'Thêm admin mới' : 'Cập nhật tài khoản admin'}</h6>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, setValues }) => {
                  useEffect(() => {
                    fetchDataById(setValues)
                  }, [setValues, id])
                  return (
                    <Form>
                      <CCol md={12}>
                        <label htmlFor="username-input">Tên đăng nhập</label>
                        <Field name="username">
                          {({ field }) => (
                            <CFormInput {...field} type="text" id="username-input" ref={inputRef} />
                          )}
                        </Field>
                        <ErrorMessage name="username" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="password-input">Mật khẩu</label>
                        <Field
                          name="password"
                          type="password"
                          as={CFormInput}
                          id="password-input"
                        />
                        <ErrorMessage name="password" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="email-input">Thư điện tử</label>
                        <Field name="email" type="email" as={CFormInput} id="email-input" />
                        <ErrorMessage name="email" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="display-name-input">Tên hiển thị</label>
                        <Field
                          name="displayName"
                          type="text"
                          as={CFormInput}
                          id="display-name-input"
                        />
                        <ErrorMessage name="displayName" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="role-select">Chức vụ</label>
                        <Field
                          name="role"
                          as={CFormSelect}
                          id="role-select"
                          options={[
                            { label: 'Chọn chức vụ', value: '', disabled: true },
                            { label: 'Trưởng nhóm', value: 1 },
                            { label: 'Nhân viên', value: 0 },
                          ]}
                        />
                        <ErrorMessage name="role" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="groups-select">Nhóm kinh doanh</label>
                        <Field
                          name="groups"
                          as={CFormSelect}
                          id="groups-select"
                          options={[
                            { label: 'Chọn chức vụ', value: '', disabled: true },
                            ...(Array.isArray(dataRole) && dataRole.length > 0
                              ? dataRole.map((role) => ({
                                  label: role.name,
                                  value: role.id,
                                }))
                              : []),
                          ]}
                        />
                        <ErrorMessage name="groups" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol xs={12}>
                        <CButton color="primary" type="submit" size="sm" disabled={isLoadingButton}>
                          {isLoadingButton ? (
                            <>
                              <CSpinner size="sm"></CSpinner> Đang cập nhật...
                            </>
                          ) : isEditing ? (
                            'Cập nhật'
                          ) : (
                            'Thêm mới'
                          )}
                        </CButton>
                      </CCol>
                    </Form>
                  )
                }}
              </Formik>
            </CCol>

            {/* search, table view */}
            <CCol md={8}>
              <CRow>
                <table className="filter-table">
                  <thead>
                    <tr>
                      <th colSpan="2">
                        <div className="d-flex justify-content-between">
                          <span>Bộ lọc tìm kiếm</span>
                          <span className="toggle-pointer" onClick={handleToggleCollapse}>
                            {isCollapse ? '▼' : '▲'}
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  {!isCollapse && (
                    <tbody>
                      <tr>
                        <td>Tổng cộng</td>
                        <td className="total-count">{pagination?.total}</td>
                      </tr>
                      <tr>
                        <td>Lọc</td>
                        <td>
                          <CFormSelect
                            className="component-size w-50"
                            aria-label="Chọn yêu cầu lọc"
                            options={[
                              { label: 'Tất cả', value: '' },
                              ...(Array.isArray(dataRole) && dataRole.length > 0
                                ? dataRole.map((role) => ({ label: role.name, value: role.id }))
                                : []),
                            ]}
                            value={roleChoosen}
                            onChange={(e) => setRoleChoosen(e.target.value)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Tìm kiếm</td>
                        <td>
                          <input
                            type="text"
                            className="search-input"
                            value={dataSearch}
                            onChange={(e) => setDataSearch(e.target.value)}
                          />
                          <button onClick={() => handleSearch(dataSearch)} className="submit-btn">
                            Submit
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </CRow>
              <CRow>
                <CCol className="my-2" md={4}>
                  <CButton color="primary" size="sm" onClick={handleDeleteAll}>
                    Xóa vĩnh viễn
                  </CButton>
                </CCol>
              </CRow>
              <CRow>
                <CTable className="mt-2" columns={columns} items={items} />
                <div className="d-flex justify-content-end">
                  <ReactPaginate
                    pageCount={Math.ceil(pagination?.total / pagination?.per_page)}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    onPageChange={handlePageChange}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                    previousLabel={'<<'}
                    nextLabel={'>>'}
                  />
                </div>
              </CRow>
            </CCol>
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default AdminList
