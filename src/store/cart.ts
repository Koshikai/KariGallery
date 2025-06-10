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
        const currentItems = get().items
        const existingItem = currentItems.find(item => item.artwork.id === artwork.id)
        
        if (existingItem) {
          // アート作品は通常1点のみなので、既にカートにある場合は何もしない
          return
        }
        
        set({
          items: [...currentItems, { artwork, quantity: 1 }]
        })
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