import Layout from '@/components/layout'
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <Layout className='flex items-center justify-center h-screen'>
      <SignIn />
    </Layout>
  )
}