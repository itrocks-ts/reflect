import { ReflectClass } from '@itrocks/reflect'

class TestClass { name!: string; age!: number }

const reflectClass = new ReflectClass(TestClass)
const properties = reflectClass.properties
for (const property of properties) {
	const name = property.name
	const goodTest1 = name === 'name'
	const goodTest2 = name === 'age'
	// @ts-expect-error TS2367: This comparison appears to be unintentional because the types 'keyof TestClass' and '"bad"' have no overlap.
	const badTest   = name === 'bad'
	// @ts-expect-error TS2339: Property 'bad' does not exist on type 'ReflectProperty<TestClass, keyof TestClass>'.
	const bad  = property.bad
}
