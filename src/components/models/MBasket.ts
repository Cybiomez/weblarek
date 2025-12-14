import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class MBasket {
    protected basketProductList: IProduct[];
    protected events: EventEmitter;
    
    constructor(events: EventEmitter) {
        this.basketProductList = []; 
        this.events = events;
    };

    getBasketProductList(): IProduct[] {
        return this.basketProductList;
    }

    addProduct(product: IProduct) {
        this.basketProductList.push(product);
        this.events.emit('basket:changed', this.basketProductList);
    }

    delProduct(targetProduct: IProduct): void {
        const index = this.basketProductList.findIndex(product => product.id === targetProduct.id);
        if (index !== -1) {
            this.basketProductList.splice(index, 1);
            this.events.emit('basket:changed', this.basketProductList);
        }
    }

    clearBasket(): void {
        this.basketProductList = [];
        this.events.emit('basket:changed', this.basketProductList);
    }

    getBasketTotal(): number {
        return this.basketProductList.reduce((total, product) => {
            if (product.price !== null) {
                return total + product.price;
            }
            return total;
        }, 0);
    }

    getBasketCounter(): number {
        return this.basketProductList.length;
    }

    hasProduct(targetProduct: IProduct): boolean {
        return this.basketProductList.some(product => product.id === targetProduct.id);
    }
}