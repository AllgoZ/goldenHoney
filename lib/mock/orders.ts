import type { Order } from '@/types'
import { products } from './products'
import { mockAddresses } from './addresses'

export const mockOrders: Order[] = [
  {
    id: 'ord_001',
    orderNumber: 'GH2F4A9B',
    items: [
      { product: products[0], quantity: 2, price: products[0].price, selectedWeight: '250g' },
      { product: products[6], quantity: 1, price: products[6].price, selectedWeight: 'Standard Set (12 pieces)' },
    ],
    status: 'delivered',
    subtotal: 7597,
    shipping: 0,
    tax: 684,
    total: 8281,
    createdAt: '2026-05-10T10:30:00Z',
    estimatedDelivery: '2026-05-14',
    address: mockAddresses[0],
    trackingNumber: 'GHTRACK001',
    paymentMethod: 'UPI',
  },
  {
    id: 'ord_002',
    orderNumber: 'GH3C8D1E',
    items: [
      { product: products[3], quantity: 1, price: products[3].price, selectedWeight: '3 × 100g' },
    ],
    status: 'shipped',
    subtotal: 3999,
    shipping: 0,
    tax: 360,
    total: 4359,
    createdAt: '2026-06-12T14:20:00Z',
    estimatedDelivery: '2026-06-17',
    address: mockAddresses[0],
    trackingNumber: 'GHTRACK002',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ord_003',
    orderNumber: 'GH7E2F5A',
    items: [
      { product: products[5], quantity: 1, price: products[5].price, selectedWeight: '250g' },
      { product: products[9], quantity: 1, price: products[9].price, selectedWeight: '200g' },
    ],
    status: 'confirmed',
    subtotal: 10498,
    shipping: 0,
    tax: 945,
    total: 11443,
    createdAt: '2026-06-18T09:15:00Z',
    estimatedDelivery: '2026-06-22',
    address: mockAddresses[1],
    paymentMethod: 'Net Banking',
  },
]

export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((o) => o.id === id)
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return mockOrders.find((o) => o.orderNumber === orderNumber)
}
