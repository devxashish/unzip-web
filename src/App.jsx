/**
 * Copyright © 2025 Ashish. All rights reserved.
 * This source code is the property of Ashish and may not be reproduced, distributed, 
 * or transmitted in any form without explicit written permission.
 */

import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import './App.css'

const UploadPage = lazy(() => import('./pages/UploadPage'))

function LoadingFallback() {
  return (
    <div className="app-loading">
      <div className="app-loading__spinner" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/upload"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <UploadPage />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
