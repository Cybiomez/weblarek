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
                    this.payment = payment;
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
            events.emit('order:submit', this.getValue());
        });
    }

    set payment(value: string) {
        this._paymentButtons.forEach(button => {
            if (button.getAttribute('name') === value) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    set address(value: string) {
        if (this._addressInput) {
            this._addressInput.value = value;
        }
    }

    getValue() {
        const paymentButton = Array.from(this._paymentButtons).find(btn => 
            btn.classList.contains('button_alt-active')
        );
        
        return {
            payment: paymentButton?.getAttribute('name') || '',
            address: this._addressInput?.value || ''
        };
    }
}