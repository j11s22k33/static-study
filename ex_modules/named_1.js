// 배열 내보내기
export let months = ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 상수 내보내기
export const MODULES_BECAME_STANDARD_YEAR = 2015;

// 함수 내보내기
export function sayHi(user) {
  console.log(`Hello! ${user}`);
  }
  
// 클래스 내보내기
export class User {
  constructor(name) {
    this.name = name;
  }
}