import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Root() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}
