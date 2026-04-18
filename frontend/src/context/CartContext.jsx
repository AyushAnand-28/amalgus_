import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i._id === action.payload._id && i.selectedVendorId === action.payload.selectedVendorId && i.selectedThickness === action.payload.selectedThickness);
      if (existing) {
        return { ...state, items: state.items.map(i => i._id === existing._id && i.selectedVendorId === existing.selectedVendorId ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((_, idx) => idx !== action.payload) };
    case 'UPDATE_QTY':
      return { ...state, items: state.items.map((item, idx) => idx === action.payload.idx ? { ...item, qty: action.payload.qty } : item) };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: JSON.parse(localStorage.getItem('amalgus_cart') || '[]'),
  });

  useEffect(() => {
    localStorage.setItem('amalgus_cart', JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((s, i) => s + i.qty, 0);
  const subtotal = state.items.reduce((s, i) => {
    const sqFt = ((i.width || 1000) / 304.8) * ((i.height || 1000) / 304.8);
    return s + sqFt * i.qty * (i.pricePerSqFt || 0);
  }, 0);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (idx) => dispatch({ type: 'REMOVE_ITEM', payload: idx });
  const updateQty = (idx, qty) => dispatch({ type: 'UPDATE_QTY', payload: { idx, qty } });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  return (
    <CartContext.Provider value={{ items: state.items, totalItems, subtotal, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
