// BUDGET CONTROLLER
let budgetController = (function() {
    let Expenses = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value,
        this.percentage = -1
    };

    Expenses.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1
        }
    };

    Expenses.prototype.getPersentage = function() {
        return this.percentage;
    };

    let Incomes = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
    };

    let calculateTotals = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function(element) {
            sum += element.value;            
        });

        data.totals[type] = sum;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, description, value) {
            let newItem, ID;
            
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'exp') {
                newItem = new Expenses(ID, description, value);
            } else {
                newItem = new Incomes(ID, description, value);
            }
            
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type, id) {
            let ids;
            // создаем массив всех айдишников
            ids = data.allItems[type].map(function(element) {
                return element.id;
            });
            // находим индекс переданного id в массиве айдишников
            index = ids.indexOf(id);
            // удаляем 1 элемент из массива
            data.allItems[type].splice(index, 1);
            console.log(data.allItems[type])
        },

        getBudget: function() {
            return {
                budget: data.budget,
                percentage: data.percentage,
                expenses: data.totals.exp,
                incomes: data.totals.inc
            }
        },

        calculateBudget: function(type) {

            calculateTotals(type);

            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100 );
            } else {
                data.percentage = -1;
            } 

        },

        calculatePercentages: function() {
           
            data.allItems.exp.forEach(element => element.calcPercentage(data.totals.inc));
            
        },

        getPersentages: function() {
            let persentagesArr;
            persentagesArr = data.allItems.exp.map(element => {
                return element.getPersentage()
            });
            return persentagesArr;
        },

        test: function () {
            console.log(data);
        }
    }

})();


// UI CONTROLLER
let UIController = (function() {
    let DOMStrings = {
        addbutton: '.add__btn',
        addType: '.add__type',
        addDescription: '.add__description',
        addValue: '.add__value',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        percentageLabel: '.budget__expenses--percentage',
        expensesLabel: '.budget__expenses--value',
        expensesPercantageLabel: '.item__percentage',
        monthLabel: '.budget__title--month',
        container: '.container'
    };

    let formatNumber = function (number, type) {
        let num, numSplit;
        num = Math.abs(number);
        num = num.toFixed(2);
        numSplit = num.split('.')
        numSplit0 = numSplit[0];
        numSplit1 = numSplit[1];

        if(numSplit0.length > 3) {
            numSplit0 = numSplit0.substr(0, numSplit0.length - 3) + ',' + numSplit0.substr(-3, numSplit0 - 1);
        }
        console.log(type)
        return type === 'exp' ? '-' + numSplit0 + '.' + numSplit1 : '+' + numSplit0 + '.' + numSplit1

    };

    return {
        getInputs: function() {
            return {
                type: document.querySelector(DOMStrings.addType).value,
                description: document.querySelector(DOMStrings.addDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.addValue).value)
            }
        },

        getDOMStrings: function() {
            return DOMStrings;
        },

        changeInputs: function() {
            let inputs = document.querySelectorAll(DOMStrings.addType + ',' + DOMStrings.addDescription + ', ' + DOMStrings.addValue);

            inputs.forEach(function(el) {
                el.classList.toggle('red-focus');
            })

            document.querySelector(DOMStrings.addbutton).classList.toggle('red');
        },


        showDate: function() {
            let date, year, month, months;

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            date = new Date();
            year = date.getFullYear();
            month = date.getMonth();
            
            document.querySelector(DOMStrings.monthLabel).textContent = months[month] + ' ' + year;
        },

        addNewItem: function(obj, type) {
            let html, newHTML, element;

            if (type === 'exp') {
                element = document.querySelector(DOMStrings.expensesContainer);

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {
                element = document.querySelector(DOMStrings.incomeContainer);

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

            element.insertAdjacentHTML('beforeend', newHTML);
        },

        deleteItem: function(id) {
            document.getElementById(id).remove();
        },

        clearFields: function() {
            // вернется колекция, которую нужно перевести в массив методом slice
            let fields = document.querySelectorAll(DOMStrings.addDescription + ', ' + DOMStrings.addValue);
            let fieldsArr = Array.prototype.slice.call(fields);
            // каждому элементу массива присвоили значение пустой строки
            
            fieldsArr.forEach(element => element.value = '');   
            fieldsArr[0].focus();
        },

        updateLabels: function(object) {
            let type;
            object.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.incomeLabel).textContent = object.incomes;
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(object.budget, type);
            document.querySelector(DOMStrings.expensesLabel).textContent = object.expenses;

            if (object.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = object.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        updatePercentages: function(arr) {
            let expArr = document.querySelectorAll(DOMStrings.expensesPercantageLabel);
            expArr.forEach((element, index) => {
                if (arr[index] > 0) {
                    element.textContent = arr[index] + '%';
                } else {
                    element.textContent = '---';
                }
               
            })
        }
    };

})();


// GLOBAL APP CONTROLLER
let controller = (function(budget, UI) {
    let eventsSetup = function() {
        let DOM = UI.getDOMStrings();

        document.querySelector(DOM.addbutton).addEventListener('click', addItem);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        
        });

        document.querySelector(DOM.container).addEventListener('click', deleteItem);

        document.querySelector(DOM.addType).addEventListener('change', changeInputs);
    };
    
    let showBudget = function(type) {
        // вычисляем 
        budgetController.calculateBudget(type);

        // получаем объект 
        let budget = budgetController.getBudget();

        UI.updateLabels(budget);
        
    };

    function changeInputs() {
        UI.changeInputs();
    };

    function showPercentages() {

        budgetController.calculatePercentages();

        let percentages = budgetController.getPersentages();

        UI.updatePercentages(percentages);
    }

    let addItem = function() {
        let input, newItem;

        input = UI.getInputs();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            newItem = budget.addItem(input.type, input.description, input.value);

            UI.addNewItem(newItem, input.type);
    
            UI.clearFields();

            showBudget(input.type);

            showPercentages();

        }
  
    };

    function deleteItem(event) {
        let elementID, splitID, type, ID;

        elementID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (elementID) {
            splitID = elementID.split('-');
            type = splitID[0];
            ID = +splitID[1];

            budgetController.deleteItem(type, ID);

            UIController.deleteItem(elementID)

            showBudget(type);

            showPercentages();
        }
        
    }

    return {
        start: function() {
            UI.updateLabels( {
                budget: 0,
                percentage: -1,
                expenses: 0,
                incomes: 0
            })

            eventsSetup();
            UI.showDate();
        }
    };

})(budgetController, UIController);

controller.start();

