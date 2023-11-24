Validator("#sign-up")




function Validator(formSelector) {

    //Form Rules
    var formRules = {};

    //Rules Types
    var rulesTypes = {
        required: function(value) {
            return value ? undefined : 'This field is required';
        },
        email: function(value) {
            var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return emailRegex.test(value) ? undefined : 'Please enter a valid email';
        },

        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `The password must contain at lease ${min} characters`;
            }
        },

        matched: function(confirmedValue) {
            return function(value) {
                return value === confirmedValue() ? undefined : 'The following information does not match';
            }
        },
        
    }

    //Các hàm phụ trợ
    function getParentElement(element, parentSelector) {
        while(element.parentElement) {
            if(element.parentElement.matches(parentSelector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    //Các hàm xử lý DOOM events
    // 1. Hàm xử lý Validate
    handleValidate = function(e) {
        var rules = formRules[e.target.name];
        var errorMessage;

        for(var rule of rules) {
            errorMessage = rule(e.target.value);
            if(errorMessage) break;           
        }

        if(errorMessage) {
            var formGroup = getParentElement(e.target, '.form__group'); 
            if(formGroup) {
                formGroup.classList.add('invalid');
                var formMessage = formGroup.querySelector('.form__message');
                var formIcon = formGroup.querySelector('.form__group-img');
                if(formMessage && formIcon) {
                    formMessage.innerText = errorMessage;
                    formIcon.src = "./assets/icons/author/author-error.svg";
                    formIcon.style.animation = "shake 0.8s";
                }
            }
        }

        return !errorMessage;
    }

    // 2. Hàm xử lý Clear Error
    handleClearError = function(e) {
        var formGroup = getParentElement(e.target, '.form__group'); 
        if(formGroup.classList.contains('invalid')) {
            formGroup.classList.remove('invalid');
            var formMessage = formGroup.querySelector('.form__message');
            var formIcon = formGroup.querySelector('.form__group-img');
            if(formMessage) {
                formMessage.innerText = '';
                formIcon.src = "";
            }
        }
    }

    //3. Hàm xử lý form submit
    handleFormSubmit = function(e) {
        e.preventDefault();
        for(var input of inputs) {
           var isFormValid = true;
           if(!(handleValidate({target: input}))) {
                isFormValid = false;
           }

           if(isFormValid) {
                formElement.submit();
           }
            
        }
    }

    var formElement = document.querySelector(formSelector);
    if(formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');
        for(var input of inputs) {
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules) {
                var isColon = rule.includes(':');
                var isMatched = rule.includes('matched');
                
            
                if(isColon) {
                    var ruleHasColon = rule.split(':');
                    rule = ruleHasColon[0];
                }

                var ruleFunctions = rulesTypes[rule];
                var value = function() {
                    return document.querySelector('#sign-up #password').value;
                }

                if(isMatched) {
                    ruleFunctions = ruleFunctions(value);
                }
            
                if(isColon) {
                    ruleFunctions = ruleFunctions(ruleHasColon[1]);
                }
                if(Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunctions);
                }
                else {
                    formRules[input.name] = [ruleFunctions];
                }

                
            }
               //Doom Events
               input.onblur = handleValidate;
               input.oninput = handleClearError;
        }
        //Handle Form  Events
        formElement.onsubmit = handleFormSubmit;
    }
}