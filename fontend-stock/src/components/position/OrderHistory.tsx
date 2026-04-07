import React from 'react'
import { toast } from 'react-hot-toast'

export const OrderHistory = () => {
  return (
    <div>
      <button 
  onClick={() => toast.success('Alo alo, Toast có hoạt động không?')}
  style={{ padding: '10px', background: '#0ECB81', color: 'white', zIndex: 9999 }}
>
  Test Thử Toast
</button>
    </div>
  )
}
