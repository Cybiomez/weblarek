import { IProduct } from "../../types";

export class MProductСatalog {
    protected productList: IProduct[];
    protected targetProduct: IProduct | undefined;

    constructor() {
        this.productList = [];
        this.targetProduct = undefined;
    };

    setProductList(productList: IProduct[]) {
        this.productList = productList;
    }

    getProductList(): IProduct[] {
        return this.productList;
    }

    getProductById(id: string): IProduct | undefined {
        return this.productList.find(product => product.id === id);
    }

    setTargetProduct(product: IProduct) {
        this.targetProduct = product;
    }

    getTargetProduct(): IProduct {
        if (!this.targetProduct) {
            throw new Error("Продукт не выбран");
        }
        return this.targetProduct;
    }
}