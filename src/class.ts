import 'reflect-metadata'
import { fileOf }                   from '@itrocks/class-file'
import { baseType }                 from '@itrocks/class-type'
import { isObject }                 from '@itrocks/class-type'
import { KeyOf }                    from '@itrocks/class-type'
import { Type }                     from '@itrocks/class-type'
import { typeOf }                   from '@itrocks/class-type'
import { PropertyDefaults }         from '@itrocks/property-default'
import { propertyDefaultsFromFile } from '@itrocks/property-default'
import { PropertyTypes }            from '@itrocks/property-type'
import { propertyTypesFromFile }    from '@itrocks/property-type'
import { SortedArray }              from '@itrocks/sorted-array'
import { ReflectProperty }          from './property'

const DEFAULTS = Symbol('defaults')
const TYPES    = Symbol('types')

type Properties<T extends object> = PropertiesIterator<T> & PropertiesMap<T>

class PropertiesIterator<T extends object> implements Iterable<ReflectProperty<T, KeyOf<T>>>
{

	[Symbol.iterator](): Iterator<ReflectProperty<T, KeyOf<T>>>
	{
		return Object.values(this)[Symbol.iterator]()
	}

}

type PropertiesMap<T extends object> = { [K in KeyOf<T>]: ReflectProperty<T, K> }

class SortedPropertyNames<T extends object> extends SortedArray<KeyOf<T>>
{

	static get [Symbol.species]()
	{
		return Array
	}

	constructor(object: T)
	{
		super(...Object.getOwnPropertyNames(object).sort() as KeyOf<T>[])
	}

}

interface SortedPropertyNames<T extends object> extends SortedArray<KeyOf<T>>
{
	includes(property: string): property is KeyOf<T>
}

export class ReflectClass<T extends object = object>
{
	readonly name:   string
	readonly object: T | undefined
	readonly type:   Type<T>

	constructor(object: T | Type<T>)
	{
		this.object = isObject(object) ? object : undefined
		this.type   = typeOf(object)
		this.name   = this.type.name
	}

	inheritedPropertyDefaults(propertyDefaults: PropertyDefaults<T>)
	{
		const parent = this.parent
		if (parent) {
			Object.assign(propertyDefaults, parent.propertyDefaults)
		}
	}

	inheritedPropertyTypes(propertyTypes: PropertyTypes<T>)
	{
		const parent = this.parent
		if (parent) {
			Object.assign(propertyTypes, parent.propertyTypes)
		}
	}

	get parent(): ReflectClass | null
	{
		const parentType = Object.getPrototypeOf(this.type)
		const value      = (parentType === Function.prototype) ? null : new ReflectClass(parentType)
		Object.defineProperty(this, 'parent', { configurable: true, enumerable: false, value, writable: true })
		return value
	}

	get properties()
	{
		const properties = new PropertiesIterator<T> as Record<string, any>
		for (const name of this.propertyNames) {
			properties[name] = new ReflectProperty(this, name)
		}
		Object.defineProperty(
			this, 'properties', { configurable: true, enumerable: false, value: properties, writable: true }
		)
		return properties as Properties<T>
	}

	get propertyDefaults()
	{
		let value = Reflect.getOwnMetadata(DEFAULTS, this.type) as PropertyDefaults<T> | undefined
		if (!value) {
			value = {} as PropertyDefaults<T>
			Reflect.defineMetadata(DEFAULTS, value, this.type)
			this.inheritedPropertyDefaults(value)
			if (this.type === baseType(this.type)) {
				Object.assign(value, propertyDefaultsFromFile<T>(fileOf(this.type)))
			}
			return value
		}
		Object.defineProperty(this, 'propertyDefaults', { configurable: true, enumerable: false, value, writable: true })
		return value
	}

	get propertyNames()
	{
		let   object           = new this.type
		const propertyNames    = new SortedPropertyNames<T>(object)
		propertyNames.distinct = true
		while (object) {
			Object.entries(Object.getOwnPropertyDescriptors(object)).forEach(([name, descriptor]) => {
				if (!descriptor.get || (name[0] === '_')) return
				propertyNames.push(name as KeyOf<T>)
			})
			object = Object.getPrototypeOf(object)
		}
		Object.defineProperty(
			this, 'propertyNames', { configurable: true, enumerable: false, value: propertyNames, writable: true }
		)
		return propertyNames
	}

	get propertyTypes()
	{
		let value: PropertyTypes<T> | undefined = Reflect.getOwnMetadata(TYPES, this.type)
		if (!value) {
			value = {} as PropertyTypes<T>
			Reflect.defineMetadata(TYPES, value, this.type)
			this.inheritedPropertyTypes(value)
			if (this.type === baseType(this.type)) {
				Object.assign(value, propertyTypesFromFile(fileOf(this.type)))
			}
			return value
		}
		Object.defineProperty(this, 'propertyTypes', { configurable: true, enumerable: false, value, writable: true })
		return value
	}

}
