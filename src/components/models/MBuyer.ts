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
 
    set setBuyerData(buyerData: Partial<IBuyer>) {
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
    
    get getBuyerData(): IBuyer {
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

    isValid(): string | true {
        if (this.payment !== "card" && this.payment !== "cash") {
            return "Необходимо выбрать вид оплаты";
        }
        if (!this.address || this.address.trim() === "") {
            return "Необходимо указать адрес";
        }
        if (!this.email || this.email.trim() === "") {
            return "Необходимо указать email";
        }
        if (!this.phone || this.phone.trim() === "") {
            return "Необходимо указать номер телефона";
        }
        return true;
    }
}