import { cilColorBorder, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormSelect,
  CImage,
  CRow,
  CTable,
  CTooltip,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosClient, imageBaseUrl } from '../../axiosConfig'
import moment from 'moment/moment'

import ReactPaginate from 'react-paginate'
import DeletedModal from '../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'

import './public/processList.scss'
import Loading from '../../components/loading/Loading'

function ProcressList() {
  const navigate = useNavigate()

  const [dataTracker, setDataTracker] = useState([])
  const [countData, setCountData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const [dataNewsCategory, setDataNewsCategroy] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // checkbox selected
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const [isCollapse, setIsCollapse] = useState(false)

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // search input
  const [dataSearch, setDataSearch] = useState('')

  // search Data
  const handleSearch = (keyword) => {
    fetchDataTracker(keyword)
  }

  const fetchDataNewsCategory = async () => {
    try {
      setIsLoading(true)
      const response = await axiosClient.get(`admin/news-category`)
      if (response.data.status === true) {
        setDataNewsCategroy(response.data.list)
        setCountData(response.data.count)
      }
    } catch (error) {
      console.error('Fetch data news is error', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDataNewsCategory()
  }, [])

  const fetchDataTracker = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(`sales/index?page=${pageNumber}`)

      if (response.data && response.data.status === true) {
        setDataTracker(response.data.data)
        setCountData(response.data.count)
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch promotion news data is error', error)
    }
  }

  useEffect(() => {
    fetchDataTracker()
  }, [pageNumber, selectedCategory])

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

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`admin/news/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchDataTracker()
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Delete news id is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const handleDeleteSelectedCheckbox = async () => {
    try {
      const response = await axiosClient.post('admin/delete-all-news', {
        data: selectedCheckbox,
      })
      if (response.data.status === true) {
        toast.success('Xóa tất cả các mục thành công!')
        fetchDataTracker()
        setSelectedCheckbox([])
      }
    } catch (error) {
      console.error('Deleted all id checkbox is error', error)
    }
  }

  const items =
    dataTracker && dataTracker?.length > 0
      ? dataTracker?.map((item) => ({
          startTime: <div>{item?.start_time}</div>,
          endTime: <div>{item?.end_time}</div>,
          sale: <div className=" blue-text">{item?.business_name}</div>,
          phone: <div className="fw-bold">{item?.user_name}</div>,
          customer: (
            <CTooltip content={item?.customer_name}>
              <div className="truncate blue-text">{item?.customer_name}</div>
            </CTooltip>
          ),
          products: <div>{item?.item}</div>,

          quantity: (
            <CTooltip content={item?.quantity}>
              <div className="red-text">{item?.quantity}</div>
            </CTooltip>
          ),
          price: <div className="red-text">{item?.price}</div>,
          results: (
            <CTooltip content={item?.sales_result}>
              <div className="truncate">{item?.sales_result}</div>
            </CTooltip>
          ),
          suggestions: (
            <CTooltip content={item?.suggestions}>
              <div className="truncate blue-text">{item?.suggestions}</div>
            </CTooltip>
          ),
          actions: (
            <div>
              <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(item.news_id)
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
      key: 'startTime',
      label: 'T/g bắt đầu',
      _props: { scope: 'col', className: 'table-header' },
    },
    {
      key: 'endTime',
      label: 'T/g kết thúc',
      _props: { scope: 'col', className: 'table-header' },
    },
    {
      key: 'sale',
      label: 'Tên kinh doanh',
      _props: { scope: 'col', className: 'table-header' },
    },
    {
      key: 'phone',
      label: 'Số điện thoại',
      _props: { scope: 'col', className: 'table-header' },
    },
    {
      key: 'customer',
      label: 'Tên khách hàng',

      _props: { scope: 'col', className: 'table-header' },
    },
    {
      key: 'products',
      label: 'Mặt hàng',
      _props: { scope: 'col', className: 'table-header' },
    },
    {
      key: 'quantity',
      label: 'Số lượng',
      _props: { scope: 'col', className: 'table-header' },
    },
    {
      key: 'price',
      label: 'Giá',
      _props: { scope: 'col', className: 'table-header' },
    },

    {
      key: 'results',
      label: 'Kết quả bán hàng',
      _props: { scope: 'col', className: 'table-header' },
    },

    {
      key: 'suggestions',
      label: 'Gợi ý cho kinh doanh',
      _props: { scope: 'col', className: 'table-header' },
    },

    {
      key: 'actions',
      label: 'Tác vụ',
      _props: { scope: 'col', className: 'table-header' },
    },
  ]

  return (
    <div>
      {!isPermissionCheck ? (
        <h5>
          <div>Bạn không đủ quyền để thao tác trên danh mục quản trị này.</div>
          <div className="mt-4">
            Vui lòng quay lại trang chủ <Link to={'/dashboard'}>(Nhấn vào để quay lại)</Link>
          </div>
        </h5>
      ) : (
        <CRow>
          <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />

          <CCol xs={12} className="mb-3">
            <CCol>
              <h3>QUẢN LÝ KHÁCH HÀNG</h3>
            </CCol>
          </CCol>

          <CCol xs={12}>
            <CCol>
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
                      <td className="total-count">{countData}</td>
                    </tr>
                    <tr>
                      <td>Lọc theo vị trí</td>
                      <td>
                        <CFormSelect
                          className="component-size w-50"
                          aria-label="Chọn yêu cầu lọc"
                          options={[
                            { label: 'Chọn danh mục', value: '' },
                            ...(dataNewsCategory && dataNewsCategory.length > 0
                              ? dataNewsCategory.map((group) => ({
                                  label: group?.news_category_desc?.cat_name,
                                  value: group.cat_id,
                                }))
                              : []),
                          ]}
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
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
            </CCol>

            {/* <CCol md={12} className="mt-3">
              <CButton onClick={handleDeleteSelectedCheckbox} color="primary" size="sm">
                Xóa mục đã chọn
              </CButton>
            </CCol> */}

            {isLoading ? (
              <Loading />
            ) : (
              <CCol className="table-container">
                <div className="table-responsive">
                  <CTable
                    style={{ fontSize: 12, minWidth: '1000px' }}
                    hover
                    className="mt-3 border "
                    columns={columns}
                    items={items}
                  />
                </div>
              </CCol>
            )}

            <div className="d-flex justify-content-end">
              <ReactPaginate
                pageCount={Math.ceil(countData / 10)}
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
      )}
    </div>
  )
}

export default ProcressList
