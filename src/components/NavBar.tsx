import Link from 'next/link'
import React from 'react'

function NavBar() {
    return (
        <div>
            <ul className='p-3 bg-[#ffffff50] flex justify-around'>
                <Link href={'/first'} className='bg-gray-800 p-3 rounded'>First FetchData </Link>
                <Link href={'/all-todos'} className='bg-gray-800 p-3 rounded'>All Todos </Link>
                <Link href={'/query'} className='bg-gray-800 p-3 rounded'>QueryCart</Link>
                <Link href={'/querytest'} className='bg-gray-800 p-3 rounded'>QueryTesting</Link>
            </ul>
        </div>
    )
}

export default NavBar