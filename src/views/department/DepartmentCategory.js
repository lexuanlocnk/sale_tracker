import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormSelect,
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
    friendlyUrl: '',
    pageTitle: '',
    metaKeyword: '',
    metaDesc: '',
    visible: 0,
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc.'),
    friendlyUrl: Yup.string().required('Chuỗi đường dẫn là bắt buộc.'),
    pageTitle: Yup.string().required('Tiêu đề bài viết là bắt buộc.'),
    metaKeyword: Yup.string().required('Meta keywords là bắt buộc.'),
    metaDesc: Yup.string().required('Meta description là bắt buộc.'),
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
      const response = await axiosClient.get(
        `admin/news-category?data=${dataSearch}&page=${pageNumber}`,
      )
      if (response.data.status === true) {
        setDataNewsCategroy(response.data.list)
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

  const fetchDataById = async (setValues) => {
    try {
      const response = await axiosClient.get(`admin/news-category/${id}/edit`)
      const data = response.data.newsCategory
      if (data) {
        setValues({
          title: data?.news_category_desc.cat_name,
          description: data?.news_category_desc.description,
          friendlyUrl: data?.news_category_desc.friendly_url,
          pageTitle: data?.news_category_desc.friendly_title,
          metaKeyword: data?.news_category_desc.metakey,
          metaDesc: data?.news_category_desc.metadesc,
          visible: data.display,
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
    navigate('/news/category?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/news/category?id=${id}&sub=edit`)
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
              key={item?.cat_id}
              aria-label="Default select example"
              defaultChecked={item?.cat_id}
              id={`flexCheckDefault_${item?.cat_id}`}
              value={item?.cat_id}
              checked={selectedCheckbox.includes(item?.cat_id)}
              onChange={(e) => {
                const categoriesId = item?.cat_id
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox([...selectedCheckbox, categoriesId])
                } else {
                  setSelectedCheckbox(selectedCheckbox.filter((id) => id !== categoriesId))
                }
              }}
            />
          ),
          title: item?.news_category_desc?.cat_name,
          url: item?.news_category_desc?.friendly_url,
          actions: (
            <div>
              <button
                onClick={() => handleEditClick(item.cat_id)}
                className="button-action mr-2 bg-info"
              >
                <CIcon icon={cilColorBorder} className="text-white" />
              </button>
              <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(item.cat_id)
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
              const allIds = dataNewsCategory?.map((item) => item.cat_id) || []
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
      key: 'url',
      label: 'Chuỗi đường dẫn',
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
                    <h6>Search Engine Optimization</h6>
                    <br />
                    <CCol md={12}>
                      <label htmlFor="url-input">Chuỗi đường dẫn</label>
                      <Field
                        name="friendlyUrl"
                        type="text"
                        as={CFormInput}
                        id="url-input"
                        text="Chuỗi dẫn tĩnh là phiên bản của tên hợp chuẩn với Đường dẫn (URL). Chuỗi này bao gồm chữ cái thường, số và dấu gạch ngang (-). VD: vi-tinh-nguyen-kim-to-chuc-su-kien-tri-an-dip-20-nam-thanh-lap"
                      />
                      <ErrorMessage name="friendlyUrl" component="div" className="text-danger" />
                    </CCol>
                    <br />
                    <CCol md={12}>
                      <label htmlFor="pageTitle-input">Tiêu đề trang</label>
                      <Field
                        name="pageTitle"
                        type="text"
                        as={CFormInput}
                        id="pageTitle-input"
                        text="Độ dài của tiêu đề trang tối đa 60 ký tự."
                      />
                      <ErrorMessage name="pageTitle" component="div" className="text-danger" />
                    </CCol>
                    <br />
                    <CCol md={12}>
                      <label htmlFor="metaKeyword-input">Meta keywords</label>
                      <Field
                        name="metaKeyword"
                        type="text"
                        as={CFormTextarea}
                        id="metaKeyword-input"
                        text="Độ dài của meta keywords chuẩn là từ 100 đến 150 ký tự, trong đó có ít nhất 4 dấu phẩy (,)."
                      />
                      <ErrorMessage name="metaKeyword" component="div" className="text-danger" />
                    </CCol>
                    <br />
                    <CCol md={12}>
                      <label htmlFor="metaDesc-input">Meta description</label>
                      <Field
                        name="metaDesc"
                        type="text"
                        as={CFormTextarea}
                        id="metaDesc-input"
                        text="Thẻ meta description chỉ nên dài khoảng 140 kí tự để có thể hiển thị hết được trên Google. Tối đa 200 ký tự."
                      />
                      <ErrorMessage name="metaDesc" component="div" className="text-danger" />
                    </CCol>
                    <br />

                    <CCol md={12}>
                      <label htmlFor="visible-select">Hiển thị</label>
                      <Field
                        name="visible"
                        as={CFormSelect}
                        id="visible-select"
                        options={[
                          { label: 'Không', value: '0' },
                          { label: 'Có', value: '1' },
                        ]}
                      />
                      <ErrorMessage name="visible" component="div" className="text-danger" />
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
