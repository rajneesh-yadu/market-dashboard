'use client'
import React from 'react'

import LtpCallVsPut from '../charts/individual-data/LtpCallVsPut'
import ChangeInOICallVsPut from '../charts/individual-data/ChangeInOICallVsPut'
function page({params}) {

    console.log('params', params)
  return (
    <div>
        <LtpCallVsPut  />
        <ChangeInOICallVsPut  />
    </div>
  )
}

export default page