export interface Company {
  _id: string;
  name: string;
  email: string;
  gst: string;
  phone: string;
  address: string;
}

export interface Item {
    _id: string;
    name: string;
    brand: string;
    price: number;
    gst: string;
    subcategories: {
      _id: number;
      color: string;
      quantity: number;
      model: string;
      size: string;
      price: number;
    }[];
  }
 
export interface Subcategory {
    _id: string;
    color: string;
    quantity: number;
    model: string;
    size: string;
    price: number;
  }
    
