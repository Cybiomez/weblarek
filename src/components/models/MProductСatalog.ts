import { IProduct } from "../../types";

export class MProductСatalog {
    protected productList: IProduct[];
    protected targetProduct: IProduct | undefined;

    constructor(productList: IProduct[]) {
        this.productList = productList;
        this.targetProduct = undefined;
    };

    set setProductList(productList: IProduct[]) {
        this.productList = productList;
    }

    get getProductList(): IProduct[] {
        return this.productList;
    }

    getProductById(id: string): IProduct | undefined {
        return this.productList.find(product => product.id === id);
    }

    set setTargetProduct(product: IProduct) {
        this.targetProduct = product;
    }

    get getTargetProduct(): IProduct {
        if (!this.targetProduct) {
            throw new Error("Продукт не выбран");
        }
        return this.targetProduct;
    }
}