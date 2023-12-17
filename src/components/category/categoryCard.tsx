import React from 'react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Trash } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../ui/use-toast';
import { useSetRecoilState } from 'recoil';
import categoriesAtom from '@/atoms/categoriesAtom';

interface CategoryCardProps {
    name: string;
    type: string;
    createdAt?: Date;
    _id: string
}

const typeColors = {
    expense: 'text-red-500',
    income: 'text-green-500',
    saving: 'text-blue-500',
};

const calculateTimeDifference = (createdAt: string | Date): string => {
    const dateObject = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    const now = new Date();
    const diffInMilliseconds = now.getTime() - dateObject.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
        return `${diffInHours}h ago`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes}m ago`;
    } else {
        return 'Just now';
    }
};

const CategoryCard: React.FC<CategoryCardProps> = ({ name, type, createdAt, _id }) => {
    const trimmedName = name.length > 6 ? name.substring(0, 6) + '...' : name;
    const setCategories = useSetRecoilState(categoriesAtom)
    const { toast } = useToast()

    const deleteCategory = async () => {
        try {
            await axios.delete(`/api/category/${_id}`);
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category._id !== _id)
            );
            toast({ title: `${name} deleted` });
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <Card className='max-w-[350px] border-2 drop-shadow-sm cursor-pointer'>
            <CardHeader className='flex flex-row items-center gap-6'>
                <div className={` w-10 h-10 bg-[#a7a7a7] rounded-full`}></div>
                <CardTitle className="font-bold text-2xl">
                    {trimmedName}
                </CardTitle>
                <CardDescription className={`font-semibold text-md  ${(typeColors as any)[type]}`}>
                    {type}
                </CardDescription>
            </CardHeader>
            <CardFooter className='flex justify-around'>
                <p className='text-gray-600/90 font-semibold'>
                    created {createdAt ? calculateTimeDifference(createdAt) : 'unknown time ago'}
                </p>

                <Trash className='text-red-400 hover:text-red-500' onClick={deleteCategory} />
            </CardFooter>
        </Card>
    )
}

export default CategoryCard