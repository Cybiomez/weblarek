import { IProduct } from "../../types";

export class MBasket {
    protected basketProductList: IProduct[];
    
    constructor() {
        this.basketProductList = []; 
    };

    getBasketProductList(): IProduct[] {
        return this.basketProductList;
    }

    addProduct(product: IProduct) {
        this.basketProductList.push(product);
    }

    delProduct(targetProduct: IProduct): void {
        const index = this.basketProductList.findIndex(product => product.id === targetProduct.id);
        if (index !== -1) this.basketProductList.splice(index, 1);
    }

    clearBasket(): void {
        this.basketProductList = [];
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