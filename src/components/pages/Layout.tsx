import { Footer } from '@/components/pages/Footer'
import { Sidebar } from './Sidebar'
//Layout component
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <div className='flex'>
          <div className='w-1/6'>
            <Sidebar/>
          </div>
          <div className='w-5/6'>{children}</div>
        </div>
      </main>
      <Footer />
    </>
  )
}
