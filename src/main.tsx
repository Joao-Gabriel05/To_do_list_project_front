import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
    <Toaster position='bottom-right'/>
  </>
)
