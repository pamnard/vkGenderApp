# vkGenderApp
Скрипт на GAS определяющий пол на основе данных API сайта vk.com

### Подготовка к работе

1. Создайте приложение в кабинете разработчика - https://vk.com/apps?act=manage
2. В разделе "Хранимые процедуры" создайте процедулу с именем "searchNames"
3. Добавьте код процедуры из файла `vkscript.js`
4. Добавьте в свой проект файл `VkGenderApp.gs`

### Применение

```javascript
function newName() {
  var vkAPI = new VkGenderApp({
    token: '***********************************************',
    lang: 'ru',
    v: '5.130'
  });
  var resultObj = vkAPI.getVkData('Александр');
  var report = vkAPI.parseVkData(resultObj);
  Logger.log(JSON.stringify(report));
}
```

Примеры ответа:
```javascript
{
    "name": "Александр", 
    "type": "first", // first | last - имя или фамилия
    "nameSynonyms": "Алекс, Олександр, Саня, Саша, Сашка", // Синонимы
    "data": {
        "popularity": 11581319, // Количество пользователей vk с таким именем\фамилией
        "maleShare": "0.99", // доля лиц мужского пола
        "femaleShare": "0.01" // доля лиц женского пола
    }
}
```
- - -
```javascript
{
    "name": "Саша",
    "type": "first",
    "nameSynonyms": null,
    "data": {
        "popularity": 2423090,
        "maleShare": "0.79",
        "femaleShare": "0.21"
    }
}
```
- - -
```javascript
{
    "name": "Козлов",
    "type": "last",
    "nameSynonyms": null,
    "data": {
        "popularity": 171023,
        "maleShare": "0.99",
        "femaleShare": "0.01"
    }
}
```
- - -
```javascript
{
    "name": "Меладзе",
    "type": "last",
    "nameSynonyms": null,
    "data": {
        "popularity": 2739,
        "maleShare": "0.59",
        "femaleShare": "0.41"
    }
}
```
