import './scss/styles.scss';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

import { MProductCatalog } from './components/models/MProductCatalog';
import { MBasket } from './components/models/MBasket';
import { MBuyer } from './components/models/MBuyer';
import { MApi } from './components/models/MApi';

import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils';

import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { SuccessModal } from './components/views/SuccesModel';
import { OrderForm } from './components/views/forms/OrderForm';
import { ContactsForm } from './components/views/forms/ContactsForm';

import { CardCatalog } from './components/views/cards/CardCatalog';
import { CardPreview } from './components/views/cards/CardPreview';
import { CardBasket } from './components/views/cards/CardBasket';

import { IProduct, IOrderRequest } from './types';

const events = new EventEmitter();

const productModel = new MProductCatalog(events);
const basketModel = new MBasket(events);
const buyerModel = new MBuyer(events);

const apiClient = new Api(API_URL);
const api = new MApi(apiClient);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));
const successModal = new SuccessModal(events, cloneTemplate('#success'));
const basket = new Basket(events, cloneTemplate('#basket'));
const orderForm = new OrderForm(events, cloneTemplate('#order'));
const contactsForm = new ContactsForm(events, cloneTemplate('#contacts'));

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

function updateCatalog(): void {
    const products = productModel.getProductList();
    const cards = products.map(product => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => {
                // View генерирует событие выбора карточки
                events.emit('card:select', product);
            }
        });
        
        return card.render({
            title: product.title,
            price: product.price,
            category: product.category,
            image: product.image
        });
    });
    
    gallery.render({ catalog: cards });
}

function updateBasket(): void {
    const products = basketModel.getBasketProductList();
    const total = basketModel.getBasketTotal();
    const count = basketModel.getBasketCounter();
    
    header.render({ counter: count });
    
    const basketCards = products.map((product, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                // View генерирует событие удаления из корзины
                events.emit('basket:remove', product);
            }
        });
        
        return card.render({
            title: product.title,
            price: product.price,
            index: index + 1
        });
    });
    
    basket.render({
        items: basketCards,
        total: total,
        selected: products.length > 0
    });
}

const isOrderValid = () => Object.keys(buyerModel.validateOrder()).length === 0;
const isContactsValid = () => Object.keys(buyerModel.validateContacts()).length === 0;

// 1. ОБРАБОТКА СОБЫТИЙ ОТ МОДЕЛЕЙ
events.on('catalog:changed', () => {
    console.log('Модель: каталог изменился');
    updateCatalog();
});

events.on('basket:changed', () => {
    console.log('Модель: корзина изменилась');
    updateBasket();
});

// 2. ОБРАБОТКА СОБЫТИЙ ОТ VIEW (пользовательские действия)
events.on('card:select', (product: IProduct) => {
    console.log('View: выбрана карточка', product.title);
    
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (basketModel.hasProduct(product)) {
                events.emit('card:remove', product);
            } else if (product.price !== null) {
                events.emit('card:add', product);
            }
            modal.close();
        }
    });
    
    modal.render({ 
        content: card.render({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            buttonText: product.price === null 
                ? 'Недоступно' 
                : basketModel.hasProduct(product) 
                    ? 'Удалить' 
                    : 'В корзину',
            buttonDisabled: product.price === null
                    })
    });

    modal.open();
});

events.on('card:add', (product: IProduct) => {
    console.log('View: добавление товара в корзину', product.title);
    basketModel.addProduct(product);
});

events.on('card:remove', (product: IProduct) => {
    console.log('View: удаление товара из корзины', product.title);
    basketModel.delProduct(product);
});

events.on('basket:remove', (product: IProduct) => {
    console.log('View: удаление из корзины', product.title);
    basketModel.delProduct(product);
});

events.on('basket:open', () => {
    console.log('View: открытие корзины');
    modal.render({ content: basket.render() });
    modal.open();
});

events.on('basket:order', () => {
    console.log('View: оформление заказа');
    modal.render({ 
        content: orderForm.render({
            payment: buyerModel.getBuyerData().payment,
            address: buyerModel.getBuyerData().address,
            valid: isOrderValid()
        })
    });
    orderForm.errors = buyerModel.validateOrder();
});

events.on('order.payment:change', (data: { payment: string }) => {
    console.log('View: изменение способа оплаты', data.payment);
    buyerModel.setBuyerData({ payment: data.payment as 'card' | 'cash' });
    orderForm.payment = data.payment; 
    orderForm.errors = buyerModel.validateOrder();
    orderForm.render({ 
        valid: isOrderValid()
    });
});

