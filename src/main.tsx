import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import './index.css'

import { PcLayout } from '@/components/pc/PcLayout'
import { MobileLayout } from '@/components/mobile/MobileLayout'
import { GuidePage } from '@/pages/GuidePage'

import { MainPage } from '@/pages/pc/MainPage'
import { LoginPage } from '@/pages/pc/LoginPage'
import { SearchPage } from '@/pages/pc/SearchPage'
import { HotelDetailPage } from '@/pages/pc/HotelDetailPage'
import { BookingPage } from '@/pages/pc/BookingPage'
import { BookingCompletePage } from '@/pages/pc/BookingCompletePage'
import { MyPage } from '@/pages/pc/MyPage'
import { OffersPage } from '@/pages/pc/OffersPage'

import { HomePage as MHomePage } from '@/pages/mobile/HomePage'
import { SearchPage as MSearchPage } from '@/pages/mobile/SearchPage'
import { HotelDetailPage as MHotelDetailPage } from '@/pages/mobile/HotelDetailPage'
import { OptionsPage as MOptionsPage } from '@/pages/mobile/OptionsPage'
import { BenefitsPage as MBenefitsPage } from '@/pages/mobile/BenefitsPage'
import { PaymentPage as MPaymentPage } from '@/pages/mobile/PaymentPage'
import { CompletePage as MCompletePage } from '@/pages/mobile/CompletePage'
import { LoginPage as MLoginPage } from '@/pages/mobile/LoginPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PcLayout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'hotels/:hotelId', element: <HotelDetailPage /> },
      { path: 'booking', element: <BookingPage /> },
      { path: 'booking/complete', element: <BookingCompletePage /> },
      { path: 'mypage', element: <MyPage /> },
      { path: 'offers', element: <OffersPage /> },
    ],
  },
  {
    path: '/mobile',
    element: <MobileLayout />,
    children: [
      { index: true, element: <MHomePage /> },
      { path: 'search', element: <MSearchPage /> },
      { path: 'hotels/:hotelId', element: <MHotelDetailPage /> },
      { path: 'booking/options', element: <MOptionsPage /> },
      { path: 'booking/benefits', element: <MBenefitsPage /> },
      { path: 'booking/payment', element: <MPaymentPage /> },
      { path: 'booking/complete', element: <MCompletePage /> },
      { path: 'login', element: <MLoginPage /> },
      { path: '*', element: <Navigate to="/mobile" replace /> },
    ],
  },
  { path: '/guide', element: <GuidePage /> },
  { path: '*', element: <Navigate to="/" replace /> },
], {
  basename: '/ambassador',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
