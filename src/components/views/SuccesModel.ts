import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface ISuccessModalData {
    total: number;
}

export class SuccessModal extends Component<ISuccessModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _description: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);
        
        this._closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;
        this._description = this.container.querySelector('.order-success__description') as HTMLElement;
        
        if (this._closeButton) {
            this._closeButton.addEventListener('click', () => {
                events.emit('success:close');
            });
        }
    }

    set total(value: number) {
        if (this._description) {
            this._description.textContent = `Списано ${value} синапсов`;
        }
    }
}