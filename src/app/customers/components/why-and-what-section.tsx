import { Card, CardContent } from '@/components/ui/card'
import GlobalReach from '../../../../public/assets/icons/GlobalReach'
import Image from 'next/image'
import Unlock from '../../../../public/assets/icons/Unlock'

const features = [
  {
    icon: Unlock,
    title: 'Convenience at Your Fingertips',
    description:
      "Surprise your loved ones with cakes, flowers and gifts delivered straight to their doorstep, whether they're nearby or miles away.",
  },
  {
    icon: Unlock,
    title: 'Direct Communication with Vendors',
    description:
      'Contact vendors directly for order updates, custom requests, or additional inquiries for a seamless experience',
  },
  {
    icon: GlobalReach,
    title: 'Global Reach',
    description:
      'Send gifts and cakes to loved ones, no matter where they are, with reliable international delivery options',
  },
]

const testimonials = [
  {
    name: 'Ajanleks Coco',
    location: 'China',
    quote:
      'Memo made it so easy to surprise my mom on her birthday. The cake was fresh, and the delivery was on time',
    avatar: '/assets/images/naomi.png',
  },
  {
    name: 'Naomi Coco',
    location: 'Nairobi',
    quote:
      'Finding the perfect gift for my best friend abroad was a breeze with Memo. Thank you for making it special',
    avatar: '/assets/images/naomi.png',
  },
  {
    name: 'Ajanleks Coco',
    location: 'Lagos',
    quote:
      'The customization options were amazing, and the vendor was super helpful. Highly recommend Memo',
    avatar: '/assets/images/naomi.png',
  },
]

const WhyAndWhatSection = () => {
  return (
    <div className='relative'>
      {/* Left edge image */}
      <div className='hidden lg:block absolute left-0 top-[90%]'>
        <Image
          src='/assets/images/left-circle.png'
          alt='Decorative left image'
          width={65}
          height={65}
          className='object-cover'
        />
      </div>

      {/* Right edge image */}
      <div className='hidden lg:block absolute right-0 top-[50%] '>
        <Image
          src='/assets/images/right-circle.png'
          alt='Decorative right image'
          width={80}
          height={80}
          className='object-cover'
        />
      </div>

      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-lg lg:text-3xl font-bold text-primary mb-4'>
              Why choose MEMO
            </h2>
            <p className='text-[#1C1C1C] lg:text-lg max-w-xl mx-auto'>
              Shop cakes, flowers and gifts from trusted vendors across the
              globe in just a few clicks.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8 px-4'>
            {features.map((feature, index) => (
              <Card
                key={index}
                className='border-none max-w-sm mx-auto lg:h-[400px] bg-[#FFFBFA] shadow-lg hover:bg-[#FDF0D5] cursor-pointer'
              >
                <CardContent className='pt-6 text-left flex flex-col items-center'>
                  <div className='mb-6 inline-block rounded-full bg-[#FFEAE4] p-4'>
                    <feature.icon className='h-6 w-6 text-primary' />
                  </div>
                  <div className='w-full mt-10'>
                    <h3 className='lg:text-xl font-bold  text-[#370E06] mb-3'>
                      {feature.title}
                    </h3>
                    <p className='text-[#1E1B16] lg:text-base text-sm font-medium mb-10'>
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-lg lg:text-3xl font-bold text-primary mb-4'>
              What users say about MEMO
            </h2>
            <p className='text-[#1C1C1C] lg:text-lg max-w-xl mx-auto'>
              Creating Smiles with Every Delivery
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className='border-none shadow-lg lg:h-[270px] bg-[#FFFBFA] '
              >
                <CardContent className='pt-6'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='relative h-16 w-16 overflow-hidden rounded-full'>
                      <Image
                        src={testimonial.avatar}
                        alt={`${testimonial.name}'s avatar`}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div>
                      <h3 className='font-semibold lg:text-lg  text-[#4A2B29]'>
                        {testimonial.name}
                      </h3>
                      <p className='text-#1E1B16 font-medium lg:text-lg'>
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <blockquote className='text-#1E1B16 mt-10'>
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default WhyAndWhatSection
