import React from 'react'

const AdminSidebar = () => {
  return (
    <div>
      admin sidebar
      <ul>
        <li><a href="/feedbacks">Feedbacks</a></li>
        <li><a href="/settings">Settings</a></li>
        <li><a href="/checkout">Checkout</a></li>
        <li><a href="/orders">Orders</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/users">Users</a></li>
      </ul>
      <p>This is the admin sidebar.</p>
    </div>
  )
}

export default AdminSidebar
