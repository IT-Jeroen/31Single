import {it, expect} from 'vitest'
import { testCode } from './test'

it.skip('should return a greeting with the given input name', ()=>{
    let name = 'World'
    let result = testCode(name)
    expect(result).toBe(`Hello ${name}`)

})