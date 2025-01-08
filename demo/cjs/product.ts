
export { Product }
export default class Product
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
