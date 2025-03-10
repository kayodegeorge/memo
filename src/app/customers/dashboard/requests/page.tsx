'use client'

const MyRequests = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-1 container mx-auto flex gap-8 py-8'>
        <main className='flex-1'>
          <h1 className='text-3xl font-medium mb-8'>My Account</h1>

          <div className='bg-white rounded-lg p-6'>
            <h2 className='text-xl font-medium mb-6'>My Requests</h2>
          </div>
        </main>
      </div>
    </div>
  )
}

export default MyRequests
