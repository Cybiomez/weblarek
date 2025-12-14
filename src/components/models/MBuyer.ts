import { IBuyer, TErrors } from "../../types";
import { EventEmitter } from "../base/Events";

export class MBuyer {
    protected payment: "card" | "cash" | "";
    protected address: string;
    protected email: string;
    protected phone: string;
    protected events: EventEmitter;
    
    constructor(events: EventEmitter) {
        this.payment = "";
        this.address = "";
        this.email = "";
        this.phone = "";
        this.events = events;
    }
 
    setBuyerData(buyerData: Partial<IBuyer>) {
        let changed = false;
        
        if (buyerData.payment !== undefined && this.payment !== buyerData.payment) {
            this.payment = buyerData.payment;
            changed = true;
        }
        if (buyerData.address !== undefined && this.address !== buyerData.address) {
            this.address = buyerData.address;
            changed = true;
        }
        if (buyerData.email !== undefined && this.email !== buyerData.email) {
            this.email = buyerData.email;
            changed = true;
        }
        if (buyerData.phone !== undefined && this.phone !== buyerData.phone) {
            this.phone = buyerData.phone;
            changed = true;
        }
        
        if (changed) {
            this.events.emit('buyer:changed', this.getBuyerData());
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
        this.events.emit('buyer:changed', this.getBuyerData());
    }

    validateOrder(): TErrors {
        const errors: TErrors = {};

        if (this.payment !== "card" && this.payment !== "cash") {
            errors.payment = "Необходимо выбрать вид оплаты";
        }

        if (!this.address || this.address.trim() === "") {
            errors.address = "Необходимо указать адрес";
        }

        return errors;
    }

    validateContacts(): TErrors {
        const errors: TErrors = {};

        if (!this.email || this.email.trim() === "") {
            errors.email = "Необходимо указать email";
        }

        if (!this.phone || this.phone.trim() === "") {
            errors.phone = "Необходимо указать номер телефона";
        }

        return errors;
    }
}