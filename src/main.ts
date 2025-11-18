import './scss/styles.scss';

import { MProductСatalog } from './components/models/MProductСatalog';
import { MBasket } from './components/models/MBasket';
import { MBuyer } from './components/models/MBuyer';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { MApi } from './components/models/MApi';

import { apiProducts } from './utils/data';

// ТЕСТИРОВАНИЕ МОДЕЛЕЙ
// 1. СОЗДАНИЕ ВСЕХ ЭКЗЕМПЛЯРОВ
const productModel = new MProductСatalog([]);
const basketModel = new MBasket();
const buyerModel = new MBuyer();
const apiClient = new Api(API_URL);
const api = new MApi(apiClient);

// 2. ТЕСТ МОДЕЛИ КАТАЛОГА (статические данные)
console.log('=== ТЕСТ MProductCatalog ===');
// Получаю список товаров
productModel.setProductList = apiProducts.items;
console.log('Каталог товаров:', productModel.getProductList);
console.log('Поиск товара по ID:', productModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390"));
// Получаю выбранный товар
productModel.setTargetProduct = productModel.getProductList[0];
console.log('Выбранный товар:', productModel.getTargetProduct);

// 3. ТЕСТ МОДЕЛИ КОРЗИНЫ
console.log('=== ТЕСТ MBasket ===');
console.log('Корзина пустая:', JSON.parse(JSON.stringify(basketModel.getBasketProductList)));
// Сохраняю в корзину товары
basketModel.addProduct = productModel.getProductList[0];
basketModel.addProduct = productModel.getProductList[1];
console.log('После добавления товаров:', JSON.parse(JSON.stringify(basketModel.getBasketProductList)));
// Удалаяю из корзины товар
basketModel.delProduct(productModel.getProductList[0]);
console.log('После удаления товара:', JSON.parse(JSON.stringify(basketModel.getBasketProductList)));
console.log('Общая стоимость:', basketModel.getBasketTotal);
console.log('Количество товаров:', basketModel.getBasketCounter);
console.log('Проверка наличия товара:', basketModel.hasProduct(productModel.getProductList[0])? `Товар "${productModel.getProductList[0].title}" в корзине` : `Товар "${productModel.getProductList[0].title}" отсутствует`);
console.log('Проверка наличия товара:', basketModel.hasProduct(productModel.getProductList[1])? `Товар "${productModel.getProductList[1].title}" в корзине` : `Товар "${productModel.getProductList[1].title}" отсутствует`);
// Очищаю корзину
basketModel.clearBasket();
console.log('После очистки корзины:', JSON.parse(JSON.stringify(basketModel.getBasketProductList)));
console.log('Стоимость после очистки:', basketModel.getBasketTotal);
console.log('Количество после очистки:', basketModel.getBasketCounter);

// 4. ТЕСТ МОДЕЛИ ПОКУПАТЕЛЯ
console.log('=== ТЕСТ MBuyer ===');
console.log('Данные покупателя (пустые):', JSON.parse(JSON.stringify(buyerModel.getBuyerData)));
console.log('Валидность (все поля пустые):', buyerModel.isValid() === true ? "Всё верно" : buyerModel.isValid());
// Сохраняю способ оплаты
buyerModel.setBuyerData = {payment: "card"};
console.log('После добавления оплаты:', JSON.parse(JSON.stringify(buyerModel.getBuyerData)));
console.log('Валидность (только оплата):', buyerModel.isValid() === true ? "Всё верно" : buyerModel.isValid());
// Сохраняю адрес
buyerModel.setBuyerData = {address: "ул. Тестовая"};
console.log('После добавления адреса:', JSON.parse(JSON.stringify(buyerModel.getBuyerData)));
console.log('Валидность (оплата + адрес):', buyerModel.isValid() === true ? "Всё верно" : buyerModel.isValid());
// Сохраняю Email
buyerModel.setBuyerData = {email: "test@mail.ru"};
console.log('После добавления email:', JSON.parse(JSON.stringify(buyerModel.getBuyerData)));
console.log('Валидность (оплата + адрес + email):', buyerModel.isValid() === true ? "Всё верно" : buyerModel.isValid());
// Сохраняю номер телефона
buyerModel.setBuyerData = {phone: "88005553535"};
console.log('Данные покупателя (все поля):', JSON.parse(JSON.stringify(buyerModel.getBuyerData)));
console.log('Валидность (все поля заполнены):', buyerModel.isValid() === true ? "Всё верно" : buyerModel.isValid());
// Очищаю данные покупателя
buyerModel.clearBuyerData();
console.log('После очистки:', JSON.parse(JSON.stringify(buyerModel.getBuyerData)));
console.log('Валидность после очистки:', buyerModel.isValid() === true ? "Всё верно" : buyerModel.isValid());

// 5. ТЕСТ API (на основе протестированных моделей)
console.log('=== ТЕСТ MApi ===');
// Получаю список товаров
const products = await api.getProductList();
console.log('Товары с сервера:', products);
productModel.setProductList = products;
console.log('Каталог товаров:', productModel.getProductList);
// Сохраняю в корзину товары
basketModel.addProduct = productModel.getProductList[8];
basketModel.addProduct = productModel.getProductList[9];
console.log(`Массив товаров из корзины:`, JSON.parse(JSON.stringify(basketModel.getBasketProductList)));
// Добавляю данные покупателя
buyerModel.setBuyerData = {payment: "card"};
buyerModel.setBuyerData = {address: "Там, не знаю где"};
buyerModel.setBuyerData = {email: "test@mail.ru"};
buyerModel.setBuyerData = {phone: "88005553535"};
console.log(`Данные покупателя:`, JSON.parse(JSON.stringify(buyerModel.getBuyerData)));
console.log(`Валидность данных:`, buyerModel.isValid() === true ? "Всё верно" : buyerModel.isValid());
// Отправляю запрос на создание заказа
const orderResponse = await api.createOrder({
    ...buyerModel.getBuyerData,
    total: basketModel.getBasketTotal,
    items: basketModel.getBasketProductList.map(product => product.id)
});
console.log('Ответ сервера на заказ:', orderResponse);