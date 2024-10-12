import { SignUp } from '@clerk/nextjs'
import { Layout } from 'lucide-react'

export default function Page() {
  return (
    <Layout className='flex items-center justify-center h-screen'>
      <SignUp />
    </Layout>
  )
}