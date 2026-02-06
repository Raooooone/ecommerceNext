// app/error/page.js
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center border border-red-100">
        <div className="text-red-500 mb-4 bg-red-50 p-3 rounded-full inline-block">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Oups ! Une erreur est survenue</h1>
        
        <p className="text-gray-600 mb-6 bg-red-50 p-4 rounded border border-red-100 text-sm">
          {message || "Une erreur inconnue s'est produite."}
        </p>
        
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => router.back()} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Retour
          </button>
          <Link 
            href="/products/manage" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Gestion Produits
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Chargement</div>}>
      <ErrorContent />
    </Suspense>
  )
}