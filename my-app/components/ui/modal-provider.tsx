"use client";

import { useEffect, useState } from "react";
import { ProModal } from "./pro-modal";

export const ModalProvider = () => {
    const [isMoounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMoounted) {
        return null
    }

    return (
        <>
        <ProModal/>
        </>
    )
}