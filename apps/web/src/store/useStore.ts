import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    options?: any;
    addons?: any;
    variants?: any;
    type?: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    isGuest?: boolean;
}

interface DeliveryAddress {
    location: string;
    houseNo: string;
    floor?: string;
    buildingName: string;
    landmark?: string;
    type: string;
}

interface AppState {
    cart: CartItem[];
    user: User | null;
    location: string;
    deliveryAddress: DeliveryAddress | null;
    selectedAddressId: string | null;
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    setUser: (user: User | null) => void;
    setLocation: (location: string) => void;
    setDeliveryAddress: (address: DeliveryAddress | null) => void;
    setSelectedAddressId: (id: string | null) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            cart: [],
            user: null,
            location: '',
            deliveryAddress: null,
            selectedAddressId: null,
            addToCart: (item) =>
                set((state) => {
                    const existingItem = state.cart.find((i) => i.id === item.id);
                    if (existingItem) {
                        return {
                            cart: state.cart.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                            ),
                        };
                    }
                    return { cart: [...state.cart, { ...item, quantity: item.quantity }] };
                }),
            removeFromCart: (itemId) =>
                set((state) => ({
                    cart: state.cart.filter((i) => i.id !== itemId),
                })),
            clearCart: () => set({ cart: [] }),
            setUser: (user) => set({ user }),
            setLocation: (location) => set({ location }),
            setDeliveryAddress: (address) => set({ deliveryAddress: address }),
            setSelectedAddressId: (id) => set({ selectedAddressId: id }),
        }),
        {
            name: 'the-pizza-box-storage',
        }
    )
);
