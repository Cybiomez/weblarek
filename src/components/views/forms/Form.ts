import { Component } from '../../base/Component';

export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected _inputs: HTMLInputElement[];

    constructor(container: HTMLElement) {
        super(container);
        
        this._submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this._errors = this.container.querySelector('.form__errors') as HTMLElement;
        this._inputs = Array.from(this.container.querySelectorAll('input')) as HTMLInputElement[];
    }

    set errors(value: Record<string, string>) {
        if (this._errors && value) {
            const errorMessages = Object.values(value).filter(msg => msg);
            this._errors.textContent = errorMessages.join(', ');
        }
    }

    clearErrors() {
        if (this._errors) {
            this._errors.textContent = '';
        }
    }

    set valid(value: boolean) {
        if (this._submitButton) {
            this._submitButton.disabled = !value;
        }
    }

    abstract getValue(): Record<string, string>;
}