import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  CButton,
  CFormInput,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalBody,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFace, cilFaceDead } from '@coreui/icons'
import { axiosClient } from '../axiosConfig'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const validationSchema = Yup.object({
  currentPassword: Yup.string().required('Mật khẩu hiện tại là bắt buộc'),
  newPassword: Yup.string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .required('Mật khẩu mới là bắt buộc'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
})

const ChangePasswordForm = ({ isOpen, onClose, title, type, defaultPassword }) => {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting }) => {
    if (type === 'changeDefaultPassword') {
      try {
        const response = await axiosClient.post('/password/update-default-password', {
          default_password: values.newPassword,
        })

        if (response.data.status === true) {
          toast.success('Thay đổi password mặc định thành công!')
          localStorage.clear()
          navigate('/login')
        }
      } catch (error) {
        console.error('Post new default password failed: ', error)
      } finally {
        setSubmitting(false)
      }
    } else {
      try {
        const response = await axiosClient.post('/password/change-password', {
          _method: 'PATCH',
          current_password: values.currentPassword,
          new_password: values.newPassword,
        })

        if (response.data.status === true) {
          toast.success('Thay đổi password thành công!')
          localStorage.clear()
          navigate('/login')
        }
      } catch (error) {
        console.error('Post new user password failed: ', error)
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <CModal visible={isOpen} onClose={onClose} backdrop="static" centered>
      <CModalHeader closeButton>
        <h4 className="text-center mb-0">{title}</h4>
      </CModalHeader>
      <CModalBody>
        <Formik
          initialValues={{
            currentPassword: type == 'changeDefaultPassword' ? defaultPassword : '',
            newPassword: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <CFormLabel htmlFor="currentPassword">Mật khẩu hiện tại</CFormLabel>
                <Field name="currentPassword">
                  {({ field }) => (
                    <CFormInput type="text" {...field} placeholder="Nhập mật khẩu hiện tại" />
                  )}
                </Field>
                <ErrorMessage name="currentPassword" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="newPassword">Mật khẩu mới</CFormLabel>
                <CInputGroup>
                  <Field name="newPassword">
                    {({ field }) => (
                      <CFormInput
                        type={showNewPassword ? 'text' : 'password'}
                        {...field}
                        placeholder="Nhập mật khẩu mới"
                      />
                    )}
                  </Field>
                  <CInputGroupText
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    <CIcon icon={showNewPassword ? cilFaceDead : cilFace} />
                  </CInputGroupText>
                </CInputGroup>
                <ErrorMessage name="newPassword" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="confirmPassword">Xác nhận mật khẩu</CFormLabel>
                <CInputGroup>
                  <Field name="confirmPassword">
                    {({ field }) => (
                      <CFormInput
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...field}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    )}
                  </Field>
                  <CInputGroupText
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    <CIcon icon={showConfirmPassword ? cilFaceDead : cilFace} />
                  </CInputGroupText>
                </CInputGroup>
                <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
              </div>

              <div className="text-center">
                <CButton size="sm" type="submit" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </CButton>
              </div>
            </Form>
          )}
        </Formik>
      </CModalBody>
    </CModal>
  )
}

export default ChangePasswordForm
