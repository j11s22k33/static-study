/*
대개는 한 파일에서 하나의 개체만 모듈로 넘기는 방식을 선호합니다. 
그에 맞춰 유용하게 쓰이는 것이 default export 입니다.
*/
function sayHi(user) {
    console.log(`Hello, ${user}!`);
}

export {sayHi as default};