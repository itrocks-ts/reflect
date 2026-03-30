import { Type }           from '@itrocks/class-type'
import { CollectionType } from '@itrocks/property-type'
import { ReflectClass }   from './class'

export class ReflectProperty<T extends object, K extends keyof T = keyof T>
{
	readonly #class: T | ReflectClass<T> | Type<T>
	readonly name:   K

	constructor(object: T | ReflectClass<T> | Type<T>, name: K)
	{
		this.#class = object
		this.name   = name
	}

	get class()
	{
		const value = (this.#class instanceof ReflectClass)
			? this.#class
			: new ReflectClass(this.#class)
		Object.defineProperty(this, 'class', { configurable: true, enumerable: false, value, writable: true })
		return value
	}

	get collectionType()
	{
		const value = this.class.propertyTypes[this.name]
		if (!(value instanceof CollectionType)) {
			throw new Error(
				'ReflectProperty.collectionType is meant to be used exclusively on collection properties'
				+ ' [' + this.class.name + '.' + this.name.toString() + ']'
			)
		}
		Object.defineProperty(this, 'collectionType', { configurable: true, enumerable: false, value, writable: true })
		return value
	}

	get defaultValue()
	{
		const value = this.class.propertyDefaults[this.name]
		Object.defineProperty(this, 'defaultValue', { configurable: true, enumerable: false, value, writable: true })
		return value
	}

	get object()
	{
		const value = this.class.object
		Object.defineProperty(this, 'object', { configurable: true, enumerable: false, value, writable: true })
		return value
	}

	get type()
	{
		const value = this.class.propertyTypes[this.name]
		Object.defineProperty(this, 'type', { configurable: true, enumerable: false, value, writable: true })
		return value
	}

	get value()
	{
		return this.object ? this.object[this.name] : undefined
	}

}
