


// Đối tượng Validator
function Validator(options){

    var selectorRules = {};
    var formElement = document.querySelector(options.form)
// Hàm thực hiện validate
    function validate(inputElement, rule){
    var errorMessage;
    var rules = selectorRules[rule.selector]
    for (var i =0; i < rules.length; i++ ){
       errorMessage = rules[i](inputElement.value)
       if(errorMessage) break
    }
     var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                if (errorMessage){
                    errorElement.innerText = errorMessage
                    inputElement.parentElement.classList.add('invalid')
                }else{
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
}
    if (formElement){
    // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input,...)
      options.rules.forEach(function(rule){
        // Lưu lại các rules cho mỗi input

        if (Array.isArray(selectorRules[rule.selector])){
           selectorRules[rule.selector].push(rule.test)
        } else {
            selectorRules[rule.selector] = [rule.test]
        }
        //selectorRules[rule.selector] = rule.test;

        var inputElement = formElement.querySelector(rule.selector)
        
       
        if (inputElement)
        {
        // Xử lý trường hợp blur khỏi input
            inputElement.onblur = function(){
                validate(inputElement, rule)
            }
        // Xử lý mỗi khi người dùng nhập vào input
            inputElement.oninput = function(){
                var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
            }
        }
      });
    }
}
// Định nghĩa rules
Validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}


Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message|| 'Trường này phải là email';
        }
    }
}

Validator.minLength = function(selector, min){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmed, message){
    return{
        selector: selector,
        test: function(value){
            return value === getConfirmed() ? undefined : message || 'Mật khẩu chưa trùng khớp'
        }
    }
}

