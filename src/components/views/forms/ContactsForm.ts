import { Form } from './Form';
import { IEvents } from '../../base/Events';

export interface IContactsFormData {
    email: string;
    phone: string;
    valid: boolean;
    errors?: Record<string, string>; 
}

export class ContactsForm extends Form<IContactsFormData> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);
        
        this._emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;
        this._phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
        
        // Обработчики изменения полей
        [this._emailInput, this._phoneInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    events.emit('contacts:change', this.getValue());
                });
            }
        });
        
        // Обработчик отправки формы
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            events.emit('contacts:submit', this.getValue());
        });
    }

    set email(value: string) {
        if (this._emailInput) {
            this._emailInput.value = value;
        }
    }

    set phone(value: string) {
        if (this._phoneInput) {
            this._phoneInput.value = value;
        }
    }

    getValue() {
        return {
            email: this._emailInput?.value || '',
            phone: this._phoneInput?.value || ''
        };
    }
}