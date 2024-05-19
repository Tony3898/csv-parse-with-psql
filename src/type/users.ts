interface Address {
  line1: string,
  line2: string,
  city: string,
  state: string,
}

export interface UsersInterface {
  name: string,
  age: number,
  address: Address,
  additional_info?: Object
  id?: number
}
