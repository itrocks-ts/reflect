import { ReflectClass, ReflectProperty } from '../../esm/reflect.js'
import Product from './product.js'

const product      = new Product('Widget', 10)
const productClass = new ReflectClass(product)

console.log(productClass.name) // Product
console.log(productClass.propertyNames) // [ 'name', 'price' ]
console.log(await productClass.propertyTypes) // { name: String, price: Number }

const priceProperty = new ReflectProperty(productClass, 'price')

console.log(await priceProperty.type) // Number
console.log(priceProperty.value) // 10
