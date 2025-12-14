import { Card, ICardData } from './Card';

export interface ICardPreviewActions {
    onClick: (event: MouseEvent) => void;
}

export class CardPreview extends Card<ICardData> {
    constructor(container: HTMLElement, actions?: ICardPreviewActions) {
        super(container);
        
        if (actions?.onClick && this._button) {
            this._button.addEventListener('click', actions.onClick);
        }
    }
}