const sleep = (duration) => new Promise((resolve, _) => {
    setTimeout(resolve, duration)
})

class Product {
    constructor({ id, title, price, img, thumb }) {
        this.id = id
        this.title = title
        this.price = price
        this.img = img || "http://ljshopch.com/wp-content/photos/2017/10/30ba465a45eb430de7ae86eed63302bd-250x150.jpg"
        this.thumb = thumb || "https://pp.userapi.com/c10369/u67429487/d_b07f643c.jpg"
    }
}

class CatalogProduct extends Product {}

class CartProduct extends Product {
    constructor(opts) {
        super(opts)
        this.quantity = opts.quantity || 1
        this.total = this.price * this.quantity
    }
    inc() {
        this.quantity++
        this.total += this.price
    }
    dec() {
        this.quantity--
        this.total -= this.price
    }
}

class DB {
    constructor() {
        this.url = 'http://localhost:3000/api'
    }
    async getAll() {
        // await sleep(2000)
        return fetch(this.url + '/catalog')
            .then(res => res.ok && res || Promise.reject('Сервер вернул ошибку ' + res.status))
            .then(res => res.json())
            .then(data => data.map(i => new CatalogProduct(i)))
    }
    async getCart() {
        // await sleep(1500)
        return fetch(this.url + '/cart')
            .then(res => res.ok && res || Promise.reject('Сервер вернул ошибку ' + res.status))
            .then(res => res.json())
            .then(cart => ({
                ...cart,
                contents: cart.items.map(i => new CartProduct(i))
            }))
    }
    async buy(product) {
        return fetch(this.url + '/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: product.id, quantity: 1 })
            })
            .then(res => res.ok && res || Promise.reject('Сервер вернул ошибку ' + res.status))
            .then(res => res.json())
            .then(({ result }) => {
                if (result === 1) {
                    return Promise.resolve(new CartProduct(product))
                }
                return Promise.reject()
            })
    }
    async remove(product) {
        return fetch(this.url + '/cart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: product.id, quantity: 1 })
            })
            .then(res => res.ok && res || Promise.reject('Сервер вернул ошибку ' + res.status))
            .then(res => res.json())
            .then(({ result }) => {
                if (result === 1) {
                    return Promise.resolve()
                }
                return Promise.reject()
            })
    }
}

const db = new DB()

export default db