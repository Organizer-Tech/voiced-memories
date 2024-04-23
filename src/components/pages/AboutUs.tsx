'use client'

import { Container } from '@/components/pages/Container'
import Image from 'next/image'

export function About() {
  //About us section
  //A lot of formatting to get it to look right
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="border-t border-gray-200 bg-gray-100 py-20 sm:py-32"
    >
      <Container>
      <div className="flex"> 
      <div className="w-2/3">
      <div className="container mx-auto px-4">
  <div className="py-8">
    <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">Finding a Photo Without a Story</h2>
    <p className="text-gray-600 text-center mb-8">
      Imagine stumbling upon an old photograph tucked away in a drawer or buried deep in your computer files. It&apos;s a beautiful image—perhaps a family gathering, a family reunion, or a candid moment that captures laughter or love. You look at it and appreciate its beauty, its composition, its timelessness. But that&apos;s where it ends.
    </p>
    <p className="text-gray-600 text-center mb-8">
      The faces or the places seem familiar, yet the specifics are lost in the sands of time. Who took the photo? What was so funny that everyone was laughing? Why was it significant enough to capture in the first place? Without its story, the photograph is a mute witness to a moment long passed, its deeper meaning and context lost to you and certainly lost to anyone who wasn&apos;t there.
    </p>
  </div>

  <div className="bg-gray-100 py-8">
    <div className="text-center">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">The Transformation: A Photo with Its Story</h3>
      <p className="text-gray-600 mb-8">
        Now, imagine another scenario.
        You come across a similar photo, but this one is different. As you look at it, you can tap a button and suddenly the photograph comes alive. You hear your mother&apos;s voice recounting the day she took the snapshot, her tone tinged with nostalgia. She describes the uproarious laughter as your uncle told an embarrassingly bad joke, how the sun felt on her skin that day, and why your mother chose to capture that exact moment.
      </p>
      <p className="text-gray-600 mb-8">
        Instantly, the photograph is no longer just an image; it&apos;s an experience, a memory encapsulated not just in pixels or on paper but in emotion, context, and real human connection. You can share this enriched photo-story with other family members, allowing them to experience that moment almost as if they were there. And most importantly, this layered memory can be passed down, each voice adding richness to the tapestry of family history.
      </p>
      <p className="text-gray-600 mb-8">
        This is the why behind Voiced Memories?
      </p>
      <p className="text-gray-600 mb-8">
        This is the transformative power of Voiced Memories. We enrich your photos by embedding the stories behind them, directly from the people who lived those moments. In doing so, we&apos;re not just preserving memories; we&apos;re adding depth, texture, and emotional hues that a simple photo, no matter how beautiful, could never capture on its own.
      </p>
    </div>
  </div>

  <div className="py-8">
    <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">About Me: Meet Karen, the Heart Behind Voiced Memories</h3>
    <div className="text-center">
      <p className="text-gray-600 mb-8">
        Hello and welcome! I&apos;m Karen, and I have a profound belief in the transformative power of photos and the stories that accompany them. My journey into this realm is deeply personal and stretches back through generations of my own family.
      </p>
    </div>
  </div>

  <div className="bg-gray-100 py-8">
    <div className="text-center">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">A Family Legacy</h4>
      <p className="text-gray-600 mb-8">
        My bond with photographs was deeply forged by the lasting memory of my Uncle Jimmy. Although he passed away long before I was born, having laid down his life during WWII, his legacy is ever-present. Uncle Jimmy&apos;s memory was beautifully kept alive in the photos that graced the homes of our family members while I was growing up, and in the stories passed down by my grandmother, father, and my uncles and aunts. Inspired by this powerful connection to the past, both my cousin Marlene McKenzie and I have taken it upon ourselves to ensure that Uncle Jimmy&apos;s story is never forgotten. We&apos;ve captured his life and his contributions in photos, along with the heartfelt retellings by our family and details gathered through research. This commitment to preserving these memories has underscored for me the immense value of photographs and stories. Through this dedication, we&apos;re ensuring that the brave contributions made by people like Uncle Jimmy are remembered for generations to come. These treasured memories serve not only as a tribute to our family but also as an anchor, connecting us all to our rich heritage.
      </p>
    </div>
  </div>

  <div className="py-8">
    <div className="text-center">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">A Compassionate Past</h4>
      <p className="text-gray-600 mb-8">
        Before I ventured into Voiced Memories, I worked in the funeral industry, where I assisted grieving families in restoring and enhancing photos of their departed loved ones for memorial services. This experience opened my eyes to the importance of being proactive rather than reactive when it comes to preserving memories.
      </p>
    </div>
  </div>

  <div className="bg-gray-100 py-8">
    <div className="text-center">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">A Personal Commitment</h4>
      <p className="text-gray-600 mb-8">
        My passion isn&apos;t just professional; it&apos;s deeply personal. In my spare time, I&apos;m diligently working on my family tree as well as that of my husband. Genealogy is more than a hobby for me—it&apos;s a commitment to understanding where we come from and preserving that history for future generations.
      </p>
    </div>
  </div>

  <div className="py-8">
    <div className="text-center">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">Here to Help You</h4>
      <p className="text-gray-600 mb-8">
        Now, I&apos;m on a mission to help you do the same for your family. Whether it&apos;s organizing your photos, tracing your genealogy, or narrating the stories that make your family unique, Voiced Memories is here to assist you in capturing and preserving these irreplaceable moments.
      </p>
      <p className="text-gray-600 mb-8">
        So why wait? Let&apos;s embark on this incredible journey together, capturing the essence of lives lived and enriching our future by embracing our past.
      </p>
    </div>
  </div>
</div>
</div>
<div className="w-1/3">
<div className='flex justify-center ml-20 pt-36'>
      <Image 
              src="/AboutUs1.PNG"
              height={700}
              width={450}
              alt="Description of the image"
            />
            </div>
            <div className='flex justify-center ml-20 pt-96'>
                  <Image 
              src="/AboutUs2.PNG"
              height={700}
              width={450}
              alt="Description of the image"
            />
              </div>
            </div>
            </div>
      </Container>
    </section>
  )
}


