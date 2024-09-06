"use client"
import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("2202ff4c-03a0-4a7a-99ee-2993932b9d25")
    },[])

    return null
}