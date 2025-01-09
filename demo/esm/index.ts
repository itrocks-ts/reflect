import { ReflectClass, ReflectProperty } from '../../esm/reflect.js'
import Product from './product.js'

const product      = new Product('Widget', 10)
const productClass = new ReflectClass(product)

console.log(productClass.name) // Product
console.log(productClass.propertyNames) // [ 'name', 'price' ]
console.log(productClass.propertyTypes) // { name: String, price: Number }

const priceProperty = new ReflectProperty(productClass, 'price')

console.log(priceProperty.type) // Number
console.log(priceProperty.value) // 10
