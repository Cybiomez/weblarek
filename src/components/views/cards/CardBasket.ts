import { Card, ICardData } from './Card';

interface ICardBasketData extends ICardData {
    index: number;
}

export interface ICardBasketActions {
    onClick: (event: MouseEvent) => void;
}

export class CardBasket extends Card<ICardBasketData> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardBasketActions) {
        super(container);
        
        this._index = this.container.querySelector('.basket__item-index') as HTMLElement;
        this._deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;
        
        if (actions?.onClick && this._deleteButton) {
            this._deleteButton.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        if (this._index) {
            this._index.textContent = String(value);
        }
    }
}