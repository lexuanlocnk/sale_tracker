import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormTextarea,
  CRow,
  CSpinner,
  CTable,
} from '@coreui/react'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Search from '../../components/search/Search'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import ReactPaginate from 'react-paginate'
import DeletedModal from '../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'
import { axiosClient } from '../../axiosConfig'

function DepartmentCategory() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  // loading button
  const [isLoading, setIsLoading] = useState(false)

  const [dataNewsCategory, setDataNewsCategroy] = useState([])
  const [countNewsCategory, setCountNewsCategory] = useState(null)

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // checkbox selected
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  const initialValues = {
    title: '',
    description: '',
  }

  const [formValues, setFormValues] = useState(initialValues)

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc.'),
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

  const fetchDataNewsCategory = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(`group?data=${dataSearch}&page=${pageNumber}`)
      if (response.data && response.data.status === true) {
        setDataNewsCategroy(response.data.data)
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch data product brand is error', error)
    }
  }

  useEffect(() => {
    fetchDataNewsCategory()
  }, [pageNumber])

  const fetchDataById = async () => {
    try {
      const response = await axiosClient.get(`group/${id}`)
      const data = response.data.data
      if (data) {
        setFormValues({
          title: data?.name,
          description: data?.description,
        })
      } else {
        console.error('No data found for the given ID.')
      }

      if (
        sub == 'edit' &&
        response.data.status === false &&
        response.data.mess == 'no permission'
      ) {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Fetch data id news category is error', error.message)
    }
  }

  useEffect(() => {
    fetchDataById()
  }, [id])

  const handleSubmit = async (values, { resetForm }) => {
    if (isEditing) {
      //call api update data
      try {
        setIsLoading(true)
        const response = await axiosClient.put(`admin/news-category/${id}`, {
          cat_name: values.title,
          description: values.description,
          friendly_url: values.friendlyUrl,
          friendly_title: values.pageTitle,
          metakey: values.metaKeyword,
          metadesc: values.metaDesc,
          display: values.visible,
        })
        if (response.data.status === true) {
          toast.success('Cập nhật danh mục thành công')
          resetForm()
          navigate('/news/category')
          setIsEditing(false)
          fetchDataNewsCategory()
        } else {
          console.error('No data found for the given ID.')
        }

        if (response.data.status === false && response.data.mess == 'no permission') {
          toast.warn('Bạn không có quyền thực hiện tác vụ này!')
        }
      } catch (error) {
        console.error('Put data id news category is error', error.message)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      } finally {
        setIsLoading(false)
      }
    } else {
      //call api post new data
      try {
        setIsLoading(true)
        const response = await axiosClient.post('admin/news-category', {
          cat_name: values.title,
          description: values.description,
          friendly_url: values.friendlyUrl,
          friendly_title: values.pageTitle,
          metakey: values.metaKeyword,
          metadesc: values.metaDesc,
          display: values.visible,
        })

        if (response.data.status === true) {
          toast.success('Thêm mới danh mục thành công!')
          resetForm()
          navigate('/news/category?sub=add')
          fetchDataNewsCategory()
        }

        if (response.data.status === false && response.data.mess == 'no permission') {
          toast.warn('Bạn không có quyền thực hiện tác vụ này!')
        }
      } catch (error) {
        console.error('Post data news category is error', error)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleAddNewClick = () => {
    navigate('/admin/QuanLiPhongBan?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/admin/QuanLiPhongBan?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`admin/news-category/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchDataNewsCategory()
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Delete brand id is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
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

  // search Data
  const handleSearch = (keyword) => {
    fetchDataNewsCategory(keyword)
  }
  const handleDeleteAll = async () => {
    try {
      const response = await axiosClient.post(`admin/delete-all-news-category`, {
        data: selectedCheckbox,
      })

      if (response.data.status === true) {
        toast.success('Xóa tất cả danh mục thành công!')
        fetchDataNewsCategory()
        setSelectedCheckbox([])
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    }
  }

  const items =
    dataNewsCategory && dataNewsCategory?.length > 0
      ? dataNewsCategory.map((item) => ({
          id: (
            <CFormCheck
              key={item?.id}
              aria-label="Default select example"
              defaultChecked={item?.id}
              id={`flexCheckDefault_${item?.id}`}
              value={item?.id}
              checked={selectedCheckbox.includes(item?.id)}
              onChange={(e) => {
                const categoriesId = item?.id
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox([...selectedCheckbox, categoriesId])
                } else {
                  setSelectedCheckbox(selectedCheckbox.filter((id) => id !== categoriesId))
                }
              }}
            />
          ),
          title: item?.name,
          manageBy: item?.manager_name,
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
                  setDeletedId(item.id)
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
              const allIds = dataNewsCategory?.map((item) => item.id) || []
              setSelectedCheckbox(allIds)
            } else {
              setSelectedCheckbox([])
            }
          }}
        />
      ),
    },
    {
      key: 'title',
      label: 'Tiêu đề',
      _props: { scope: 'col' },
    },

    {
      key: 'manageBy',
      label: 'Trưởng nhóm',
      _props: { scope: 'col' },
    },
    {
      key: 'actions',
      label: 'Tác vụ',
      _props: { scope: 'col' },
    },
  ]

  return (
    <CContainer>
      <>
        <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />
        <CRow className="mb-3">
          <CCol md={6}>
            <h3>QUẢN LÝ NHÓM KINH DOANH</h3>
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
              <Link to={'/product/brand'}>
                <CButton color="primary" type="submit" size="sm">
                  Danh sách
                </CButton>
              </Link>
            </div>
          </CCol>
        </CRow>

        <CRow>
          <CCol md={4}>
            <h6>{!isEditing ? 'Thêm danh mục mới' : 'Cập nhật danh mục'}</h6>
            <Formik
              initialValues={formValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ setFieldValue }) => {
                return (
                  <Form>
                    <CCol md={12}>
                      <label htmlFor="title-input">Tiêu đề </label>
                      <Field name="title">
                        {({ field }) => (
                          <CFormInput
                            {...field}
                            type="text"
                            id="title-input"
                            ref={inputRef}
                            text="Tên riêng sẽ hiển thị lên trang web của bạn."
                          />
                        )}
                      </Field>
                      <ErrorMessage name="title" component="div" className="text-danger" />
                    </CCol>
                    <br />

                    <CCol md={12}>
                      <label htmlFor="desc-input">Mô tả</label>
                      <Field
                        style={{ height: '100px' }}
                        name="description"
                        type="text"
                        as={CFormTextarea}
                        id="desc-input"
                        text="Mô tả bình thường không được sử dụng trong giao diện, tuy nhiên có vài giao diện hiện thị mô tả này."
                      />
                      <ErrorMessage name="description" component="div" className="text-danger" />
                    </CCol>
                    <br />

                    <CCol xs={12}>
                      <CButton color="primary" type="submit" size="sm" disabled={isLoading}>
                        {isLoading ? (
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

          <CCol>
            <Search count={dataNewsCategory?.length} onSearchData={handleSearch} />
            <CCol md={12} className="mt-3">
              <CButton onClick={handleDeleteAll} color="primary" size="sm">
                Xóa vĩnh viễn
              </CButton>
            </CCol>
            <CTable className="mt-2" columns={columns} items={items} />

            <div className="d-flex justify-content-end">
              <ReactPaginate
                pageCount={Math.ceil(dataNewsCategory?.length / 15)}
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
          </CCol>
        </CRow>
      </>
    </CContainer>
  )
}

export default DepartmentCategory
