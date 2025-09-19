// Đối tượng Validator

function Validator(options){
    var formElement = document.querySelector(options.form)

    console.log(options.rules)
    if (formElement){
      options.rules.forEach(function(rule){
        var inputElement = formElement.querySelector(rule.selector)
        console.log(inputElement)
      });
    }
}
// Định nghĩa rules
Validator.isRequired = function(selector){
    return {
        selector: selector,
        test: function(){

        }
    }
}


Validator.isEmail = function(selector){
    return {
        selector: selector,
        test: function(){

        }
    }
}

