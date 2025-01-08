import { KeyOf, Type }    from '@itrocks/class-type'
import { CollectionType } from '@itrocks/property-type'
import ReflectClass       from './class'

export { ReflectProperty }
export default class ReflectProperty<T extends object>
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
		Object.defineProperty(this, 'class', { value })
		return value
	}

	async getCollectionType()
	{
		return (await this.class.propertyTypes)[this.name]
	}

	get collectionType(): Promise<CollectionType<T>>
	{
		const value = this.getCollectionType()
		Object.defineProperty(this, 'collectionType', { value })
		return value as Promise<CollectionType<T>>
	}

	get object()
	{
		const value = this.class.object
		Object.defineProperty(this, 'object', { value })
		return value
	}

	async getType()
	{
		return (await this.class.propertyTypes)[this.name]
	}

	get type()
	{
		const value = this.getType()
		Object.defineProperty(this, 'type', { value })
		return value
	}

	get value()
	{
		return this.object ? this.object[this.name] : undefined
	}

}
