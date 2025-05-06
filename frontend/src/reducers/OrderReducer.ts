import { Order } from '../types';

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export type OrderAction =
  | { type: 'FETCH_ORDERS_START' }
  | { type: 'FETCH_ORDERS_SUCCESS'; payload: Order[] }
  | { type: 'FETCH_ORDERS_ERROR'; payload: string }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'DELETE_ORDER'; payload: string };

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const orderReducer = (state: OrderState = initialState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'FETCH_ORDERS_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_ORDERS_SUCCESS':
      return {
        ...state,
        loading: false,
        orders: action.payload,
      };
    case 'FETCH_ORDERS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        ),
      };
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.payload),
      };
    default:
      return state;
  }
}; 