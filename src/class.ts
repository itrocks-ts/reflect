import 'reflect-metadata'
import { fileOf }                   from '@itrocks/class-file'
import { baseType }                 from '@itrocks/class-type'
import { isObject }                 from '@itrocks/class-type'
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

class SortedPropertyNames<T extends object, K extends keyof T = keyof T> extends SortedArray<K>
{

	static get [Symbol.species]()
	{
		return Array
	}

	constructor(object: T)
	{
		super(...Object.getOwnPropertyNames(object).sort() as K[])
	}

}

interface SortedPropertyNames<T extends object, K extends keyof T = keyof T> extends SortedArray<K>
{
	includes(property: number | string | symbol): property is K
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

	inheritPropertyDefaults(propertyDefaults: PropertyDefaults<T>)
	{
		const parent = this.parent
		if (parent) {
			Object.assign(propertyDefaults, parent.propertyDefaults)
		}
	}

	inheritPropertyTypes(propertyTypes: PropertyTypes<T>)
	{
		const parent = this.parent
		if (parent) {
			Object.assign(propertyTypes, parent.propertyTypes)
		}
	}

	get parent(): ReflectClass | null
	{
		const parentType = Object.getPrototypeOf(this.type)
		const parent     = (parentType === Function.prototype) ? null : new ReflectClass(parentType)
		Object.defineProperty(this, 'parent', { configurable: true, enumerable: false, value: parent, writable: true })
		return parent
	}

	get properties()
	{
		const properties = new Array<ReflectProperty<T>>
		for (const name of this.propertyNames) {
			properties.push(new ReflectProperty(this, name))
		}
		Object.defineProperty(
			this, 'properties', { configurable: true, enumerable: false, value: properties, writable: true }
		)
		return properties
	}

	get property()
	{
		const properties = {} as { [K in keyof T]: ReflectProperty<T, K> }
		for (const property of this.properties) {
			properties[property.name] = property
		}
		Object.defineProperty(
			this, 'property', { configurable: true, enumerable: false, value: properties, writable: true }
		)
		return properties
	}

	get propertyDefaults()
	{
		let value = Reflect.getOwnMetadata(DEFAULTS, this.type) as PropertyDefaults<T> | undefined
		if (!value) {
			value = {} as PropertyDefaults<T>
			Reflect.defineMetadata(DEFAULTS, value, this.type)
			this.inheritPropertyDefaults(value)
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
				propertyNames.push(name as keyof T)
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
			this.inheritPropertyTypes(value)
			if (this.type === baseType(this.type)) {
				Object.assign(value, propertyTypesFromFile(fileOf(this.type)))
			}
			return value
		}
		Object.defineProperty(this, 'propertyTypes', { configurable: true, enumerable: false, value, writable: true })
		return value
	}

}
