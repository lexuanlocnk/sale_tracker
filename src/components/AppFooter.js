import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://web.chinhnhan.net" target="_blank" rel="noopener noreferrer">
          nkc sale tracker
        </a>
        <span className="ms-1">&copy; 2024</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://web.chinhnhan.net" target="_blank" rel="noopener noreferrer">
          nkc it group
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
