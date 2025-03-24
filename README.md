[![npm version](https://img.shields.io/npm/v/@itrocks/reflect?logo=npm)](https://www.npmjs.org/package/@itrocks/reflect)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/reflect)](https://www.npmjs.org/package/@itrocks/reflect)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/reflect?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/reflect)
[![issues](https://img.shields.io/github/issues/itrocks-ts/reflect)](https://github.com/itrocks-ts/reflect/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# reflect

Runtime introspection of TypeScript classes and their properties,
including property types read from TypeScript declaration `.d.ts` files.

## Installation

To use the Reflect API in your project, install the package:
```sh
npm i @itrocks/reflect
```

## Basic Usage

The `product.ts` script:
```ts
export class Product
{
	name:     string
	price:    number
	basedOn?: Product
	history:  Product[] = []

	constructor(name: string, price: number)
	{
		this.name  = name
		this.price = price
	}

}
```

The `index.ts` main script:
```ts
import '@itrocks/class-file/automation'
import { ReflectClass, ReflectProperty } from '@irocks/reflect'
import { Product } from './product'

const product      = new Product('Widget', 10)
const productClass = new ReflectClass(product)

console.log(productClass.name)  // Product
console.log(productClass.propertyNames)  // ['basedOn', 'history', 'name', 'price']
console.log(productClass.propertyTypes)  // { name: String, price: Number, basedOn: class Product, history: { containerType: Array, elementType: class Product } }

const priceProperty = new ReflectProperty(productClass, 'price')

console.log(priceProperty.type)  // Number
console.log(priceProperty.value)  // 10
```

## References

In this documentation, we will refer to the following:

**Generics references:**

- `T extends object`: Enables precise type control through reflection class methods and properties.
	Defined by the constructor parameter `object`.

**Types references:**

- [PropertyType](https://github.com/itrocks-ts/property-type#propertytype):
	Represents any single property type, either primitive or complex.
- [PropertyTypes](https://github.com/itrocks-ts/property-type#propertytypes):
	A mapping of property names to their types.
- [Type&lt;T&gt;](https://github.com/itrocks-ts/class-type#type):
	A class for objects of type `T`.
- [KeyOf&lt;T&gt;](https://github.com/itrocks-ts/class-type#keyof):
	The string property names in `T`.

## ReflectClass

The `ReflectClass` class provides utilities for reflecting on a class or an object at runtime.

### Constructor

`constructor(object: T | Type<T>)`

**Parameters:**
- `object`: An instance of the class or the [class type](https://github.com/itrocks-ts/class-type#type) itself.

### Properties

- `name: string`.
	The name of the class.

- `object: T | undefined`.
	The object instance, or `undefined` if a [class type](https://github.com/itrocks-ts/class-type#type) was provided.

- `type: Type<T>`.
	The [type](https://github.com/itrocks-ts/class-type#type) information of the class.

- `parent: ReflectClass | null`.
	The parent [class](#reflectclass), or `null` if no parent exists.

- `properties: Record<KeyOf<T>, ReflectProperty<T>>`.
	A map of property names ([KeyOf&lt;T&gt;](https://github.com/itrocks-ts/class-type#keyof))
	to [ReflectProperty](#reflectproperty) instances.

- `propertyNames: SortedArray<KeyOf<T>>`.
	A [sorted array](https://github.com/itrocks-ts/sorted-array#sortedarray)
	of [property names](https://github.com/itrocks-ts/class-type#keyof).

- `propertyTypes: PropertyTypes<T>`.
	A [map of property names](https://github.com/itrocks-ts/property-type#propertytypes)
	and their corresponding [types](https://github.com/itrocks-ts/property-type#propertytype).

## ReflectProperty

The `ReflectProperty` class provides utilities for reflecting on a class or object property at runtime.

### Constructor

`constructor(object: T | ReflectClass<T> | Type<T>, name: KeyOf<T>)`

**Parameters:**

- `object`:
	An instance, [ReflectClass](#reflectclass), or the [class type](https://github.com/itrocks-ts/class-type#type).
- `name`:
	The name of the property.

### Properties

- `name: KeyOf<T>`.
	The name of the property ([KeyOf&lt;T&gt;](https://github.com/itrocks-ts/class-type#keyof)).

- `class: ReflectClass<T>`.
	The [ReflectClass](#ReflectClass) instance associated with the property.

- `collectionType: CollectionType<T>`.
	Similar to `type`,
	explicitly returning a [CollectionType](https://github.com/itrocks-ts/property-type#collectiontype)
	(throws an error if not a collection).

- `object: T | undefined`.
	The object instance associated with the property, or `undefined` if no `object` is provided.

- `type: PropertyType<T>`
	The [type](https://github.com/itrocks-ts/property-type#propertytype) of the property.

- `value: any`
	The current value of the property, or `undefined` if no object is provided.
