import { Component } from '../../base/Component';
import { CDN_URL, categoryMap } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';

export interface ICardData {
    id: string;
    title: string;
    description?: string;
    category?: string;
    image?: string;
    price: number | null;
    buttonText?: string;
    buttonDisabled?: boolean;
}

export abstract class Card<T extends ICardData> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _button?: HTMLButtonElement;
    protected _description?: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._title = ensureElement<HTMLElement>('.card__title', this.container);
        this._price = ensureElement<HTMLElement>('.card__price', this.container);
        
        this._category = this.container.querySelector('.card__category') as HTMLElement;
        this._image = this.container.querySelector('.card__image') as HTMLImageElement;
        this._button = this.container.querySelector('.card__button') as HTMLButtonElement;
        this._description = this.container.querySelector('.card__text') as HTMLElement;
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        if (this._price) {
            if (value === null) {
                this._price.textContent = 'Бесценно';
            } else {
                this._price.textContent = `${value} синапсов`;
            }
        }
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            
            // Удаляем старые классы категорий
            Object.values(categoryMap).forEach(className => {
                this._category!.classList.remove(className);
            });
            
            // Добавляем новый класс
            const categoryClass = categoryMap[value as keyof typeof categoryMap];
            if (categoryClass) {
                this._category.classList.add(categoryClass);
            }
        }
    }

    set image(value: string) {
        if (this._image && value) {
            this._image.src = CDN_URL + value;
            this._image.alt = '';
        }
    }

    set description(value: string) {
        if (this._description) {
            this._description.textContent = value;
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }

    set buttonDisabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
        }
    }
}