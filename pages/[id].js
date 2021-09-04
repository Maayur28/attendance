import React from 'react';
import Navbar from '../navbar';
import styles from '../styles/Home.module.css'
import {useRouter} from 'next/router'
export default function Slug(){
    const router=useRouter();
    console.log(router.query.id);
    return (
        <div className={styles.container}>
            <Navbar/>
        </div>
    )
}