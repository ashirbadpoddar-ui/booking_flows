import { describe, expect, it } from "vitest";
import { bookingSchema, scheduleSchema, serviceSchema } from "../lib/validation";
describe('input validation',()=>{
 it('accepts a valid booking',()=>expect(bookingSchema.safeParse({serviceId:'haircut',staffId:'marcin',date:'2026-08-24',time:'09:00',customerName:'Maja Lewandowska',customerEmail:'maja@example.com',phone:'+48 123 456 789'}).success).toBe(true));
 it('rejects invalid customer and booking fields',()=>expect(bookingSchema.safeParse({serviceId:'',staffId:'',date:'today',time:'25:99',customerName:'X',customerEmail:'bad'}).success).toBe(false));
 it('rejects invalid service duration and price',()=>expect(serviceSchema.safeParse({name:'Cut',description:'A detailed description',duration:0,price:-1,active:true}).success).toBe(false));
 it('rejects working hours where end precedes start',()=>expect(scheduleSchema.safeParse({weekday:1,start:'17:00',end:'09:00'}).success).toBe(false));
});
