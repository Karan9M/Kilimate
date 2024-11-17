
import type { PropsWithChildren } from 'react'
import Header from './Header'
import { Coffee, Github, Heart, Instagram, TwitchIcon, Twitter, TwitterIcon, XIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div className='bg-gradient-to-br from-background to-muted'>
            <Header/>
            <main className='min-h-screen mx-auto container px-4 py-8'>
                {children}
            </main>
            <footer className='border-t backdrop-blur py-12 supports-[backdrop-filter]:bg-background/60 flex justify-center items-center flex-col gap-5'>
                <div className='container mx-auto px-4 text-center text-gray-400'>
                    <p className='flex justify-center gap-2 items-center'>Made with <Coffee className='h-6 w-6'/>&<Heart className='h-6 w-6 text-red-500'/> by Karan</p>
                    <br />
                    <hr />
                </div>
                <div className='flex justify-center items-center flex-col gap-5 p-5 rounded-lg backdrop-blur'>
                    <h1 className='text-2xl text-gray-400 underline'>Socials</h1>
                    <div className='flex justify-center items-center gap-10 mt-3'>
                        <Link to={`https://x.com/karan_9M`}><TwitterIcon/></Link>
                        <Link to={`https://github.com/Karan9M`}><Github/></Link>
                        <Link to={`https://instagram.com//9__karan`}><Instagram/></Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Layout