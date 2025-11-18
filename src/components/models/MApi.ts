import { IApi } from "../../types";
import { IProduct, IProductsResponse, IOrderRequest, IOrderResponse } from "../../types";

export class MApi {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProductList(): Promise<IProduct[]> {
        try {
            const data = await this.api.get<IProductsResponse>('/product/');
            return data.items;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            throw error; 
        }
    }

    async createOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
        try {
            const response = await this.api.post<IOrderResponse>('/order/', orderData);
            console.log('Заказ успешно создан:', response);
            return response;
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            throw error;
        }
    }
}