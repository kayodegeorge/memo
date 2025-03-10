'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const CountUp = ({
  end,
  duration = 2000,
}: {
  end: number
  duration?: number
}) => {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)
  const [isInView, setIsInView] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isInView) return

    const startTime = Date.now()
    const counter = setInterval(() => {
      const timePassed = Date.now() - startTime
      const progress = Math.min(timePassed / duration, 1)

      const nextCount = Math.floor(progress * end)
      if (nextCount !== countRef.current) {
        setCount(nextCount)
        countRef.current = nextCount
      }

      if (progress === 1) {
        clearInterval(counter)
      }
    }, 16)

    return () => clearInterval(counter)
  }, [end, duration, isInView])

  return (
    <div ref={observerRef} className='text-4xl font-bold text-gray-200'>
      {count}+
    </div>
  )
}

export default function StatsSection() {
  return (
    <div className='w-screen relative overflow-hidden'>
      {/* Hero section with background */}
      <div className='relative h-[300px] w-full'>
        <Image
          src='/assets/images/2nd-bg.svg'
          alt='Background celebration image'
          fill
          className='object-cover opacity-50 z-0'
          priority
        />
        <div className='absolute inset-0 flex items-center justify-center'>
          <h2 className='text-primary mx-auto max-w-lg lg:leading-[54px] text-center text-3xl md:text-4xl font-bold px-4 z-10'>
            Your satisfaction is our Priority
          </h2>
        </div>
      </div>

      {/* Stats Grid - Now separate from the background image section */}
      <div className='mt-10 w-full py-16 px-4'>
        <div className='max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8'>
          {[
            { label: 'Vendors', value: 1530 },
            { label: 'Orders', value: 50 },
            { label: 'Deliveries', value: 1530 },
            { label: 'Users', value: 50 },
          ].map((stat, index) => (
            <div key={index} className='relative text-center'>
              {/* Red Dot */}
              <div className='absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full' />

              {/* White Box */}
              <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4 relative'>
                <CountUp end={stat.value} />
                <div className='text-[#6B6B6F] mt-2'>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
