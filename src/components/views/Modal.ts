import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);
        
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        
        // Закрытие по клику на крестик
        this._closeButton.addEventListener('click', () => this.close());
        
        // Закрытие по клику вне окна
        container.addEventListener('click', (event) => {
            if (event.target === container) {
                this.close();
            }
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
        
        events.on('modal:open', () => this.open());
        events.on('modal:close', () => this.close());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        document.body.classList.add('page__wrapper_locked');
    }

    close() {
        this.container.classList.remove('modal_active');
        document.body.classList.remove('page__wrapper_locked');
    }
}