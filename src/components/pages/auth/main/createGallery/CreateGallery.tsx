'use client'

import Link from 'next/link'
import { useState, useContext } from 'react'
import { AuthLayout } from '@/components/pages/AuthLayout'
import { Button } from '@/components/pages/Button'
import { TextField } from '@/components/pages/Fields'
import { useRouter } from 'next/navigation'

//Page for creating a new gallery links to edit gallery
export default function CreateGallery() {
    const [album, setAlbum] = useState("");
    const router = useRouter();

    const onSubmit = () => {
        router.push("/auth/main/editGallery#" + album)
    };

    return (
        <AuthLayout
            title="Gallery Name"
            subtitle={
                <>
                    Enter the name of your new photo album below!{' '}
                </>
            }
        >
            <div>
                <div className="space-y-6">
                    <TextField
                        name="album"
                        type="album"
                        autoComplete="album"
                        value={album}
                        onChange={(event) => setAlbum(event.target.value)}
                        required
                    />
                </div>
                <Button onClick={() => onSubmit()} color="cyan" className="mt-8 w-full">
                    Create new album
                </Button>
            </div>
        </AuthLayout>
    )
}