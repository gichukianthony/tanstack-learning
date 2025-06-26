
export interface Mechanic {
  id:string,
  name:string,
  email:string,
  phone:string,
  location:string,
  notes:string,
  status:string,
  specialization:string
}
    
export interface createMehanicInput {
  name:string,
  email:string,
  phone:string,
  location:string,
  notes:string,
  status:string,
  specialization:string
}