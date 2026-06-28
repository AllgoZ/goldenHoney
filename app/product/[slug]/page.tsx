'use client'
import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { getProductBySlug, getRelatedProducts } from '@/lib/services/product.service'
import ProductPageContent from './ProductPageContent'
import type { FSProduct } from '@/types/firebase'

export default function ProductPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [product, setProduct] = useState<FSProduct | null>(null)
  const [related, setRelated] = useState<FSProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundFlag, setNotFoundFlag] = useState(false)

  useEffect(() => {
    if (!slug) return

    Promise.all([
      getProductBySlug(slug),
    ]).then(async ([p]) => {
      if (!p) {
        setNotFoundFlag(true)
        setLoading(false)
        return
      }

      setProduct(p)

      try {
        const relatedProducts = await getRelatedProducts(p.categorySlug, p.id)
        setRelated(relatedProducts)
      } catch (error) {
        console.error('Error fetching related products:', error)
      }

      setLoading(false)
    }).catch((error) => {
      console.error('Error loading product:', error)
      setNotFoundFlag(true)
      setLoading(false)
    })
  }, [slug])

  if (notFoundFlag) {
    notFound()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-2 border-honey border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  return <ProductPageContent product={product} related={related} />
}
