import { Card, ICardData } from './Card';

export interface ICardCatalogActions {
    onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<ICardData> {
    constructor(container: HTMLElement, actions?: ICardCatalogActions) {
        super(container);
        
        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

}