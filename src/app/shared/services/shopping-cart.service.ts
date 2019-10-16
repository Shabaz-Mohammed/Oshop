import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  FirebaseObjectObservable
} from 'angularfire2/database';
import { Product } from 'shared/models/product';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { take } from 'rxjs/operators';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { Observable } from 'rxjs';

@Injectable()
export class ShoppingCartService {
  constructor(private db: AngularFireDatabase) {}

  async getCart(): Promise<Observable<ShoppingCart>> {
    const cartId = await this.getOrCreateCartId();
    return this.db
      .object('/shopping-carts/' + cartId)
      .map((x: any) => new ShoppingCart(x.items));
  }

  async addToCart(product: Product) {
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }

  async clearCart() {
    const cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }
  private create() {
    return this.db.list('/shopping-cart').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      return cartId;
    }

    const result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  private async updateItem(product: Product, change: number) {
    const cartId = await this.getOrCreateCartId();
    const item$ = this.getItem(cartId, product.$key);
    item$.pipe(take(1)).subscribe(item => {
      // tslint:disable-next-line:object-literal-shorthand
      const quantity = (item.quantity || 0) + change;
      if (quantity === 0) {
        item$.remove();
      } else {
        item$.update({
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: quantity
        });
      }
    });
  }
}
