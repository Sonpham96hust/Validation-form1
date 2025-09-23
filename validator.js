


// Đối tượng Validator
function Validator(options){
    function getParents(element, selector){
        while(element.parentElement){
            if (element.parentElement.matches(selector))
            {
                return element.parentElement
            }
            element = element.parentElement;
        }
    }
    var selectorRules = {};
    var formElement = document.querySelector(options.form)
    
// Hàm thực hiện validate
    function validate(inputElement, rule){
    var errorMessage;
    var rules = selectorRules[rule.selector]
    for (var i =0; i < rules.length; i++ ){
        switch(inputElement.type)
        {
            case 'checkbox':
            case 'radio':
                errorMessage = rules[i](
                    formElement.querySelector(rule.selector +':checked')
            
                );
                break;
            default:
                 errorMessage = rules[i](inputElement.value)
        }
       if(errorMessage) break;
    }
     var errorElement = getParents(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
                if (errorMessage){
                    errorElement.innerText = errorMessage
                    getParents(inputElement, options.formGroupSelector).classList.add('invalid')
                    
                }else{
                    errorElement.innerText = ''
                    getParents(inputElement, options.formGroupSelector).classList.remove('invalid')
                }
                return !errorMessage;
                
}

    
    if (formElement){
          
        //Khi submit form
        formElement.onsubmit = function(e){
            e.preventDefault();
          var isFormValid = true;
            
         // Lặp qua từng rules và validate
        options.rules.forEach(function(rule){
            var inputElement = formElement.querySelector(rule.selector)
            var isValid =  validate(inputElement, rule);
            if (isValid){
            }
            else{
                isFormValid = false;
            }
        });
            if (isFormValid){
               if (typeof options.onSubmit === 'function'){

                var enableInputs = formElement.querySelectorAll('[name]')
                var formValue = Array.from(enableInputs).reduce(function (result, input){
                    switch(input.type){
                        case 'radio':
                        case 'checkbox':
                        result[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                        break;
                        default:
                        result[input.name] = input.value ;
                    }
                    
                    
                    return result;
                }, {});
                options.onSubmit(formValue);
               }
            }
        }
    
        

    // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input,...)
      options.rules.forEach(function(rule){
        // Lưu lại các rules cho mỗi input

        if (Array.isArray(selectorRules[rule.selector])){
           selectorRules[rule.selector].push(rule.test)
        } else {
            selectorRules[rule.selector] = [rule.test]
        }
        

        var inputElements = formElement.querySelectorAll(rule.selector)
        Array.from(inputElements).forEach(function (inputElement){
            if (inputElement)
        {
        // Xử lý trường hợp blur khỏi input
            inputElement.onblur = function(){
                validate(inputElement, rule)
            }
        // Xử lý mỗi khi người dùng nhập vào input
            inputElement.oninput = function(){
                var errorElement = getParents(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
                errorElement.innerText = ''
                    getParents(inputElement, options.formGroupSelector).classList.remove('invalid')
            }
        }
        })

        
      });
    }
}
// Định nghĩa rules
Validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value ? undefined : message || 'Vui lòng nhập trường này'
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

