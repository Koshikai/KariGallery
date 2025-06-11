import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Artwork } from '@/types/database'

export interface CartItem {
  artwork: Artwork
  quantity: number
}

interface CartState {
  items: CartItem[]
  addToCart: (artwork: Artwork) => void
  removeFromCart: (artworkId: string) => void
  updateQuantity: (artworkId: string, quantity: number) => void
  clearCart: () => void
  getTotalAmount: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
        addToCart: (artwork) => {
        console.log('🛒 Store addToCart called with:', artwork.id, artwork.title)
        const currentItems = get().items
        console.log('🛒 Current items in store:', currentItems)
        const existingItem = currentItems.find(item => item.artwork.id === artwork.id)
        console.log('🛒 Existing item found:', existingItem)
        
        if (existingItem) {
          // アート作品は通常1点のみなので、既にカートにある場合は何もしない
          console.log('🛒 Item already exists, not adding')
          return
        }
        
        const newItems = [...currentItems, { artwork, quantity: 1 }]
        console.log('🛒 Setting new items:', newItems)
        set({
          items: newItems
        })
        console.log('🛒 Items updated successfully')
      },
      
      removeFromCart: (artworkId) => {
        set({
          items: get().items.filter(item => item.artwork.id !== artworkId)
        })
      },
      
      updateQuantity: (artworkId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(artworkId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.artwork.id === artworkId
              ? { ...item, quantity }
              : item
          )
        })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotalAmount: () => {
        return get().items.reduce(
          (total, item) => total + (item.artwork.price * item.quantity),
          0
        )
      },
      
      getTotalItems: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity,
          0
        )
      }
    }),
    {
      name: 'kari-gallery-cart',
      partialize: (state) => ({ items: state.items })
    }
  )
) 