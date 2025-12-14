import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IBasketData {
    items: HTMLElement[];
    total: number;
    selected: boolean;
}

export class Basket extends Component<IBasketData> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        
        this._list = this.container.querySelector('.basket__list') as HTMLElement;
        this._total = this.container.querySelector('.basket__price') as HTMLElement;
        this._button = this.container.querySelector('.basket__button') as HTMLButtonElement;
        
        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('basket:order');
            });
        }
    }

    set items(items: HTMLElement[]) {
        // Полностью очищаем список
        this._list.innerHTML = '';
        
        if (items.length > 0) {
            // Добавляем товары
            items.forEach(item => this._list.appendChild(item));
            this.selected = true;
        } else {
            // Создаем элемент "Корзина пуста"
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'Корзина пуста';
            emptyMessage.classList.add('basket__empty');
            this._list.appendChild(emptyMessage);
            this.selected = false;
        }
    }

    set total(value: number) {
        if (this._total) {
            this._total.textContent = `${value} синапсов`;
        }
    }

    set selected(value: boolean) {
        if (this._button) {
            this._button.disabled = !value;
        }
    }

}