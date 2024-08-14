"use client"
import { useState } from 'react';
import Link from 'next/link';
import '@/styles/login.css';
import { loginSchema } from '@/utils/validations/user';
import { useFormik } from 'formik';
import fetchData from '@/utils/front/fetch';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import CreateEdit from '@/components/create-edit/CreateEdit';
require('dotenv').config();

const Create = () => {
    // const { session } = useSession();

    return (
        <CreateEdit />
    );
}

export default Create;