events.on('order.address:change', (data: { address: string }) => {
    console.log('View: изменение адреса', data.address);
    buyerModel.setBuyerData({ address: data.address });
    orderForm.errors = buyerModel.validateOrder();
    orderForm.render({ 
        valid: isOrderValid()
    });
});

events.on('order:submit', () => {
    console.log('View: отправка формы заказа');
    modal.render({ 
        content: contactsForm.render({
            email: buyerModel.getBuyerData().email,
            phone: buyerModel.getBuyerData().phone,
            valid: isContactsValid()
        })
    });
    contactsForm.errors = buyerModel.validateContacts();
});

events.on('contacts:change', (data) => {
    console.log('View: изменение контактов', data);
    buyerModel.setBuyerData(data);
    contactsForm.errors = buyerModel.validateContacts();
    contactsForm.render({ 
        valid: isContactsValid()
    });
});

events.on('contacts:submit', () => {
    console.log('View: отправка формы контактов');
    const orderErrors = buyerModel.validateOrder();
    const contactsErrors = buyerModel.validateContacts();
    const allErrors = { ...orderErrors, ...contactsErrors };
    
    contactsForm.errors = allErrors;
    
    if (Object.keys(allErrors).length === 0) {
        const buyerData = buyerModel.getBuyerData();
        const basketItems = basketModel.getBasketProductList();
        
        const orderData: IOrderRequest = {
            ...buyerData,
            total: basketModel.getBasketTotal(),
            items: basketItems.map(item => item.id)
        };
        
        api.createOrder(orderData)
            .then(response => {
                console.log('API: заказ создан успешно');
                modal.render({ 
                    content: successModal.render({ total: response.total })
                });
                
                basketModel.clearBasket();
                buyerModel.clearBuyerData();
            })
            .catch(error => {
                console.error('API: ошибка оформления заказа:', error);
            });
    } else {
        contactsForm.render({ 
            valid: false
        });
    }
});

events.on('success:close', () => {
    console.log('View: закрытие окна уведомления о заказе');
    modal.close();
});

// 3. ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
api.getProductList()
    .then(products => {
        console.log('API: товары загружены');
        productModel.setProductList(products);
        updateBasket(); 
    })
    .catch(error => {
        console.error('API: ошибка загрузки товаров, используем тестовые данные');
        productModel.setProductList(apiProducts.items);
        updateBasket();
    });

// 4. ТЕСТОВЫЙ РЕЖИМ, по умолчанию выключен - false, включить - true

const TEST_MODE = false;

if (TEST_MODE) {
    const testProductModel = new MProductCatalog(events);
    const testBasketModel = new MBasket(events);
    const testBuyerModel = new MBuyer(events);

    testProductModel.setProductList(apiProducts.items);
    console.log('Каталог товаров:', testProductModel.getProductList());
    
    testBasketModel.addProduct(testProductModel.getProductList()[0]);
    testBasketModel.addProduct(testProductModel.getProductList()[1]);
    console.log('Корзина:', testBasketModel.getBasketProductList());
    
    console.log('=== ТЕСТ ВАЛИДАЦИИ ПОКУПАТЕЛЯ ===');
    
    console.log('1. Валидация заказа (пустые поля):');
    console.log('Ошибки:', testBuyerModel.validateOrder());
    
    testBuyerModel.setBuyerData({payment: 'card'});
    console.log('2. Валидация заказа (только payment):');
    console.log('Ошибки:', testBuyerModel.validateOrder());
    
    testBuyerModel.setBuyerData({address: 'ул. Тестовая'});
    console.log('3. Валидация заказа (payment + address):');
    console.log('Ошибки:', testBuyerModel.validateOrder());
    
    console.log('4. Валидация контактов (пустые):');
    console.log('Ошибки:', testBuyerModel.validateContacts());
    
    testBuyerModel.setBuyerData({email: 'test@mail.ru'});
    console.log('5. Валидация контактов (только email):');
    console.log('Ошибки:', testBuyerModel.validateContacts());
    
    testBuyerModel.setBuyerData({phone: '88005553535'});
    console.log('6. Валидация контактов (email + phone):');
    console.log('Ошибки:', testBuyerModel.validateContacts());
    
    testBuyerModel.clearBuyerData();
    console.log('7. После очистки:');
    console.log('Ошибки заказа:', testBuyerModel.validateOrder());
    console.log('Ошибки контактов:', testBuyerModel.validateContacts());
}