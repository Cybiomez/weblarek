import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class MProductCatalog {
    protected productList: IProduct[];
    protected targetProduct: IProduct | undefined;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.productList = [];
        this.targetProduct = undefined;
        this.events = events;
    };

    setProductList(productList: IProduct[]) {
        this.productList = productList;
        this.events.emit('catalog:changed', this.productList);
    }

    getProductList(): IProduct[] {
        return this.productList;
    }

    getProductById(id: string): IProduct | undefined {
        return this.productList.find(product => product.id === id);
    }

    setTargetProduct(product: IProduct) {
        this.targetProduct = product;
        this.events.emit('product:selected', product);
    }

    getTargetProduct(): IProduct | undefined {
        return this.targetProduct;
    }
}