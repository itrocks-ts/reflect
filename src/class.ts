import 'reflect-metadata'
import { fileOf }                   from '@itrocks/class-file'
import { baseType }                 from '@itrocks/class-type'
import { isObject, KeyOf }          from '@itrocks/class-type'
import { Type, typeOf }             from '@itrocks/class-type'
import { PropertyDefaults }         from '@itrocks/property-default'
import { propertyDefaultsFromFile } from '@itrocks/property-default'
import { PropertyTypes }            from '@itrocks/property-type'
import { propertyTypesFromFile }    from '@itrocks/property-type'
import { SortedArray }              from '@itrocks/sorted-array'
import { ReflectProperty }          from './property'

const DEFAULTS = Symbol('defaults')
const TYPES    = Symbol('types')

class Properties<T extends object>
{
	[s: string]: ReflectProperty<T>

	*[Symbol.iterator](): Iterator<ReflectProperty<T>>
	{
		for (const value of Object.values(this)) {
			yield value
		}
	}

}

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

	inheritedPropertyDefaults(propertyDefaults: PropertyDefaults)
	{
		const parent = this.parent
		if (parent) {
			Object.assign(propertyDefaults, parent.propertyDefaults)
		}
	}

	inheritedPropertyTypes(propertyTypes: PropertyTypes)
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
		const properties = new Properties<T>
		for (const name of this.propertyNames) {
			properties[name] = new ReflectProperty(this, name)
		}
		Object.defineProperty(
			this, 'properties', { configurable: true, enumerable: false, value: properties, writable: true }
		)
		return properties
	}

	get propertyDefaults()
	{
		let value: PropertyDefaults | undefined = Reflect.getOwnMetadata(DEFAULTS, this.type)
		if (!value) {
			value = {}
			Reflect.defineMetadata(DEFAULTS, value, this.type)
			this.inheritedPropertyDefaults(value)
			if (this.type === baseType(this.type)) {
				Object.assign(value, propertyDefaultsFromFile(fileOf(this.type)))
			}
			return value
		}
		Object.defineProperty(this, 'propertyDefaults', { configurable: true, enumerable: false, value, writable: true })
		return value
	}

	get propertyNames()
	{
		let   object           = new this.type
		const propertyNames    = new SortedPropertyNames(object)
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
		let value: PropertyTypes | undefined = Reflect.getOwnMetadata(TYPES, this.type)
		if (!value) {
			value = {}
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
