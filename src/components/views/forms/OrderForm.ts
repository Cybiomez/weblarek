import { Form } from './Form';
import { IEvents } from '../../base/Events';

export interface IOrderFormData {
    payment: string;
    address: string;
    valid: boolean;
}

export class OrderForm extends Form<IOrderFormData> {
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _addressInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);
        
        this._paymentButtons = this.container.querySelectorAll('.button_alt') as NodeListOf<HTMLButtonElement>;
        this._addressInput = this.container.querySelector('input[name="address"]') as HTMLInputElement;
        
        // Обработчики для кнопок оплаты
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.getAttribute('name');
                if (payment) {
                    events.emit('order.payment:change', { payment });
                }
            });
        });
        
        // Обработчик для поля адреса
        if (this._addressInput) {
            this._addressInput.addEventListener('input', () => {
                events.emit('order.address:change', { address: this._addressInput.value });
            });
        }
        
        // Обработчик отправки формы
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const activePaymentButton = Array.from(this._paymentButtons).find(btn => 
                btn.classList.contains('button_alt-active')
            );
            
            events.emit('order:submit', {
                payment: activePaymentButton?.getAttribute('name') || '',
                address: this._addressInput?.value || ''
            });
        });
    }

    set payment(value: string) {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.getAttribute('name') === value);
        });
    }

    set address(value: string) {
        if (this._addressInput) {
            this._addressInput.value = value;
        }
    }

}