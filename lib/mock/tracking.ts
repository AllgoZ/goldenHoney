import type { TrackingStep } from '@/types'

export function getMockTrackingSteps(status: string): TrackingStep[] {
  const allSteps: TrackingStep[] = [
    {
      key: 'placed',
      label: 'Order Placed',
      description: 'Your order has been received and payment confirmed',
      timestamp: '18 Jun 2026, 9:14 AM',
      completed: true,
      active: false,
    },
    {
      key: 'confirmed',
      label: 'Order Confirmed',
      description: 'Our team has verified and accepted your order',
      timestamp: '18 Jun 2026, 10:32 AM',
      completed: true,
      active: false,
    },
    {
      key: 'packed',
      label: 'Packed',
      description: 'Your order is carefully packed and ready for dispatch',
      timestamp: '18 Jun 2026, 3:15 PM',
      completed: false,
      active: false,
    },
    {
      key: 'shipped',
      label: 'Shipped',
      description: 'Your order is on its way with Delhivery Express',
      completed: false,
      active: false,
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      description: 'Your order is out for delivery today',
      completed: false,
      active: false,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      description: 'Your order has been delivered. Enjoy!',
      completed: false,
      active: false,
    },
  ]

  const statusOrder = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered']
  const currentIdx = statusOrder.indexOf(status)

  return allSteps.map((step, i) => ({
    ...step,
    completed: i < currentIdx,
    active: i === currentIdx,
  }))
}
