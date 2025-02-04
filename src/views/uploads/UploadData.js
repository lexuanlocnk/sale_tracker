import React, { useState } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CFormInput,
  CButton,
  CAlert,
} from '@coreui/react'
import axios from 'axios'
import './css/uploadData.css'
import { axiosClient } from '../../axiosConfig'

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileInfo, setFileInfo] = useState(null)
  const [error, setError] = useState(null)

  const allowedFileTypes = [
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  ]

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && allowedFileTypes.includes(file.type)) {
      setSelectedFile(file)
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type,
      })
      setError(null)
    } else {
      setSelectedFile(null)
      setFileInfo(null)
      setError('Vui lòng chọn file Excel (.xls, .xlsx)')
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFileInfo(null)
    setError(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn file trước khi upload.')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await axiosClient.post('upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('saleToken')
            ? `Bearer ${localStorage.getItem('saleToken')}`
            : '',
        },
      })
      alert('Upload thành công: ' + response.data.message)
    } catch (error) {
      alert('Upload thất bại: ' + error.message)
    }
  }

  return (
    <CContainer>
      <CRow>
        <h1>SALE TRACKER UPLOAD</h1>
        <CCol>
          <CCard className="custom-card">
            <CCardHeader className="custom-card-header">Upload File Excel</CCardHeader>
            <CCardBody className="custom-card-body">
              <CFormInput size="sm" type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
              {error && (
                <CAlert color="danger" className="custom-alert mt-3">
                  {error}
                </CAlert>
              )}
              {fileInfo && (
                <div className="file-info">
                  <p>Tên file: {fileInfo.name}</p>
                  <p>Kích thước: {fileInfo.size} bytes</p>
                  <p>Loại file: {fileInfo.type}</p>
                  {/* <CButton
                    size="sm"
                    color="danger"
                    className="custom-button"
                    onClick={handleRemoveFile}
                  >
                    Xóa file
                  </CButton> */}
                </div>
              )}
              <CButton
                size="sm"
                color="primary"
                className="custom-button mt-3"
                onClick={handleUpload}
              >
                Upload File
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default UploadFile
