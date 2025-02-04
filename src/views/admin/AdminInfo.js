import { CButton, CCol, CContainer, CForm, CFormInput, CImage, CRow, CSpinner } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosClient, imageBaseUrl } from '../../axiosConfig'
import { toast } from 'react-toastify'

function AdminInfo() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')

  const [avatarFile, setAvatarFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  // upload image and show image
  const [selectedFile, setSelectedFile] = useState('')
  const [file, setFile] = useState([])

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

  const fetchAdminInformation = async () => {
    try {
      const response = await axiosClient.get(`/admin/edit`)
      const data = response.data.admin_detail
      if (response.data && response.data.status === true) {
        setUserName(data.username)
        // setEmail(data.email)
        setDisplayName(data.username)
        // setPhone(data.phone)
        // setAvatarFile(data.avatar)
      }
    } catch (error) {
      console.error('Fetch admin info data is error', error)
    }
  }

  useEffect(() => {
    fetchAdminInformation()
  }, [])

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     setIsLoading(true)
  //     const response = await axiosClient.put(`admin/information}`, {
  //       email: email,
  //       display_name: displayName,
  //       avatar: formData,
  //       phone: phone,
  //     })
  //     if (response.data.status === true) {
  //       toast.success('Cập nhật thông tin admin thành công!')
  //       fetchAdminInformation()
  //     }
  //   } catch (error) {
  //     console.error('Put data admin info is error', error)
  //     toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      const formData = new FormData()
      formData.append('email', email)
      formData.append('display_name', displayName)
      formData.append('phone', phone)

      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      const response = await axiosClient.post(`admin/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('saleToken')
            ? `Bearer ${localStorage.getItem('saleToken')}`
            : '',
        },
      })

      if (response.data.status === true) {
        toast.success('Cập nhật thông tin admin thành công!')
        fetchAdminInformation()
      }
    } catch (error) {
      console.error('Put data admin info is error', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol md={6}>
          <h3>THÔNG TIN NHÂN VIÊN</h3>
          <h6>Thông tin tài khoản</h6>
        </CCol>
        <CCol md={6}>
          <div className="d-flex justify-content-end">
            <Link to={'/admin/list'}>
              <CButton color="primary" size="sm">
                Thêm mới
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol md={6}>
          <CForm className="row gy-3">
            <CCol md={12}>
              <CFormInput
                id="inputEmail4"
                label="Tên đăng nhập"
                text="Không thể thay đổi"
                value={userName}
                disabled
                onChange={(e) => setUserName(e.target.value)}
              />
            </CCol>

            <CCol md={12}>
              <CFormInput
                type="password"
                id="inputPassword4"
                label="Mật khẩu mới"
                disabled
                placeholder="Liên hệ admin quản trị để thay đổi."
              />
            </CCol>

            {/* <CCol md={12}>
              <CFormInput
                id="inputAddress"
                label="Thư điện tử"
                text="Thư điện tử (bắt buộc)."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </CCol> */}

            <CCol md={12}>
              <CFormInput
                id="inputAddress2"
                label="Tên hiển thị"
                text="Tên hiển thị (bắt buộc)."
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </CCol>

            {/* <CCol md={12}>
              <CFormInput
                id="inputAddress2"
                label="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </CCol> */}

            <CCol xs={12}>
              <CButton
                onClick={handleSubmit}
                color="primary"
                type="submit"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <CSpinner size="sm"></CSpinner> Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật'
                )}
              </CButton>
            </CCol>
          </CForm>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AdminInfo
