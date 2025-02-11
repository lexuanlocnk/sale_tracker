import React from 'react'
import {
  CButton,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { axiosClient } from '../../axiosConfig'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function NoteModal({ visible, setVisible, note, setNote, recordId, record }) {
  const navigate = useNavigate()
  // Submit note
  const handleSubmitNote = async () => {
    try {
      const response = await axiosClient.post(`/sale/${recordId}`, {
        _method: 'PUT',
        note: note,
      })
      if (response.data && response.data.status === true) {
        toast.success('Ghi chú đã được gửi!')
        setVisible(false)
        navigate(`/dataTracking`)
      }
    } catch (error) {
      console.error('Post sale note data is error', error)
    }
  }

  return (
    <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader closeButton>
        <CModalTitle>Ghi chú giao dịch</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <div>
            <label>Tên khách hàng:</label>
            <span
              style={{
                fontWeight: 600,
                color: 'dodgerblue',
              }}
            >
              {record.customer_name}
            </span>
          </div>
        </div>
        <div>
          <label>Ghi chú:</label>
          <CFormTextarea
            className="mt-2"
            rows="8"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleSubmitNote}>
          Nộp
        </CButton>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Hủy
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default NoteModal
