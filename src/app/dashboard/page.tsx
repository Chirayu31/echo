'use client';
import categoriesAtom from '@/atoms/categoriesAtom'
import CategoryCard from '@/components/category/categoryCard'
import Navbar from '@/components/category/navbar'
import axios from 'axios'
import Link from 'next/link';
import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'

const Dashboard = () => {
    const [categories, setCategories] = useRecoilState(categoriesAtom)

    async function fetchCategories() {
        try {
            const { data } = await axios.get('/api/category')
            return data.categories
        } catch (error) {
            console.log(error)
        }
    }

    async function get() {
        setCategories(await fetchCategories());
    }

    useEffect(() => {
        get();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<>
        <Navbar />
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 mx-8 md:mx-20 lg:mx-32' >
            {categories?.map(category => (
                <div key={category._id}>
                    <Link href={`/dashboard/${category._id}`}>
                        <CategoryCard createdAt={category.createdAt} name={category.name} type={category.type} _id={category._id} key={category._id} />
                    </Link>
                </div>
            ))}
        </div >
    </>
    )
}

export default Dashboard