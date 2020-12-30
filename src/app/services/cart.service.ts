import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(newCartItem: CartItem) {
    //Check if the item already exist in the cart
    let alreadyExistingInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {

      //find the item based on Id  
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === newCartItem.id);
      //check if found
      alreadyExistingInCart = existingCartItem != undefined;
      
    }

    if(alreadyExistingInCart){
      existingCartItem.quantity++;
    }else{
      this.cartItems.push(newCartItem);
    }

    this.computeCartTotals();
  }


  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;


    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, subTotalPrice: ${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }

  decrementQuantity(cartItem: CartItem) {
    
    cartItem.quantity--;

    if(cartItem.quantity == 0){
      this.remove(cartItem);
    }else{
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id == cartItem.id);

    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }

    
  }

}
