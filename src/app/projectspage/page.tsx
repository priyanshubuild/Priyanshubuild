import React from 'react'
import Link from 'next/link'
import { Undo2 } from 'lucide-react'
import Container from '@/components/Container'
import RingButton from '@/components/RingButton'
import { Button } from '@/components/ui/button'

const page = () => {
    return (
        <div className='bg-[#09090B]'>
            <Container>
                <div className="w-full px-4 md:px-8">
                    <div className="text-white px-[2%]">
                        <div className='text-lg gap-2 items-center font-semibold mt-8 mb-4 '>
                            <Link href="/" className='flex items-center gap-2'>
                                <Button variant='primary' size="lg" ><Undo2 /> Back </Button>
                            </Link>
                        </div>
                        <div className='flex flex-col gap-4 mb-8'>
                            <div className='text-4xl sm:text-6xl pt-10 font-semibold font-space-grotesk'>
                                Projects
                            </div>
                            <div className='text-lg sm:text-xl text-neutral-400'>
                                Currently under active development · Live projects will be added as they are completed
                            </div>
                        </div>
                        <hr className= 'border-0.5 border-[#424244]' />
                        <div className='py-12 flex flex-col items-center justify-center text-center max-w-xl mx-auto'>
                            <p className="text-neutral-300 text-base leading-relaxed mb-6">
                                I am currently focusing on core engineering foundations in C++, Data Structures &amp; Algorithms, and web development. Active code and practice repositories are available on GitHub.
                            </p>
                            <a
                                href="https://github.com/priyanshubuild"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <RingButton text="Visit GitHub @priyanshubuild" size="lg" />
                            </a>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default page