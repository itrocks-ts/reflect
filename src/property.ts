import { KeyOf, Type }    from '@itrocks/class-type'
import { CollectionType } from '@itrocks/property-type'
import { ReflectClass }   from './class'

export class ReflectProperty<T extends object>
{
	readonly #class: T | ReflectClass<T> | Type<T>
	readonly name:   KeyOf<T>

	constructor(object: T | ReflectClass<T> | Type<T>, name: KeyOf<T>)
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
			throw 'ReflectProperty.collectionType is meant to be used exclusively on collection properties'
		}
		Object.defineProperty(this, 'collectionType', { configurable: true, enumerable: false, value, writable: true })
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
