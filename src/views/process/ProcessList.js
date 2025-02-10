import { cilColorBorder, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CFormCheck,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTooltip,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../axiosConfig'
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

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [noteData, setNoteData] = useState('')

  const [errors, setErrors] = useState({ startDate: '', endDate: '' })

  const handleDateChange = (field, value) => {
    if (field === 'startDate') {
      setStartDate(value)
      if (endDate && value > endDate) {
        setErrors((prev) => ({
          ...prev,
          startDate: 'Ngày bắt đầu không thể lớn hơn ngày kết thúc',
        }))
      } else {
        setErrors((prev) => ({ ...prev, startDate: '' }))
      }
    }

    if (field === 'endDate') {
      setEndDate(value)
      if (startDate && value < startDate) {
        setErrors((prev) => ({ ...prev, endDate: 'Ngày kết thúc không thể nhỏ hơn ngày bắt đầu' }))
      } else {
        setErrors((prev) => ({ ...prev, endDate: '' }))
      }
    }
  }

  const [isManager, setIsManager] = useState(false)
  const [noteModalVisible, setNoteModalVisible] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({})
  const [note, setNote] = useState('')

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

  const convertDateTime = (date) => {
    const data = moment(date).format('DD/MM/YYYY')
    return data
  }

  const fetchDataTracker = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(
        `sales/index?page=${pageNumber}&data=${dataSearch}&start_time=${startDate !== '' ? convertDateTime(startDate) : ''}&end_time=${endDate !== '' ? convertDateTime(endDate) : ''}`,
      )

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
  }, [pageNumber, selectedCategory, startDate, endDate])

  // Fetch API to check delete action from user
  const fetchAdminInfo = async () => {
    try {
      const response = await axiosClient.get('/profile')
      if (response.data && response.data.status === true) {
        const isManager = response.data.admin_detail.is_manager
        if (isManager === 1) {
          setIsManager(true)
        }
      }
    } catch (error) {
      console.error('Fetch data info user is error', error)
    }
  }

  useEffect(() => {
    fetchAdminInfo()
  }, [])

  // const fetchNoteData = async () => {
  //   try {
  //     const response = await axiosClient.get('/sale/')
  //   } catch (error) {}
  // }

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
      const response = await axiosClient.delete(`sales/${deletedId}`)
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
      const response = await axiosClient.post('/sale/delete', {
        ids: selectedCheckbox,
        _method: 'DELETE',
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
          id: (
            <CFormCheck
              key={item?.id}
              aria-label="Default select example"
              defaultChecked={item?.id}
              id={`flexCheckDefault_${item?.id}`}
              value={item?.id}
              checked={selectedCheckbox.includes(item?.id)}
              onChange={(e) => {
                const saleId = item?.id
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox([...selectedCheckbox, saleId])
                } else {
                  setSelectedCheckbox(selectedCheckbox.filter((id) => id !== saleId))
                }
              }}
            />
          ),
          startTime: <div>{item?.start_time}</div>,
          endTime: <div>{item?.end_time}</div>,
          sale: <div className=" blue-text">{item?.business_name}</div>,
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
              <div className="truncate fw-bold">{item?.sales_result}</div>
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
                  setNoteModalVisible((prev) => !prev)
                  setCustomerInfo(item)
                }}
                className="button-action bg-warning"
              >
                <CTooltip content={'Tạo ghi chú'}>
                  <CIcon icon={cilColorBorder} className="text-white" />
                </CTooltip>
              </button>
              {isManager && (
                <button
                  onClick={() => {
                    setVisible(true)
                    setDeletedId(item.id)
                  }}
                  className="button-action bg-danger mt-2"
                >
                  <CIcon icon={cilTrash} className="text-white" />
                </button>
              )}
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
              const allIds = dataTracker?.map((item) => item.id) || []
              setSelectedCheckbox(allIds)
            } else {
              setSelectedCheckbox([])
            }
          }}
        />
      ),
    },
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

  const handleSubmitNote = async () => {
    // if (note === '') {
    //   alert('Xin vui lòng nhập ghi chú trước khi lưu!')
    // }

    alert('Chức năng đang phát triển ')
  }

  const NoteModal = ({ record }) => {
    return (
      <CModal visible={noteModalVisible} onClose={() => setNoteModalVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Ghi chú giao dịch</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="note__info-customer mb-3">
            <div className="mb-1 d-flex gap-2">
              <label style={{ wordBreak: 'nowrap' }} className="form-label ">
                Tên khách hàng:
              </label>
              <CTooltip content={record.customer_name}>
                <div className="truncate-2-lines">{record.customer_name}</div>
              </CTooltip>
            </div>
            <div className="mb-1 d-flex">
              <label style={{ wordBreak: 'nowrap' }} className="form-label">
                Mặt hàng:{' '}
              </label>
              <CTooltip content={record.item}>
                <div className="truncate-2-lines">{record.item}</div>
              </CTooltip>
            </div>
            <div className="mb-1 d-flex gap-2">
              <label className="form-label">Số lượng:</label>
              <div>{record.quantity}</div>
            </div>
            <div className=" d-flex gap-2">
              <label className="form-label">Kết quả giao dịch:</label>
              <div>{record.sales_result}</div>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Nội dung ghi chú:</label>
            <textarea className="form-control" rows="8" placeholder="Nhập nội dung ghi chú..." />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setNoteModalVisible(false)}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={handleSubmitNote}>
            Lưu
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

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
          <NoteModal record={customerInfo} />
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
                      <td>Lọc theo ngày</td>
                      <td>
                        <div className="d-flex gap-4">
                          <div>
                            <label>Từ ngày:</label>
                            <CFormInput
                              type="date"
                              value={startDate}
                              onChange={(e) => handleDateChange('startDate', e.target.value)}
                            />
                            {errors.startDate && (
                              <div className="text-danger">{errors.startDate}</div>
                            )}
                          </div>
                          <div>
                            <label>Đến ngày:</label>
                            <CFormInput
                              type="date"
                              value={endDate}
                              onChange={(e) => handleDateChange('endDate', e.target.value)}
                            />
                            {errors.endDate && <div className="text-danger">{errors.endDate}</div>}
                          </div>
                        </div>
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

            <CCol md={12} className="mt-3">
              <CButton onClick={handleDeleteSelectedCheckbox} color="primary" size="sm">
                Xóa mục đã chọn
              </CButton>
            </CCol>

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
