import { File }          from '@itrocks/class-file'
import { fileURLToPath } from 'node:url'

@File(fileURLToPath(import.meta.url))
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
