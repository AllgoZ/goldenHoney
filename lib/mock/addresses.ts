import type { Address } from '@/types'

export const mockAddresses: Address[] = [
  {
    id: 'addr_001',
    label: 'Home',
    firstName: 'Nagul',
    lastName: 'Lugan',
    phone: '+91 98765 43210',
    addressLine1: '14, Neem Tree Lane, Koramangala 5th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560095',
    country: 'India',
    isDefault: true,
  },
  {
    id: 'addr_002',
    label: 'Office',
    firstName: 'Nagul',
    lastName: 'Lugan',
    phone: '+91 98765 43210',
    addressLine1: '3rd Floor, Prestige Tech Park, Outer Ring Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    country: 'India',
    isDefault: false,
  },
]
