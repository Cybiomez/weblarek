import { IBuyer } from "../../types";

export class MBuyer {
    protected payment: "card" | "cash" | "";
    protected address: string;
    protected email: string;
    protected phone: string;
    
    constructor() {
        this.payment = "";
        this.address = "";
        this.email = "";
        this.phone = "";
    }
 
    setBuyerData(buyerData: Partial<IBuyer>) {
        if (buyerData.payment !== undefined) {
            this.payment = buyerData.payment;
        }
        if (buyerData.address !== undefined) {
            this.address = buyerData.address;
        }
        if (buyerData.email !== undefined) {
            this.email = buyerData.email;
        }
        if (buyerData.phone !== undefined) {
            this.phone = buyerData.phone;
        }
    }   
    
    getBuyerData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone
        };
    }

    clearBuyerData(): void {
        this.payment = "";
        this.address = "";
        this.email = "";
        this.phone = "";
    }

    isValid(): { [key in keyof IBuyer]?: string } {
        const errors: { [key in keyof IBuyer]?: string } = {};

        if (this.payment !== "card" && this.payment !== "cash") {
            errors.payment = "Необходимо выбрать вид оплаты";
        }

        if (!this.address || this.address.trim() === "") {
            errors.address = "Необходимо указать адрес";
        }

        if (!this.email || this.email.trim() === "") {
            errors.email = "Необходимо указать email";
        }

        if (!this.phone || this.address.trim() === "") {
            errors.phone = "Необходимо указать номер телефона";
        }

        return errors;
    }
}